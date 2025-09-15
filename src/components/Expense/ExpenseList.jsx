import React, { useContext } from 'react';
import moment from 'moment';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { UserContext } from '../../context/UserContext';

function titleFrom(tx) {
  const category = tx.categoryName || tx.category || 'Uncategorized';
  const src = (tx.source || '').trim(); // some older data may not have source
  return src ? `${src} (${category})` : category;
}

const ExpenseList = ({ transactions = [], onDelete, onDownload }) => {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';

  const cardClass = `rounded-lg p-4 mb-4 border ${
    isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'
  }`;

  const headerClass = `flex items-center justify-between mb-4 ${
    isDark ? 'text-gray-100' : 'text-gray-900'
  }`;

  const emptyClass = `text-sm py-3 ${
    isDark ? 'text-gray-400' : 'text-slate-500'
  }`;

  const buttonClass = `flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    isDark
      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400'
  }`;

  return (
    <div className={cardClass}>
      <div className={headerClass}>
        <h5 className="text-lg font-semibold">Expenses</h5>

        <button className={buttonClass} onClick={onDownload}>
          <LuDownload className="text-base" /> Download
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transactions.map((expense) => (
          <TransactionInfoCard
            key={expense._id}
            title={titleFrom(expense)} // 👉 "KFC (Food)"
            icon={expense.icon}
            date={expense.date ? moment(expense.date).format('Do MMM YYYY') : ''}
            amount={expense.amount}
            type="expense"
            onDelete={() => onDelete?.(expense._id)}
          />
        ))}

        {transactions.length === 0 && (
          <div className={emptyClass}>No expenses yet.</div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
