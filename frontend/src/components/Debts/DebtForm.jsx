import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

const initialState = {
  counterpartyId: '',
  amount: '',
  currency: 'THB',
  description: '',
  dueDate: '',
};

export default function DebtForm({ onCreated, isDark }) {
  const [mode, setMode] = useState('lend');
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const endpoint = mode === 'lend' ? API_PATHS.DEBTS.LEND : API_PATHS.DEBTS.BORROW;
      const payload = {
        counterpartyId: form.counterpartyId.trim(),
        amount: Number(form.amount),
        currency: form.currency.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || undefined,
      };

      const { data } = await axiosInstance.post(endpoint, payload);
      toast.success(data?.message || 'Debt record created');
      setForm(initialState);
      onCreated?.(data?.data || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create record');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = isDark
    ? 'border-white/10 bg-white/[0.04] text-white placeholder:text-white/35 focus:border-[#d9ff34]/35'
    : 'border-white/50 bg-white/70 text-[#11131b] placeholder:text-[#9aa2b8] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] focus:border-[#84cc16]/45 focus:bg-white';

  return (
    <form onSubmit={submit} className="min-w-0">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[17px] font-medium">Create debt record</h2>
          <p className={`mt-1 text-sm ${isDark ? 'text-white/55' : 'text-slate-500'}`}>
            Track who owes whom, then follow up with chat and reminders.
          </p>
        </div>
        <div className={`inline-flex shrink-0 rounded-2xl p-1 ${isDark ? 'border border-white/10 bg-white/[0.05]' : 'border border-white/35 bg-white/65 shadow-[0_18px_50px_rgba(15,23,42,0.06)]'}`}>
          {['lend', 'borrow'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                mode === item
                  ? isDark
                    ? 'bg-[#d9ff34] text-black'
                    : 'bg-slate-900 text-white'
                  : isDark
                  ? 'text-white/65 hover:bg-white/5'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              {item === 'lend' ? 'I lent money' : 'I borrowed money'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid min-w-0 gap-2 text-sm font-medium">
          Counterparty
          <input
            className={`min-w-0 rounded-2xl border px-4 py-3 outline-none transition ${inputClass}`}
            value={form.counterpartyId}
            onChange={(e) => handleChange('counterpartyId', e.target.value)}
            placeholder="Email, username, or user id"
            required
          />
          <span className={`text-xs ${isDark ? 'text-white/45' : 'text-slate-500'}`}>
            You can type the person’s email, username, or Mongo user id.
          </span>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-medium">
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            className={`min-w-0 rounded-2xl border px-4 py-3 outline-none transition ${inputClass}`}
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="500"
            required
          />
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-medium">
          Currency
          <input
            className={`min-w-0 rounded-2xl border px-4 py-3 outline-none transition ${inputClass}`}
            value={form.currency}
            onChange={(e) => handleChange('currency', e.target.value)}
            placeholder="THB"
          />
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-medium">
          Due date
          <input
            type="date"
            className={`min-w-0 rounded-2xl border px-4 py-3 outline-none transition ${inputClass}`}
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
          />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-medium">
        Description
        <textarea
          rows="3"
          className={`min-w-0 resize-none rounded-2xl border px-4 py-3 outline-none transition ${inputClass}`}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Lunch, rent, shared trip, etc."
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className={`mt-5 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-bold transition ${
          isDark
            ? 'bg-[#d9ff34] text-black hover:bg-[#cce83b]'
            : 'bg-slate-900 text-white hover:bg-slate-800'
        } disabled:opacity-60`}
      >
        {saving ? 'Saving...' : mode === 'lend' ? 'Create lend record' : 'Create borrow record'}
      </button>
    </form>
  );
}
