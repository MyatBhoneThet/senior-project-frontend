import React, { useContext, useState } from 'react';
import { LuHandCoins, LuChevronRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import Modal from '../layouts/Modal';
import AddExpenseForm from '../Expense/AddExpenseForm';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';

const ExpenseCard = ({ thisMonthExpense, format }) => {
  const navigate = useNavigate();
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';
  const { t } = useT();

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  const handleAddExpense = async (expense) => {
    const { source, categoryId, categoryName, amount, date, icon } = expense;

    if (!source?.trim()) return toast.error(tt('expense.text1','Source is required.'));
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error(tt('expense.text2','Amount must be greater than 0.'));
    if (!date) return toast.error(tt('expense.text3','Date is required.'));

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        source: source.trim(),
        categoryId: categoryId || undefined,
        category: categoryName || undefined,
        amount: Number(amount),
        date,
        icon: icon || '',
      });

      setOpenAddExpenseModal(false);
      toast.success(tt('expense.text4','Expense added successfully.'));
      navigate('/expense');
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('expense.text5','Something went wrong.'));
    }
  };

  return (
    <div className={`rounded-xl p-6 border shadow-md transition-colors ${
      isDark
        ? 'bg-gray-900 border-gray-700 text-gray-200'
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <div className="flex justify-between items-center">
        <h2 className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
          {tt("dashboard.expense", "Expense")}
        </h2>
        <button onClick={() => navigate('/expense')} className="p-2 rounded-full transition-colors hover:bg-gray-700 dark:hover:bg-gray-200/10">
          <LuHandCoins className="text-red-500" size={24} />
        </button>
      </div>

      <p className={`mt-3 text-2xl ${isDark ? 'text-white' : 'text-black'}`}>
        {tt("dashboard.thisMonth", "This month")}:
        <span className="font-semibold text-red-600"> {format(thisMonthExpense)}</span>
      </p>

      <div className="mt-15 flex gap-3">
        <button onClick={() => navigate('/expense')} className="w-1/3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
          {tt("dashboard.viewDetail", "View")}
        </button>

        <button onClick={() => setOpenAddExpenseModal(true)} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1">
          <span>{tt("dashboard.addExpense", "Add Expense")}</span>
          <LuChevronRight className="text-red-200" size={18} />
        </button>
      </div>

      <Modal isOpen={openAddExpenseModal} onClose={() => setOpenAddExpenseModal(false)} title={tt('expense.addNewExpense', 'Add New Expense')}>
        <AddExpenseForm onAddExpense={handleAddExpense} mode="add" />
      </Modal>
    </div>
  );
};

export default ExpenseCard;
