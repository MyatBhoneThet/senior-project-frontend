import React, { useEffect, useContext } from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';
import useT from '../../hooks/useT';
import { UserContext } from '../../context/UserContext';

function titleFrom(tx) {
  const category = tx.categoryName || tx.category || 'Uncategorized';
  const src = (tx.source || '').trim();
  return src ? `${src} (${category})` : category;
}

const IncomeList = ({ transactions = [], onDelete, onDownload, onEdit }) => {
  const { t, lang } = useT();
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';
  useEffect(() => {}, [lang]);
  const tt = (k, d) => (t?.(k) || d);

  return (
    <div className={`p-4 mt-6 rounded-lg border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-200/50 text-gray-900'}`}>
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg font-semibold">
          {tt('income.incomeSources', 'Income Sources')}
        </h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> {tt('income.download', 'Download')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {transactions.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={titleFrom(income)}
            icon={income.icon}
            date={income.date ? moment(income.date).format('Do MMM YYYY') : ''}
            amount={Number(income.amount)}   // ensure number
            type="income"
            onDelete={() => onDelete?.(income._id)}
            onEdit={() => onEdit?.(income)}
          />
        ))}

        {transactions.length === 0 && (
          <div className="text-slate-500 text-sm py-3">{tt("income.noData", "No income yet")}.</div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
