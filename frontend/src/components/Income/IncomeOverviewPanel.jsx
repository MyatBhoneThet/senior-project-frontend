import React from 'react';
import { LuChevronDown, LuPlus } from 'react-icons/lu';
import { ChartSkeleton, SkeletonBlock } from '../Dashboard/DashboardSkeleton';

const IncomeOverviewPanel = ({
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
  overviewChartBars,
  isLoading = false,
}) => (
  <div className={`mt-5 rounded-[24px] border p-6 ${cardClass}`}>
    <div className={`flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between ${sectionDivider}`}>
      <div>
        <h2 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('income.overview', 'Income Overview')}</h2>
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
              <option key={month} value={index}>
                {month}
              </option>
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
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7f8399]" />
        </label>

        <button
          type="button"
          onClick={onOpenAdd}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all backdrop-blur-2xl border border-white/20 ${
            isDark
              ? 'bg-[#d9ff34] text-black shadow-[0_18px_40px_rgba(217,255,52,0.25)] hover:bg-[#cbf029]'
              : 'bg-[#84cc16] text-white shadow-[0_18px_40px_rgba(132,204,22,0.18)] hover:bg-[#65a30d]'
          }`}
        >
          <LuPlus />
          {tt('income.add', 'Add Income')}
        </button>
      </div>
    </div>

    <div className={`grid grid-cols-2 gap-4 border-b py-5 md:grid-cols-4 ${sectionDivider}`}>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>
          {tt('income.totalPeriod', 'Total Period')}
        </div>
        {isLoading ? <SkeletonBlock isDark={isDark} className="mt-3 h-7 w-28 rounded-lg" /> : (
          <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-[#d9ff34]' : 'text-[#84cc16]'}`}>{format(overviewStats.total)}</div>
        )}
      </div>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>
          {tt('income.transactionsCount', 'Transactions')}
        </div>
        {isLoading ? <SkeletonBlock isDark={isDark} className="mt-3 h-7 w-16 rounded-lg" /> : (
          <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{overviewStats.transactions}</div>
        )}
      </div>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>
          {tt('income.highestSingle', 'Highest Single')}
        </div>
        {isLoading ? <SkeletonBlock isDark={isDark} className="mt-3 h-7 w-24 rounded-lg" /> : (
          <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{format(overviewStats.highest)}</div>
        )}
      </div>
      <div>
        <div className={`text-xs tracking-[0.12em] ${labelText}`}>
          {tt('income.average', 'Average')}
        </div>
        {isLoading ? <SkeletonBlock isDark={isDark} className="mt-3 h-7 w-24 rounded-lg" /> : (
          <div className={`mt-2 text-2xl font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{format(overviewStats.average)}</div>
        )}
      </div>
    </div>

    <div className="pt-8">
      {isLoading ? (
        <div className="h-[260px]">
          <ChartSkeleton isDark={isDark} />
        </div>
      ) : overviewChartBars.length ? (
        <div className="h-[260px]">
          <div className="relative flex h-[210px] items-end gap-2 overflow-x-auto pb-2">
            {overviewChartBars.map((bar) => (
              <div
                key={bar.id}
                className="flex min-w-[40px] flex-col items-center justify-end gap-3"
              >
                <div className="relative flex h-[180px] w-full items-end justify-center">
                  <div className="absolute inset-x-0 bottom-0 top-0 rounded-2xl border border-transparent" />
                  <div
                    className={`w-8 rounded-[10px] ${
                      bar.emphasis
                        ? 'bg-[#d9ff34] shadow-[0_0_24px_rgba(217,255,52,0.3)]'
                        : bar.amount > 0
                        ? 'bg-gradient-to-t from-[#84cc16] to-[#d9ff34]'
                        : isDark ? 'bg-white/10' : 'bg-white/55'
                    }`}
                    style={{ height: bar.height }}
                    title={`${bar.fullLabel}: ${format(bar.amount)}`}
                  />
                </div>
                <div className={`text-[10px] font-medium tracking-[0.08em] ${mutedText}`}>
                  {bar.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={`py-16 text-center text-sm ${mutedText}`}>
          {tt('income.noDataForMonth', 'No income data for')} {MONTHS[selectedMonth]} {selectedYear}.
        </div>
      )}
    </div>
  </div>
);

export default IncomeOverviewPanel;
