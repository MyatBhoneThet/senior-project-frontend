import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import DashboardLayout from '../../components/layouts/DashboardLayout';

const DEFAULTS = {
  currency: 'THB',
  theme: 'light',
  weekStartsOn: 'Mon',
  language: 'en',
};

export default function Settings() {
  const { t } = useT();
  const { prefs, updatePrefs } = useContext(UserContext);
  const navigate = useNavigate();

  const [settings, setSettings] = useState(DEFAULTS);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const isDarkTheme = prefs?.theme === 'dark';

  useEffect(() => {
    setSettings((s) => ({ ...s, ...prefs }));
  }, [prefs]);

  const update = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

  const savePreferences = async () => {
    try {
      setSavingPrefs(true);
      updatePrefs(settings);
      await axiosInstance.put(API_PATHS.USER.UPDATE_PREFS, settings);
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
    if (e) e.preventDefault();
    if (!newPwd || !confirmPwd) return toast.error('Please enter a new password and confirm it.');
    if (newPwd.length < 8) return toast.error('New password must be at least 8 characters.');
    if (newPwd !== confirmPwd) return toast.error('New passwords do not match.');

    try {
      setChangingPwd(true);
      await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword: currPwd,
        newPassword: newPwd,
      });
      setCurrPwd('');
      setNewPwd('');
      setConfirmPwd('');
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

  // Dark/light theme classes
  const containerClass = isDarkTheme ? 'min-h-screen bg-gray-900 text-gray-100' : 'min-h-screen bg-gray-50 text-gray-900';
  const cardClass = isDarkTheme ? 'rounded-lg p-6 border bg-gray-800 border-gray-700 text-gray-200' : 'rounded-lg p-6 border bg-white border-gray-200 text-gray-900';
  const labelBaseClass = isDarkTheme ? 'text-gray-200' : 'text-gray-900';
  const textBaseClass = isDarkTheme ? 'text-gray-400' : 'text-gray-600';
  const inputBaseClass = isDarkTheme
    ? 'w-full px-3 py-2 rounded-md text-sm border bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
    : 'w-full px-3 py-2 rounded-md text-sm border bg-white border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const buttonPrimaryClass = `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    isDarkTheme
      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
  }`;
  const buttonSecondaryClass = `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    isDarkTheme
      ? 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500'
      : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  }`;

  return (
    <DashboardLayout activeMenu="Settings">
      <div className={`max-w-4xl mx-auto p-6 space-y-8 overflow-y-auto ${containerClass}`}>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* GENERAL */}
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-2 ${labelBaseClass}`}>⚙️ General Settings</h2>
          <p className={`text-sm mb-6 ${textBaseClass}`}>
            Configure your basic preferences and display options
          </p>

          {/* Theme */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>Theme</label>
            <div className="flex gap-4">
              {['light', 'dark'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={opt}
                    checked={settings.theme === opt}
                    onChange={() => update('theme', opt)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={textBaseClass + " capitalize"}>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>Language</label>
            <select
              className={inputBaseClass}
              value={settings.language}
              onChange={(e) => update('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="th">Thai</option>
              <option value="my">Burmese</option>
            </select>
          </div>

          {/* Currency */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>Currency</label>
            <select
              className={inputBaseClass}
              value={settings.currency}
              onChange={(e) => update('currency', e.target.value)}
            >
              <option value="THB">THB — Thai Baht</option>
              <option value="USD">USD — US Dollar</option>
              <option value="MMK">MMK — Myanmar Kyat</option>
            </select>
          </div>

          {/* Week starts on */}
          <div className="mb-8">
            <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>Week starts on</label>
            <select
              className={inputBaseClass}
              value={settings.weekStartsOn}
              onChange={(e) => update('weekStartsOn', e.target.value)}
            >
              <option value="Sun">Sunday</option>
              <option value="Mon">Monday</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={savePreferences}
              disabled={savingPrefs}
              className={`${buttonPrimaryClass} ${savingPrefs ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              💾 {savingPrefs ? 'Saving Changes' : 'Save Changes'}
            </button>
            <button onClick={resetPreferences} className={buttonSecondaryClass}>
              🔄 Reset to Defaults
            </button>
          </div>
        </div>

        {/* SECURITY */}
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-2 ${labelBaseClass}`}>🛡️ Security</h2>
          <p className={`text-sm mb-6 ${textBaseClass}`}>Manage your account security settings</p>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${labelBaseClass}`}>Current Password</label>
              <input
                type="password"
                value={currPwd}
                onChange={(e) => setCurrPwd(e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelBaseClass}`}>New Password</label>
              <input
                type="password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelBaseClass}`}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className={inputBaseClass}
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={changingPwd}
              className={`${buttonPrimaryClass} ${changingPwd ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              🔑 {changingPwd ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* DELETE ACCOUNT */}
        <div className={cardClass}>
          <h2 className={`text-lg font-semibold mb-2 ${labelBaseClass}`}>⚠️ Delete Account</h2>
          <p className={`text-sm mb-4 ${textBaseClass}`}>
            Type <strong>DELETE</strong> in the box to permanently remove your account.
          </p>
          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            className={inputBaseClass}
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className={`${buttonPrimaryClass} mt-3 bg-red-600 hover:bg-red-700 focus:ring-red-500 ${
              deleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            🗑️ {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
