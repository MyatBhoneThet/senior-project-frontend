import React from 'react';

const SettingsHeaderActions = ({
  sectionDivider,
  mutedText,
  outlineButton,
  savingPrefs,
  isDark,
  tt,
  onReset,
  onSave,
}) => (
  <div className={`mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between ${sectionDivider}`}>
    <div>
      <h1 className="text-2xl font-black tracking-[0.18em]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        {tt('menu.settings', 'Settings')}
      </h1>
      <p className={`mt-2 text-sm ${mutedText}`}>
        {tt('settings.subtitle', 'Preferences, security, and account control')}
      </p>
    </div>

    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onReset}
        className={`rounded-2xl border px-5 py-3 text-sm font-bold ${outlineButton}`}
      >
        {tt('settings.resetDefaults', 'Reset to Defaults')}
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={savingPrefs}
        className={`rounded-2xl px-5 py-3 text-sm font-bold ${
          savingPrefs
            ? 'cursor-not-allowed bg-white/10 text-[#7b8095]'
            : isDark ? 'bg-[#d9ff34] text-black hover:bg-[#cbf029]' : 'bg-[#84cc16] text-white hover:bg-[#65a30d]'
        }`}
      >
        {savingPrefs ? tt('common.saving', 'Saving...') : tt('settings.saveChanges', 'Save Changes')}
      </button>
    </div>
  </div>
);

export default SettingsHeaderActions;
