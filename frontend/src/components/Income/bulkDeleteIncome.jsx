import React from 'react';
import BulkDeleteModal from '../common/BulkDeleteModal';

const PERIOD_OPTIONS = [
  { key: 'income.lastMonth', fallback: 'Last Month', value: 'last-month', helper: 'Delete entries from the previous calendar month.' },
  { key: 'income.last6Month', fallback: 'Last 6 Months', value: 'last-6-months', helper: 'Delete entries from the last six months.' },
  { key: 'income.lastYear', fallback: 'Last Year', value: 'last-year', helper: 'Delete entries from the previous calendar year.' },
  { key: 'income.allIncome', fallback: 'All Income', value: 'all', helper: 'Remove every income entry.' },
];

const BulkDeleteIncome = (props) => {
  return (
    <BulkDeleteModal
      {...props}
      namespace="income"
      periodOptions={PERIOD_OPTIONS}
      copy={{
        warningFallback: 'Warning',
        warningTextFallback: 'This action cannot be undone. Deleted income will be permanently removed.',
        selectPeriodFallback: 'Select deletion period:',
        periodHelperText: 'Choose the exact range to remove.',
        cancelFallback: 'Cancel',
        confirmFallback: 'Delete Selected',
      }}
      styles={{
        warningDefaultClass: 'rounded-xl bg-gradient-to-r from-red-500 to-pink-400 p-4 shadow-lg',
        radioAccentClass: 'accent-lime-400',
        footerDefaultClass: '',
        selectedNeonOptionClass: ({ isDarkTheme }) =>
          isDarkTheme
            ? 'border border-[#d9ff34]/20 bg-[#d9ff34]/10'
            : 'border border-[#84cc16]/40 bg-[#84cc16]/5',
        selectedNeonTextClass: ({ isDarkTheme }) =>
          `text-sm font-bold ${isDarkTheme ? 'text-[#d9ff34]' : 'text-[#84cc16]'}`,
        cancelButtonDefaultClass: `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          props.isDarkTheme
            ? 'bg-gray-600 hover:bg-gray-700 text-white'
            : 'bg-slate-600 hover:bg-slate-700 text-white'
        }`,
        confirmButtonDefaultClass: `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          props.isDarkTheme
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white'
        }`,
        confirmNeonButtonClass: ({ isDarkTheme }) =>
          `rounded-2xl px-4 py-2 text-sm font-bold transition-all ${
            isDarkTheme
              ? 'bg-[#d9ff34] text-black hover:bg-[#cbf029]'
              : 'bg-[#84cc16] text-white hover:bg-[#65a30d]'
          }`,
      }}
    />
  );
};

export default BulkDeleteIncome;
