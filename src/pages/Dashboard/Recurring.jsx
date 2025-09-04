import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RecurringList from '../../components/recurring/RecurringList';

export default function RecurringPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-2">Recurring Transactions</h1>
        <p className="text-sm text-slate-600 mb-6">
          Create rules for salary, rent, and loan payments so they’re posted automatically each month.
          You can edit amounts and dates anytime, and pause/resume rules as needed.
        </p>
        <RecurringList />
      </div>
    </DashboardLayout>
  );
}
