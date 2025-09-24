import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import RecurringForm from './RecurringForm';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';

export default function RecurringList() {
  const { prefs } = useContext(UserContext);
  const { t } = useT(); // Translation function
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
      alert(t('recurring.loadError', 'Failed to load recurring rules'));
    } finally {
      setLoading(false);
    }
  }

  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  useEffect(() => { load(); }, []);

  async function toggle(id, isActive) {
    try {
      await axiosInstance.patch(`${API_PATHS.RECURRING.BASE}/${id}/toggle`, { isActive });
      await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);
      await load();
    } catch {
      alert(t('recurring.toggleError', 'Failed to toggle'));
    }
  }

  async function removeRule(id) {
    if (!confirm(t('recurring.confirmDelete', 'Delete this rule?'))) return;
    try {
      await axiosInstance.delete(`${API_PATHS.RECURRING.BASE}/${id}`);
      await axiosInstance.post(`${API_PATHS.RECURRING.BASE}/run`);
      await load();
    } catch {
      alert(tt('recurring.deleteError', 'Failed to delete'));
    }
  }

  const btnClass = `px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 flex-shrink-0 min-w-0 text-center
    ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`;

  const primaryBtnClass = `px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 flex-shrink-0 min-w-0 text-center
    ${isDark ? 'bg-purple-600 hover:bg-purple-500 text-gray-200'
      : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`;

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className={`rounded-2xl shadow ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
        <div className="px-4 pt-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{tt('recurring.title', 'Recurring')}</h2>
          {!editing && (
            <button className={primaryBtnClass} onClick={() => setEditing({})}>
              {tt('recurring.addRule', 'Add Rule')}
            </button>
          )}
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
              {tt('recurring.description', 'Create rules for salary, rent, etc.')}
            </div>
          )}
        </div>
      </div>

      {/* List Card */}
      <div className={`rounded-2xl shadow overflow-hidden ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className="text-base font-medium">{tt('recurring.yourRules', 'Your Rules')}</h3>
        </div>
        {loading ? (
          <div className={`p-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            {tt('recurring.loading', 'Loading…')}
          </div>
        ) : rules.length === 0 ? (
          <div className={`p-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
            {tt('recurring.noRules', 'No recurring rules yet.')}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {rules.map((rule) => (
              <li key={rule._id} className="p-4">
                <div className="flex flex-col space-y-3">
                  {/* Content Section */}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">
                      {rule.type === 'income' ? tt('recurring.income', 'Income') : t('recurring.expense', 'Expense')} — {rule.category}
                    </div>
                    <div className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {rule.source ? `${rule.source} • ` : ''}฿{Number(rule.amount).toLocaleString()}
                      {' • '}{tt('recurring.day', 'day')} {rule.dayOfMonth}
                      {' • '}{tt('recurring.start', 'start')} {String(rule.startDate).slice(0,10)}
                      {rule.endDate ? ` • ${tt('recurring.end', 'end')} ${String(rule.endDate).slice(0,10)}` : ''}
                      {rule.isActive ? ` • ${tt('recurring.active', 'active')}` : ` • ${tt('recurring.paused', 'paused')}`}
                    </div>
                  </div>
                  
                  {/* Buttons Section */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                    <button className={primaryBtnClass} onClick={() => setEditing(rule)}>
                      {tt('recurring.edit', 'Edit')}
                    </button>
                    <button className={btnClass} onClick={() => toggle(rule._id, !rule.isActive)}>
                      {rule.isActive ? tt('recurring.pause', 'Pause') : tt('recurring.resume', 'Resume')}
                    </button>
                    <button className={btnClass} onClick={() => removeRule(rule._id)}>
                      {tt('recurring.delete', 'Delete')}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
