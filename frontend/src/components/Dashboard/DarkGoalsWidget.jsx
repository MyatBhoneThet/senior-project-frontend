import React, { useContext } from 'react';
import { LuTarget } from 'react-icons/lu';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import { CompactRowsSkeleton, SkeletonBlock } from './DashboardSkeleton';

const DarkGoalsWidget = ({ goals, totalGoals, isLoading = false }) => {
  const { prefs } = useContext(UserContext) || {};
  const isDark = prefs?.theme === 'dark';
  const defaultGoals = Array.isArray(goals) ? goals : [];

  const getProgressColor = (progress) => {
    if (progress < 10) return 'from-gray-500 to-gray-400';
    if (progress < 50) return 'from-[#fb7185] to-[#f43f5e]';
    if (progress < 70) return 'from-[#eab308] to-[#facc15]';
    return 'from-[#84cc16] to-[#a3e635]';
  };

  const getTextColor = (progress) => {
    if (progress < 10) return 'text-gray-400';
    if (progress < 50) return 'text-[#fb7185]';
    if (progress < 70) return 'text-[#facc15]';
    return 'text-[#a3e635]';
  };

  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';

  const { t } = useT();
  const tt = (k, f) => { const v = t?.(k); return v && v !== k ? v : f; };

  return (
    <div className={`h-[260px] w-full overflow-hidden rounded-[22px] border p-5 flex flex-col relative ${cardClass}`}>
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_34%,transparent)]' : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_36%,transparent)]'}`} />
      <div className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${isDark ? 'bg-white/[0.07]' : 'bg-white/45'}`} />

      <div className="relative z-10 flex justify-between items-center mb-4">
        <h3 className={`text-[13px] font-semibold tracking-[0.1em] ${isDark ? 'text-gray-100' : 'text-[#11131b]'}`}>{tt('dashboard.goals', 'Goals')}</h3>
        {isLoading ? (
          <SkeletonBlock isDark={isDark} className="h-5 w-16 rounded" />
        ) : (
          <span className="px-2 py-0.5 bg-[#a3e635]/14 text-[#a3e635] text-[10px] tracking-widest rounded">
            {(typeof totalGoals === 'number' ? totalGoals : defaultGoals.length)} {tt('dashboard.active', 'Active')}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-4 flex-1 justify-center">
        {isLoading ? (
          <CompactRowsSkeleton rows={3} isDark={isDark} />
        ) : defaultGoals.length > 0 ? (
          defaultGoals.map((g, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {g.icon || <LuTarget className="text-[#eab308]" />}
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-200' : 'text-[#11131b]'}`}>{g.name}</span>
                </div>
                <span className={`text-xs font-medium tracking-widest ${getTextColor(g.progress)}`}>
                  {g.progress}%
                </span>
              </div>
              
              <div className={`relative h-1.5 w-full overflow-hidden rounded-full ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'}`}>
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getProgressColor(g.progress)} shadow-[0_0_10px_currentColor]`}
                  style={{ width: `${g.progress}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className={`flex h-full items-center justify-center text-xs font-medium tracking-widest ${isDark ? 'text-gray-500' : 'text-[#6b7080]'}`}>
            {tt('dashboard.noGoals', 'No active goals')}
          </div>
        )}
      </div>
    </div>
  );
};

export default DarkGoalsWidget;
