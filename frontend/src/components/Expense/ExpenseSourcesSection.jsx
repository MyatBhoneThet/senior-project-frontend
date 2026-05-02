import React from 'react';
import { LuDownload, LuPencil, LuTrash2 } from 'react-icons/lu';
import FilterControl from '../common/FilterControl';
import { categoryLabel, renderExpenseIcon, shortDateLabel, sourceTitle } from './expenseViewHelpers';

const ExpenseSourcesSection = ({
  isDark,
  cardClass,
  sectionDivider,
  outlineButton,
  mutedText,
  periodExpense,
  setFilteredExpense,
  visibleSources,
  format,
  onOpenBulkDelete,
  onDownload,
  onOpenEdit,
  onOpenDelete,
  tt,
}) => (
  <section className={`rounded-[24px] border p-6 ${cardClass}`}>
    <div className={`flex flex-col gap-3 border-b pb-5 lg:flex-row lg:items-center lg:justify-between ${sectionDivider}`}>
      <h2 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('expense.sources', 'Expense Sources')}</h2>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onDownload}
          className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${outlineButton}`}
        >
          <span className="inline-flex items-center gap-2">
            <LuDownload />
            {tt('expense.export', 'Export')}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenBulkDelete}
          className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${outlineButton}`}
        >
          <span className="inline-flex items-center gap-2">
            <LuTrash2 />
            {tt('expense.bulkDelete', 'Bulk Delete')}
          </span>
        </button>

        <FilterControl
          items={periodExpense}
          fieldMap={{
            date: 'date',
            category: 'category',
            amount: 'amount',
            text: 'source',
          }}
          onChange={setFilteredExpense}
          label={tt('expense.filter', 'Filter')}
          theme="neon"
        />
      </div>
    </div>

    <div className="pt-5">
      {visibleSources.length ? (
        visibleSources.map((item, index) => (
          <div key={item._id} className={index === 0 ? '' : `border-t ${isDark ? 'border-white/12' : 'border-black/10'}`}>
            <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-lg ${isDark ? 'bg-[#2a1117] text-[#ffb6c1]' : 'bg-[#ffe4ea] text-[#fb7185]'}`}>
                  {renderExpenseIcon(item.icon)}
                </div>
                <div>
                  <div className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{sourceTitle(item)}</div>
                  <div className={`mt-1 text-[11px] tracking-[0.1em] ${mutedText}`}>
                    {categoryLabel(item)} · {shortDateLabel(item.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:min-w-[250px] md:justify-end">
                <span className={`rounded-lg px-3 py-1.5 text-[11px] font-bold backdrop-blur-2xl ${isDark ? 'bg-[#ff6b81]/12 text-[#ff9bad]' : 'bg-[#ff6b81]/12 text-[#ef4444]'}`}>
                  Expense
                </span>
                <span className={`min-w-[100px] text-right text-base font-bold ${isDark ? 'text-[#ff6b81]' : 'text-[#ef4444]'}`}>
                  -{format(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenEdit(item)}
                  className={`rounded-lg border p-1.5 transition-all backdrop-blur-3xl ${isDark ? 'border-white/10 bg-white/[0.05] text-[#aab0c5] hover:bg-white/[0.1]' : 'border-white/45 bg-white/58 text-[#4e5569] hover:bg-white/88'}`}
                  aria-label="Edit expense"
                >
                  <LuPencil />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDelete(item._id)}
                  className={`rounded-lg border p-1.5 transition-all backdrop-blur-3xl ${isDark ? 'border-white/10 bg-white/[0.05] text-[#aab0c5] hover:bg-white/[0.1]' : 'border-white/45 bg-white/58 text-[#4e5569] hover:bg-white/88'}`}
                  aria-label="Delete expense"
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={`py-10 text-sm ${mutedText}`}>
          {tt('expense.noDataFilter', 'No expense data available for the current filters.')}
        </div>
      )}
    </div>
  </section>
);

export default ExpenseSourcesSection;
