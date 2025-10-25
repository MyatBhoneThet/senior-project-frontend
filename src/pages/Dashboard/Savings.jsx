import React, { useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import JarList from '../../components/savings/JarList';
import GoalList from '../../components/savings/GoalList';

export default function SavingsPage() {
  const [tab, setTab] = useState('goals');

  return (
    <DashboardLayout activeMenu="Savings">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('goals')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === 'goals'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Goals
          </button>
          <button
            onClick={() => setTab('jars')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === 'jars'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200'
            }`}
          >
            Jars
          </button>

          <div className="ml-auto hidden md:flex gap-6 text-xs text-gray-500 dark:text-gray-400 items-center">
            <div>
              <b>Jar</b>: sub-wallet of reserved money. Fund/Withdraw doesn’t change past income/expenses.
            </div>
            <div>
              <b>Goal</b>: target amount + date, linked to a jar. Auto-allocate can move a % or fixed THB from each income.
            </div>
          </div>
        </div>

        {tab === 'goals' ? <GoalList /> : <JarList />}
      </div>
    </DashboardLayout>
  );
}
