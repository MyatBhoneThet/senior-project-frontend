import React, { useState } from 'react';
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';
import CategorySelect from '../common/CategorySelect';

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: '',
    categoryId: '',
    categoryName: 'Uncategorized',
    amount: '',
    date: '',
    icon: '',
  });

  const setField = (k, v) => setIncome((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <EmojiPickerPopup icon={income.icon} onSelect={(e) => setField('icon', e)} />

      <Input
        value={income.source}
        onChange={({ target }) => setField('source', target.value)}
        label="Income Source"
        placeholder="Salary, Freelance, Bonus…"
        type="text"
      />

      <div className="mt-3">
        <label className="block mb-1 text-sm">Category</label>
        <CategorySelect
          type="income"
          value={income.categoryId}
          onChange={(id, name) => {
            setField('categoryId', id);
            setField('categoryName', name || 'Uncategorized');
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <Input
          value={income.amount}
          onChange={({ target }) => setField('amount', target.value)}
          label="Amount"
          placeholder="0.00"
          type="number"
        />
        <Input
          value={income.date}
          onChange={({ target }) => setField('date', target.value)}
          label="Date"
          placeholder="YYYY-MM-DD"
          type="date"
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddIncome?.({ ...income, amount: Number(income.amount) })}
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
