import React from 'react';
import { LuChevronDown, LuPlus } from 'react-icons/lu';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const ExpenseOverviewPanel = ({
  isDark,
  cardClass,
  sectionDivider,
  labelText,
  mutedText,
  inputClass,
  MONTHS,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  availableYears,
  onOpenAdd,
  tt,
  overviewStats,
  format,
  overviewLineData,
}) => (
  <div className={`mt-5 rounded-[24px] border p-6 ${cardClass}`}>
    <div className={`flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between ${sectionDivider}`}>
      <div>
        <h2 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('expense.overview', 'Expense Overview')}</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className={`appearance-none rounded-2xl border px-4 py-2 pr-10 text-sm font-semibold outline-none ${inputClass}`}
            aria-label="Select month"
          >
            {MONTHS.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7f8399]" />
        </label>

        <label className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={`appearance-none rounded-2xl border px-4 py-2 pr-10 text-sm font-semibold outline-none ${inputClass}`}
            aria-label="Select year"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7f8399]" />
        </label>

        <button
          type="button"
          onClick={onOpenAdd}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-[#ff6b81]/90 px-5 py-2.5 text-sm font-bold text-white shadow-[0_18px_40px_rgba(255,107,129,0.28)] backdrop-blur-2xl transition-all hover:-translate-y-0.5 hover:bg-[#ff5f7a]"
        >
          <LuPlus />
          {tt('expense.add', 'Add Expense')}
        </button>
      </div>
    </div>

    <div className={`grid grid-cols-2 gap-4 border-b py-5 md:grid-cols-4 ${sectionDivider}`}>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>{tt('expense.totalPeriod', 'Total Period')}</div>
        <div className="mt-2 text-2xl font-bold text-[#ff6b81]">{format(overviewStats.total)}</div>
      </div>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>{tt('expense.transactionsCount', 'Transactions')}</div>
        <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{overviewStats.transactions}</div>
      </div>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>{tt('expense.highestSingle', 'Highest Single')}</div>
        <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{format(overviewStats.highest)}</div>
      </div>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>{tt('expense.average', 'Average')}</div>
        <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{format(overviewStats.average)}</div>
      </div>
    </div>

    <div className="pt-8">
      {overviewLineData.length ? (
        <div className="h-[280px]">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={overviewLineData}
                margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="expenseOverviewArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff6b81" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ff6b81" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(17,19,27,0.10)'}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={{ fill: isDark ? '#6b7280' : '#6b7080', fontSize: 10, fontWeight: 700 }}
                  dy={8}
                  height={36}
                />
                <YAxis
                  hide
                  domain={[0, (dataMax) => Math.max(dataMax || 0, 1)]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const point = payload[0]?.payload;
                    return (
                      <div className={`rounded-xl border px-3 py-2 shadow-xl backdrop-blur-2xl ${isDark ? 'border-white/10 bg-white/[0.08]' : 'border-white/70 bg-white/88'}`}>
                        <div className={`text-xs font-bold uppercase tracking-[0.18em] ${labelText}`}>
                          {point?.fullLabel || point?.label}
                        </div>
                        <div className={`mt-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
                          {format(point?.amount || 0)}
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#ff6b81"
                  strokeWidth={3}
                  fill="url(#expenseOverviewArea)"
                  dot={{ r: 3, fill: '#ff6b81', stroke: isDark ? '#11131b' : '#fffdf7', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#ff6b81', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className={`py-16 text-center text-sm ${mutedText}`}>
          {tt('expense.noDataForMonth', 'No expense data for')} {MONTHS[selectedMonth]} {selectedYear}.
        </div>
      )}
    </div>
  </div>
);

export default ExpenseOverviewPanel;
