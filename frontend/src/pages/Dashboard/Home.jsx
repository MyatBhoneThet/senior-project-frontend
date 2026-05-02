import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LuArrowDownRight,
  LuArrowUpRight,
  LuPiggyBank,
  LuRefreshCcw,
  LuWalletCards,
} from 'react-icons/lu';
import DashboardLayout from '../../components/layout/DashboardLayout';
import NeonTopBar from '../../components/Dashboard/NeonTopBar';
import DarkCashFlowChart from '../../components/Dashboard/DarkCashFlowChart';
import DarkRecentTransactions from '../../components/Dashboard/DarkRecentTransactions';
import DarkSpendingChart from '../../components/Dashboard/DarkSpendingChart';
import DarkIncomeChart from '../../components/Dashboard/DarkIncomeChart';
import DarkGoalsWidget from '../../components/Dashboard/DarkGoalsWidget';
import DarkRecurringWidget from '../../components/Dashboard/DarkRecurringWidget';
import PageShell from '../../components/Dashboard/PageShell';
import StatCardsGrid from '../../components/Dashboard/StatCardsGrid';
import QuickActionsPanel from '../../components/Dashboard/QuickActionsPanel';
import FocusMetricsPanel from '../../components/Dashboard/FocusMetricsPanel';
import SystemStatusPanel from '../../components/Dashboard/SystemStatusPanel';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import useT from '../../hooks/useT';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const { user, prefs } = useContext(UserContext) || {};
  const isDark = prefs?.theme === 'dark';
  const { format } = useCurrency();
  const { t } = useT();
  const tt = (k, f) => {
    const v = t?.(k);
    return v && v !== k ? v : f;
  };

  const [dashboardData, setDashboardData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('M');

  const formatDayLabel = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const formatMonthLabel = (date) =>
    date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { data } = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA(selectedPeriod));
        if (active) setDashboardData(data || null);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [selectedPeriod]);

  const pct = (value, total) => {
    if (!total) return 0;
    return Math.round((Number(value || 0) / Number(total || 0)) * 100);
  };

  const statCards = [
    {
      title: tt('dashboard.totalBalance', 'Net Balance'),
      amount: format(dashboardData?.totalBalance || 0),
      subtitle: tt('dashboard.acrossAccounts', 'Across all tracked accounts'),
      badgeText: `${pct(dashboardData?.totalExpenses, dashboardData?.totalIncome)}% ${tt('dashboard.expenseRatio', 'expense ratio')}`,
      accent: 'text-[#8b5cf6]',
      badgeClass: 'bg-[#8b5cf6]/10 text-[#8b5cf6]',
      glow: 'from-[#8b5cf6]/20 to-transparent',
      icon: LuWalletCards,
    },
    {
      title: tt('dashboard.totalIncomes', 'Total Income'),
      amount: format(dashboardData?.totalIncome || 0),
      subtitle: tt(`dashboard.period.${selectedPeriod}`, selectedPeriod),
      badgeText: `${format(dashboardData?.prevPeriodIncome || 0)} ${tt('dashboard.previous', 'previous')}`,
      accent: isDark ? 'text-[#d9ff34]' : 'text-[#84cc16]',
      badgeClass: isDark ? 'bg-[#d9ff34]/10 text-[#d9ff34]' : 'bg-[#84cc16]/10 text-[#84cc16]',
      glow: isDark ? 'from-[#d9ff34]/20 to-transparent' : 'from-[#84cc16]/20 to-transparent',
      icon: LuArrowUpRight,
    },
    {
      title: tt('dashboard.totalExpenses', 'Total Expenses'),
      amount: format(dashboardData?.totalExpenses || 0),
      subtitle: tt(`dashboard.period.${selectedPeriod}`, selectedPeriod),
      badgeText: `${format(dashboardData?.prevPeriodExpenses || 0)} ${tt('dashboard.previous', 'previous')}`,
      accent: 'text-[#fb7185]',
      badgeClass: 'bg-[#fb7185]/10 text-[#fb7185]',
      glow: 'from-[#fb7185]/20 to-transparent',
      icon: LuArrowDownRight,
    },
  ];

  const cashFlowData = useMemo(() => {
    const incomeTransactions = dashboardData?.periodData?.income?.transactions || [];
    const expenseTransactions = dashboardData?.periodData?.expense?.transactions || [];
    const useMonthlyBuckets = selectedPeriod === 'Q' || selectedPeriod === 'Y';
    const useCurrentMonthBuckets = selectedPeriod === 'M';
    const buckets = new Map();
    const now = new Date();
    const periodCount = useMonthlyBuckets
      ? (selectedPeriod === 'Y' ? 12 : 3)
      : (selectedPeriod === 'W' ? 7 : 30);

    const makeDateKey = (date) =>
      useMonthlyBuckets
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const makeDateLabel = (date) =>
      useMonthlyBuckets ? formatMonthLabel(date) : formatDayLabel(date);

    const addEmptyBucket = (date) => {
      const key = makeDateKey(date);
      if (buckets.has(key)) return;
      buckets.set(key, {
        date: new Date(date),
        label: makeDateLabel(date),
        income: 0,
        expense: 0,
      });
    };

    if (useMonthlyBuckets) {
      const start = new Date(now.getFullYear(), now.getMonth() - (periodCount - 1), 1);
      for (let i = 0; i < periodCount; i += 1) {
        const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
        addEmptyBucket(date);
      }
    } else if (useCurrentMonthBuckets) {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        addEmptyBucket(new Date(date));
      }
    } else {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (periodCount - 1));
      for (let i = 0; i < periodCount; i += 1) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        addEmptyBucket(date);
      }
    }

    const addToBucket = (txn, type) => {
      const date = new Date(txn.date);
      if (Number.isNaN(date.getTime())) return;

      const key = makeDateKey(date);
      if (!buckets.has(key)) {
        const bucketDate = useMonthlyBuckets
          ? new Date(date.getFullYear(), date.getMonth(), 1)
          : new Date(date.getFullYear(), date.getMonth(), date.getDate());
        buckets.set(key, {
          date: bucketDate,
          label: makeDateLabel(bucketDate),
          income: 0,
          expense: 0,
        });
      }

      buckets.get(key)[type] += Number(txn.amount || 0);
    };

    incomeTransactions.forEach((transaction) => addToBucket(transaction, 'income'));
    expenseTransactions.forEach((transaction) => addToBucket(transaction, 'expense'));

    return [...buckets.values()]
      .sort((a, b) => a.date - b.date)
      .map((bucket) => ({
        date: bucket.label,
        income: Math.round(bucket.income),
        expense: Math.round(bucket.expense),
      }));
  }, [dashboardData, selectedPeriod]);

  const quickActions = [
    {
      title: tt('dashboard.addIncome', 'Add income'),
      subtitle: tt('dashboard.captureEarningSource', 'Capture a new earning source'),
      icon: LuArrowUpRight,
      color: isDark ? 'text-[#d9ff34]' : 'text-[#84cc16]',
      bg: isDark ? 'bg-[#d9ff34]/14' : 'bg-[#84cc16]/15',
      action: () => navigate('/income'),
    },
    {
      title: tt('dashboard.addExpense', 'Add expense'),
      subtitle: tt('dashboard.trackOutgoingCashQuickly', 'Track outgoing cash quickly'),
      icon: LuArrowDownRight,
      color: 'text-[#fb7185]',
      bg: isDark ? 'bg-[#fb7185]/14' : 'bg-[#fb7185]/14',
      action: () => navigate('/expense'),
    },
    {
      title: tt('dashboard.savingsGoals', 'Savings goals'),
      subtitle: tt('dashboard.reviewJarsAndFundingProgress', 'Review jars and funding progress'),
      icon: LuPiggyBank,
      color: 'text-[#8b5cf6]',
      bg: isDark ? 'bg-[#8b5cf6]/14' : 'bg-[#8b5cf6]/14',
      action: () => navigate('/savings'),
    },
    {
      title: tt('dashboard.recurringRules', 'Recurring rules'),
      subtitle: tt('dashboard.pauseOrTuneSubscriptions', 'Pause or tune subscriptions'),
      icon: LuRefreshCcw,
      color: 'text-[#f59e0b]',
      bg: isDark ? 'bg-[#f59e0b]/14' : 'bg-[#f59e0b]/14',
      action: () => navigate('/recurring'),
    },
  ];

  const mappedGoals = (dashboardData?.goals?.items || []).slice(0, 3).map((goal) => ({
    name: goal.title,
    progress: Math.round(goal.progress || 0),
  }));

  const recurringColors = ['#a3e635', '#9b51e0', '#38bdf8', '#fb7185', '#f59e0b'];
  const mappedRecurring = (dashboardData?.recurring?.items || [])
    .filter((rule) => rule.isActive)
    .slice(0, 4)
    .map((rule, index) => ({
      type: rule.type,
      name: rule.source || rule.category || rule.type || 'Recurring',
      amount: Number(rule.amount || 0),
      color: recurringColors[index % recurringColors.length],
      repeat: rule.repeat || 'monthly',
    }));

  const spendingData = dashboardData?.spendingByCategory || [];
  const incomeData = useMemo(() => {
    const transactions = dashboardData?.periodData?.income?.transactions || [];
    const totals = new Map();

    transactions.forEach((txn) => {
      const category = String(txn.categoryName || txn.category || txn.source || 'Uncategorized').trim() || 'Uncategorized';
      totals.set(category, (totals.get(category) || 0) + Number(txn.amount || 0));
    });

    const colors = ['#d9ff34', '#8b5cf6', '#38bdf8', '#f59e0b', '#fb7185', '#22d3ee', '#a855f7'];
    return [...totals.entries()]
      .map(([name, total], index) => ({
        name,
        total,
        value: 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.total - a.total)
      .map((item, index, arr) => {
        const total = arr.reduce((sum, row) => sum + row.total, 0) || 1;
        return {
          ...item,
          value: Math.round((item.total / total) * 100),
        };
      });
  }, [dashboardData]);

  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.12),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f6faee_100%)] text-[#11131b]';
  const panelClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const topCardClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const mutedText = isDark ? 'text-[#6c7086]' : 'text-[#6b6f80]';
  const labelText = isDark ? 'text-[#7b8095]' : 'text-[#6b7080]';

  return (
    <DashboardLayout activeMenu="Dashboard">
      <PageShell isDark={isDark} pageClass={pageClass}>
        <NeonTopBar
          title={tt('menu.dashboard', 'DASHBOARD')}
          subtitle={`${tt('dashboard.overviewFor', 'Overview for')} ${
            user?.fullName?.split(' ')[0] || user?.username || tt('profile.defaultUser', 'User')
          }`}
          userName={user?.fullName?.split(' ')[0] || user?.username}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        <StatCardsGrid
          statCards={statCards}
          isDark={isDark}
          topCardClass={topCardClass}
          labelText={labelText}
          mutedText={mutedText}
          updatedNowText={tt('dashboard.updatedNow', 'Updated now')}
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
          <div className="grid grid-cols-1 gap-4">
            <DarkCashFlowChart data={cashFlowData} valueFormatter={(value) => format(value)} />

            <QuickActionsPanel
              quickActions={quickActions}
              isDark={isDark}
              panelClass={panelClass}
              labelText={labelText}
              mutedText={mutedText}
              title={tt('dashboard.quickActions', 'Quick Actions')}
              description={tt('dashboard.quickActionsDesc', 'Common workflows, one tap away.')}
            />
          </div>

          <DarkRecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            onSeeAll={() => navigate('/expense')}
            formatAmount={(amount, type) => `${type === 'income' ? '+' : '-'}${format(Math.abs(Number(amount || 0)))}`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DarkSpendingChart data={spendingData} format={format} />
          <DarkIncomeChart data={incomeData} format={format} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FocusMetricsPanel
            isDark={isDark}
            panelClass={panelClass}
            labelText={labelText}
            dashboardData={dashboardData}
            format={format}
            onRefresh={() => navigate('/dashboard')}
            texts={{
              focusMetrics: tt('dashboard.focusMetrics', 'Focus Metrics'),
              refreshView: tt('dashboard.refreshView', 'Refresh View'),
              last60DaysIncome: tt('dashboard.last60DaysIncome', 'Last 60 days income'),
              recurringMonthly: tt('dashboard.recurringMonthly', 'Recurring monthly'),
              activeGoals: tt('dashboard.activeGoals', 'Active goals'),
            }}
          />

          <DarkRecurringWidget recurring={mappedRecurring} totalAmount={dashboardData?.recurring?.monthlyTotal || 0} format={format} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DarkGoalsWidget goals={mappedGoals} totalGoals={dashboardData?.goals?.active ?? dashboardData?.goals?.total ?? 0} />

          <SystemStatusPanel
            isDark={isDark}
            panelClass={panelClass}
            labelText={labelText}
            mutedText={mutedText}
            dashboardData={dashboardData}
            texts={{
              systemStatus: tt('dashboard.systemStatus', 'System Status'),
              budgetSignal: tt('dashboard.budgetSignal', 'Budget signal'),
              healthy: tt('dashboard.healthy', 'Healthy'),
              watchlist: tt('dashboard.watchlist', 'Watchlist'),
              budgetSignalDesc: tt('dashboard.budgetSignalDesc', 'Based on current total balance versus tracked expenses.'),
              latestActivity: tt('dashboard.latestActivity', 'Latest activity'),
              recentItems: tt('dashboard.recentItems', 'recent items'),
              noRecentItems: tt('dashboard.noRecentItems', 'No recent items'),
              activityDesc: tt('dashboard.activityDesc', 'Transactions, recurring events, and goal updates feed this view.'),
            }}
          />
        </div>
      </PageShell>
    </DashboardLayout>
  );
};

export default Home;
