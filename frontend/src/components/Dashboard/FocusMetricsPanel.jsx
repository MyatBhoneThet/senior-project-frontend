import React from 'react';
import { SkeletonBlock } from './DashboardSkeleton';

const FocusMetricsPanel = ({ isDark, panelClass, labelText, dashboardData, format, onRefresh, texts, isLoading = false }) => (
  <div className={`relative overflow-hidden rounded-[24px] border p-5 ${panelClass}`}>
    <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_34%,transparent)]' : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_36%,transparent)]'}`} />
    <div className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${isDark ? 'bg-white/[0.07]' : 'bg-white/45'}`} />

    <div className="relative z-10 mb-4 flex items-center justify-between">
      <h3 className={`text-[13px] font-medium tracking-[0.12em] ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{texts.focusMetrics}</h3>
      <button
        type="button"
        onClick={onRefresh}
        className={`rounded-xl border px-3 py-1.5 text-[11px] backdrop-blur-3xl ${
          isDark
            ? 'border-white/10 bg-white/[0.05] text-[#d0d3e4] hover:bg-white/[0.08]'
            : 'border-white/28 bg-white/28 text-[#31374a] hover:bg-white/42'
        }`}
      >
        {texts.refreshView}
      </button>
    </div>

    <div className="relative z-10 space-y-3">
      <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/12 bg-white/[0.07] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'border-white/28 bg-white/28 backdrop-blur-3xl'}`}>
        <div className={`text-[10px] font-medium tracking-[0.18em] ${labelText}`}>{texts.last60DaysIncome}</div>
        {isLoading ? (
          <SkeletonBlock isDark={isDark} className="mt-3 h-6 w-28 rounded-lg" />
        ) : (
          <div className="mt-2 text-xl font-bold text-[#d9ff34]">{format(dashboardData?.last60DaysIncome?.total || 0)}</div>
        )}
      </div>

      <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/12 bg-white/[0.07] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'border-white/28 bg-white/28 backdrop-blur-3xl'}`}>
        <div className={`text-[10px] font-medium tracking-[0.18em] ${labelText}`}>{texts.recurringMonthly}</div>
        {isLoading ? (
          <SkeletonBlock isDark={isDark} className="mt-3 h-7 w-32 rounded-lg" />
        ) : (
          <div className="mt-2 text-2xl font-bold text-[#fb7185]">{format(dashboardData?.recurring?.monthlyTotal || 0)}</div>
        )}
      </div>

      <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/12 bg-white/[0.07] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'border-white/28 bg-white/28 backdrop-blur-3xl'}`}>
        <div className={`text-[10px] font-medium tracking-[0.18em] ${labelText}`}>{texts.activeGoals}</div>
        {isLoading ? (
          <SkeletonBlock isDark={isDark} className="mt-3 h-7 w-16 rounded-lg" />
        ) : (
          <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
            {dashboardData?.goals?.active ?? dashboardData?.goals?.total ?? 0}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default FocusMetricsPanel;
