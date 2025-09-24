import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";
import useT from "../../hooks/useT";

const ExpenseOverview = ({ transactions, onExpenseIncome, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);
  const { t, lang } = useT();
  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const result = prepareExpenseLineChartData(transactions);
      setChartData(result);
    } else {
      setChartData([]);
    }
  }, [transactions, lang]);

//   const handleOpenForm = onExpenseIncome || onAddExpense;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">{tt("expense.expenseOverview", "Expense Overview")}</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            {tt("expense.text", "Track your spending trends over time and gain insights into where your money goes.")}
          </p>
        </div>

        <button
                  className="add-btn flex items-center gap-1"
                  onClick={onAddExpense}
                >
                  <LuPlus className="text-lg" />
                  <span>{tt("expense.addExpense", "Add Expense")}</span>
                </button>
              </div>

      {/* Chart */}
      <div className="mt-10">
        {chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <p className="text-center text-sm text-gray-400">
            {tt("expense.noData", "No expense data available yet.")}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseOverview;
