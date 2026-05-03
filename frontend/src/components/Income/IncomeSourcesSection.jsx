import React from 'react';
import { LuDownload, LuPencil, LuTrash2 } from 'react-icons/lu';
import FilterControl from '../common/FilterControl';
import { categoryLabel, renderIncomeIcon, shortDateLabel, sourceTitle } from './incomeViewHelpers';
import { ListSkeleton } from '../Dashboard/DashboardSkeleton';

const IncomeSourcesSection = ({
  isDark,
  cardClass,
  sectionDivider,
  outlineButton,
  mutedText,
  periodIncome,
  setFilteredIncome,
  visibleSources,
  format,
  onOpenBulkDelete,
  onDownload,
  onOpenEdit,
  onOpenDelete,
  tt,
  isLoading = false,
}) => (
  <section className={`rounded-[24px] border p-6 ${cardClass}`}>
    <div className={`flex flex-col gap-3 border-b pb-5 lg:flex-row lg:items-center lg:justify-between ${sectionDivider}`}>
      <h2 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('income.sources', 'Income Sources')}</h2>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onDownload}
          className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${outlineButton}`}
        >
          <span className="inline-flex items-center gap-2">
            <LuDownload />
            {tt('income.export', 'Export')}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenBulkDelete}
          className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${outlineButton}`}
        >
          <span className="inline-flex items-center gap-2">
            <LuTrash2 />
            {tt('income.bulkDelete', 'Bulk Delete')}
          </span>
        </button>

        <FilterControl
          items={periodIncome}
          fieldMap={{
            date: 'date',
            category: 'category',
            amount: 'amount',
            text: 'source',
          }}
          onChange={setFilteredIncome}
          label={tt('income.filter', 'Filter')}
          theme="neon"
        />
      </div>
    </div>

    <div className="pt-5">
      {isLoading ? (
        <ListSkeleton rows={6} isDark={isDark} />
      ) : visibleSources.length ? (
        visibleSources.map((item, index) => (
          <div key={item._id} className={index === 0 ? '' : `border-t ${isDark ? 'border-white/12' : 'border-black/10'}`}>
            <div className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-lg ${isDark ? 'bg-[#2b3517] text-[#d9ff34]' : 'bg-[#eef6cb] text-[#84cc16]'}`}>
                  {renderIncomeIcon(item.icon)}
                </div>
                <div>
                  <div className={`text-[15px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
                    {sourceTitle(item)}
                  </div>
                  <div className={`mt-1 text-[11px] tracking-[0.1em] ${mutedText}`}>
                    {categoryLabel(item)} · {shortDateLabel(item.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:min-w-[250px] md:justify-end">
                <span className={`rounded-lg px-3 py-1.5 text-[11px] font-bold backdrop-blur-2xl ${isDark ? 'bg-[#d9ff34]/12 text-[#d9ff34]' : 'bg-[#84cc16]/12 text-[#84cc16]'}`}>
                  Income
                </span>
                <span className={`min-w-[100px] text-right text-base font-bold ${isDark ? 'text-[#d9ff34]' : 'text-[#84cc16]'}`}>
                  +{format(item.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenEdit(item)}
                  className={`rounded-lg border p-1.5 transition-all backdrop-blur-3xl ${isDark ? 'border-white/10 bg-white/[0.05] text-[#aab0c5] hover:bg-white/[0.1]' : 'border-white/45 bg-white/58 text-[#4e5569] hover:bg-white/88'}`}
                  aria-label="Edit income"
                >
                  <LuPencil />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenDelete(item._id)}
                  className={`rounded-lg border p-1.5 transition-all backdrop-blur-3xl ${isDark ? 'border-white/10 bg-white/[0.05] text-[#aab0c5] hover:bg-white/[0.1]' : 'border-white/45 bg-white/58 text-[#4e5569] hover:bg-white/88'}`}
                  aria-label="Delete income"
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={`py-10 text-sm ${mutedText}`}>
          {tt('income.noDataFilter', 'No income data available for the current filters.')}
        </div>
      )}
    </div>
  </section>
);

export default IncomeSourcesSection;
