import React, { useContext, useState } from 'react';
import Input from '../Inputs/Input';
import EmojiPickerPopup from '../layouts/EmojiPickerPopup';
import CategorySelect from '../common/CategorySelect';
import { UserContext } from '../../context/UserContext';

const AddExpenseForm = ({ onAddExpense }) => {
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';
  
  const [expense, setExpense] = useState({
    source: '',
    categoryId: '',
    categoryName: 'Uncategorized',
    amount: '',
    date: '',
    icon: '💳',
  });

  const setField = (k, v) => setExpense((p) => ({ ...p, [k]: v }));

  const handleEmojiSelect = (emoji) => {
    setField('icon', emoji);
    // Force close by triggering a re-render or use component's internal close mechanism
  };

  const handleAddExpense = () => {
    if (!expense.source || !expense.amount || !expense.date) {
      return;
    }
    
    onAddExpense?.({ 
      ...expense, 
      amount: parseFloat(expense.amount) || 0 
    });
    
    // Reset form after successful addition
    setExpense({
      source: '',
      categoryId: '',
      categoryName: 'Uncategorized',
      amount: '',
      date: '',
      icon: '💳',
    });
  };

  const isFormValid = expense.source && expense.amount && expense.date;

  return (
    <div className={`relative overflow-hidden ${
      isDarkTheme 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-white via-red-50 to-pink-50'
    } rounded-2xl shadow-2xl border ${
      isDarkTheme ? 'border-gray-700/50' : 'border-white/20'
    }`}>
      
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full ${
          isDarkTheme ? 'bg-red-600/10' : 'bg-red-200/30'
        } blur-3xl`}></div>
        <div className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full ${
          isDarkTheme ? 'bg-pink-600/10' : 'bg-pink-200/30'
        } blur-3xl`}></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
            isDarkTheme 
              ? 'bg-gradient-to-r from-white-600 to-white-600' 
              : 'bg-gradient-to-r from-white-500 to-white-500' 
          } shadow-lg`}>
            <span className="text-lg">💸</span>
          </div>
          <h2 className={`text-xl font-bold mb-1 ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>
            Add New Expense
          </h2>
          <p className={`text-xs ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Track your spending and manage your budget
          </p>
        </div>

        <div className="space-y-4">
          {/* Icon Selection */}
          <div className="group">
            <label className={`block text-xs font-semibold mb-2 ${
              isDarkTheme ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Icon
            </label>
            <div className="flex justify-center">
              <EmojiPickerPopup
                icon={expense.icon}
                onSelect={handleEmojiSelect}
                isDark={isDarkTheme}
              />
            </div>
          </div>

          {/* Expense Source */}
          <div className="group">
            <label className={`block text-xs font-semibold mb-2 ${
              isDarkTheme ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Expense Source <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                value={expense.source}
                onChange={({ target }) => setField('source', target.value)}
                placeholder="e.g., KFC, Starbucks, Grab, Shopping..."
                type="text"
                className={`w-full px-3 py-3 rounded-lg text-sm border-2 transition-all duration-200 ${
                  isDarkTheme
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:bg-gray-800/80'
                    : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:bg-white'
                } focus:outline-none focus:ring-2 focus:ring-red-500/20 backdrop-blur-sm`}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="group">
            <label className={`block text-xs font-semibold mb-2 ${
              isDarkTheme ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Category
            </label>
            <div className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              isDarkTheme
                ? 'bg-gray-800/50 border-gray-600 backdrop-blur-sm'
                : 'bg-white/80 border-gray-200 backdrop-blur-sm'
            }`}>
              <CategorySelect
                type="expense"
                value={expense.categoryId}
                isDark={isDarkTheme}
                onChange={(id, name) => {
                  setField('categoryId', id);
                  setField('categoryName', name || 'Uncategorized');
                }}
              />
            </div>
          </div>

          {/* Amount and Date Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div className="group">
              <label className={`block text-xs font-semibold mb-2 ${
                isDarkTheme ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className={`absolute left-3 top-3 flex items-center pointer-events-none ${
                  isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span className="text-sm font-semibold">$</span>
                </div>
                <input
                  value={expense.amount}
                  onChange={({ target }) => setField('amount', target.value)}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-3 py-3 rounded-lg text-sm border-2 transition-all duration-200 ${
                    isDarkTheme
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:bg-gray-800/80'
                      : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-orange-500/20 backdrop-blur-sm`}
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="group">
              <label className={`block text-xs font-semibold mb-2 ${
                isDarkTheme ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  value={expense.date}
                  onChange={({ target }) => setField('date', target.value)}
                  type="date"
                  className={`w-full px-3 py-3 rounded-lg text-sm border-2 transition-all duration-200 ${
                    isDarkTheme
                      ? 'bg-gray-800/50 border-gray-600 text-white focus:border-red-500 focus:bg-gray-800/80'
                      : 'bg-white/80 border-gray-200 text-gray-900 focus:border-red-500 focus:bg-white'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20 backdrop-blur-sm`}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 pt-4 border-t border-opacity-20 border-gray-300">
          <button
            type="button"
            onClick={handleAddExpense}
            disabled={!isFormValid}
            className={`group relative w-full overflow-hidden rounded-xl px-6 py-3 font-bold text-white transition-all duration-300 ${
              isFormValid
                ? isDarkTheme
                  ? 'bg-gradient-to-r from-red-600 to-indigo-600 hover:from-blue-700 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-red-600 to-indigo-600 hover:from-blue-700 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gray-400 cursor-not-allowed opacity-60'
            } focus:outline-none focus:ring-4 focus:ring-red-500/20`}
          >
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span className="text-lg">💳</span>
              <span className="text-sm">Add Expense</span>
              <span className="text-lg">📊</span>
            </div>
          </button>
        </div>

        {/* Form validation hint */}
        {!isFormValid && (
          <div className={`mt-3 text-center text-xs ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Please fill in all required fields to continue
          </div>
        )}
      </div>
    </div>
  );
};

export default AddExpenseForm;
