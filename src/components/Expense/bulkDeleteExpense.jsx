import React, { useState } from 'react';
import useT from "../../hooks/useT";

const BulkDeleteExpense = ({ isOpen, onClose, onConfirm, isDarkTheme }) => {
  const [bulkDeletePeriod, setBulkDeletePeriod] = useState('all');
  const { t, lang } = useT();
  
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(bulkDeletePeriod);
  };

  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  return (
    <div
      className={`space-y-6 p-6 rounded-xl transition-all duration-300 ${
        isDarkTheme
          ? 'bg-gray-800 border border-gray-700 text-gray-200'
          : 'bg-gradient-to-br from-slate-50 to-slate-100 text-gray-900'
      }`}
    >
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
        <h3 className="text-sm font-bold text-white">{tt('expense.warning', '⚠️ Warning')}</h3>
        <p className="text-sm text-white/95 mt-1">
          {tt('expense.warningText', 'This action cannot be undone. Deleted expenses will be permanently removed.')}
        </p>
      </div>

      <p className="font-bold text-lg">{tt('expense.selectDeletionPeriod', 'Select deletion period:')}</p>
      <div className="space-y-3">
        {[
          { label: tt('expense.lastMonth', 'Last Month'), value: 'last-month', color: 'blue' },
          { label: tt('expense.last6Month', 'Last 6 Months'), value: 'last-6-months', color: 'indigo' },
          { label: tt('expense.lastYear', 'Last Year'), value: 'last-year', color: 'purple' },
          { label: tt('expense.allExpenses', 'All Expenses'), value: 'all', color: 'red' },
        ].map(({ label, value, color }) => (
          <label
            key={value}
            className={`group flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              bulkDeletePeriod === value
                ? `bg-gradient-to-r from-${color}-500 to-${color}-600 shadow-lg scale-[1.02]`
                : isDarkTheme
                ? 'bg-gray-700 border border-gray-600 hover:bg-gray-600'
                : 'bg-white border-2 border-slate-200 hover:shadow-lg hover:scale-[1.01]'
            }`}
          >
            <input
              type="radio"
              name="period"
              value={value}
              checked={bulkDeletePeriod === value}
              onChange={(e) => setBulkDeletePeriod(e.target.value)}
              className={`w-5 h-5 text-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`}
            />
            <span
              className={`font-bold ${
                bulkDeletePeriod === value ? 'text-white' : ''
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
          onClick={onClose}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isDarkTheme
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-slate-600 hover:bg-slate-700 text-white'
          }`}
        >
          {tt('expense.cancel', 'Cancel')}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isDarkTheme
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
          }`}
        >
          {tt('expense.deleteSelected', 'Delete Selected')}
        </button>
      </div>
    </div>
  );
};

export default BulkDeleteExpense;
