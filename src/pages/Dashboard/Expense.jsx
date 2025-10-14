import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import ExpenseList from '../../components/Expense/ExpenseList';
import Modal from '../../components/layouts/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';
import { useUserAuth } from '../../hooks/useUserAuth';
import { syncRecurring } from '../../utils/syncRecurring';

// NEW
import FilterControl from '../../components/common/FilterControl';
// import { applyFilterSort } from '../../utils/filtering';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);

  // NEW: hold filtered results
  const [filteredExpense, setFilteredExpense] = useState([]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // NEW: edit modal state
  const [openEditExpenseModal, setOpenEditExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const mounted = useRef(true);

  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await syncRecurring({ silent: true });
      const { data } = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (!mounted.current) return;
      const list = Array.isArray(data) ? data : [];
      setExpenseData(list);
      // NEW: initial filtered = full list
      setFilteredExpense(list);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const handleAddExpense = async (expense) => {
    const { source, categoryId, categoryName, amount, date, icon } = expense;

    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Amount must be > 0.');
    if (!date) return toast.error('Date is required.');

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        source: (source || '').trim(),
        categoryId: categoryId || undefined,
        category: categoryName || undefined,
        amount: Number(amount),
        date,
        icon: icon || '',
      });

      await syncRecurring({ silent: false });
      setOpenAddExpenseModal(false);
      toast.success('Expense added successfully.');
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  // NEW: update expense
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
      toast.success('Expense updated successfully.');
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Update failed.');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      await syncRecurring({ silent: false });
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
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXCEL, { responseType: 'blob' });
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
      toast.error('Something went wrong while downloading.');
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchExpenseDetails();
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
          />

          {/* NEW: small toolbar to place Filter beside Download area */}
          <div className="flex items-center justify-end">
            <FilterControl
              items={expenseData}
              fieldMap={{ date: 'date', category: 'category', amount: 'amount', text: 'source' }}
              onChange={(list /*, state */) => setFilteredExpense(list)}
              label="Filter"
            />
          </div>

          <ExpenseList
            transactions={filteredExpense} // NEW: pass filtered list
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadExpenseDetails}
            // ← NEW: open edit modal with selected item
            onEdit={(item) => { setSelectedExpense(item); setOpenEditExpenseModal(true); }}
          />
        </div>

        {/* Add Modal */}
        <Modal isOpen={openAddExpenseModal} onClose={() => setOpenAddExpenseModal(false)} title="Add Expense">
          <AddExpenseForm onAddExpense={handleAddExpense} mode="add" />
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={openEditExpenseModal} onClose={() => setOpenEditExpenseModal(false)} title="Edit Expense">
          <AddExpenseForm
            mode="edit"
            initial={selectedExpense}
            onUpdateExpense={handleUpdateExpense}
          />
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
