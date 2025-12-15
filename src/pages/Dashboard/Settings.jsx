import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useCurrency } from '../../context/CurrencyContext';

const uiWeekToServer = (v) => (String(v).toLowerCase().startsWith('mon') ? 'monday' : 'sunday');
const serverWeekToUI = (v) => (String(v).toLowerCase().startsWith('mon') ? 'Mon' : 'Sun');

const normalizeCurrency = (v) => (String(v || 'THB').match(/[A-Za-z]{3}/)?.[0] || 'THB').toUpperCase();
const normalizeLanguage = (v) => {
  const s = String(v || 'en').toLowerCase();
  const map = { english: 'en', en: 'en', thai: 'th', th: 'th', burmese: 'my', myanmar: 'my', my: 'my' };
  return map[s] || (s.length > 2 ? s.slice(0, 2) : s);
};

const DEFAULTS = { currency: 'THB', theme: 'light', weekStartsOn: 'Mon', language: 'en' };

export default function Settings() {
  const { t } = useT();
  const { prefs, updatePrefs } = useContext(UserContext);
  const navigate = useNavigate();

  // ✅ useCurrency must be INSIDE the component
  const { rates, lastUpdated, loading, refreshRates } = useCurrency();
  const last = lastUpdated ? new Date(lastUpdated).toLocaleString() : '—';

  const [settings, setSettings] = useState(DEFAULTS);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const isDarkTheme = prefs?.theme === 'dark';
  const tt = (k, f) => { const s = t(k); return s && s !== k ? s : f; };

  useEffect(() => {
    if (!prefs) return;
    setSettings((s) => ({
      ...s,
      theme: prefs.theme || s.theme,
      language: normalizeLanguage(prefs.language || s.language),
      currency: normalizeCurrency(prefs.currency || s.currency),
      weekStartsOn: serverWeekToUI(prefs.weekStartsOn || s.weekStartsOn),
    }));
  }, [prefs]);

  const update = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

  const savePreferences = async () => {
    try {
      setSavingPrefs(true);
      const payload = {
        theme: settings.theme,
        currency: normalizeCurrency(settings.currency),
        language: normalizeLanguage(settings.language),
        weekStartsOn: uiWeekToServer(settings.weekStartsOn),
      };
      updatePrefs(settings);
      await axiosInstance.put(API_PATHS.USER.UPDATE_PREFS, payload);
      toast.success(tt('settings.saved', 'Preferences saved'));
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.message || tt('settings.saveError', 'Could not save preferences'));
    } finally {
      setSavingPrefs(false);
    }
  };

  const resetPreferences = () => { setSettings(DEFAULTS); updatePrefs(DEFAULTS); toast.success(tt('settings.resetSuccess', 'Restored defaults')); };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!newPwd || !confirmPwd) return toast.error(tt('settings.password.enterBoth', 'Please enter a new password and confirm it.'));
    if (newPwd.length < 8) return toast.error(tt('settings.password.tooShort', 'New password must be at least 8 characters.'));
    if (newPwd !== confirmPwd) return toast.error(tt('settings.password.noMatch', 'New passwords do not match.'));
    try {
      setChangingPwd(true);
      await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, { currentPassword: currPwd, newPassword: newPwd });
      setCurrPwd(''); setNewPwd(''); setConfirmPwd('');
      toast.success(tt('settings.password.updated', 'Password updated. Please log in again.'));
      localStorage.removeItem('token'); navigate('/login');
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.message || tt('settings.password.error', 'Could not change password'));
    } finally {
      setChangingPwd(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return toast.error(tt('settings.deleteConfirmError', 'Type DELETE to confirm'));
    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.USER.DELETE_ME);
      toast.success(tt('settings.deleted', 'Account deleted'));
      localStorage.removeItem('token'); navigate('/login');
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.message || tt('settings.deleteError', 'Could not delete account'));
    } finally { setDeleting(false); }
  };

  const containerClass = isDarkTheme ? 'min-h-screen bg-gray-900 rounded-xl text-gray-100' : 'min-h-screen bg-gray-50 text-gray-900';
  const cardClass = isDarkTheme ? 'rounded-lg p-6 border bg-gray-800 border-gray-700 text-gray-200' : 'rounded-lg p-6 border bg-white border-gray-200 text-gray-900';
  const labelBaseClass = isDarkTheme ? 'text-gray-200' : 'text-gray-900';
  const textBaseClass = isDarkTheme ? 'text-gray-400' : 'text-gray-600';
  const inputBaseClass = isDarkTheme
    ? 'w-full px-3 py-2 rounded-md text-sm border bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    : 'w-full px-3 py-2 rounded-md text-sm border bg-white border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const buttonPrimaryClass = `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkTheme ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'}`;
  const buttonSecondaryClass = `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkTheme ? 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500' : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'}`;

  return (
    <DashboardLayout activeMenu="Settings">
      <div className={`max-w-4xl mx-auto p-6 space-y-8 overflow-y-auto ${containerClass}`}>
        <h1 className="text-2xl font-bold mb-6">{tt('settings.title', 'Settings')}</h1>

        {/* GENERAL */}
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-2 ${labelBaseClass}`}>⚙️ {tt('settings.general', 'General Settings')}</h2>
          <p className={`text-sm mb-6 ${textBaseClass}`}>{tt('settings.generalDesc', 'Configure your basic preferences and display options')}</p>

          {/* Theme */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>{tt('settings.theme', 'Theme')}</label>
            <div className="flex gap-4">
              {['light', 'dark'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="theme" value={opt} checked={settings.theme === opt} onChange={() => update('theme', opt)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className={textBaseClass + ' capitalize'}>{tt(`settings.${opt}`, opt)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>{tt('settings.language', 'Language')}</label>
            <select className={inputBaseClass} value={settings.language} onChange={(e) => update('language', e.target.value)}>
              <option value="en">{tt('settings.english', 'English')}</option>
              <option value="th">{tt('settings.thai', 'Thai')}</option>
              <option value="my">{tt('settings.burmese', 'Burmese')}</option>
            </select>
          </div>

          {/* Currency */}
          <div className="mb-2">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>{tt('settings.currency', 'Currency')}</label>
            <select className={inputBaseClass} value={settings.currency} onChange={(e) => update('currency', e.target.value)}>
              <option value="THB">{tt('settings.currencyTHB', 'THB — Thai Baht')}</option>
              <option value="USD">{tt('settings.currencyUSD', 'USD — US Dollar')}</option>
              <option value="MMK">{tt('settings.currencyMMK', 'MMK — Myanmar Kyat')}</option>
            </select>

            {/* rates + refresh */}
            <div className="mt-2 text-xs flex items-center gap-2">
              <span className={textBaseClass}>
                1 THB ≈ {rates?.USD ? rates.USD.toFixed(4) : '…'} USD • {rates?.MMK ? Math.round(rates.MMK).toLocaleString() : '…'} MMK
                <span className="opacity-70 ml-2">(updated: {last})</span>
              </span>
              <button
                type="button"
                onClick={refreshRates}
                disabled={loading}
                className={`px-2 py-1 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                {loading ? 'Refreshing…' : 'Refresh rates'}
              </button>
            </div>
          </div>

          {/* Week starts on */}
          <div className="mb-8 mt-4">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>{tt('settings.weekStartsOn', 'Week starts on')}</label>
            <select className={inputBaseClass} value={settings.weekStartsOn} onChange={(e) => update('weekStartsOn', e.target.value)}>
              <option value="Sun">{tt('settings.weekSunday', 'Sunday')}</option>
              <option value="Mon">{tt('settings.weekMonday', 'Monday')}</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={savePreferences} disabled={savingPrefs} className={`${buttonPrimaryClass} ${savingPrefs ? 'opacity-50 cursor-not-allowed' : ''}`}>
              💾 {savingPrefs ? tt('settings.saving', 'Saving Changes') : tt('settings.save', 'Save Changes')}
            </button>
            <button onClick={resetPreferences} className={buttonSecondaryClass}>🔄 {tt('settings.reset', 'Reset to Defaults')}</button>
          </div>
        </div>

        {/* SECURITY */}
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-2 ${labelBaseClass}`}>🛡️ {tt('settings.security', 'Security')}</h2>
          <p className={`text-sm mb-6 ${textBaseClass}`}>{tt('settings.securityDesc', 'Manage your account security settings')}</p>

          <div className="space-y-4">
            <div><label className={`block text-sm font-medium mb-1 ${labelBaseClass}`}>{tt('settings.currentPassword', 'Current Password')}</label><input type="password" value={currPwd} onChange={(e) => setCurrPwd(e.target.value)} className={inputBaseClass} /></div>
            <div><label className={`block text-sm font-medium mb-1 ${labelBaseClass}`}>{tt('settings.newPassword', 'New Password')}</label><input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={inputBaseClass} /></div>
            <div><label className={`block text-sm font-medium mb-1 ${labelBaseClass}`}>{tt('settings.confirmNewPassword', 'Confirm New Password')}</label><input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className={inputBaseClass} /></div>
            <button onClick={handleChangePassword} disabled={changingPwd} className={`${buttonPrimaryClass} ${changingPwd ? 'opacity-50 cursor-not-allowed' : ''}`}>🔑 {changingPwd ? tt('settings.changingPassword', 'Updating...') : tt('settings.changePassword', 'Change Password')}</button>
          </div>
        </div>

        {/* DELETE ACCOUNT */}
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-2 ${labelBaseClass}`}>⚠️ {tt('settings.deleteAccount', 'Delete Account')}</h2>
          <p className={`text-sm mb-4 ${textBaseClass}`}>{tt('settings.deleteDesc', 'Type DELETE in the box to permanently remove your account.')}</p>
          <input type="text" placeholder={tt('settings.deletePlaceholder', 'Type DELETE to confirm')} value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} className={inputBaseClass} />
          <button onClick={handleDeleteAccount} disabled={deleting} className={`${buttonPrimaryClass} mt-3 bg-red-600 hover:bg-red-700 focus:ring-red-500 ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}>🗑️ {deleting ? tt('settings.deleting', 'Deleting...') : tt('settings.deleteBtn', 'Delete Account')}</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
