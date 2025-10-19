import React, { useEffect, useState, useRef } from "react";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";
import useT from "../../hooks/useT";
import { useCurrency } from "../../context/CurrencyContext";
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
  const monthRef = useRef();
  const yearRef = useRef();

  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  // Close dropdowns when clicking outside
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

  // Prepare unique years from transactions
  useEffect(() => {
    const years = Array.from(
      new Set(transactions.map((tx) => moment(tx.date).year()))
    ).sort((a, b) => b - a);
    setYearList(years);
  }, [transactions]);

  // Filter chart data based on selected month/year
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      setTotalExpense(0);
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
      .map((tx) => ({
        date: moment(tx.date).format("YYYY-MM-DD"),
        amount: convert(tx.amount),
        category: tx.category || tx.categoryName || "Uncategorized",
      }))
      .sort((a, b) => moment(a.date) - moment(b.date));

    setChartData(result);

    // Calculate total expense
    const total = result.reduce((sum, tx) => sum + tx.amount, 0);
    setTotalExpense(total);
  }, [transactions, selectedMonth, selectedYear, lang, convert]);

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h5 className="text-lg font-semibold">
            {tt("expense.expenseOverview", "Expense Overview")}
          </h5>
          <p className="text-xs text-gray-400 mt-0.5">
            {tt(
              "expense.text",
              "Track your spending trends over time and gain insights into where your money goes."
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 relative flex-wrap">
          {/* Month Dropdown */}
          <div ref={monthRef} className="relative">
            <button
              className="px-3 py-1 bg-gray-700 text-white rounded-md"
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            >
              {selectedMonth !== null
                ? moment().month(selectedMonth).format("MMMM")
                : "Month"}
            </button>
            {monthDropdownOpen && (
              <div className="absolute mt-1 bg-gray-700 border border-gray-300 rounded-md shadow-lg z-10">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 cursor-pointer hover:bg-gray-500"
                    onClick={() => {
                      setSelectedMonth(i);
                      setMonthDropdownOpen(false);
                    }}
                  >
                    {moment().month(i).format("MMMM")}
                  </div>
                ))}
                <div
                  className="px-3 py-1 cursor-pointer hover:bg-gray-500 font-bold text-red-400"
                  onClick={() => {
                    setSelectedMonth(null);
                    setMonthDropdownOpen(false);
                  }}
                >
                  All Months
                </div>
              </div>
            )}
          </div>

          {/* Year Dropdown */}
          <div ref={yearRef} className="relative">
            <button
              className="px-3 py-1 bg-gray-700 text-white rounded-md"
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            >
              {selectedYear || "Year"}
            </button>
            {yearDropdownOpen && (
              <div className="absolute mt-1 bg-gray-700 border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                {yearList.map((y) => (
                  <div
                    key={y}
                    className="px-3 py-1 cursor-pointer hover:bg-gray-500"
                    onClick={() => {
                      setSelectedYear(y);
                      setYearDropdownOpen(false);
                    }}
                  >
                    {y}
                  </div>
                ))}
                <div
                  className="px-3 py-1 cursor-pointer hover:bg-gray-500 font-bold text-red-400"
                  onClick={() => {
                    setSelectedYear(null);
                    setYearDropdownOpen(false);
                  }}
                >
                  All Years
                </div>
              </div>
            )}
          </div>

          <button
            className="add-btn flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
            onClick={onAddExpense}
          >
            <LuPlus className="text-lg" />
            <span>{tt("expense.addExpense", "Add Expense")}</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 flex justify-end">
        <div className="w-full h-[250px]">
          {chartData.length > 0 ? (
            <CustomLineChart data={chartData} />
          ) : (
            <p className="text-center text-sm text-gray-400">
              {tt("expense.noData", "No expense data available for this period.")}
            </p>
          )}
          <span className="text-base text-gray-300 font-medium whitespace-nowrap">
                {tt("expense.totalExpense", "Total Expense for this period")}
            </span>
            <span className="text-xl font-bold text-rose-500 ml-4 whitespace-nowrap">
                {totalExpense.toLocaleString()} {currencySymbol || "THB"}
            </span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseOverview;
