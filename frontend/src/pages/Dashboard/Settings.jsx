import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useCurrency } from '../../context/CurrencyContext';
import { clearStoredToken } from '../../utils/authSession';
import SettingsPageShell from '../../components/Settings/SettingsPageShell';
import SettingsHeaderActions from '../../components/Settings/SettingsHeaderActions';
import GeneralSettingsPanel from '../../components/Settings/GeneralSettingsPanel';
import SecuritySettingsPanel from '../../components/Settings/SecuritySettingsPanel';

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
  const isDark = prefs?.theme === 'dark';
  const navigate = useNavigate();
  const { rates, lastUpdated, loading, refreshRates } = useCurrency();

  const [settings, setSettings] = useState(DEFAULTS);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const tt = (k, f) => {
    const s = t(k);
    return s && s !== k ? s : f;
  };

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

  const resetPreferences = () => {
    setSettings(DEFAULTS);
    updatePrefs(DEFAULTS);
    toast.success(tt('settings.resetSuccess', 'Restored defaults'));
  };

  const handleChangePassword = async () => {
    if (!newPwd || !confirmPwd) return toast.error(tt('settings.password.enterBoth', 'Please enter a new password and confirm it.'));
    if (newPwd.length < 8) return toast.error(tt('settings.password.tooShort', 'New password must be at least 8 characters.'));
    if (newPwd !== confirmPwd) return toast.error(tt('settings.password.noMatch', 'New passwords do not match.'));
    try {
      setChangingPwd(true);
      await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, { currentPassword: currPwd, newPassword: newPwd });
      setCurrPwd('');
      setNewPwd('');
      setConfirmPwd('');
      toast.success(tt('settings.password.updated', 'Password updated. Please log in again.'));
      clearStoredToken();
      navigate('/login');
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
      clearStoredToken();
      navigate('/login');
    } catch (err) {
      console.error(err?.response?.data || err);
      toast.error(err?.response?.data?.message || tt('settings.deleteError', 'Could not delete account'));
    } finally {
      setDeleting(false);
    }
  };

  const last = lastUpdated ? new Date(lastUpdated).toLocaleString() : '—';
  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.11),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f7f3ea_100%)] text-[#11131b]';
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const sectionDivider = isDark ? 'border-white/10' : 'border-white/45';
  const mutedText = isDark ? 'text-[#7b8095]' : 'text-[#6b6f80]';
  const labelText = isDark ? 'text-[#8a90a7]' : 'text-[#6b7080]';
  const inputClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white placeholder:text-[#848aa0]'
    : 'border-white/28 bg-white/28 text-[#11131b] placeholder:text-[#8a8f9f] backdrop-blur-3xl';
  const outlineButton = isDark
    ? 'border-white/10 text-[#d0d3e4] hover:bg-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 text-[#31374a] hover:bg-white/42 backdrop-blur-3xl';
  const subtleSurface = isDark
    ? 'border-white/10 bg-white/[0.05]'
    : 'border-white/28 bg-white/22 backdrop-blur-3xl';

  return (
    <DashboardLayout activeMenu="Settings">
      <SettingsPageShell isDark={isDark} pageClass={pageClass}>
        <SettingsHeaderActions
          sectionDivider={sectionDivider}
          mutedText={mutedText}
          outlineButton={outlineButton}
          savingPrefs={savingPrefs}
          isDark={isDark}
          tt={tt}
          onReset={resetPreferences}
          onSave={savePreferences}
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <GeneralSettingsPanel
            isDark={isDark}
            cardClass={cardClass}
            labelText={labelText}
            mutedText={mutedText}
            inputClass={inputClass}
            outlineButton={outlineButton}
            subtleSurface={subtleSurface}
            settings={settings}
            rates={rates}
            last={last}
            loading={loading}
            tt={tt}
            onUpdate={update}
            onRefreshRates={refreshRates}
          />

          <SecuritySettingsPanel
            isDark={isDark}
            cardClass={cardClass}
            mutedText={mutedText}
            labelText={labelText}
            inputClass={inputClass}
            sectionDivider={sectionDivider}
            currPwd={currPwd}
            newPwd={newPwd}
            confirmPwd={confirmPwd}
            changingPwd={changingPwd}
            deleteConfirm={deleteConfirm}
            deleting={deleting}
            tt={tt}
            setCurrPwd={setCurrPwd}
            setNewPwd={setNewPwd}
            setConfirmPwd={setConfirmPwd}
            setDeleteConfirm={setDeleteConfirm}
            onChangePassword={handleChangePassword}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </SettingsPageShell>
    </DashboardLayout>
  );
}
