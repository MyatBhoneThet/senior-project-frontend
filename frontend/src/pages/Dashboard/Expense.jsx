import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/layout/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import DeleteAlert from '../../components/layout/DeleteAlert';
import BulkDeleteExpense from '../../components/Expense/bulkDeleteExpense';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';
import { useUserAuth } from '../../hooks/useUserAuth';
import { syncRecurring } from '../../utils/syncRecurring';
import { UserContext } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import useT from '../../hooks/useT';
import NeonTopBar from '../../components/Dashboard/NeonTopBar';
import ExpensePageShell from '../../components/Expense/ExpensePageShell';
import ExpenseStatCards from '../../components/Expense/ExpenseStatCards';
import ExpenseOverviewPanel from '../../components/Expense/ExpenseOverviewPanel';
import ExpenseSourcesSection from '../../components/Expense/ExpenseSourcesSection';
import ExpensePacePanel from '../../components/Expense/ExpensePacePanel';
import { monthYearLabel, shortDateLabel, sourceTitle } from '../../components/Expense/expenseViewHelpers';

const PERIOD_DAYS = { W: 7, M: 30, Q: 90, Y: 365 };

const Expense = () => {
  useUserAuth();

  const { user, prefs } = useContext(UserContext) || {};
  const isDark = prefs?.theme === 'dark';
  const { format } = useCurrency();
  const { t } = useT();

  const [expenseData, setExpenseData] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const selectedPeriod = 'Y';

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openEditExpenseModal, setOpenEditExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);

  const mounted = useRef(true);
  const didAutoSelectLatest = useRef(false);

  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  const MONTHS = [
    tt('month.january', 'January'),
    tt('month.february', 'February'),
    tt('month.march', 'March'),
    tt('month.april', 'April'),
    tt('month.may', 'May'),
    tt('month.june', 'June'),
    tt('month.july', 'July'),
    tt('month.august', 'August'),
    tt('month.september', 'September'),
    tt('month.october', 'October'),
    tt('month.november', 'November'),
    tt('month.december', 'December'),
  ];

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await syncRecurring({ silent: true });
      const { data } = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (!mounted.current) return;
      const list = Array.isArray(data) ? data : [];
      setExpenseData(list);
      setFilteredExpense(list);

      if (list.length && !didAutoSelectLatest.current) {
        const latest = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        if (latest?.date) {
          const latestDate = new Date(latest.date);
          setSelectedMonth(latestDate.getMonth());
          setSelectedYear(latestDate.getFullYear());
          didAutoSelectLatest.current = true;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(tt('expense.text5', 'Failed to load expenses.'));
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA(selectedPeriod));
      if (mounted.current) setDashboardData(data || null);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchExpenseDetails(), fetchDashboardData()]);
  };

  const handleAddExpense = async (expense) => {
    const { source, categoryId, categoryName, amount, date, icon } = expense;

    if (!source?.trim()) return toast.error(tt('expense.text1', 'Source is required.'));
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error(tt('expense.text2', 'Amount must be greater than 0.'));
    }
    if (!date) return toast.error(tt('expense.text3', 'Date is required.'));

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        source: source.trim(),
        categoryId: categoryId || undefined,
        category: categoryName || undefined,
        amount: Number(amount),
        date,
        icon: icon || '',
      });

      await syncRecurring({ silent: false });
      setOpenAddExpenseModal(false);
      toast.success(tt('expense.text4', 'Expense added successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('expense.text5', 'Something went wrong.'));
    }
  };

  const handleUpdateExpense = async (payload) => {
    if (!selectedExpense?._id) return;

    try {
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(selectedExpense._id), {
        source: (payload.source || '').trim(),
        categoryId: payload.categoryId || undefined,
        category: payload.categoryName || undefined,
        amount: Number(payload.amount),
        date: payload.date,
        icon: payload.icon || '',
      });

      setOpenEditExpenseModal(false);
      setSelectedExpense(null);
      toast.success(tt('expense.text6', 'Expense updated successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('expense.text7', 'Update failed.'));
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      await syncRecurring({ silent: false });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success(tt('expense.text8', 'Expense deleted successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('expense.text5', 'Something went wrong.'));
    }
  };

  const handleBulkDelete = async (period) => {
    try {
      const { data } = await axiosInstance.delete(
        API_PATHS.EXPENSE.BULK_DELETE_EXPENSE(period)
      );
      setOpenBulkDeleteModal(false);
      toast.success(data?.message || tt('expense.text8', 'Expense deleted successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || tt('expense.text5', 'Something went wrong.'));
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXCEL, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error(tt('expense.text9', 'Something went wrong while downloading.'));
    }
  };

  useEffect(() => {
    mounted.current = true;
    refreshData();
    return () => {
      mounted.current = false;
    };
  }, []);

  const sortedExpense = useMemo(
    () => [...expenseData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [expenseData]
  );

  const periodExpense = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - PERIOD_DAYS[selectedPeriod]);
    return sortedExpense.filter((item) => new Date(item.date).getTime() >= cutoff.getTime());
  }, [selectedPeriod, sortedExpense]);

  const currentMonthExpense = useMemo(() => {
    const now = new Date();
    return expenseData.reduce((sum, item) => {
      const date = new Date(item.date);
      if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
        return sum + Number(item.amount || 0);
      }
      return sum;
    }, 0);
  }, [expenseData]);

  const previousMonthExpense = useMemo(() => {
    const now = new Date();
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return expenseData.reduce((sum, item) => {
      const date = new Date(item.date);
      if (date.getMonth() === previous.getMonth() && date.getFullYear() === previous.getFullYear()) {
        return sum + Number(item.amount || 0);
      }
      return sum;
    }, 0);
  }, [expenseData]);

  const monthChange = useMemo(() => {
    if (!previousMonthExpense) return currentMonthExpense > 0 ? 100 : 0;
    return Math.round(((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100);
  }, [currentMonthExpense, previousMonthExpense]);

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    return expenseData.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  }, [expenseData]);

  const avgWeekly = useMemo(() => {
    const weeksElapsed = Math.max(1, Math.ceil(new Date().getDate() / 7));
    return currentMonthExpense / weeksElapsed;
  }, [currentMonthExpense]);

  const availableYears = useMemo(() => {
    const years = new Set(expenseData.map((item) => new Date(item.date).getFullYear()));
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [expenseData]);

  const overviewExpense = useMemo(() => {
    return sortedExpense
      .filter((item) => {
        const date = new Date(item.date);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedMonth, selectedYear, sortedExpense]);

  const overviewStats = useMemo(() => {
    const total = overviewExpense.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const highest = overviewExpense.reduce((max, item) => Math.max(max, Number(item.amount || 0)), 0);
    const average = overviewExpense.length ? total / overviewExpense.length : 0;
    return { total, transactions: overviewExpense.length, highest, average };
  }, [overviewExpense]);

  const overviewLineData = useMemo(() => {
    const grouped = overviewExpense.reduce((acc, item) => {
      const day = new Date(item.date).getDate();
      acc[day] = (acc[day] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const entries = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      return {
        day,
        amount: Number(grouped[day] || 0),
        label: String(day),
        fullLabel: shortDateLabel(new Date(selectedYear, selectedMonth, day)),
      };
    });

    const maxAmount = Math.max(...entries.map((item) => item.amount), 1);
    return entries.map((item) => ({
      ...item,
      amount: Number(item.amount || 0),
      maxAmount,
    }));
  }, [overviewExpense, selectedMonth, selectedYear]);

  const monthlyPace = useMemo(() => {
    const buckets = {};
    expenseData.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!buckets[key]) {
        buckets[key] = {
          label: monthYearLabel(new Date(date.getFullYear(), date.getMonth(), 1)),
          amount: 0,
        };
      }
      buckets[key].amount += Number(item.amount || 0);
    });
    return Object.entries(buckets)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .slice(-4)
      .map(([, value]) => value);
  }, [expenseData]);

  const maxPace = useMemo(() => Math.max(...monthlyPace.map((item) => item.amount), 1), [monthlyPace]);
  const visibleSources = useMemo(() => filteredExpense.slice(0, 6), [filteredExpense]);
  const currentMonthSourceCount = useMemo(
    () => new Set(currentMonthTransactions.map((item) => sourceTitle(item))).size,
    [currentMonthTransactions]
  );

  const statCards = [
    {
      title: tt('dashboard.totalExpenses', 'Total Expense'),
      value: format(currentMonthExpense),
      subtitle: `${tt('dashboard.thisMonth', 'This month')} · ${currentMonthSourceCount} ${tt('expense.sourcesCount', 'sources')}`,
      badge: `${monthChange >= 0 ? '↑' : '↓'} ${Math.abs(monthChange)}% vs last month`,
      accent: isDark ? 'text-[#ff6b81]' : 'text-[#ef4444]',
      badgeAccent: isDark ? 'text-[#ff6b81] bg-[#ff6b81]/10' : 'text-[#ef4444] bg-[#ef4444]/10',
      glow: isDark ? 'from-[#ff6b81]/20 to-transparent' : 'from-[#ef4444]/20 to-transparent',
    },
    {
      title: tt('dashboard.thisYear', 'This Year'),
      value: format(periodExpense.reduce((sum, item) => sum + Number(item.amount || 0), 0)),
      subtitle: tt('expense.spentSoFar', 'Spent so far'),
      badge: `${periodExpense.length} ${tt('dashboard.transactions', 'transactions')}`,
      accent: isDark ? 'text-white' : 'text-[#11131b]',
      badgeAccent: 'text-[#8b5cf6] bg-[#8b5cf6]/10',
      glow: 'from-white/10 to-transparent',
    },
    {
      title: tt('dashboard.avgWeekly', 'Avg Weekly'),
      value: format(avgWeekly),
      subtitle: tt('dashboard.basedOnCurrentMonth', 'Based on current month'),
      badge: avgWeekly > 0 ? tt('expense.runningSpend', 'Running spend') : tt('dashboard.noActivity', 'No activity'),
      accent: 'text-[#47d7ff]',
      badgeAccent: 'text-[#47d7ff] bg-[#47d7ff]/10',
      glow: 'from-[#47d7ff]/20 to-transparent',
    },
  ];

  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(255,182,193,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(255,182,193,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f9eef1_100%)] text-[#11131b]';
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.38)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const sectionDivider = isDark ? 'border-white/10' : 'border-white/45';
  const labelText = isDark ? 'text-[#8a90a7]' : 'text-[#6b7080]';
  const mutedText = isDark ? 'text-[#7b8095]' : 'text-[#6b6f80]';
  const inputClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white placeholder:text-[#848aa0] shadow-[0_10px_30px_rgba(0,0,0,0.12)]'
    : 'border-white/28 bg-white/28 text-[#11131b] placeholder:text-[#8a8f9f] shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-3xl';
  const outlineButton = isDark
    ? 'border-white/10 bg-white/[0.05] text-[#d0d3e4] hover:bg-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#31374a] hover:bg-white/42 backdrop-blur-3xl';
  const subtleSurface = isDark
    ? 'border-white/10 bg-white/[0.05]'
    : 'border-white/28 bg-white/22 backdrop-blur-3xl';

  return (
    <DashboardLayout activeMenu="Expense">
      <ExpensePageShell isDark={isDark} pageClass={pageClass}>
        <NeonTopBar
          title={tt('menu.expense', 'Expense')}
          subtitle={tt('expense.trackSpending', 'Track your spending')}
          userName={user?.fullName?.split(' ')[0] || user?.username}
          liveLabel=""
          periodLabel=""
          selectedPeriod={selectedPeriod}
        />

        <ExpenseStatCards
          statCards={statCards}
          isDark={isDark}
          cardClass={cardClass}
          labelText={labelText}
          mutedText={mutedText}
        />

        <ExpenseOverviewPanel
          isDark={isDark}
          cardClass={cardClass}
          sectionDivider={sectionDivider}
          labelText={labelText}
          mutedText={mutedText}
          inputClass={inputClass}
          MONTHS={MONTHS}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          availableYears={availableYears}
          onOpenAdd={() => setOpenAddExpenseModal(true)}
          tt={tt}
          overviewStats={overviewStats}
          format={format}
          overviewLineData={overviewLineData}
        />

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <ExpenseSourcesSection
            isDark={isDark}
            cardClass={cardClass}
            sectionDivider={sectionDivider}
            outlineButton={outlineButton}
            mutedText={mutedText}
            periodExpense={periodExpense}
            setFilteredExpense={setFilteredExpense}
            visibleSources={visibleSources}
            format={format}
            onOpenBulkDelete={() => setOpenBulkDeleteModal(true)}
            onDownload={handleDownloadExpenseDetails}
            onOpenEdit={(item) => {
              setSelectedExpense(item);
              setOpenEditExpenseModal(true);
            }}
            onOpenDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            tt={tt}
          />

          <ExpensePacePanel
            isDark={isDark}
            cardClass={cardClass}
            mutedText={mutedText}
            subtleSurface={subtleSurface}
            monthlyPace={monthlyPace}
            format={format}
            maxPace={maxPace}
            dashboardData={dashboardData}
            tt={tt}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title={tt('expense.add', 'Add Expense')}
          accent="expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} mode="add" variant="neon" />
        </Modal>

        <Modal
          isOpen={openEditExpenseModal}
          onClose={() => setOpenEditExpenseModal(false)}
          title={tt('expense.edit', 'Edit Expense')}
          accent="expense"
        >
          <AddExpenseForm
            mode="edit"
            initial={selectedExpense}
            onUpdateExpense={handleUpdateExpense}
            variant="neon"
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title={tt('expense.delete', 'Delete Expense')}
          accent="neutral"
        >
          <DeleteAlert
            content={tt('expense.deleteAlert', 'Are you sure you want to delete this expense?')}
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>

        <Modal
          isOpen={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
          title={tt('expense.bulkDelete', 'Bulk Delete Expenses')}
          accent="neutral"
        >
          <BulkDeleteExpense
            isOpen={openBulkDeleteModal}
            onClose={() => setOpenBulkDeleteModal(false)}
            onConfirm={handleBulkDelete}
            isDarkTheme
            variant="neon"
          />
        </Modal>
      </ExpensePageShell>
    </DashboardLayout>
  );
};

export default Expense;
