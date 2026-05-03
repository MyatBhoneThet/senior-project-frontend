import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { SkeletonBlock } from '../Dashboard/DashboardSkeleton';

export default function EditTransactionModal({ id, open, onClose, onSaved }){
  const [model, setModel] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    if (!open || !id) return;
    axiosInstance.get(`${API_PATHS.TRANSACTIONS.BASE}/${id}`).then(({data})=> setModel(data));
  }, [open, id]);

  function setField(k, v){ setModel((m)=>({ ...m, [k]: v })); }

  async function save(){
    setSaving(true);
    await axiosInstance.patch(`${API_PATHS.TRANSACTIONS.BASE}/${id}`, {
      type: model.type,
      category: model.category,
      source: model.source,
      amount: model.amount,
      date: model.date,
      notes: model.notes,
    });
    setSaving(false);
    onSaved?.();
    onClose?.();
  }

  if (!open) return null;
  if (!model) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="w-[480px] max-w-[92vw] rounded-2xl bg-white p-4">
          <SkeletonBlock isDark={false} className="h-6 w-40 rounded-lg" />
          <div className="mt-5 space-y-3">
            <SkeletonBlock isDark={false} className="h-12 w-full rounded-xl" />
            <SkeletonBlock isDark={false} className="h-12 w-full rounded-xl" />
            <SkeletonBlock isDark={false} className="h-12 w-full rounded-xl" />
            <SkeletonBlock isDark={false} className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-4 w-[480px] max-w-[92vw]">
        <div className="text-lg font-semibold mb-3">Edit Transaction</div>
        <div className="space-y-3">
          <label className="flex flex-col text-sm">Type
            <select className="input" value={model.type} onChange={(e)=>setField('type', e.target.value)}>
              <option value="income">income</option>
              <option value="expense">expense</option>
            </select>
          </label>
          <label className="flex flex-col text-sm">Category
            <input className="input" value={model.category} onChange={(e)=>setField('category', e.target.value)} />
          </label>
          <label className="flex flex-col text-sm">Source
            <input className="input" value={model.source||''} onChange={(e)=>setField('source', e.target.value)} />
          </label>
          <label className="flex flex-col text-sm">Amount
            <input type="number" className="input" value={model.amount} onChange={(e)=>setField('amount', Number(e.target.value))} />
          </label>
          <label className="flex flex-col text-sm">Date
            <input type="date" className="input" value={model.date?.slice(0,10)} onChange={(e)=>setField('date', e.target.value)} />
          </label>
          <label className="flex flex-col text-sm">Notes
            <textarea className="input" value={model.notes||''} onChange={(e)=>setField('notes', e.target.value)} />
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={saving} onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
