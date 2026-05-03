import React from 'react';
import DebtStatusBadge from './DebtStatusBadge';
import { ListSkeleton } from '../Dashboard/DashboardSkeleton';

export default function DebtList({ debts, selectedId, onSelect, filters, onFilterChange, isDark, currentUserId, loading = false }) {
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const chipIdle = isDark ? 'border-white/10 text-white/65 hover:bg-white/5' : 'border-white/45 bg-white/35 text-[#6b7080] hover:bg-white/70 hover:text-[#11131b]';
  const chipActive = isDark ? 'bg-[#d9ff34] text-black border-[#d9ff34]' : 'bg-slate-900 text-white border-slate-900';

  return (
    <div className={`rounded-[24px] border p-5 ${cardClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-medium">My debt records</h3>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
            Filter by role or status and open a record to chat, repay, or remind.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'lend', label: 'Lent' },
          { key: 'borrow', label: 'Borrowed' },
          { key: 'pending', label: 'Pending' },
          { key: 'partially_paid', label: 'Partial' },
          { key: 'overdue', label: 'Overdue' },
          { key: 'paid', label: 'Paid' },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onFilterChange(item.key)}
            className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
              filters.view === item.key ? chipActive : chipIdle
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={`mt-5 overflow-hidden rounded-[22px] border ${isDark ? 'border-white/10 bg-black/5' : 'border-white/45 bg-white/35'}`}>
        {loading ? (
          <div className="p-5">
            <ListSkeleton rows={5} isDark={isDark} />
          </div>
        ) : debts.length === 0 ? (
          <div className={`rounded-2xl border border-dashed p-6 text-sm ${isDark ? 'border-white/10 text-white/55' : 'border-white/50 text-slate-500'}`}>
            No debt records yet. Create one above.
          </div>
        ) : (
          debts.map((debt, index) => {
            const isSelected = String(selectedId) === String(debt._id);
            const counterparty = debt.role === 'lend' ? debt.borrowerId : debt.lenderId;
            const unreadMap = debt?.chatConversationId?.unreadCounts;
            const unreadCount = Number(
              unreadMap?.[String(currentUserId)] ||
              unreadMap?.get?.(String(currentUserId)) ||
              0
            );
            return (
              <div key={debt._id}>
                <button
                  type="button"
                  onClick={() => onSelect(debt)}
                  className={`w-full p-4 text-left transition ${
                    isSelected
                      ? isDark
                        ? 'bg-transparent'
                        : 'bg-white/55'
                      : isDark
                        ? 'hover:bg-white/[0.03]'
                        : 'hover:bg-white/55'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className={`text-base font-semibold ${isSelected ? (isDark ? 'text-[#d9ff34]' : 'text-amber-600') : ''}`}>
                        {debt.currency} {Number(debt.amount || 0).toLocaleString()}
                      </div>
                      <div className={`mt-1 text-sm ${isSelected ? (isDark ? 'text-[#e7f99b]' : 'text-amber-700') : (isDark ? 'text-white/55' : 'text-slate-500')}`}>
                        {debt.description || 'No description'}
                      </div>
                    </div>
                    <DebtStatusBadge status={debt.status} />
                  </div>
                  <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 text-xs tracking-[0.12em] ${isSelected ? (isDark ? 'text-[#d9ff34]/90' : 'text-amber-700') : (isDark ? 'text-white/55' : 'text-slate-500')}`}>
                    <span>Counterparty: {counterparty?.fullName || counterparty?.email || 'Unknown user'}</span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 ? (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? '9+' : unreadCount} new
                        </span>
                      ) : null}
                      <span>Remaining: {debt.currency} {Number(debt.remainingAmount || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </button>
                {index < debts.length - 1 ? (
                  <div className={`mx-4 h-px ${isDark ? 'bg-white/15' : 'bg-slate-200'}`} />
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
