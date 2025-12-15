import React, { useContext, useState } from 'react';
import { LuWalletMinimal, LuChevronRight } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import Modal from '../layouts/Modal';
import AddIncomeForm from '../Income/AddIncomeForm';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';

const IncomeCard = ({ thisMonthIncome, format }) => {
  const navigate = useNavigate();
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';
  const { t } = useT();

  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  const handleAddIncome = async (income) => {
    const { source, categoryId, categoryName, amount, date, icon } = income;

    if (!source?.trim()) return toast.error(tt('income.text1','Source is required.'));
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error(tt('income.text2','Amount must be greater than 0.'));
    if (!date) return toast.error(tt('income.text3','Date is required.'));

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source: source.trim(),
        categoryId: categoryId || undefined,
        category: categoryName || undefined,
        amount: Number(amount),
        date,
        icon: icon || '',
      });

      setOpenAddIncomeModal(false);
      toast.success(tt('income.text4','Income added successfully.'));
      navigate('/income');
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('income.text5','Something went wrong.'));
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
          {tt("dashboard.income", "Income")}
        </h2>
        <button onClick={() => navigate('/income')} className="p-2 rounded-full transition-colors hover:bg-gray-700 dark:hover:bg-gray-200/10">
          <LuWalletMinimal className="text-green-500" size={24} />
        </button>
      </div>

      <p className={`mt-3 text-2xl ${isDark ? 'text-white' : 'text-black'}`}>
        {tt("dashboard.thisMonth", "This month")}:
        <span className="font-semibold text-green-600"> {format(thisMonthIncome)}</span>
      </p>

      <div className="mt-15 flex gap-3">
        <button onClick={() => navigate('/income')} className="w-1/3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          {tt("dashboard.viewDetail", "View")}
        </button>

        <button onClick={() => setOpenAddIncomeModal(true)} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1">
          <span>{tt("dashboard.addIncome", "Add Income")}</span>
          <LuChevronRight className="text-green-200" size={18} />
        </button>
      </div>

      <Modal isOpen={openAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title={tt('income.addNewIncome', 'Add New Income')}>
        <AddIncomeForm onAddIncome={handleAddIncome} mode="add" />
      </Modal>
    </div>
  );
};

export default IncomeCard;
