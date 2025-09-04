import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

export default function RecurringForm({ initial, onSaved, onCancel }) {
  const [form, setForm] = useState(() => initial || {
    type: 'expense',
    category: 'Rent',
    source: '',
    amount: 0,
    dayOfMonth: 1,
    startDate: new Date().toISOString().slice(0,10),
    endDate: '',
    timezone: 'Asia/Bangkok',
    notes: '',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  function setField(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial?._id) {
        await axiosInstance.patch(`${API_PATHS.RECURRING.BASE}/${initial._id}`, form);
      } else {
        await axiosInstance.post(API_PATHS.RECURRING.BASE, form);
      }
      onSaved?.();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-2xl shadow">
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col text-sm">Type
          <select className="input" value={form.type} onChange={(e)=>setField('type', e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label className="flex flex-col text-sm">Category
          <input className="input" value={form.category} onChange={(e)=>setField('category', e.target.value)} placeholder="Rent / Salary / Loan Payment"/>
        </label>
        <label className="flex flex-col text-sm">Source (optional)
          <input className="input" value={form.source||''} onChange={(e)=>setField('source', e.target.value)} placeholder="Employer / Bank / Landlord"/>
        </label>
        <label className="flex flex-col text-sm">Amount (per month)
          <input className="input" type="number" min={0} value={form.amount} onChange={(e)=>setField('amount', Number(e.target.value))} />
        </label>
        <label className="flex flex-col text-sm">Day of Month
          <input className="input" type="number" min={1} max={31} value={form.dayOfMonth} onChange={(e)=>setField('dayOfMonth', Number(e.target.value))} />
        </label>
        <label className="flex flex-col text-sm">Start Date
          <input className="input" type="date" value={form.startDate?.slice(0,10)} onChange={(e)=>setField('startDate', e.target.value)} />
        </label>
        <label className="flex flex-col text-sm">End Date (optional)
          <input className="input" type="date" value={form.endDate?.slice(0,10) || ''} onChange={(e)=>setField('endDate', e.target.value)} />
        </label>
        <label className="flex flex-col text-sm">Timezone
          <input className="input" value={form.timezone} onChange={(e)=>setField('timezone', e.target.value)} />
        </label>
      </div>

      <label className="flex flex-col text-sm">Notes
        <textarea className="input" value={form.notes||''} onChange={(e)=>setField('notes', e.target.value)} />
      </label>

      <div className="flex items-center gap-3">
        <button disabled={saving} className="btn btn-primary">{initial?._id ? 'Save Changes' : 'Create Rule'}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}