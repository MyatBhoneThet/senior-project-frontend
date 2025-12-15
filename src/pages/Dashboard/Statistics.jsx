import React, { useEffect, useState, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import RecentExpense from '../../components/Dashboard/RecentExpense';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import Last60DaysIncomes from '../../components/Dashboard/Last60DaysIncomes';
import RecentIncome from '../../components/Dashboard/RecentIncome';
import { UserContext } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import useT from '../../hooks/useT';

const Statistics = () => {
  useUserAuth();
  const navigate = useNavigate();
  const { t } = useT();
  const tt = (key, fallback) => {
    const translated = t(key);
    return translated && translated !== key ? translated : fallback;
  };

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { prefs } = useContext(UserContext) || {};
  const { format } = useCurrency();
  const appTheme = prefs?.theme || 'light';

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { data } = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (data) {
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout activeMenu="Statistic">
      <div
        className={`${
          appTheme === 'dark'
            ? 'bg-gray-900 text-gray-100'
            : 'bg-gray-50 text-gray-900'
        } min-h-screen my-5 mx-auto px-4 lg:px-8`}
      >

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* RIGHT COLUMN (Charts first on mobile) */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            
            {/* Finance Overview */}
            <FinanceOverview
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpense={dashboardData?.totalExpenses || 0}
            />

            {/* Last 30 Days Expenses */}
            <Last30DaysExpenses
              date={dashboardData?.last30DaysExpenses?.transactions || []}
            />

            {/* Last 60 Days Income */}
            <Last60DaysIncomes
              data={
                dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []
              }
              totalIncome={dashboardData?.totalIncome || 0}
            />

          </div>

          {/* LEFT COLUMN (History second on mobile) */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">

            <RecentTransactions
              title={tt('dashboard.recentTransactions', 'Recent Transactions')}
              transactions={dashboardData?.recentTransactions || []}
              onSeeMore={() => navigate('/expense')}
            />

            <RecentExpense
              transactions={
                dashboardData?.last30DaysExpenses?.transactions || []
              }
              onSeeMore={() => navigate('/expense')}
            />

            <RecentIncome
              transactions={
                dashboardData?.last60DaysIncome?.transactions || []
              }
              onSeeMore={() => navigate('/income')}
            />

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
