import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';

const DEFAULTS = {
  currency: 'THB',
  theme: 'light',
  weekStartsOn: 'Mon',
  language: 'en',
};

export default function Settings() {
  const { t } = useT();
  const { prefs, updatePrefs } = useContext(UserContext);

  const [settings, setSettings] = useState(DEFAULTS);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setSettings((s) => ({ ...s, ...prefs }));
  }, [prefs]);

  const update = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

  const savePreferences = async () => {
    try {
      setSavingPrefs(true);
      // Instant UI change via context
      updatePrefs(settings);
      // Persist on backend (optional)
      await axiosInstance.put(API_PATHS.USER.UPDATE_PREFS, {
        currency: settings.currency,
        theme: settings.theme,
        weekStartsOn: settings.weekStartsOn,
        language: settings.language,
      });
      toast.success('Preferences saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  const resetPreferences = () => {
    setSettings(DEFAULTS);
    updatePrefs(DEFAULTS);
    toast.success('Restored defaults');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPwd || !confirmPwd) return toast.error('Please enter a new password and confirm it.');
    if (newPwd.length < 8) return toast.error('New password must be at least 8 characters.');
    if (newPwd !== confirmPwd) return toast.error('New passwords do not match.');

    try {
      setChangingPwd(true);
      await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword: currPwd,
        newPassword: newPwd,
      });
      setCurrPwd(''); setNewPwd(''); setConfirmPwd('');
      toast.success('Password updated. Please log in again.');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not change password');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return toast.error('Type DELETE to confirm');
    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.USER.DELETE_ME);
      toast.success('Account deleted');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold mb-1">{t('settings.title')}</h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm">
          Customize your app preferences and account.
        </p>
      </div>

      {/* Preferences */}
      <section className="card">
        <h2 className="text-base font-medium mb-4">Preferences</h2>

        {/* Theme */}
        <div className="mb-4">
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
            {t('settings.theme')}
          </label>
          <div className="flex gap-3">
            {['light', 'dark'].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="theme"
                  value={opt}
                  checked={settings.theme === opt}
                  onChange={() => update('theme', opt)}
                />
                <span className="capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="mb-4">
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
            {t('settings.language')}
          </label>
          <select
            className="form-select"
            value={settings.language}
            onChange={(e) => update('language', e.target.value)}
          >
            <option value="en">{t('settings.english')}</option>
            <option value="th">{t('settings.thai')}</option>
            <option value="my">{t('settings.burmese')}</option>
          </select>
        </div>

        {/* Currency */}
        <div className="mb-4">
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
            {t('settings.currency')}
          </label>
          <select
            className="form-select"
            value={settings.currency}
            onChange={(e) => update('currency', e.target.value)}
          >
            <option value="THB">THB — Thai Baht</option>
            <option value="USD">USD — US Dollar</option>
            <option value="MMK">MMK — Myanmar Kyat</option>
          </select>
        </div>

        {/* Week Starts On */}
        <div className="mb-6">
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
            {t('settings.weekStartsOn')}
          </label>
          <select
            className="form-select"
            value={settings.weekStartsOn}
            onChange={(e) => update('weekStartsOn', e.target.value)}
          >
            <option value="Sun">Sunday</option>
            <option value="Mon">Monday</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={savePreferences}
            disabled={savingPrefs}
            className="btn-primary disabled:opacity-60"
          >
            {savingPrefs ? 'Saving…' : t('settings.save')}
          </button>
          <button onClick={resetPreferences} className="btn-secondary">
            Reset to defaults
          </button>
        </div>
      </section>

      {/* Change Password */}
      <section className="card">
        <h2 className="text-base font-medium mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            placeholder="Current password"
            className="form-input"
            value={currPwd}
            onChange={(e) => setCurrPwd(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            className="form-input"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="form-input"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />

          <div className="col-span-1 md:col-span-3">
            <button
              type="submit"
              disabled={changingPwd}
              className="btn-primary w-full md:w-auto disabled:opacity-60"
            >
              {changingPwd ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </section>

      {/* Delete Account */}
      <section className="card">
        <h2 className="text-base font-medium mb-2 text-rose-600">Delete Account</h2>
        <p className="text-sm text-rose-600 mb-4">
          This action is permanent and cannot be undone. Type <strong>DELETE</strong> to confirm.
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            className="form-input"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="btn-secondary border-rose-400 text-rose-600 dark:border-rose-500 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-60"
          >
            {deleting ? 'Deleting…' : 'Delete account'}
          </button>
        </div>
      </section>
    </div>
  );
}
