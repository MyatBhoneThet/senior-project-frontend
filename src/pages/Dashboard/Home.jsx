import React, { useEffect, useState, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/Cards/InfoCard';
import { UserContext } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import useT from '../../hooks/useT';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import IncomeCard from '../../components/Dashboard/IncomeCard';
import ExpenseCard from '../../components/Dashboard/ExpenseCard';
import SavingsQuickCard from '../../components/Dashboard/SavingQuickCard';
import ChatWidget from '../../components/Chat/ChatWidget';

const Home = () => {
  useUserAuth();
  const { t } = useT();
  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thisMonthExpense, setThisMonthExpense] = useState(0);
  const [thisMonthIncome, setThisMonthIncome] = useState(0);
  
  const { prefs } = useContext(UserContext) || {};
  const { format: originalFormat } = useCurrency();
  const appTheme = prefs?.theme || 'light';

  // Custom format function to show "xxx฿" instead of "THBxxx"
  const format = (amount) => {
    const formatted = originalFormat(amount);
    // If it starts with THB, move it to the end with ฿ symbol
    if (formatted.startsWith('THB')) {
      const number = formatted.replace('THB', '').trim();
      return `${number}฿`;
    }
    return formatted;
  };

  // Fetch dashboard summary data
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

  // Fetch and calculate this month's expenses
  const fetchThisMonthExpense = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      const list = Array.isArray(data) ? data : [];
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthTotal = list.reduce((sum, expense) => {
        const expenseDate = new Date(expense.date);
        if (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        ) {
          return sum + (Number(expense.amount) || 0);
        }
        return sum;
      }, 0);
      
      setThisMonthExpense(monthTotal);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setThisMonthExpense(0);
    }
  };

  // Fetch and calculate this month's income
  const fetchThisMonthIncome = async () => {
    try {
      const { data } = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      const list = Array.isArray(data) ? data : [];
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthTotal = list.reduce((sum, income) => {
        const incomeDate = new Date(income.date);
        if (
          incomeDate.getMonth() === currentMonth &&
          incomeDate.getFullYear() === currentYear
        ) {
          return sum + (Number(income.amount) || 0);
        }
        return sum;
      }, 0);
      
      setThisMonthIncome(monthTotal);
    } catch (error) {
      console.error('Failed to fetch income:', error);
      setThisMonthIncome(0);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchThisMonthExpense();
    fetchThisMonthIncome();
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className={`${appTheme === 'dark' ? 'text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen my-5 mx-auto`}>
        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label={t('dashboard.totalBalance')}
            value={format(dashboardData?.totalBalance || 0)}
            color="bg-indigo-500"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label={t('dashboard.totalIncome', 'Total Income')}
            value={format(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label={tt('dashboard.totalExpenses', 'Total Expenses')}
            value={format(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
          />
        </div>

        {/* Income & Expense Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <IncomeCard thisMonthIncome={thisMonthIncome} format={format} />
          <ExpenseCard thisMonthExpense={thisMonthExpense} format={format} />
        </div>

        <div className="mt-6">
          <SavingsQuickCard />
        </div>
      </div>
      <ChatWidget />
    </DashboardLayout>
  );
};

export default Home;
