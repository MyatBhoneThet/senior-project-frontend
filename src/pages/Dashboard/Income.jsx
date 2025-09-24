import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import IncomeList from '../../components/Income/IncomeList';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';
import { useUserAuth } from '../../hooks/useUserAuth';
import { syncRecurring } from '../../utils/syncRecurring'; // ← shared helper

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // NEW: edit modal state
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);

  const mounted = useRef(true);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await syncRecurring({ silent: true });
      const { data } = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (!mounted.current) return;
      setIncomeData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, categoryId, categoryName, amount, date, icon } = income;

    if (!source?.trim()) return toast.error('Source is required.');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Amount must be > 0.');
    if (!date) return toast.error('Date is required.');

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
      toast.success('Income added successfully.');
      fetchIncomeDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  // NEW: update income
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
      toast.success('Income updated successfully.');
      fetchIncomeDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Update failed.');
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      await syncRecurring({ silent: false });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success('Income deleted successfully.');
      fetchIncomeDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_EXCEL, { responseType: 'blob' });
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
      toast.error('Something went wrong while downloading.');
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchIncomeDetails();
    return () => { mounted.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout activeMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
            // ← NEW: open edit modal with selected item
            onEdit={(item) => { setSelectedIncome(item); setOpenEditIncomeModal(true); }}
          />
        </div>

        {/* Add Modal */}
        <Modal isOpen={openAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title="Add Income">
          <AddIncomeForm onAddIncome={handleAddIncome} mode="add" />
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={openEditIncomeModal} onClose={() => setOpenEditIncomeModal(false)} title="Edit Income">
          <AddIncomeForm
            mode="edit"
            initial={selectedIncome}
            onUpdateIncome={handleUpdateIncome}
          />
        </Modal>

        {/* Delete Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
