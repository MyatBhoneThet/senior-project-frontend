import React, { useEffect, useRef, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import BulkDeleteExpense from "../../components/Expense/bulkDeleteExpense";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { useUserAuth } from "../../hooks/useUserAuth";
import { syncRecurring } from "../../utils/syncRecurring";
import FilterControl from "../../components/common/FilterControl";
import { UserContext } from "../../context/UserContext";
import useT from "../../hooks/useT";

const Expense = () => {
  useUserAuth();
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === "dark";
  const { t } = useT();

  const [expenseData, setExpenseData] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openEditExpenseModal, setOpenEditExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);

  const mounted = useRef(true);

  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  /** Fetch all expense details */
  const fetchExpenseDetails = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await syncRecurring({ silent: true });
      const { data } = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);
      if (!mounted.current) return;
      const list = Array.isArray(data) ? data : [];
      setExpenseData(list);
      setFilteredExpense(list);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load expenses. Please try again.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  /** Add Expense */
  const handleAddExpense = async (expense) => {
    const { source, categoryId, categoryName, amount, date, icon } = expense;
    if (!source?.trim()) return toast.error(tt('expense.text1','Source is required.'));
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error(tt('expense.text2','Amount must be greater than 0.'));
    if (!date) return toast.error(tt('expense.text3','Date is required.'));

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        source: (source || "").trim(),
        categoryId: categoryId || undefined,
        category: categoryName || undefined,
        amount: Number(amount),
        date,
        icon: icon || "",
      });

      await syncRecurring({ silent: false });
      setOpenAddExpenseModal(false);
      toast.success(tt('expense.text4',"Expense added successfully."));
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('expense.text5','Something went wrong.'));
    }
  };

  /** Update Expense */
  const handleUpdateExpense = async (payload) => {
    if (!selectedExpense?._id) return;
    try {
      await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(selectedExpense._id), {
        source: (payload.source || "").trim(),
        categoryId: payload.categoryId || undefined,
        category: payload.categoryName || undefined,
        amount: Number(payload.amount),
        date: payload.date,
        icon: payload.icon || "",
      });

      setOpenEditExpenseModal(false);
      setSelectedExpense(null);
      toast.success(tt('expense.text6','Expense updated successfully.'));
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || tt('expense.text7',"Update failed."));
    }
  };

  /** Delete Single Expense */
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      await syncRecurring({ silent: false });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success(tt('expense.text8',"Expense deleted successfully."));
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || (tt('expense.text5',"Something went wrong.")));
    }
  };

  /** Bulk Delete Expenses */
  const handleBulkDelete = async (period) => {
    try {
      const data = await BulkDeleteExpense(period);
      setOpenBulkDeleteModal(false);
      toast.success(data.message || tt('expense.text8',"Expense deleted successfully."));
      fetchExpenseDetails();
    } catch (error) {
      console.error(error);
      toast.error(error.message || tt('expense.text5','Something went wrong.'));
    }
  };

  /** Download Expense Excel */
  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXCEL, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error(tt('expense.text9','Something went wrong while downloading.'));
    }
  };

  /** Initial Mount */
  useEffect(() => {
    mounted.current = true;
    fetchExpenseDetails();
    return () => {
      mounted.current = false;
    };
  }, []);

  // Theming
  const containerClass = isDarkTheme
    ? "min-h-screen bg-gray-900 text-gray-100 transition-colors duration-300"
    : "min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300";

  const cardClass = isDarkTheme
    ? "bg-gray-800 border border-gray-700 text-gray-200"
    : "bg-white border border-gray-200 text-gray-900";

  return (
    <DashboardLayout activeMenu="Expense">
      <div className={`my-5 mx-auto ${containerClass}`}>
        <div className="grid grid-cols-1 gap-6">

          {/* Overview Chart */}
          <div className={`${cardClass} rounded-xl p-4`}>
            <ExpenseOverview
              transactions={expenseData}
              onAddExpense={() => setOpenAddExpenseModal(true)}
            />
          </div>

          {/* Filter + Bulk Delete */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setOpenBulkDeleteModal(true)}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              {tt('expense.bulkDelete','Bulk Delete')}
            </button>
            <FilterControl
              items={expenseData}
              fieldMap={{
                date: "date",
                category: "category",
                amount: "amount",
                text: "source",
              }}
              onChange={(list) => setFilteredExpense(list)}
              label={tt('expense.filter',"Filter")}
            />
          </div>

          {/* Expense List */}
          <div className={`${cardClass} rounded-xl p-4`}>
            <ExpenseList
              transactions={filteredExpense}
              onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
              onDownload={handleDownloadExpenseDetails}
              onEdit={(item) => {
                setSelectedExpense(item);
                setOpenEditExpenseModal(true);
              }}
            />
          </div>
        </div>

        {/* Add Expense Modal */}
        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} mode="add" />
        </Modal>

        {/* Edit Expense Modal */}
        <Modal
          isOpen={openEditExpenseModal}
          onClose={() => setOpenEditExpenseModal(false)}
          title="Edit Expense"
        >
          <AddExpenseForm
            mode="edit"
            initial={selectedExpense}
            onUpdateExpense={handleUpdateExpense}
          />
        </Modal>

        {/* Delete Single Expense Modal */}
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

        {/* Bulk Delete Modal */}
        <Modal
          isOpen={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
          title="Bulk Delete Expenses"
        >
          <BulkDeleteExpense
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

export default Expense;
