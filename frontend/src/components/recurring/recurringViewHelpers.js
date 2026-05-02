export const repeatLabel = (repeat, tt) => {
  const r = String(repeat || 'monthly').toLowerCase();
  if (r === 'weekly') return tt('recurring.weekly', 'Weekly');
  if (r === 'yearly') return tt('recurring.yearly', 'Yearly');
  return tt('recurring.monthly', 'Monthly');
};

export const whenText = (rule, tt) => {
  const rep = String(rule?.repeat || 'monthly').toLowerCase();
  const start = rule?.startDate ? new Date(rule.startDate) : new Date();
  const weekday = start.toLocaleDateString(undefined, { weekday: 'long' });
  const md = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const dom = rule?.dayOfMonth || start.getDate();

  if (rep === 'weekly') return `${tt('recurring.everyWeekOn', 'Every')} ${weekday}`;
  if (rep === 'yearly') return `${tt('recurring.everyYearOn', 'Every year on')} ${md}`;
  return `${tt('recurring.dayEachMonth', 'Day')} ${dom} ${tt('recurring.eachMonth', 'each month')}`;
};

export const nextChargeDate = (rule, locale = 'en-US') => {
  const start = new Date(rule?.startDate || new Date());
  return start.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
};
