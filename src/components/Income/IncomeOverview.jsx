import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../utils/helper";
import useT from "../../hooks/useT";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);
  const { t, lang } = useT();

  // fallback translator
  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const result = prepareIncomeBarChartData(transactions);
      setChartData(result);
    } else {
      setChartData([]);
    }
  }, [transactions, lang]); // re-render on language change

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">
            {tt("income.incomeOverview", "Income Overview")}
          </h5>
          <p className="text-xs text-gray-400 mt-0.5">
            {tt("income.text", "Track your earnings over time and analyze your income trends.")}
          </p>
        </div>

        <button
          className="add-btn flex items-center gap-1"
          onClick={onAddIncome}
        >
          <LuPlus className="text-lg" />
          <span>{tt("income.add", "Add Income")}</span>
        </button>
      </div>

      {/* Chart */}
      <div className="mt-10">
        {chartData.length > 0 ? (
          <CustomBarChart data={chartData} />
        ) : (
          <p className="text-center text-sm text-gray-400">
            {tt("income.noData", "No income data available yet.")}
          </p>
        )}
      </div>
    </div>
  );
};

export default IncomeOverview;
