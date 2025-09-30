import React, { useContext, useEffect, useState } from 'react';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';
import CategorySelect from '../common/CategorySelect';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import { useCurrency } from '../../context/CurrencyContext';

const AddIncomeForm = ({ onAddIncome, onUpdateIncome, mode = 'add', initial = null }) => {
  const { t } = useT();
  const tt = (key, fallback) => { const v = t?.(key); return v && v !== key ? v : fallback; };
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';
  const { format } = useCurrency();

  const [income, setIncome] = useState({ source: '', categoryId: '', categoryName: 'Uncategorized', amount: '', date: '', icon: '💰' });

  useEffect(() => {
    if (mode === 'edit' && initial) {
      setIncome({
        source: initial.source || '',
        categoryId: initial.categoryId || '',
        categoryName: initial.categoryName || initial.category || 'Uncategorized',
        amount: initial.amount ?? '',
        date: initial.date ? String(initial.date).slice(0, 10) : '',
        icon: initial.icon || '💰',
      });
    }
  }, [mode, initial]);

  const setField = (k, v) => setIncome((p) => ({ ...p, [k]: v }));
  const handleEmojiSelect = (emoji) => setField('icon', emoji);

  const handleAddIncome = () => {
    if (!income.source || !income.amount || !income.date) return;
    const payload = { ...income, amount: parseFloat(income.amount) || 0 };
    if (mode === 'edit') onUpdateIncome?.(payload); else onAddIncome?.(payload);
    setIncome({ source: '', categoryId: '', categoryName: 'Uncategorized', amount: '', date: '', icon: '💰' });
  };

  const isFormValid = income.source && income.amount && income.date;

  return (
    <div className={`relative overflow-hidden ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-green-50 to-emerald-50'} rounded-2xl shadow-2xl border ${isDarkTheme ? 'border-gray-700/50' : 'border-white/20'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`${isDarkTheme ? 'bg-blue-600/10' : 'bg-green-200/30'} absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl`} />
        <div className={`${isDarkTheme ? 'bg-emerald-600/10' : 'bg-emerald-200/30'} absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl`} />
      </div>

      <div className="relative p-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 shadow-lg ${isDarkTheme ? 'bg-white/10' : 'bg-white/60'}`}><span className="text-lg">💸</span></div>
          <h2 className={`text-xl font-bold mb-1 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{mode === 'edit' ? tt('income.editIncome', 'Edit Income') : tt('income.addNewIncome', 'Add New Income')}</h2>
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>{tt('income.trackMessage', 'Track your earnings and build your financial future')}</p>
        </div>

        <div className="space-y-4">
          <div className="group">
            <label className={`block text-xs font-semibold mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>{tt('income.icon', 'Icon')}</label>
            <div className="flex justify-center"><EmojiPickerPopup icon={income.icon} onSelect={handleEmojiSelect} isDark={isDarkTheme} /></div>
          </div>

          <div className="group">
            <label className={`block text-xs font-semibold mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>{tt('income.incomeSource', 'Income Source')} <span className="text-red-500">*</span></label>
            <input value={income.source} onChange={(e) => setField('source', e.target.value)} placeholder="e.g., Salary, Freelance..." type="text"
              className={`w-full px-3 py-3 rounded-lg text-sm border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:bg-gray-800/80' : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-green-500/20 backdrop-blur-sm`} required />
          </div>

          <div className="group">
            <label className={`block text-xs font-semibold mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>{tt('income.category', 'Category')}</label>
            <div className={`${isDarkTheme ? 'p-3 rounded-lg border-2 bg-gray-800/50 border-gray-600 backdrop-blur-sm [&_*]:text-gray-100 [&_*]:placeholder-gray-400 [&_input]:bg-gray-900/60 [&_input]:border-gray-600 [&_select]:bg-gray-900/60 [&_select]:border-gray-600 [&_textarea]:bg-gray-900/60 [&_textarea]:border-gray-600 [&_button]:text-white' : 'p-3 rounded-lg border-2 bg-white/80 border-gray-200 backdrop-blur-sm [&_*]:text-gray-900 [&_*]:placeholder-gray-500'}`}>
              <CategorySelect type="income" value={income.categoryId} isDark={isDarkTheme}
                onChange={(id, name) => { setField('categoryId', id); setField('categoryName', name || 'Uncategorized'); }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className={`block text-xs font-semibold mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>{tt('income.amount', 'Amount')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <div className={`absolute left-3 top-3 pointer-events-none ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}><span className="text-sm font-semibold">฿</span></div>
                <input value={income.amount} onChange={(e) => setField('amount', e.target.value)} placeholder="0.00" type="number" step="0.01" min="0"
                  className={`w-full pl-8 pr-3 py-3 rounded-lg text-sm border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:bg-gray-800/80' : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-green-500/20 backdrop-blur-sm`} required />
              </div>
              {!!income.amount && (
                <div className={`mt-1 text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  ≈ {format(Number(income.amount))} (today’s rate)
                </div>
              )}
            </div>

            <div className="group">
              <label className={`block text-xs font-semibold mb-2 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>{tt('income.date', 'Date')} <span className="text-red-500">*</span></label>
              <input value={income.date} onChange={(e) => setField('date', e.target.value)} type="date"
                className={`w-full px-3 py-3 rounded-lg text-sm border-2 transition-all duration-200 ${isDarkTheme ? 'bg-gray-800/50 border-gray-600 text-white focus:border-green-500 focus:bg-gray-800/80' : 'bg-white/80 border-gray-200 text-gray-900 focus:border-green-500 focus:bg-white'} focus:outline-none focus:ring-2 focus:ring-green-500/20 backdrop-blur-sm`} required />
            </div>
          </div>

          <div className="mt-6 pt-4">
            <button type="button" onClick={handleAddIncome} disabled={!isFormValid}
              className={`group relative w-full overflow-hidden rounded-xl px-6 py-3 font-bold text-white transition-all duration-300 ${isFormValid ? (isDarkTheme ? 'bg-gradient-to-r from-green-600 to-indigo-600 hover:from-indigo-700 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' : 'bg-gradient-to-r from-green-500 to-indigo-500 hover:from-indigo-600 hover:to-green-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5') : 'bg-gray-400 cursor-not-allowed opacity-60'} focus:outline-none focus:ring-4 focus:ring-green-500/20`}>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              <div className="relative flex items-center justify-center space-x-2">
                <span className="text-lg">✨</span>
                <span className="text-sm">{mode === 'edit' ? tt('income.updateIncome', 'Update Income') : tt('income.addIncome', 'Add Income')}</span>
                <span className="text-lg">💰</span>
              </div>
            </button>
          </div>

          {!isFormValid && <div className={`text-center text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{tt('income.fillRequired', 'Date')}</div>}
        </div>
      </div>
    </div>
  );
};

export default AddIncomeForm;
