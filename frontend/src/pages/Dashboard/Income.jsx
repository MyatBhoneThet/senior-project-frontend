import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/layout/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import DeleteAlert from '../../components/layout/DeleteAlert';
import BulkDeleteIncome from '../../components/Income/bulkDeleteIncome';
import NeonTopBar from '../../components/Dashboard/NeonTopBar';
import IncomePageShell from '../../components/Income/IncomePageShell';
import IncomeStatCards from '../../components/Income/IncomeStatCards';
import IncomeOverviewPanel from '../../components/Income/IncomeOverviewPanel';
import IncomeSourcesSection from '../../components/Income/IncomeSourcesSection';
import IncomePacePanel from '../../components/Income/IncomePacePanel';
import { monthYearLabel, sourceTitle } from '../../components/Income/incomeViewHelpers';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useUserAuth } from '../../hooks/useUserAuth';
import { syncRecurring } from '../../utils/syncRecurring';
import { UserContext } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import useT from '../../hooks/useT';

const PERIOD_DAYS = {
  W: 7,
  M: 30,
  Q: 90,
  Y: 365,
};

const Income = () => {
  useUserAuth();

  const { user, prefs } = useContext(UserContext) || {};
  const isDark = prefs?.theme === 'dark';
  const { format } = useCurrency();
  const { t } = useT();
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

  const [incomeData, setIncomeData] = useState([]);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const selectedPeriod = 'Y';

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);

  const mounted = useRef(true);
  const didAutoSelectLatest = useRef(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await syncRecurring({ silent: true });
      const { data } = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

      if (!mounted.current) return;

      const list = Array.isArray(data) ? data : [];
      setIncomeData(list);
      setFilteredIncome(list);

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
      toast.error(tt('income.text5', 'Something went wrong.'));
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
    await Promise.all([fetchIncomeDetails(), fetchDashboardData()]);
  };

  const handleAddIncome = async (income) => {
    const { source, categoryId, categoryName, amount, date, icon } = income;

    if (!source?.trim()) {
      return toast.error(tt('income.text1', 'Source is required.'));
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error(tt('income.text2', 'Amount must be greater than 0.'));
    }
    if (!date) {
      return toast.error(tt('income.text3', 'Date is required.'));
    }

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source: source.trim(),
        categoryId: categoryId || undefined,
        category: categoryName || undefined,
        amount: Number(amount),
        date,
        icon: icon || '',
      });

      await syncRecurring({ silent: false });
      setOpenAddIncomeModal(false);
      toast.success(tt('income.text4', 'Income added successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || tt('income.text5', 'Something went wrong.')
      );
    }
  };

  const handleUpdateIncome = async (payload) => {
    if (!selectedIncome?._id) return;

    try {
      await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(selectedIncome._id), {
        source: (payload.source || '').trim(),
        categoryId: payload.categoryId || undefined,
        category: payload.categoryName || undefined,
        amount: Number(payload.amount),
        date: payload.date,
        icon: payload.icon || '',
      });

      setOpenEditIncomeModal(false);
      setSelectedIncome(null);
      toast.success(tt('income.text6', 'Income updated successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || tt('income.text7', 'Update failed.')
      );
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      await syncRecurring({ silent: false });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success(tt('income.text8', 'Income deleted successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || tt('income.text5', 'Something went wrong.')
      );
    }
  };

  const handleBulkDelete = async (period) => {
    try {
      const { data } = await axiosInstance.delete(
        API_PATHS.INCOME.BULK_DELETE_INCOME(period)
      );
      setOpenBulkDeleteModal(false);
      toast.success(data?.message || tt('income.text8', 'Income deleted successfully.'));
      await refreshData();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || tt('income.text5', 'Something went wrong.'));
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_EXCEL, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error(tt('income.text9', 'Something went wrong while downloading.'));
    }
  };

  useEffect(() => {
    mounted.current = true;
    refreshData();

    return () => {
      mounted.current = false;
    };
  }, []);

  const sortedIncome = useMemo(
    () =>
      [...incomeData].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [incomeData]
  );

  const periodIncome = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - PERIOD_DAYS[selectedPeriod]);

    return sortedIncome.filter(
      (item) => new Date(item.date).getTime() >= cutoff.getTime()
    );
  }, [selectedPeriod, sortedIncome]);

  const currentMonthIncome = useMemo(() => {
    const now = new Date();
    return incomeData.reduce((sum, item) => {
      const date = new Date(item.date);
      if (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return sum + Number(item.amount || 0);
      }
      return sum;
    }, 0);
  }, [incomeData]);

  const previousMonthIncome = useMemo(() => {
    const now = new Date();
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return incomeData.reduce((sum, item) => {
      const date = new Date(item.date);
      if (
        date.getMonth() === previous.getMonth() &&
        date.getFullYear() === previous.getFullYear()
      ) {
        return sum + Number(item.amount || 0);
      }
      return sum;
    }, 0);
  }, [incomeData]);

  const monthChange = useMemo(() => {
    if (!previousMonthIncome) return currentMonthIncome > 0 ? 100 : 0;
    return Math.round(
      ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100
    );
  }, [currentMonthIncome, previousMonthIncome]);

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    return incomeData.filter((item) => {
      const date = new Date(item.date);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }, [incomeData]);

  const avgWeekly = useMemo(() => {
    const weeksElapsed = Math.max(1, Math.ceil(new Date().getDate() / 7));
    return currentMonthIncome / weeksElapsed;
  }, [currentMonthIncome]);

  const availableYears = useMemo(() => {
    const years = new Set(incomeData.map((item) => new Date(item.date).getFullYear()));
    years.add(new Date().getFullYear());
    return Array.from(years).sort((a, b) => b - a);
  }, [incomeData]);

  const overviewIncome = useMemo(() => {
    return sortedIncome
      .filter((item) => {
        const date = new Date(item.date);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedMonth, selectedYear, sortedIncome]);

  const overviewStats = useMemo(() => {
    const total = overviewIncome.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const highest = overviewIncome.reduce(
      (max, item) => Math.max(max, Number(item.amount || 0)),
      0
    );
    const average = overviewIncome.length ? total / overviewIncome.length : 0;
    return {
      total,
      transactions: overviewIncome.length,
      highest,
      average,
    };
  }, [overviewIncome]);

  const overviewChartBars = useMemo(() => {
    const grouped = overviewIncome.reduce((acc, item) => {
      const day = new Date(item.date).getDate();
      acc[day] = (acc[day] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const entries = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const amount = Number(grouped[day] || 0);
      return {
        id: `${selectedYear}-${selectedMonth}-${day}`,
        day,
        amount,
        label: String(day),
        fullLabel: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(selectedYear, selectedMonth, day)),
      };
    });

    const maxAmount = Math.max(...entries.map((item) => item.amount), 1);

    return entries.map((item, index, arr) => ({
      ...item,
      height:
        item.amount > 0
          ? `${Math.max(26, Math.round((item.amount / maxAmount) * 100))}%`
          : '8%',
      emphasis: item.amount > 0 && (index === arr.length - 1 || item.amount === maxAmount),
    }));
  }, [overviewIncome, selectedMonth, selectedYear]);

  const monthlyPace = useMemo(() => {
    const buckets = {};

    incomeData.forEach((item) => {
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
  }, [incomeData]);

  const maxPace = useMemo(
    () => Math.max(...monthlyPace.map((item) => item.amount), 1),
    [monthlyPace]
  );

  const visibleSources = useMemo(() => filteredIncome.slice(0, 6), [filteredIncome]);
  const currentMonthSourceCount = useMemo(
    () => new Set(currentMonthTransactions.map((item) => sourceTitle(item))).size,
    [currentMonthTransactions]
  );

  const statCards = [
    {
      title: tt('dashboard.totalIncome', 'Total Income'),
      value: format(currentMonthIncome),
      subtitle: `${tt('dashboard.thisMonth', 'This month')} · ${currentMonthSourceCount} ${tt('income.sourcesCount', 'sources')}`,
      badge: `${monthChange >= 0 ? '↑' : '↓'} ${Math.abs(monthChange)}% vs last month`,
      accent: isDark ? 'text-[#d9ff34]' : 'text-[#84cc16]',
      badgeAccent: isDark ? 'text-[#d9ff34] bg-[#d9ff34]/10' : 'text-[#84cc16] bg-[#84cc16]/10',
      glow: isDark ? 'from-[#d9ff34]/20 to-transparent' : 'from-[#84cc16]/20 to-transparent',
    },
    {
      title: tt('dashboard.thisYear', 'This Year'),
      value: format(periodIncome.reduce((sum, item) => sum + Number(item.amount || 0), 0)),
      subtitle: tt('dashboard.collectedSoFar', 'Collected so far'),
      badge: `${periodIncome.length} ${tt('dashboard.transactions', 'transactions')}`,
      accent: isDark ? 'text-white' : 'text-[#11131b]',
      badgeAccent: 'text-[#8b5cf6] bg-[#8b5cf6]/10',
      glow: 'from-white/10 to-transparent',
    },
    {
      title: tt('dashboard.avgWeekly', 'Avg Weekly'),
      value: format(avgWeekly),
      subtitle: tt('dashboard.basedOnCurrentMonth', 'Based on current month'),
      badge: avgWeekly > 0 ? tt('dashboard.onTrack', 'On track') : tt('dashboard.noActivity', 'No activity'),
      accent: 'text-[#47d7ff]',
      badgeAccent: 'text-[#47d7ff] bg-[#47d7ff]/10',
      glow: 'from-[#47d7ff]/20 to-transparent',
    },
  ];

  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f4fbe7_100%)] text-[#11131b]';
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
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
    <DashboardLayout activeMenu="Income">
      <IncomePageShell isDark={isDark} pageClass={pageClass}>
        <NeonTopBar
          title={tt('menu.income', 'Income')}
          subtitle={tt('income.trackEarnings', 'Track your earnings')}
          userName={user?.fullName?.split(' ')[0] || user?.username}
          liveLabel=""
          periodLabel=""
          selectedPeriod={selectedPeriod}
        />

        <IncomeStatCards
          statCards={statCards}
          isDark={isDark}
          cardClass={cardClass}
          labelText={labelText}
          mutedText={mutedText}
          isLoading={loading}
        />

        <IncomeOverviewPanel
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
          onOpenAdd={() => setOpenAddIncomeModal(true)}
          tt={tt}
          overviewStats={overviewStats}
          format={format}
          overviewChartBars={overviewChartBars}
          isLoading={loading}
        />

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <IncomeSourcesSection
            isDark={isDark}
            cardClass={cardClass}
            sectionDivider={sectionDivider}
            outlineButton={outlineButton}
            mutedText={mutedText}
            periodIncome={periodIncome}
            setFilteredIncome={setFilteredIncome}
            visibleSources={visibleSources}
            format={format}
            onOpenBulkDelete={() => setOpenBulkDeleteModal(true)}
            onDownload={handleDownloadIncomeDetails}
            onOpenEdit={(item) => {
              setSelectedIncome(item);
              setOpenEditIncomeModal(true);
            }}
            onOpenDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            tt={tt}
            isLoading={loading}
          />

          <IncomePacePanel
            isDark={isDark}
            cardClass={cardClass}
            mutedText={mutedText}
            subtleSurface={subtleSurface}
            monthlyPace={monthlyPace}
            format={format}
            maxPace={maxPace}
            dashboardData={dashboardData}
            tt={tt}
            isLoading={loading}
          />
        </div>

        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title={tt('income.add', 'Add Income')}
          accent="income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} mode="add" variant="neon" />
        </Modal>

        <Modal
          isOpen={openEditIncomeModal}
          onClose={() => setOpenEditIncomeModal(false)}
          title={tt('income.edit', 'Edit Income')}
          accent="income"
        >
          <AddIncomeForm
            mode="edit"
            initial={selectedIncome}
            onUpdateIncome={handleUpdateIncome}
            variant="neon"
          />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title={tt('income.deleteIncome', 'Delete Income')}
          accent="neutral"
        >
          <DeleteAlert
            content={tt(
              'income.deleteAlert',
              'Are you sure you want to delete this income?'
            )}
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>

        <Modal
          isOpen={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
          title={tt('income.bulkDeleteIncome', 'Bulk Delete Income')}
          accent="neutral"
        >
          <BulkDeleteIncome
            isOpen={openBulkDeleteModal}
            onClose={() => setOpenBulkDeleteModal(false)}
            onConfirm={handleBulkDelete}
            isDarkTheme
            variant="neon"
          />
        </Modal>
      </IncomePageShell>
    </DashboardLayout>
  );
};

export default Income;
