import React from 'react';

const StatCardsGrid = ({ statCards, isDark, topCardClass, labelText, mutedText, updatedNowText }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {statCards.map((card) => {
      const Icon = card.icon;

      return (
        <div key={card.title} className={`relative overflow-hidden rounded-[24px] border p-6 ${topCardClass}`}>
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-radial ${card.glow} blur-3xl opacity-80`}
          />
          <div
            className={`pointer-events-none absolute inset-0 ${
              isDark
                ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,transparent)]'
                : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.26),transparent_36%,transparent)]'
            }`}
          />
          <div className="relative flex h-full flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className={`text-[11px] font-medium ${labelText}`}>{card.title}</div>
                <div className={`mt-3 text-[34px] font-bold leading-none tracking-[-0.04em] ${card.accent}`}>
                  {card.amount}
                </div>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  isDark ? 'bg-white/[0.04]' : 'bg-[rgba(17,19,27,0.04)]'
                }`}
              >
                <Icon className={`text-xl ${card.accent}`} />
              </div>
            </div>

            <div className={`mt-3 text-xs md:text-sm ${mutedText}`}>{card.subtitle}</div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className={`rounded-xl px-3 py-1.5 text-[11px] ${card.badgeClass}`}>{card.badgeText}</span>
              <span className={`text-[11px] ${mutedText}`}>{updatedNowText}</span>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default StatCardsGrid;
