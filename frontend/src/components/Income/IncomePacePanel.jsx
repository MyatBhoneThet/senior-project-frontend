import React from 'react';

const IncomePacePanel = ({
  isDark,
  cardClass,
  mutedText,
  subtleSurface,
  monthlyPace,
  format,
  maxPace,
  dashboardData,
  tt,
}) => (
  <aside className={`rounded-[24px] border p-6 ${cardClass}`}>
    <div className="mb-6 flex items-center justify-between">
      <h3 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
        {tt('dashboard.monthlyPace', 'Monthly Pace')}
      </h3>
      <span className={`text-xs tracking-[0.12em] ${mutedText}`}>
        {tt('dashboard.last4Months', 'Last 4 Months')}
      </span>
    </div>

    <div className="space-y-5">
      {monthlyPace.length ? (
        monthlyPace.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{item.label}</p>
              <p className="text-sm font-bold text-[#84cc16]">
                {format(item.amount)}
              </p>
            </div>
            <div className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/[0.06]' : 'bg-white/58'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#d9ff34] via-[#84cc16] to-[#47d7ff]"
                style={{
                  width: `${Math.max(
                    12,
                    Math.round((item.amount / maxPace) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <p className={`text-sm ${mutedText}`}>
          {tt('income.pacingFallback', 'Monthly pacing appears here once income starts coming in.')}
        </p>
      )}
    </div>

    <div className={`mt-8 rounded-2xl border p-5 ${subtleSurface}`}>
      <div className={`text-xs tracking-[0.12em] ${mutedText}`}>
        {tt('dashboard.allTimeTotal', 'All-time total')}
      </div>
      <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
        {format(dashboardData?.totalIncome || 0)}
      </div>
      <div className={`mt-3 text-sm ${mutedText}`}>
        {tt('income.netBalance', 'Net balance:')} {format(dashboardData?.totalBalance || 0)}
      </div>
    </div>
  </aside>
);

export default IncomePacePanel;
