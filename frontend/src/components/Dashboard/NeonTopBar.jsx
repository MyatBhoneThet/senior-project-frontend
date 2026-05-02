import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';

const NeonTopBar = ({
  userName,
  title, // if provided, use it, else default
  subtitle,
  liveLabel,
  periodLabel,
  periods = ['W', 'M', 'Q', 'Y'],
  selectedPeriod = 'M',
  onPeriodChange,
}) => {
  const { t } = useT();
  const tt = (k, f) => { const v = t?.(k); return v && v !== k ? v : f; };

  const { prefs } = useContext(UserContext) || {};
  const isDark = prefs?.theme === 'dark';
  const currentPeriodLabel = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());
  const resolvedTitle = title || tt('menu.dashboard', 'Dashboard');
  const resolvedSubtitle = subtitle || `${tt('dashboard.welcomeBack', 'Welcome back')}, ${userName || 'User'}`;
  const resolvedLiveLabel = liveLabel || tt('dashboard.live', 'Live');
  const resolvedPeriodLabel = periodLabel ?? currentPeriodLabel;
  const showLiveMeta = Boolean(resolvedLiveLabel || resolvedPeriodLabel);
  const showPeriods = typeof onPeriodChange === 'function' && Array.isArray(periods) && periods.length > 0;

  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-8 rounded-[28px] border px-5 py-5 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:px-6 md:py-6 ${
      isDark ? 'border-white/10 bg-white/[0.04]' : 'border-white/20 bg-white/55'
    }`}>
      <div>
        <div className="flex items-center gap-3">
          <h1
            className={`text-3xl font-bold tracking-[0.2em] ${isDark ? 'text-white' : 'text-[#11131b]'}`}
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {resolvedTitle}
          </h1>
          {showLiveMeta && (
            <div className={`flex items-center gap-2 text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-[#5f6477]'}`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a3e635] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#84cc16]"></span>
              </span>
              <span>{[resolvedLiveLabel, resolvedPeriodLabel].filter(Boolean).join(' • ')}</span>
            </div>
          )}
        </div>
        <p className={`mt-1 text-sm font-medium ${isDark ? 'text-gray-500' : 'text-[#6c7086]'}`}>
          {resolvedSubtitle}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-6 md:mt-0">
        {showPeriods && (
          <div
            className={`flex rounded-2xl p-1 backdrop-blur-2xl ${
              isDark
                ? 'border border-white/10 bg-white/[0.05] shadow-[0_24px_80px_rgba(0,0,0,0.2)]'
                : 'border border-white/15 bg-white/65 shadow-[0_24px_80px_rgba(15,23,42,0.08)]'
            }`}
          >
            {periods.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onPeriodChange?.(period)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  period === selectedPeriod
                    ? isDark
                      ? 'bg-white/[0.08] text-white shadow-sm'
                      : 'bg-white/90 text-[#84cc16] shadow-sm'
                    : isDark
                      ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                      : 'text-[#666c80] hover:bg-white/55 hover:text-[#11131b]'
                }`}
              >
                {tt(`dashboard.period.${period}`, period)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NeonTopBar;
