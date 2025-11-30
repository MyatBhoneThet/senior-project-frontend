import React, { useEffect, useState, useRef, useContext } from "react";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import useT from "../../hooks/useT";
import { useCurrency } from "../../context/CurrencyContext";
import { UserContext } from "../../context/UserContext";
import moment from "moment";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [yearList, setYearList] = useState([]);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [totalExpense, setTotalExpense] = useState(0);

  const { convert, format } = useCurrency(); // useCurrency hook
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === "dark";
  const monthRef = useRef();
  const yearRef = useRef();
  const { t, lang } = useT();

  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (monthRef.current && !monthRef.current.contains(e.target))
        setMonthDropdownOpen(false);
      if (yearRef.current && !yearRef.current.contains(e.target))
        setYearDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const years = Array.from(
      new Set(transactions.map((tx) => moment(tx.date).year()))
    ).sort((a, b) => b - a);
    setYearList(years);
  }, [transactions]);

  useEffect(() => {
    if (!transactions?.length) {
      setChartData([]);
      setTotalExpense(0);
      return;
    }

    const filteredTx = transactions.filter((tx) => {
      const date = moment(tx.date);
      return (
        (selectedMonth === null || date.month() === selectedMonth) &&
        (selectedYear === null || date.year() === selectedYear)
      );
    });

    const result = filteredTx
      .map((tx) => ({
        date: moment(tx.date).format("YYYY-MM-DD"),
        amount: convert(tx.amount), // convert to selected currency
        category: tx.category || tx.categoryName || "Uncategorized",
        source: tx.source || "Expense",
      }))
      .sort((a, b) => moment(a.date) - moment(b.date));

    setChartData(result);
    setTotalExpense(result.reduce((sum, tx) => sum + tx.amount, 0));
  }, [transactions, selectedMonth, selectedYear, lang, convert]);

  return (
    <div className={`rounded-xl p-4 border shadow-sm transition-colors ${isDark ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-200/60 text-gray-900"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-1">
            {tt("expense.expenseOverview", "Expense Overview")}
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {tt("expense.text","Track your spending trends over time and gain insights into where your money goes.")}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Month & Year Dropdowns (same as before) */}
          {/* ... keep your dropdown code unchanged ... */}

          {/* Add Button */}
          <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none" onClick={onAddExpense}>
            <LuPlus className="text-base" />
            <span>{tt("expense.addExpense", "Add Expense")}</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        {chartData.length > 0 ? (
          <div className={`rounded-lg p-3 border ${isDark ? "bg-gray-800 border-gray-700": "bg-gray-50 border-gray-200"}`}>
            <div className="h-[200px]">
              <CustomLineChart 
                data={chartData} 
                formatLabel={(value) => format(value)} // send formatted label with symbol in front
              />
            </div>
          </div>
        ) : (
          <div className={`rounded-lg p-8 border text-center ${isDark ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
            <div className="mb-3">
              <svg className={`w-12 h-12 mx-auto ${isDark ? "text-gray-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <p className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {tt("expense.noData", "No expense data available for this month.")}
            </p>
          </div>
        )}
      </div>

      {/* Total */}
      <div className={`rounded-lg p-4 border ${isDark ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700" : "bg-gradient-to-r from-gray-100 to-white border-gray-200"}`}>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            {tt('expense.totalExpense','Total Expense for this period:')}
          </span>
          <span className="text-xl font-bold text-rose-500 text-center">
            {format(totalExpense)} {/* symbol is in front automatically */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;
