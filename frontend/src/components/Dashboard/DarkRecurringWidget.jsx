import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useCurrency } from '../../context/CurrencyContext';
import useT from '../../hooks/useT';
import { ListSkeleton, SkeletonBlock } from './DashboardSkeleton';

const DarkRecurringWidget = ({ recurring, totalAmount, format, isLoading = false }) => {
  const { prefs } = useContext(UserContext) || {};
  const { format: formatCurrency } = useCurrency();
  const isDark = prefs?.theme === 'dark';
  const defaultRecurring = Array.isArray(recurring) ? recurring : [];
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';

  const { t } = useT();
  const tt = (k, f) => { const v = t?.(k); return v && v !== k ? v : f; };
  const resolvedFormat = (amount) => {
    if (typeof format === 'function') return format(Number(amount || 0));
    if (typeof formatCurrency === 'function') return formatCurrency(Number(amount || 0));
    return Number(amount || 0).toLocaleString();
  };

  const repeatLabel = (repeat) => {
    const value = String(repeat || 'monthly').toLowerCase();
    if (value === 'weekly') return tt('recurring.weekly', 'Weekly');
    if (value === 'yearly') return tt('recurring.yearly', 'Yearly');
    return tt('recurring.monthly', 'Monthly');
  };

  return (
    <div className={`h-[260px] w-full overflow-hidden rounded-[22px] border p-5 flex flex-col relative ${cardClass}`}>
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_34%,transparent)]' : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.34),transparent_36%,transparent)]'}`} />
      <div className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${isDark ? 'bg-white/[0.07]' : 'bg-white/45'}`} />

      <div className="relative z-10 flex justify-between items-center mb-4">
        <h3 className={`text-[13px] font-medium tracking-[0.1em] ${isDark ? 'text-gray-100' : 'text-[#11131b]'}`}>{tt('menu.recurring', 'Recurring')}</h3>
        {isLoading ? (
          <SkeletonBlock isDark={isDark} className="h-3 w-24 rounded" />
        ) : (
          <span className="text-[10px] tracking-widest text-[#fb7185] uppercase">
            {resolvedFormat(totalAmount)} {tt('dashboard.perMonth', '/ mo')}
          </span>
        )}
      </div>

      <div className="relative z-10 flex flex-col gap-3 flex-1 justify-center">
        {isLoading ? (
          <ListSkeleton rows={4} isDark={isDark} />
        ) : defaultRecurring.length > 0 ? (
          defaultRecurring.map((r, idx) => (
          <div key={idx} className={`-mx-1 flex items-center justify-between rounded p-1 transition-colors group cursor-pointer ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.03]'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: r.color, color: r.color }}></div>
              <span className={`text-xs font-bold ${isDark ? 'text-gray-200' : 'text-[#11131b]'}`}>{r.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-[#6b7080]'}`}>{repeatLabel(r.repeat)}</span>
              <span className={`text-xs font-bold font-mono tracking-tight ${r.type === 'income' ? 'text-[#d9ff34]' : 'text-[#fb7185]'}`}>
                {r.type === 'income' ? '+' : '-'}{resolvedFormat(Math.abs(Number(r.amount || 0)))}
              </span>
            </div>
            </div>
          ))
        ) : (
          <div className={`flex h-full items-center justify-center text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-[#6b7080]'}`}>
            {tt('recurring.noRules', 'No active recurring rules')}
          </div>
        )}
      </div>
    </div>
  );
};

export default DarkRecurringWidget;
