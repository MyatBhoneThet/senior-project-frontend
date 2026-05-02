import React from 'react';
import BulkDeleteModal from '../common/BulkDeleteModal';

const PERIOD_OPTIONS = [
  { key: 'expense.lastMonth', fallback: 'Last Month', value: 'last-month', helper: 'Delete entries from the previous calendar month.' },
  { key: 'expense.last6Month', fallback: 'Last 6 Months', value: 'last-6-months', helper: 'Delete entries from the last six months.' },
  { key: 'expense.lastYear', fallback: 'Last Year', value: 'last-year', helper: 'Delete entries from the previous calendar year.' },
  { key: 'expense.allExpenses', fallback: 'All Expenses', value: 'all', helper: 'Remove every expense entry.' },
];

const BulkDeleteExpense = (props) => {
  return (
    <BulkDeleteModal
      {...props}
      namespace="expense"
      periodOptions={PERIOD_OPTIONS}
      copy={{
        warningFallback: 'Warning',
        warningTextFallback: 'This action cannot be undone. Deleted expenses will be permanently removed.',
        selectPeriodFallback: 'Select deletion period:',
        periodHelperText: 'Choose the exact range to remove.',
        cancelFallback: 'Cancel',
        confirmFallback: 'Delete Selected',
      }}
      styles={{
        warningDefaultClass: 'rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 shadow-lg',
        radioAccentClass: 'accent-rose-400',
        footerDefaultClass: 'border-t border-gray-300 dark:border-gray-600',
        cancelButtonDefaultClass: `px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
          props.isDarkTheme
            ? 'bg-gray-600 hover:bg-gray-700 text-white'
            : 'bg-slate-600 hover:bg-slate-700 text-white'
        }`,
        confirmButtonDefaultClass: `px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
          props.isDarkTheme
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
        }`,
      }}
    />
  );
};

export default BulkDeleteExpense;
