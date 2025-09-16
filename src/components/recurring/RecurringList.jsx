import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import RecurringForm from './RecurringForm';
import { UserContext } from '../../context/UserContext';

export default function RecurringList() {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';

  const [rules, setRules] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(API_PATHS.RECURRING.BASE);
      setRules(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || 'Failed to load recurring rules');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(id, isActive) {
    try {
      await axiosInstance.patch(`${API_PATHS.RECURRING.BASE}/${id}/toggle`, { isActive });
      await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);
      await load();
    } catch {
      alert('Failed to toggle');
    }
  }

  async function removeRule(id) {
    if (!confirm('Delete this rule?')) return;
    try {
      await axiosInstance.delete(`${API_PATHS.RECURRING.BASE}/${id}`);
      await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);
      await load();
    } catch {
      alert('Failed to delete');
    }
  }

  // Common button classes
  const btnClass = `px-3 py-1 rounded-md font-medium text-sm transition-colors duration-200
                    ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                             : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`;

  const primaryBtnClass = `px-3 py-1 rounded-md font-medium text-sm transition-colors duration-200
                           ${isDark ? 'bg-purple-600 hover:bg-purple-500 text-gray-200' 
                                    : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`;

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className={`rounded-2xl shadow ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recurring</h2>
            {!editing && (
              <button className={primaryBtnClass} onClick={() => setEditing({})}>
                Add Rule
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {editing && (
            <RecurringForm
              initial={editing && editing._id ? editing : null}
              onSaved={() => { setEditing(null); load(); }}
              onCancel={() => setEditing(null)}
            />
          )}
          {!editing && (
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
              Create rules for salary, rent, etc.
            </div>
          )}
        </div>
      </div>

      {/* List Card */}
      <div className={`rounded-2xl shadow overflow-hidden ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-base font-medium">Your Rules</h3>
        </div>

        {loading ? (
          <div className={`p-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Loading…</div>
        ) : rules.length === 0 ? (
          <div className={`p-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No recurring rules yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {rules.map((rule) => (
              <li key={rule._id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">
                    {rule.type === 'income' ? 'Income' : 'Expense'} — {rule.category}
                  </div>
                  <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {rule.source ? `${rule.source} • ` : ''}฿{Number(rule.amount).toLocaleString()}
                    {' • '}day {rule.dayOfMonth}
                    {' • '}start {String(rule.startDate).slice(0,10)}
                    {rule.endDate ? ` • end ${String(rule.endDate).slice(0,10)}` : ''}
                    {rule.isActive ? ' • active' : ' • paused'}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button className={primaryBtnClass} onClick={() => setEditing(rule)}>Edit</button>
                  <button className={btnClass} onClick={() => toggle(rule._id, !rule.isActive)}>
                    {rule.isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button className={btnClass} onClick={() => removeRule(rule._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
