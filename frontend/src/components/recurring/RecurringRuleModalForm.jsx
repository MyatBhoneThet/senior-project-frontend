import React from 'react';
import CategorySelect from '../common/CategorySelect';
import EmojiPickerPopup from '../layout/EmojiPickerPopup';

const RecurringRuleModalForm = ({
  editing,
  onSubmit,
  saving,
  form,
  setField,
  isDark,
  surfaceBorder,
  inputClass,
  labelText,
  tt,
}) => (
  <form onSubmit={onSubmit} className={`space-y-5 rounded-[24px] border p-6 ${surfaceBorder} ${isDark ? 'bg-white/[0.05] text-white' : 'bg-white/18 text-[#11131b] backdrop-blur-3xl'}`}>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.type', 'Type')}</label>
        <select
          value={form.type}
          onChange={(e) => {
            const nextType = e.target.value;
            setField('type', nextType);
            setField('categoryId', '');
            setField('category', 'Uncategorized');
            setField('icon', nextType === 'income' ? '💰' : '💸');
          }}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
        >
          <option value="expense">{tt('recurring.expense', 'Expense')}</option>
          <option value="income">{tt('recurring.income', 'Income')}</option>
        </select>
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.category', 'Category')}</label>
        <CategorySelect
          type={form.type}
          value={form.categoryId}
          isDark={isDark}
          onChange={(id, name) => {
            setField('categoryId', id);
            setField('category', name || 'Uncategorized');
          }}
        />
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.source', 'Source')}</label>
        <input value={form.source} onChange={(e) => setField('source', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`} />
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.amount', 'Amount')}</label>
        <input type="number" min="0" value={form.amount} onChange={(e) => setField('amount', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`} />
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.icon', 'Icon')}</label>
        <div className={`rounded-2xl border px-4 py-3 ${inputClass}`}>
          <EmojiPickerPopup icon={form.icon} onSelect={(emoji) => setField('icon', emoji)} />
        </div>
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.frequency', 'Frequency')}</label>
        <select value={form.repeat} onChange={(e) => setField('repeat', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}>
          <option value="weekly">{tt('recurring.weekly', 'Weekly')}</option>
          <option value="monthly">{tt('recurring.monthly', 'Monthly')}</option>
          <option value="yearly">{tt('recurring.yearly', 'Yearly')}</option>
        </select>
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.dayOfMonth', 'Day of Month')}</label>
        <input type="number" min="1" max="31" value={form.dayOfMonth} onChange={(e) => setField('dayOfMonth', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`} />
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.startDate', 'Start Date')}</label>
        <input type="date" value={form.startDate} onChange={(e) => setField('startDate', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`} />
      </div>

      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.endDate', 'End Date')}</label>
        <input type="date" value={form.endDate} onChange={(e) => setField('endDate', e.target.value)} className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`} />
      </div>
    </div>

    <div>
      <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>{tt('recurring.notes', 'Notes')}</label>
      <textarea value={form.notes} onChange={(e) => setField('notes', e.target.value)} rows={3} className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`} />
    </div>

    <div className={`flex items-center justify-between border-t pt-5 ${surfaceBorder}`}>
      <label className={`inline-flex items-center gap-3 text-sm ${isDark ? 'text-[#d0d3e4]' : 'text-[#31374a]'}`}>
        <input type="checkbox" checked={form.isActive} onChange={(e) => setField('isActive', e.target.checked)} className="accent-lime-400" />
        {tt('recurring.activeRule', 'Active Rule')}
      </label>
      <button
        type="submit"
        disabled={saving}
        className={`rounded-2xl px-5 py-3 text-sm font-black ${saving ? 'cursor-not-allowed bg-white/10 text-[#7b8095]' : 'bg-[#d9ff34] text-black hover:bg-[#cbf029]'}`}
      >
        {saving
          ? tt('common.saving', 'Saving...')
          : editing?._id
            ? tt('recurring.saveChanges', 'Save Changes')
            : tt('recurring.createRule', 'Create Rule')}
      </button>
    </div>
  </form>
);

export default RecurringRuleModalForm;
