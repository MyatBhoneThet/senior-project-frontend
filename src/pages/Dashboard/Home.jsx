import React, { useEffect, useState, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/Cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import { UserContext } from '../../context/UserContext';
import { formatCurrency } from '../../utils/currency';
import useT from '../../hooks/useT';

import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

import ChatWidget from '../../components/Chat/ChatWidget'; // left-only widget

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();
  const { t } = useT();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // get prefs from context (currency/language/theme)
  const { prefs } = useContext(UserContext) || {};
  const appCurrency = prefs?.currency || 'THB';
  const appLanguage = prefs?.language || 'en';
  const appTheme = prefs?.theme || 'light'; // <<--- add theme here

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (data) setDashboardData(data);
    } catch (error) {
      console.error('Something went wrong. Please Try Again.', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Theme wrapper */}
      <div className={`${appTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen my-5 mx-auto`}>
        
        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label={t('dashboard.totalBalance')}
            value={formatCurrency(dashboardData?.totalBalance || 0, appCurrency, appLanguage)}
            color="bg-indigo-500"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label={t('dashboard.totalIncome')}
            value={formatCurrency(dashboardData?.totalIncome || 0, appCurrency, appLanguage)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label={t('dashboard.totalExpenses')}
            value={formatCurrency(dashboardData?.totalExpenses || 0, appCurrency, appLanguage)}
            color="bg-red-500"
          />
        </div>

        {/* Main dashboard grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            title={t('dashboard.recentTransactions')}
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate('/expense')}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0}
          />

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate('/expense')}
          />

          <Last30DaysExpenses
            date={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate('/income')}
          />
        </div>
      </div>

      {/* Chatbot pinned on the LEFT only */}
      <ChatWidget />
    </DashboardLayout>
  );
};

export default Home;
