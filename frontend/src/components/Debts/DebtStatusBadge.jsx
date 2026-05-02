import React from 'react';

const variants = {
  pending: 'bg-slate-100 text-slate-700 ring-slate-200',
  partially_paid: 'bg-amber-100 text-amber-700 ring-amber-200',
  paid: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  overdue: 'bg-rose-100 text-rose-700 ring-rose-200',
  cancelled: 'bg-slate-200 text-slate-600 ring-slate-300',
};

const labels = {
  pending: 'Pending',
  partially_paid: 'Partially paid',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

export default function DebtStatusBadge({ status }) {
  const klass = variants[status] || variants.pending;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${klass}`}>
      {labels[status] || status || 'Pending'}
    </span>
  );
}
