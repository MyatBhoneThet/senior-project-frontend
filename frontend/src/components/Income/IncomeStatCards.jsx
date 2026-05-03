import React from 'react';
import { StatCardSkeleton } from '../Dashboard/DashboardSkeleton';

const IncomeStatCards = ({ statCards, isDark, cardClass, labelText, mutedText, isLoading = false }) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    {statCards.map((card) => (
      <div key={card.title} className={`relative overflow-hidden rounded-[22px] border p-6 ${cardClass}`}>
        <div className={`pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-radial ${card.glow} blur-3xl opacity-80`} />
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,transparent)]' : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.56),transparent_36%,transparent)]'}`} />
        {isLoading ? (
          <div className="relative z-10">
            <StatCardSkeleton isDark={isDark} />
          </div>
        ) : (
        <div className="relative">
          <div className={`mb-4 text-[13px] font-semibold ${labelText}`}>
            {card.title}
          </div>
          <div className={`text-4xl font-bold tracking-tight ${card.accent}`}>
            {card.value}
          </div>
          <div className={`mt-3 text-xs ${mutedText}`}>{card.subtitle}</div>
          <div className={`mt-6 inline-flex rounded-xl px-4 py-2 text-sm font-bold ${card.badgeAccent}`}>
            {card.badge}
          </div>
        </div>
        )}
      </div>
    ))}
  </div>
);

export default IncomeStatCards;
