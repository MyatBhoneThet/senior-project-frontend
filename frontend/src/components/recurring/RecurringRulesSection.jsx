import React from 'react';
import { LuPause, LuPlay, LuTrash2 } from 'react-icons/lu';
import { repeatLabel, whenText } from './recurringViewHelpers';

const RecurringRuleRow = ({
  rule,
  isDark,
  mutedText,
  outlineButton,
  format,
  tt,
  onEdit,
  onToggle,
  onDelete,
}) => (
  <div className="flex flex-col gap-2 px-1 py-3 md:flex-row md:items-center md:justify-between">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${rule.isActive ? (isDark ? 'bg-[#d9ff34]' : 'bg-[#84cc16]') : 'bg-[#f59e0b]'}`} />
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg border text-sm ${isDark ? 'border-white/10 bg-white/[0.05]' : 'border-white/22 bg-white/18 backdrop-blur-3xl'}`}>
          {rule.icon || (rule.type === 'income' ? '💰' : '💸')}
        </span>
        <h3 className={`truncate text-[13px] tracking-[0.08em] ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
          {rule.type === 'income' ? tt('recurring.income', 'Income') : tt('recurring.expense', 'Expense')} - {rule.category}
        </h3>
      </div>
      <p className={`mt-1 text-xs ${mutedText}`}>
        {format(rule.amount)} · {whenText(rule, tt)} · {tt('recurring.start', 'Start')} {String(rule.startDate).slice(0, 10)} ·{' '}
        <span className={rule.isActive ? (isDark ? 'text-[#d9ff34]' : 'text-[#84cc16]') : 'text-[#f59e0b]'}>
          {rule.isActive ? tt('recurring.active', 'Active') : tt('recurring.paused', 'Paused')}
        </span>
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-2 md:justify-end">
      <span className={`rounded-lg px-3 py-1.5 text-[11px] tracking-[0.1em] ${isDark ? 'bg-[#d9ff34]/10 text-[#d9ff34]' : 'bg-[#84cc16]/10 text-[#84cc16]'}`}>
        {repeatLabel(rule.repeat, tt)}
      </span>
      <span className={`text-base font-bold ${rule.type === 'income' ? 'text-[#d9ff34]' : 'text-[#fb7185]'}`}>
        {rule.type === 'income' ? '+' : '-'}{format(rule.amount)}
      </span>
      <button type="button" onClick={() => onEdit(rule)} className={`rounded-lg border px-3 py-1.5 text-[11px] ${outlineButton}`}>
        {tt('common.edit', 'Edit')}
      </button>
      <button
        type="button"
        onClick={() => onToggle(rule._id, !rule.isActive)}
        className={`rounded-lg border px-3 py-1.5 text-[11px] ${rule.isActive ? outlineButton : 'border-[#d9ff34]/20 text-[#d9ff34] hover:bg-[#d9ff34]/10'}`}
      >
        {rule.isActive ? (
          <span className="inline-flex items-center gap-2"><LuPause /> {tt('recurring.pause', 'Pause')}</span>
        ) : (
          <span className="inline-flex items-center gap-2"><LuPlay /> {tt('recurring.resume', 'Resume')}</span>
        )}
      </button>
      <button type="button" onClick={() => onDelete(rule._id)} className={`rounded-lg border px-3 py-1.5 text-[11px] ${outlineButton}`}>
        <span className="inline-flex items-center gap-2"><LuTrash2 /> {tt('common.delete', 'Delete')}</span>
      </button>
    </div>
  </div>
);

const RecurringRulesSection = ({
  isDark,
  cardClass,
  sectionDivider,
  loading,
  rules,
  mutedText,
  outlineButton,
  format,
  tt,
  onOpenCreate,
  onOpenEdit,
  onToggleRule,
  onRemoveRule,
}) => (
  <section className={`mt-5 rounded-[24px] border p-6 ${cardClass}`}>
    <div className={`flex flex-col gap-3 border-b pb-5 lg:flex-row lg:items-center lg:justify-between ${sectionDivider}`}>
      <h2 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('recurring.yourRules', 'Your Rules')}</h2>

      <button
        type="button"
        onClick={onOpenCreate}
        className={`rounded-2xl px-5 py-3 text-sm font-bold transition-all ${isDark ? 'bg-[#d9ff34] text-[#323331] hover:bg-[#cbf029]' : 'bg-[#84cc16] text-white hover:bg-[#65a30d]'}`}
      >
        {tt('recurring.add', 'Add Rule')}
      </button>
    </div>

    <div className="pt-5">
      {loading ? (
        <div className={`py-10 text-sm ${mutedText}`}>{tt('common.loading', 'Loading...')}</div>
      ) : rules.length === 0 ? (
        <div className={`py-10 text-sm ${mutedText}`}>{tt('recurring.noRules', 'No recurring rules yet.')}</div>
      ) : (
        rules.map((rule, index) => (
          <div
            key={rule._id}
            className={index === 0 ? '' : `mt-4 border-t pt-4 ${isDark ? 'border-white/12' : 'border-black/10'}`}
          >
            <RecurringRuleRow
              rule={rule}
              isDark={isDark}
              mutedText={mutedText}
              outlineButton={outlineButton}
              format={format}
              tt={tt}
              onEdit={onOpenEdit}
              onToggle={onToggleRule}
              onDelete={onRemoveRule}
            />
          </div>
        ))
      )}
    </div>
  </section>
);

export default RecurringRulesSection;
