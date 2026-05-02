import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import { LuSend } from 'react-icons/lu';
import DebtStatusBadge from './DebtStatusBadge';
import ChatPanel from './ChatPanel';

export default function DebtDetailsPanel({ debt, onUpdated, onConversationRead, isDark, currentUserId }) {
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [repaymentNote, setRepaymentNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const isLender = String(debt?.lenderId?._id || debt?.lenderId) === String(currentUserId);

  if (!debt) {
    return (
      <div className={`rounded-[28px] border p-6 ${isDark ? 'border-white/10 bg-white/[0.03] text-white/55' : 'border-slate-200 bg-white text-slate-500'}`}>
        Select a debt record to see details and chat.
      </div>
    );
  }

  const submitRepayment = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.DEBTS.REPAYMENTS(debt._id), {
        amount: Number(repaymentAmount),
        note: repaymentNote,
      });
      toast.success(data?.message || 'Repayment added');
      setRepaymentAmount('');
      setRepaymentNote('');
      onUpdated?.(data?.data?.debt || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to add repayment');
    } finally {
      setSaving(false);
    }
  };

  const markRepaid = async () => {
    setSaving(true);
    try {
      const { data } = await axiosInstance.post(API_PATHS.DEBTS.MARK_REPAID(debt._id), {});
      toast.success(data?.message || 'Debt marked as repaid');
      onUpdated?.(data?.data?.debt || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to mark as repaid');
    } finally {
      setSaving(false);
    }
  };

  const otherUser = String(debt?.lenderId?._id || debt?.lenderId) === String(currentUserId)
    ? debt?.borrowerId
    : debt?.lenderId;
  const otherRole = isLender ? 'borrower' : 'lender';
  const otherDisplay = otherUser?.fullName || otherUser?.email || `Unknown ${otherRole}`;
  const paidAmount = Number(debt.amount || 0) - Number(debt.remainingAmount || 0);
  const unreadMap = debt?.chatConversationId?.unreadCounts;
  const unreadCount = Number(
    unreadMap?.[String(currentUserId)] ||
    unreadMap?.get?.(String(currentUserId)) ||
    0
  );
  const panelClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const inputClass = isDark
    ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/35 focus:border-[#d9ff34]/35'
    : 'border-white/50 bg-white/70 text-[#11131b] placeholder:text-[#9aa2b8] focus:border-[#84cc16]/45 focus:bg-white';

  return (
    <div className="min-w-0 space-y-4">
      <div className={`overflow-hidden rounded-[24px] border p-5 ${panelClass}`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-[17px] font-medium">
                {debt.currency} {Number(debt.amount || 0).toLocaleString()}
              </h3>
              <DebtStatusBadge status={debt.status} />
            </div>
            <p className={`mt-2 max-w-2xl text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              {debt.description || 'No description'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {isLender ? (
              <button
                type="button"
                onClick={markRepaid}
                disabled={saving || debt.status === 'paid'}
                className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                  isDark ? 'bg-[#d9ff34] text-black hover:bg-[#cbe93a]' : 'bg-slate-900 text-white hover:bg-slate-800'
                } disabled:opacity-50`}
              >
                Mark repaid
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              aria-label="Open chat"
              title="Open chat"
              className={`relative grid h-11 w-11 place-items-center rounded-2xl border ${
                isDark
                  ? 'animate-[fade-in-up_0.45s_ease-out] border-white/15 bg-white/5 text-white hover:-translate-y-0.5 hover:bg-white/10 active:scale-[0.98]'
                  : 'animate-[fade-in-up_0.45s_ease-out] border-white/50 bg-white/65 text-slate-900 shadow-sm hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]'
              }`}
            >
              <LuSend className="-rotate-12 text-[18px]" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Remaining" value={`${debt.currency} ${Number(debt.remainingAmount || 0).toLocaleString()}`} isDark={isDark} />
          <Stat label="Paid" value={`${debt.currency} ${paidAmount.toLocaleString()}`} isDark={isDark} />
          <Stat label="Due date" value={debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : 'No due date'} isDark={isDark} />
        </div>

        {isLender ? (
          <div className={`mt-5 rounded-[22px] border p-4 ${isDark ? 'border-white/10 bg-black/10' : 'border-white/45 bg-white/40'}`}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid min-w-0 gap-2 text-sm font-medium">
                Partial repayment
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`min-w-0 rounded-2xl border px-4 py-3 outline-none transition ${inputClass}`}
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  placeholder="100"
                />
              </label>
              <label className="grid min-w-0 gap-2 text-sm font-medium">
                Note
                <input
                  className={`min-w-0 rounded-2xl border px-4 py-3 outline-none transition ${inputClass}`}
                  value={repaymentNote}
                  onChange={(e) => setRepaymentNote(e.target.value)}
                  placeholder="Paid via bank transfer"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={submitRepayment}
              disabled={saving}
              className={`mt-3 rounded-2xl px-4 py-3 text-sm font-bold ${
                isDark ? 'bg-white text-black hover:bg-white/90' : 'bg-white/65 text-slate-900 hover:bg-white'
              }`}
            >
              Add repayment
            </button>
          </div>
        ) : null}

      </div>

      <div className={`rounded-[24px] border p-5 ${panelClass}`}>
        <h4 className="text-[17px] font-medium">Counterparty</h4>
        <div className={`mt-3 flex flex-wrap items-center gap-3`}>
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              isDark
                ? 'border-[#d9ff34]/40 bg-[#d9ff34]/10 text-[#f1ffb8] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d9ff34]/20 active:scale-[0.98]'
                : 'border-white/55 bg-white/65 text-slate-900 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]'
            }`}
          >
            {otherRole}: {otherDisplay}
          </button>
          <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Click to open conversation popup
          </span>
        </div>
      </div>

      <ChatPanel
        debt={debt}
        isDark={isDark}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title={`Chat with ${otherDisplay}`}
        onUpdated={onUpdated}
        onConversationRead={onConversationRead}
      />
    </div>
  );
}

function Stat({ label, value, isDark }) {
  return (
    <div className={`rounded-[20px] border p-4 ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-white/45 bg-white/40'}`}>
      <div className={`text-xs tracking-[0.12em] ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{label}</div>
      <div className="mt-2 text-base font-semibold">{value}</div>
    </div>
  );
}
