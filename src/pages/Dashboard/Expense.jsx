import React, { useEffect, useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/layouts/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import { toast } from 'react-toastify';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      setExpenseData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { source, categoryId, categoryName, amount, date, icon } = expense;

    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Amount must be > 0.');
    if (!date) return toast.error('Date is required.');

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        source,
        amount,
        date,
        icon,
        categoryId: categoryId || undefined,
        category: categoryName || 'Uncategorized',
      });
      setOpenAddExpenseModal(false);
      toast.success('Expense added successfully.');
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Expense deleted successfully.');
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while downloading.');
    }
  };

  useEffect(() => { fetchExpenseDetails(); }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
            onExpenseIncome={() => setOpenAddExpenseModal(true)} // in case your component expects this name
          />
          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal isOpen={openAddExpenseModal} onClose={() => setOpenAddExpenseModal(false)} title="Add Expense">
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({ show: false, data: null })} title="Delete Expense">
          <DeleteAlert content="Are you sure you want to delete this expense?" onDelete={() => deleteExpense(openDeleteAlert.data)} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
