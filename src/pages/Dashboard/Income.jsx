import React, { useEffect, useRef, useState, useContext } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import IncomeList from '../../components/Income/IncomeList';
import Modal from '../../components/layouts/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import DeleteAlert from '../../components/layouts/DeleteAlert';
import { bulkDeleteIncome } from '../../components/Income/bulkDeleteIncome';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-toastify';
import { useUserAuth } from '../../hooks/useUserAuth';
import { syncRecurring } from '../../utils/syncRecurring';
import FilterControl from '../../components/common/FilterControl';
import { UserContext } from '../../context/UserContext';

const Income = () => {
  useUserAuth();
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredIncome, setFilteredIncome] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [openEditIncomeModal, setOpenEditIncomeModal] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
  const [bulkDeletePeriod, setBulkDeletePeriod] = useState('all');

  const mounted = useRef(true);

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

  const handleBulkDelete = async () => {
    try {
      const data = await bulkDeleteIncome(bulkDeletePeriod);
      setOpenBulkDeleteModal(false);
      toast.success(data.message || 'Income deleted successfully.');
      fetchIncomeDetails();
    } catch (error) {
      toast.error(error.message);
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
              Bulk Delete
            </button>
            <FilterControl
              items={incomeData}
              fieldMap={{ date: 'date', category: 'category', amount: 'amount', text: 'source' }}
              onChange={(list) => setFilteredIncome(list)}
              label="Filter"
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

        {/* Delete Single */}
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

        {/* Bulk Delete */}
        <Modal
          isOpen={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
          title="Bulk Delete Income"
        >
          <div
            className={`space-y-6 p-6 rounded-xl transition-all duration-300 ${
              isDarkTheme
                ? 'bg-gray-800 border border-gray-700 text-gray-200'
                : 'bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900'
            }`}
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
              <h3 className="text-sm font-bold text-white">Warning</h3>
              <p className="text-sm text-white/95 mt-1">
                This action cannot be undone. Deleted income will be permanently removed.
              </p>
            </div>

            <p className="font-bold text-lg">Select deletion period:</p>
            <div className="space-y-3">
              {[
                { label: 'Last Month', value: 'last-month', color: 'blue' },
                { label: 'Last 6 Months', value: 'last-6-months', color: 'indigo' },
                { label: 'Last Year', value: 'last-year', color: 'purple' },
                { label: 'All Income', value: 'all', color: 'red' },
              ].map(({ label, value, color }) => (
                <label
                  key={value}
                  className={`group relative flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    bulkDeletePeriod === value
                      ? `bg-gradient-to-r from-${color}-500 to-${color}-600 shadow-lg scale-[1.02]`
                      : isDarkTheme
                      ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                      : 'bg-white border-2 border-slate-200 hover:shadow-lg hover:scale-[1.01]'
                  }`}
                >
                  <input
                    type="radio"
                    name="period"
                    value={value}
                    checked={bulkDeletePeriod === value}
                    onChange={(e) => setBulkDeletePeriod(e.target.value)}
                    className={`w-5 h-5 text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`}
                  />
                  <span className={`font-bold ${bulkDeletePeriod === value ? 'text-white' : ''}`}>
                    {label}
                  </span>
                  {bulkDeletePeriod === value && (
                    <svg className="w-6 h-6 text-white ml-auto" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
              <button
                onClick={() => setOpenBulkDeleteModal(false)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDarkTheme
                    ? 'bg-gray-600 hover:bg-gray-700 text-white'
                    : 'bg-slate-600 hover:bg-slate-700 text-white'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDarkTheme
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
                }`}
              >
                Delete Selected
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
