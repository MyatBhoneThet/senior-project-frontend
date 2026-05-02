import React from 'react';
import { nextChargeDate } from './recurringViewHelpers';

const RecurringSummaryCards = ({
  isDark,
  cardClass,
  labelText,
  mutedText,
  format,
  monthlyCommitted,
  activeCount,
  nextRule,
  annualRecurring,
  rules,
  tt,
}) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
    <div className={`relative overflow-hidden rounded-[22px] border p-6 ${cardClass}`}>
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-radial from-[#8b5cf6]/20 to-transparent blur-3xl opacity-80" />
      <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_35%,transparent)]' : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.30),transparent_36%,transparent)]'}`} />
      <div className={`relative z-10 mb-4 text-[13px] font-semibold ${labelText}`}>{tt('recurring.monthlyCommitted', 'Monthly Committed')}</div>
      <div className="relative z-10 text-4xl font-bold tracking-tight text-[#8b5cf6]">{format(monthlyCommitted)}</div>
      <div className={`relative z-10 mt-3 text-xs ${mutedText}`}>{tt('recurring.across', 'Across')} {activeCount} {tt('recurring.activeRules', 'active rules')}</div>
      <div className="relative z-10 mt-6 inline-flex rounded-xl bg-[#8b5cf6]/10 px-4 py-2 text-sm font-bold text-[#8b5cf6]">
        {activeCount} {tt('recurring.active', 'active')}
      </div>
    </div>

    <div className={`relative overflow-hidden rounded-[22px] border p-6 ${cardClass}`}>
      <div className={`mb-4 text-[13px] font-semibold ${labelText}`}>{tt('recurring.nextCharge', 'Next Charge')}</div>
      <div className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
        {nextRule ? format(nextRule.amount) : format(0)}
      </div>
      <div className={`mt-3 text-xs ${mutedText}`}>
        {nextRule ? `${nextRule.category} · ${nextChargeDate(nextRule)}` : tt('recurring.noActiveRule', 'No active rule')}
      </div>
      <div className="mt-6 inline-flex rounded-xl bg-[#f59e0b]/10 px-4 py-2 text-sm font-bold text-[#f59e0b]">
        {nextRule ? tt('recurring.upcoming', 'Upcoming') : tt('recurring.noSchedule', 'No schedule')}
      </div>
    </div>

    <div className={`relative overflow-hidden rounded-[22px] border p-6 ${cardClass}`}>
      <div className={`mb-4 text-[13px] font-semibold ${labelText}`}>{tt('recurring.annualRecurring', 'Annual Recurring')}</div>
      <div className="text-4xl font-bold tracking-tight text-[#fb7185]">{format(annualRecurring)}</div>
      <div className={`mt-3 text-xs ${mutedText}`}>{tt('recurring.projectedYearlyCost', 'Projected yearly recurring cost')}</div>
      <div className="mt-6 inline-flex rounded-xl bg-[#fb7185]/10 px-4 py-2 text-sm font-bold text-[#fb7185]">
        {rules.length} {tt('recurring.totalRules', 'total rules')}
      </div>
    </div>
  </div>
);

export default RecurringSummaryCards;
