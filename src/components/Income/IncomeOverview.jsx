import React, { useEffect, useState, useRef, useContext } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import useT from "../../hooks/useT";
import { useCurrency } from "../../context/CurrencyContext";
import { UserContext } from "../../context/UserContext";
import moment from "moment";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [yearList, setYearList] = useState([]);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);

  const { convert, format, symbol, targetCurrency, language } = useCurrency();
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === "dark";

  const { t } = useT();

  const monthRef = useRef();
  const yearRef = useRef();

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
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      setTotalIncome(0);
      return;
    }

    let filteredTx = [...transactions];

    if (selectedMonth !== null) {
      filteredTx = filteredTx.filter(
        (tx) => moment(tx.date).month() === selectedMonth
      );
    }
    if (selectedYear !== null) {
      filteredTx = filteredTx.filter(
        (tx) => moment(tx.date).year() === selectedYear
      );
    }

    const result = filteredTx
      .map((tx) => {
        const convertedAmount = convert(tx.amount);
        return {
          date: moment(tx.date).format("YYYY-MM-DD"),
          amount: convertedAmount,
          category: tx.category || tx.categoryName || "Uncategorized",
          source: tx.source || "Income",
        };
      })
      .sort((a, b) => moment(a.date) - moment(b.date));

    setChartData(result);

    // Calculate total - chartData amounts are already converted to display currency
    const total = result.reduce((sum, tx) => sum + tx.amount, 0);
    setTotalIncome(total);
  }, [transactions, selectedMonth, selectedYear, convert]);

  // Format the total income in display currency
  const formatDisplayAmount = (amount) => {
    try {
      return new Intl.NumberFormat(language, { 
        style: "currency", 
        currency: targetCurrency 
      }).format(amount);
    } catch {
      const symbolMap = { THB: "฿", USD: "$", MMK: "MMK " };
      const sym = symbolMap[targetCurrency] || targetCurrency;
      return `${sym}${Number(amount).toLocaleString(language)}`;
    }
  };

  // Get currency symbol as a string
  const currencySymbol = typeof symbol === 'function' ? symbol() : symbol || '$';

  return (
    <div
      className={`rounded-xl p-4 border shadow-sm ${
        isDark
          ? "bg-gray-900 border-gray-700 text-gray-200"
          : "bg-white border-gray-200/50 text-gray-900"
      }`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <h1
            className={`text-xl font-bold mb-1 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {tt("income.incomeOverview", "Income Overview")}
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {tt(
              "income.text",
              "Track your earnings over time and analyze your income trends."
            )}
          </p>
        </div>

        {/* Controls Section */}
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
                : tt("income.month", "Month")}
            </button>
            {monthDropdownOpen && (
              <div
                className={`absolute mt-1 rounded-md shadow-lg z-20 left-0 right-0 sm:left-auto sm:right-0 sm:min-w-[120px] max-h-60 overflow-auto border ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      isDark
                        ? "hover:bg-gray-600 text-gray-100"
                        : "hover:bg-gray-100 text-gray-700"
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
                      ? "hover:bg-gray-600 text-green-400 border-gray-600"
                      : "hover:bg-gray-100 text-green-500 border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedMonth(null);
                    setMonthDropdownOpen(false);
                  }}
                >
                  {tt("income.all", "All")}
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
              {selectedYear || tt("income.year", "Year")}
            </button>
            {yearDropdownOpen && (
              <div
                className={`absolute mt-1 rounded-md shadow-lg z-20 left-0 right-0 sm:left-auto sm:right-0 sm:min-w-[90px] max-h-60 overflow-auto border ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              >
                {yearList.map((y) => (
                  <div
                    key={y}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                      isDark
                        ? "hover:bg-gray-600 text-gray-100"
                        : "hover:bg-gray-100 text-gray-700"
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
                      ? "hover:bg-gray-600 text-green-400 border-gray-600"
                      : "hover:bg-gray-100 text-green-500 border-gray-200"
                  }`}
                  onClick={() => {
                    setSelectedYear(null);
                    setYearDropdownOpen(false);
                  }}
                >
                  {tt("income.all", "All")}
                </div>
              </div>
            )}
          </div>

          <button
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none"
            onClick={onAddIncome}
          >
            <LuPlus className="text-base" />
            <span>{tt("income.add", "Add Income")}</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-4">
        {chartData.length > 0 ? (
          <div
            className={`rounded-lg p-3 border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="h-[200px]">
              <CustomBarChart
                data={chartData}
                currencySymbol={currencySymbol}
              />
            </div>
          </div>
        ) : (
          <div
            className={`rounded-lg p-8 border text-center ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-400"
                : "bg-gray-50 border-gray-200 text-gray-500"
            }`}
          >
            <div className="mb-3">
              <svg
                className={`w-12 h-12 mx-auto ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm">
              {tt("income.noData", "No income data available for this month.")}
            </p>
          </div>
        )}
      </div>

      {/* Total Income Display */}
      <div
        className={`rounded-lg p-4 border ${
          isDark
            ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-r from-gray-100 to-white border-gray-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span
            className={`text-sm font-medium text-center sm:text-left ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {tt("income.totalIncome", "Total Income for this period:")}
          </span>
          <span className="text-xl font-bold text-green-500 text-center">
            {formatDisplayAmount(totalIncome)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IncomeOverview;
