import React, { useState } from 'react';
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';
import CategorySelect from '../common/CategorySelect';

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    source: '',
    categoryId: '',
    categoryName: 'Uncategorized',
    amount: '',
    date: '',
    icon: '',
  });

  const setField = (k, v) => setExpense((p) => ({ ...p, [k]: v }));

  return (
    <div>
      <EmojiPickerPopup icon={expense.icon} onSelect={(e) => setField('icon', e)} />

      <Input
        value={expense.source}
        onChange={({ target }) => setField('source', target.value)}
        label="Expense Source"
        placeholder="KFC, Starbucks, Grab…"
        type="text"
      />

      <div className="mt-3">
        <label className="block mb-1 text-sm">Category</label>
        <CategorySelect
          type="expense"
          value={expense.categoryId}
          onChange={(id, name) => {
            setField('categoryId', id);
            setField('categoryName', name || 'Uncategorized');
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <Input
          value={expense.amount}
          onChange={({ target }) => setField('amount', target.value)}
          label="Amount"
          placeholder="0.00"
          type="number"
        />
        <Input
          value={expense.date}
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
          onClick={() => onAddExpense?.({ ...expense, amount: Number(expense.amount) })}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
