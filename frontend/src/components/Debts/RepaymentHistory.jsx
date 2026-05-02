import React from 'react';

export default function RepaymentHistory({ repayments = [], currency = 'THB', isDark }) {
  return (
    <div className={`rounded-[28px] border p-5 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white'}`}>
      <h4 className="text-lg font-semibold">Repayment history</h4>
      <div className="mt-4 space-y-3">
        {repayments.length === 0 ? (
          <div className={`rounded-3xl border border-dashed p-4 text-sm ${isDark ? 'border-white/10 text-white/55' : 'border-slate-200 text-slate-500'}`}>
            No repayments yet.
          </div>
        ) : repayments.map((item, index) => (
          <div key={`${item.repaymentId || index}`} className={`rounded-3xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center justify-between gap-3">
              <div className="font-medium">
                {currency} {Number(item.amount || 0).toLocaleString()}
              </div>
              <div className={`text-xs ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
                {item.paidAt ? new Date(item.paidAt).toLocaleString() : 'Just now'}
              </div>
            </div>
            {item.note ? <p className={`mt-2 text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>{item.note}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
