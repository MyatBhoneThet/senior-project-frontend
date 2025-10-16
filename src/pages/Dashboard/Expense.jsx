import React, { useEffect, useRef, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ExpenseOverview from "../../components/Expense/ExpenseOverview";
import ExpenseList from "../../components/Expense/ExpenseList";
import Modal from "../../components/layouts/Modal";
import AddExpenseForm from "../../components/Expense/AddExpenseForm";
import DeleteAlert from "../../components/layouts/DeleteAlert";
import { bulkDeleteExpense } from "../../components/Expense/bulkDeleteExpense";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { useUserAuth } from "../../hooks/useUserAuth";
import { syncRecurring } from "../../utils/syncRecurring";
import FilterControl from "../../components/common/FilterControl";
import { UserContext } from "../../context/UserContext";

const Expense = () => {
  useUserAuth();
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === "dark";

  const [expenseData, setExpenseData] = useState([]);
  const [filteredExpense, setFilteredExpense] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [openEditExpenseModal, setOpenEditExpenseModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);
  const [bulkDeletePeriod, setBulkDeletePeriod] = useState("all");

  const mounted = useRef(true);

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

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return toast.error("Amount must be greater than 0.");
    if (!date) return toast.error("Date is required.");

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
      toast.success("Expense added successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
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
      toast.success("Expense updated successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Update failed.");
    }
  };

  /** Delete Single Expense */
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      await syncRecurring({ silent: false });
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense deleted successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(error?.response?.data || error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  /** Bulk Delete Expenses */
  const handleBulkDelete = async () => {
    try {
      const data = await bulkDeleteExpense(bulkDeletePeriod);
      setOpenBulkDeleteModal(false);
      toast.success(data.message || "Expenses deleted successfully.");
      fetchExpenseDetails();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Bulk delete failed.");
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
      toast.error("Something went wrong while downloading.");
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
              Bulk Delete
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
              label="Filter"
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
          <div
            className={`space-y-6 p-6 rounded-xl transition-all duration-300 ${
              isDarkTheme
                ? "bg-gray-800 border border-gray-700 text-gray-200"
                : "bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900"
            }`}
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
              <h3 className="text-sm font-bold text-white">⚠️ Warning</h3>
              <p className="text-sm text-white/95 mt-1">
                This action cannot be undone. Deleted expenses will be
                permanently removed.
              </p>
            </div>

            <p className="font-bold text-lg">Select deletion period:</p>
            <div className="space-y-3">
              {[
                { label: "Last Month", value: "last-month", color: "blue" },
                { label: "Last 6 Months", value: "last-6-months", color: "indigo" },
                { label: "Last Year", value: "last-year", color: "purple" },
                { label: "All Expenses", value: "all", color: "red" },
              ].map(({ label, value, color }) => (
                <label
                  key={value}
                  className={`group flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    bulkDeletePeriod === value
                      ? `bg-gradient-to-r from-${color}-500 to-${color}-600 shadow-lg scale-[1.02]`
                      : isDarkTheme
                      ? "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                      : "bg-white border-2 border-slate-200 hover:shadow-lg hover:scale-[1.01]"
                  }`}
                >
                  <input
                    type="radio"
                    name="period"
                    value={value}
                    checked={bulkDeletePeriod === value}
                    onChange={(e) => setBulkDeletePeriod(e.target.value)}
                    className="w-5 h-5 accent-current focus:ring-2 focus:ring-offset-2"
                  />
                  <span
                    className={`font-bold ${
                      bulkDeletePeriod === value ? "text-white" : ""
                    }`}
                  >
                    {label}
                  </span>
                  {bulkDeletePeriod === value && (
                    <svg
                      className="w-6 h-6 text-white ml-auto"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
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
                    ? "bg-gray-600 hover:bg-gray-700 text-white"
                    : "bg-slate-600 hover:bg-slate-700 text-white"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  isDarkTheme
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
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

export default Expense;
