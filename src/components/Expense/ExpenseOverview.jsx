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

  const { convert, currencySymbol } = useCurrency();
  const { t, lang } = useT();
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === "dark";

  const monthRef = useRef();
  const yearRef = useRef();

  const tt = (key, fallback) => t?.(key) || fallback;

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

    let filteredTx = transactions.filter((tx) => {
      const date = moment(tx.date);
      return (
        (selectedMonth === null || date.month() === selectedMonth) &&
        (selectedYear === null || date.year() === selectedYear)
      );
    });

    const result = filteredTx
      .map((tx) => ({
        date: moment(tx.date).format("YYYY-MM-DD"),
        amount: convert(tx.amount),
        category: tx.category || tx.categoryName || "Uncategorized",
      }))
      .sort((a, b) => moment(a.date) - moment(b.date));

    setChartData(result);
    setTotalExpense(result.reduce((sum, tx) => sum + tx.amount, 0));
  }, [transactions, selectedMonth, selectedYear, lang, convert]);

  return (
    <div
      className={`rounded-xl p-4 border shadow-sm transition-colors ${
        isDark
          ? "bg-gray-900 border-gray-700 text-gray-200"
          : "bg-white border-gray-200/60 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-1">
            {tt("expense.expenseOverview", "Expense Overview")}
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {tt(
              "expense.text",
              "Track your spending trends over time and gain insights into where your money goes."
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Month Dropdown */}
          <div ref={monthRef} className="relative flex-1 sm:flex-none min-w-[80px]">
            <button
              className={`w-full px-2 py-1.5 rounded-md text-xs sm:text-sm ${
                isDark
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            >
              {selectedMonth !== null
                ? moment().month(selectedMonth).format("MMM")
                : "Month"}
            </button>
            {monthDropdownOpen && (
              <div
                className={`absolute mt-1 rounded-md shadow-lg z-20 left-0 right-0 sm:left-auto sm:right-0 sm:min-w-[120px] max-h-60 overflow-auto border ${
                  isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      isDark ? "hover:bg-gray-600 text-gray-100" : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedMonth(i);
                      setMonthDropdownOpen(false);
                    }}
                  >
                    {moment().month(i).format("MMMM")}
                  </div>
                ))}
                <div
                  className={`px-3 py-2 cursor-pointer font-bold text-sm border-t ${
                    isDark
                      ? "hover:bg-gray-600 text-red-400 border-gray-600"
                      : "hover:bg-gray-100 text-red-500 border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedMonth(null);
                    setMonthDropdownOpen(false);
                  }}
                >
                  All
                </div>
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div ref={yearRef} className="relative flex-1 sm:flex-none min-w-[70px]">
            <button
              className={`w-full px-2 py-1.5 rounded-md text-xs sm:text-sm ${
                isDark
                  ? "bg-gray-700 text-white"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            >
              {selectedYear || "Year"}
            </button>
            {yearDropdownOpen && (
              <div
                className={`absolute mt-1 rounded-md shadow-lg z-20 left-0 right-0 sm:left-auto sm:right-0 sm:min-w-[90px] max-h-60 overflow-auto border ${
                  isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"
                }`}
              >
                {yearList.map((y) => (
                  <div
                    key={y}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      isDark ? "hover:bg-gray-600 text-gray-100" : "hover:bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => {
                      setSelectedYear(y);
                      setYearDropdownOpen(false);
                    }}
                  >
                    {y}
                  </div>
                ))}
                <div
                  className={`px-3 py-2 cursor-pointer font-bold text-sm border-t ${
                    isDark
                      ? "hover:bg-gray-600 text-red-400 border-gray-600"
                      : "hover:bg-gray-100 text-red-500 border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedYear(null);
                    setYearDropdownOpen(false);
                  }}
                >
                  All
                </div>
              </div>
            )}
          </div>

          {/* Add Button */}
          <button
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none"
            onClick={onAddExpense}
          >
            <LuPlus className="text-base" />
            <span>{tt("expense.addExpense", "Add Expense")}</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div
        className={`rounded-lg p-3 mb-4 border ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}
      >
        {chartData.length > 0 ? (
          <div className="h-[200px]">
            <CustomLineChart data={chartData} />
          </div>
        ) : (
          <p className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {tt("expense.noData", "No expense data available for this period.")}
          </p>
        )}
      </div>

      {/* Total */}
      <div
        className={`rounded-lg p-4 border ${
          isDark
            ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-r from-gray-100 to-white border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Total Expense for this period:
          </span>
          <span className="text-xl font-bold text-rose-500 text-center">
            {totalExpense.toLocaleString()} {currencySymbol}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;
