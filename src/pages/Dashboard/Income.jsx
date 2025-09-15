import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import { toast } from 'react-toastify';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncomeData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, categoryId, categoryName, amount, date, icon } = income;

    if (!source?.trim()) return toast.error('Source is required.');
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error('Amount must be > 0.');
    if (!date) return toast.error('Date is required.');

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        source,
        amount,
        date,
        icon,
        categoryId: categoryId || undefined,
        category: categoryName || 'Uncategorized',
      });
      setOpenAddIncomeModal(false);
      toast.success('Income added successfully.');
      fetchIncomeDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
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
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while downloading.');
    }
  };

  useEffect(() => { fetchIncomeDetails(); }, []);

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
          />
        </div>

        <Modal isOpen={openAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title="Add Income">
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal isOpen={openDeleteAlert.show} onClose={() => setOpenDeleteAlert({ show: false, data: null })} title="Delete Income">
          <DeleteAlert content="Are you sure you want to delete this income?" onDelete={() => deleteIncome(openDeleteAlert.data)} />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
