import React, { useEffect, useState, useRef } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import useT from "../../hooks/useT";
import { useCurrency } from "../../context/CurrencyContext";
import moment from "moment";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().month());
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [yearList, setYearList] = useState([]);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);

  const { convert, currencySymbol } = useCurrency();
  const { t, lang } = useT();
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
      .map((tx) => ({
        date: moment(tx.date).format("YYYY-MM-DD"),
        amount: convert(tx.amount),
      }))
      .sort((a, b) => moment(a.date) - moment(b.date));

    setChartData(result);

    const total = result.reduce((sum, tx) => sum + tx.amount, 0);
    setTotalIncome(total);
  }, [transactions, selectedMonth, selectedYear, lang, convert]);

  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      {/* Header Section with Controls on the right */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white mb-1">
            {tt("income.incomeOverview", "Income Overview")}
          </h1>
          <p className="text-sm text-gray-400">
            {tt(
              "income.text",
              "Track your earnings over time and analyze your income trends."
            )}
          </p>
        </div>
        
        {/* Controls Section - Moved to right side */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Month Dropdown */}
          <div ref={monthRef} className="relative flex-1 sm:flex-none min-w-[80px]">
            <button
              className="w-full px-2 py-1.5 bg-gray-700 text-white rounded-md text-xs sm:text-sm"
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
            >
              {selectedMonth !== null
                ? moment().month(selectedMonth).format("MMM")
                : "Month"}
            </button>
            {monthDropdownOpen && (
              <div className="absolute mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-20 left-0 right-0 sm:left-auto sm:right-0 sm:min-w-[120px] max-h-60 overflow-auto">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-sm"
                    onClick={() => {
                      setSelectedMonth(i);
                      setMonthDropdownOpen(false);
                    }}
                  >
                    {moment().month(i).format("MMMM")}
                  </div>
                ))}
                <div
                  className="px-3 py-2 cursor-pointer hover:bg-gray-600 font-bold text-red-400 text-sm border-t border-gray-600"
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
              className="w-full px-2 py-1.5 bg-gray-700 text-white rounded-md text-xs sm:text-sm"
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
            >
              {selectedYear || "Year"}
            </button>
            {yearDropdownOpen && (
              <div className="absolute mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-20 left-0 right-0 sm:left-auto sm:right-0 sm:min-w-[90px] max-h-60 overflow-auto">
                {yearList.map((y) => (
                  <div
                    key={y}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-600 text-sm"
                    onClick={() => {
                      setSelectedYear(y);
                      setYearDropdownOpen(false);
                    }}
                  >
                    {y}
                  </div>
                ))}
                <div
                  className="px-3 py-2 cursor-pointer hover:bg-gray-600 font-bold text-red-400 text-sm border-t border-gray-600"
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

          <button
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none"
            onClick={onAddIncome}
          >
            <LuPlus className="text-base" />
            <span>{tt("income.add", "Add Income")}</span>
          </button>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="mb-4">
        {chartData.length > 0 ? (
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="h-[200px]">
              <CustomBarChart data={chartData} />
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
            <div className="text-gray-400 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-400">
              {tt("income.noData", "No income data available for this period.")}
            </p>
          </div>
        )}
      </div>

      {/* Total Income Display */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <span className="text-sm text-gray-300 font-medium text-center sm:text-left">
            Total Income for this period:
          </span>
          <span className="text-xl font-bold text-green-500 text-center">
            {totalIncome.toLocaleString()} {currencySymbol}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IncomeOverview;
