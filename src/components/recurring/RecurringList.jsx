import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import RecurringForm from './RecurringForm';

export default function RecurringList() {
  const [rules, setRules] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.RECURRING.BASE);
      setRules(data || []);
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(id, isActive) {
    try {
      await axiosInstance.patch(`${API_PATHS.RECURRING.BASE}/${id}/toggle`, { isActive });
      load();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  }

  async function removeRule(id) {
    try {
      if (!confirm('Delete this rule?')) return;
      await axiosInstance.delete(`${API_PATHS.RECURRING.BASE}/${id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  }

  return (
    <div className="space-y-6">
      {editing ? (
        <RecurringForm initial={editing} onSaved={() => { setEditing(null); load(); }} onCancel={() => setEditing(null)} />
      ) : (
        <RecurringForm onSaved={load} onCancel={() => {}} />
      )}

      <div className="bg-white rounded-2xl shadow">
        <div className="p-4 border-b font-semibold">Your Recurring Rules</div>
        {loading ? (
          <div className="p-4 text-sm text-slate-500">Loading…</div>
        ) : rules.length === 0 ? (
          <div className="p-4 text-sm text-slate-500">No rules yet. Create your first recurring item above.</div>
        ) : (
          <ul>
            {rules.map((rule) => (
              <li key={rule._id} className="p-4 border-b flex items-center justify-between">
                <div>
                  <div className="font-medium">
                    {rule.category} ({rule.type}) — {Number(rule.amount).toLocaleString()} THB
                  </div>
                  <div className="text-sm text-slate-500">
                    Every month on day {rule.dayOfMonth} • {new Date(rule.startDate).toLocaleDateString()} →{' '}
                    {rule.endDate ? new Date(rule.endDate).toLocaleDateString() : 'No end'} • {rule.isActive ? 'Active' : 'Paused'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn" onClick={() => setEditing(rule)}>Edit</button>
                  <button className="btn" onClick={() => toggle(rule._id, !rule.isActive)}>
                    {rule.isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button className="btn" onClick={() => removeRule(rule._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}