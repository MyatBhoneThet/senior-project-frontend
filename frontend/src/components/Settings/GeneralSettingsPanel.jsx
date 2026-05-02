import React from 'react';

const GeneralSettingsPanel = ({
  isDark,
  cardClass,
  labelText,
  mutedText,
  inputClass,
  outlineButton,
  subtleSurface,
  settings,
  rates,
  last,
  loading,
  tt,
  onUpdate,
  onRefreshRates,
}) => (
<section className={`rounded-[24px] border p-6 xl:col-span-2 ${cardClass}`}>
    <h2 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('settings.general', 'General Settings')}</h2>
    <p className={`mt-2 text-sm ${mutedText}`}>
      {tt('settings.generalDesc', 'Configure your basic preferences and display options.')}
    </p>

    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>
          {tt('settings.theme', 'Theme')}
        </label>
        <div className="flex gap-3">
          {['light', 'dark'].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onUpdate('theme', opt)}
              className={`rounded-2xl border px-5 py-3 text-sm font-bold capitalize ${
                settings.theme === opt
                  ? isDark
                    ? 'border-[#d9ff34] bg-[#d9ff34]/10 text-[#d9ff34]'
                    : 'border-[#84cc16] bg-[#84cc16]/10 text-[#84cc16]'
                  : isDark
                    ? 'border-white/10 bg-white/[0.03] text-[#d0d3e4]'
                    : 'border-black/10 bg-white text-[#31374a]'
              }`}
            >
              {tt(`settings.themes.${opt}`, opt)}
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>
          {tt('settings.language', 'Language')}
        </label>
        <select
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
          value={settings.language}
          onChange={(e) => onUpdate('language', e.target.value)}
        >
          <option value="en">{tt('settings.lang.en', 'English')}</option>
          <option value="th">{tt('settings.lang.th', 'Thai')}</option>
          <option value="my">{tt('settings.lang.my', 'Burmese')}</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>
          {tt('settings.currency', 'Currency')}
        </label>
        <select
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
          value={settings.currency}
          onChange={(e) => onUpdate('currency', e.target.value)}
        >
          <option value="THB">THB - Thai Baht</option>
          <option value="USD">USD - US Dollar</option>
          <option value="MMK">MMK - Myanmar Kyat</option>
        </select>

        <div className={`mt-3 rounded-2xl border p-4 text-sm ${labelText} ${subtleSurface}`}>
          <div>
            1 THB ≈ {rates?.USD ? rates.USD.toFixed(4) : '...'} USD • {rates?.MMK ? Math.round(rates.MMK).toLocaleString() : '...'} MMK
          </div>
          <div className="mt-1">{tt('settings.updatedAt', 'Updated')}: {last}</div>
          <button
            type="button"
            onClick={onRefreshRates}
            disabled={loading}
            className={`mt-3 rounded-xl border px-3 py-2 text-sm font-semibold ${outlineButton}`}
          >
            {loading ? tt('settings.refreshing', 'Refreshing...') : tt('settings.refreshRates', 'Refresh Rates')}
          </button>
        </div>
      </div>

      <div className="md:col-span-2">
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>
          {tt('settings.weekStart', 'Week Starts On')}
        </label>
        <select
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
          value={settings.weekStartsOn}
          onChange={(e) => onUpdate('weekStartsOn', e.target.value)}
        >
          <option value="Sun">{tt('settings.week.sun', 'Sunday')}</option>
          <option value="Mon">{tt('settings.week.mon', 'Monday')}</option>
        </select>
      </div>
    </div>
  </section>
);

export default GeneralSettingsPanel;
