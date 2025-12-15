import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RecurringList from '../../components/recurring/RecurringList';
import useT from '../../hooks/useT';

export default function RecurringPage() {
    const { t } = useT(); // Translation function

    const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-2">{tt('recurring.title', 'Recurring Transactions')}</h1>
        <p className="text-sm text-slate-600 mb-6">{tt('recurring.text', `Create rules for salary, rent, and loan payments so they’re posted automatically each month.
          You can edit amounts and dates anytime, and pause/resume rules as needed.`)}
        </p>
        <RecurringList />
      </div>
    </DashboardLayout>
  );
}
