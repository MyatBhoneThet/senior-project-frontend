import React from "react";
import { LuArrowRight } from "react-icons/lu";
import TransactionInfoCard from "../Cards/TransactionInfoCard";
import moment from "moment";
import useT from "../../hooks/useT";

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  const { t } = useT();

  // translate with fallback if a key is missing
  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">{tt("dashboard.expenses", "Expenses")}</h5>

        <button className="card-btn" onClick={onSeeMore}>
          {tt("dashboard.seeMore", "See More")} <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 3).map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={expense.category}
            icon={expense.icon}
            date={moment(expense.date).format("Do MMM YYYY")}
            amount={expense.amount}
            type="expense"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
