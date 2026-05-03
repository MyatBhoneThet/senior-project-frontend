import React from 'react';
import { LuChartNoAxesCombined } from 'react-icons/lu';
import { SkeletonBlock } from './DashboardSkeleton';

const SystemStatusPanel = ({ isDark, panelClass, labelText, mutedText, dashboardData, texts, isLoading = false }) => (
  <div className={`relative overflow-hidden rounded-[24px] border p-6 ${panelClass}`}>
    <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_34%,transparent)]' : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_36%,transparent)]'}`} />
    <div className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${isDark ? 'bg-white/[0.07]' : 'bg-white/45'}`} />

    <div className="relative z-10 mb-4 flex items-center justify-between">
      <h3 className={`text-[13px] font-medium tracking-[0.12em] ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{texts.systemStatus}</h3>
      <LuChartNoAxesCombined className={`text-lg ${labelText}`} />
    </div>

    <div className="relative z-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/12 bg-white/[0.07] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'border-white/28 bg-white/28 backdrop-blur-3xl'}`}>
        <div className={`text-[10px] font-medium tracking-[0.18em] ${labelText}`}>{texts.budgetSignal}</div>
        {isLoading ? (
          <>
            <SkeletonBlock isDark={isDark} className="mt-3 h-5 w-24 rounded-lg" />
            <SkeletonBlock isDark={isDark} className="mt-3 h-3 w-full rounded" />
          </>
        ) : (
          <>
            <div className="mt-2 text-lg font-semibold text-[#53ff47]">
              {dashboardData?.totalBalance >= 0 ? texts.healthy : texts.watchlist}
            </div>
            <p className={`mt-1 text-xs md:text-sm ${mutedText}`}>{texts.budgetSignalDesc}</p>
          </>
        )}
      </div>

      <div className={`rounded-2xl border p-4 ${isDark ? 'border-white/12 bg-white/[0.07] ring-1 ring-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'border-white/28 bg-white/28 backdrop-blur-3xl'}`}>
        <div className={`text-[10px] font-medium tracking-[0.18em] ${labelText}`}>{texts.latestActivity}</div>
        {isLoading ? (
          <>
            <SkeletonBlock isDark={isDark} className="mt-3 h-5 w-32 rounded-lg" />
            <SkeletonBlock isDark={isDark} className="mt-3 h-3 w-full rounded" />
          </>
        ) : (
          <>
            <div className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
              {dashboardData?.recentTransactions?.length
                ? `${dashboardData.recentTransactions.length} ${texts.recentItems}`
                : texts.noRecentItems}
            </div>
            <p className={`mt-1 text-xs md:text-sm ${mutedText}`}>{texts.activityDesc}</p>
          </>
        )}
      </div>
    </div>
  </div>
);

export default SystemStatusPanel;
