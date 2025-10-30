import React, { useEffect, useRef, useState, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import IncomeList from '../../components/Income/IncomeList';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import BulkDeleteIncome from '../../components/Income/bulkDeleteIncome';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';
import { useUserAuth } from '../../hooks/useUserAuth';
import { syncRecurring } from '../../utils/syncRecurring';
import FilterControl from '../../components/common/FilterControl';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';

const Income = () => {
  useUserAuth();
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';
  const { t } = useT();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);

  const mounted = useRef(true);

  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  const fetchIncomeDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await syncRecurring({ silent: true });
      const { data } = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      if (!mounted.current) return;
      const list = Array.isArray(data) ? data : [];
      setIncomeData(list);
      setFilteredIncome(list);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, categoryId, categoryName, amount, date, icon } = income;
    if (!source?.trim()) return toast.error(tt('income.text1','Source is required.'));
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error(tt('income.text2','Amount must be greater than 0.'));
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
      await syncRecurring({ silent: false });
      setOpenAddIncomeModal(false);
      toast.success(tt('income.text4','Income added successfully.'));
      fetchIncomeDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('income.text5','Something went wrong.'));
    }
  };

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
      toast.success(tt('income.text6','Income updated successfully.'));
      fetchIncomeDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('income.text7','Update failed.'));
    }
  };

  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      await syncRecurring({ silent: false });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success(tt('income.text8','Income deleted successfully.'));
      fetchIncomeDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || (tt('income.text5',"Something went wrong.")));
    }
  };

  const handleBulkDelete = async (period) => {
    try {
      const data = await BulkDeleteIncome(period);
      setOpenBulkDeleteModal(false);
      toast.success(data.message || tt('income.text8','Income deleted successfully.'));
      fetchIncomeDetails();
    } catch (error) {
      toast.error(error.message  || tt('income.text5','Something went wrong.'));
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
      toast.error(tt('income.text9','Something went wrong while downloading.'));
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchIncomeDetails();
    return () => { mounted.current = false; };
  }, []);

  const containerClass = isDarkTheme
    ? 'min-h-screen bg-gray-900 text-gray-100 transition-colors duration-300'
    : 'min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300';
  const cardClass = isDarkTheme
    ? 'bg-gray-800 border border-gray-700 text-gray-200'
    : 'bg-white border border-gray-200 text-gray-900';

  return (
    <DashboardLayout activeMenu="Income">
      <div className={`my-5 mx-auto ${containerClass}`}>
        <div className="grid grid-cols-1 gap-6">
          <div className={`${cardClass} rounded-xl p-4`}>
            <IncomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setOpenBulkDeleteModal(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkTheme
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {tt('income.bulkDelete','Bulk Delete')}
            </button>
            <FilterControl
              items={incomeData}
              fieldMap={{ date: 'date', category: 'category', amount: 'amount', text: 'source' }}
              onChange={(list) => setFilteredIncome(list)}
              label={tt('income.filter',"Filter")}
            />
          </div>

          <div className={`${cardClass} rounded-xl p-4`}>
            <IncomeList
              transactions={filteredIncome}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={handleDownloadIncomeDetails}
              onEdit={(item) => { setSelectedIncome(item); setOpenEditIncomeModal(true); }}
            />
          </div>
        </div>

        {/* Add Income */}
        <Modal isOpen={openAddIncomeModal} onClose={() => setOpenAddIncomeModal(false)} title="Add Income">
          <AddIncomeForm onAddIncome={handleAddIncome} mode="add" />
        </Modal>

        {/* Edit Income */}
        <Modal isOpen={openEditIncomeModal} onClose={() => setOpenEditIncomeModal(false)} title="Edit Income">
          <AddIncomeForm
            mode="edit"
            initial={selectedIncome}
            onUpdateIncome={handleUpdateIncome}
          />
        </Modal>

        {/* Delete Income(single) */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title={tt('income.deleteIncome',"Delete Income")}
        >
          <DeleteAlert
            content={tt('income.deleteAlert',"Are you sure you want to delete this income?")}
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>

        {/* Bulk Delete */}
        <Modal
          isOpen={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
          title={tt('income.bulkDeleteIncome',"Bulk Delete Income")}
        >
          <BulkDeleteIncome
            isOpen={openBulkDeleteModal}
            onClose={() => setOpenBulkDeleteModal(false)}
            onConfirm={handleBulkDelete}
            isDarkTheme={isDarkTheme}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
