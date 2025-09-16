// src/components/recurring/RecurringForm.jsx
import React, { useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';

export default function RecurringForm({ initial, onSaved, onCancel }) {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';

  const [form, setForm] = useState(() => initial || {
    type: 'expense',
    category: 'Rent',
    source: '',
    amount: initial ? String(initial.amount ?? '') : '',
    dayOfMonth: 1,
    startDate: new Date().toISOString().slice(0,10),
    endDate: '',
    timezone: 'Asia/Bangkok', // UI-only
    notes: '',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  const toISODate = (v) => (v ? String(v).slice(0,10) : undefined);

async function handleSubmit(e) {
  e.preventDefault();
  setSaving(true);
  try {
    const body = {
      type: form.type,
      category: form.category,
      source: form.source || '',
      amount: Number(form.amount),
      dayOfMonth: Number(form.dayOfMonth || 1),
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      isActive: !!form.isActive,
      notes: form.notes || '',
    };

    if (initial?._id) {
      await axiosInstance.patch(`${API_PATHS.RECURRING.BASE}/${initial._id}`, body);
    } else {
      await axiosInstance.post(API_PATHS.RECURRING.BASE, body);
    }

    // ✅ force backfill so Income/Expense pages show it immediately
    await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);

    onSaved?.();
  } catch (e) {
    alert(e.response?.data?.message || e.message);
  } finally {
    setSaving(false);
  }
}


  // Common input classes
  const inputClass = `input ${isDark 
    ? 'bg-gray-700 text-gray-200 placeholder-gray-400 border-gray-600 focus:ring-2 focus:ring-purple-500' 
    : ''}`;

  // Buttons
  const primaryBtnClass = `px-4 py-2 rounded-lg bg-purple-600 text-gray-200 font-medium 
    hover:bg-purple-500 transition-colors duration-200`;
    
  const cancelBtnClass = `px-4 py-2 rounded-lg border font-medium transition-colors duration-200
    ${isDark 
      ? 'border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-400' 
      : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'}`;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 p-4 rounded-2xl shadow 
      ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
      
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col text-sm">Type
          <select className={inputClass} value={form.type} onChange={(e)=>setField('type', e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label className="flex flex-col text-sm">Category
          <input className={inputClass} value={form.category} onChange={(e)=>setField('category', e.target.value)} placeholder="Rent / Salary / Loan Payment"/>
        </label>

        <label className="flex flex-col text-sm">Source (optional)
          <input className={inputClass} value={form.source||''} onChange={(e)=>setField('source', e.target.value)} placeholder="Employer / Bank / Landlord"/>
        </label>

        <label className="flex flex-col text-sm">Amount (per month)
          <input className={inputClass} type="number" min={0} value={form.amount} onChange={(e)=>setField('amount', Number(e.target.value))} />
        </label>

        <label className="flex flex-col text-sm">Day of Month
          <input className={inputClass} type="number" min={1} max={31} value={form.dayOfMonth} onChange={(e)=>setField('dayOfMonth', Number(e.target.value))} />
        </label>

        <label className="flex flex-col text-sm">Start Date
          <input className={inputClass} type="date" value={form.startDate?.slice(0,10)} onChange={(e)=>setField('startDate', e.target.value)} />
        </label>

        <label className="flex flex-col text-sm">End Date (optional)
          <input className={inputClass} type="date" value={form.endDate?.slice(0,10) || ''} onChange={(e)=>setField('endDate', e.target.value)} />
        </label>

        <label className="flex flex-col text-sm">Timezone
          <input className={inputClass} value={form.timezone} onChange={(e)=>setField('timezone', e.target.value)} />
        </label>
      </div>

      <label className="flex flex-col text-sm">Notes
        <textarea className={inputClass} value={form.notes||''} onChange={(e)=>setField('notes', e.target.value)} />
      </label>

      <div className="flex items-center gap-3">
        <button disabled={saving} className={primaryBtnClass}>
          {initial?._id ? 'Save Changes' : 'Create Rule'}
        </button>
        <button type="button" className={cancelBtnClass} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
