import React, { useEffect } from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';
import useT from '../../hooks/useT';

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  const { t, lang } = useT();

  // Optional: localize Moment month/day names to match app language
  useEffect(() => {
    try {
      moment.locale(lang || 'en');
    } catch {
      moment.locale('en');
    }
  }, [lang]);

  // translate with fallback helper
  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold">
          {tt('dashboard.incomeSources', 'Income Sources')}
        </h5>

        <button className="card-btn" onClick={onDownload}>
          <LuDownload className="text-base" /> {tt('dashboard.download', 'Download')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {transactions?.map((income) => (
          <TransactionInfoCard
            key={income._id}
            title={income.source}
            icon={income.icon}
            date={moment(income.date).format('Do MMM YYYY')}
            amount={income.amount}      // keep raw number; card formats using prefs
            type="income"
            onDelete={() => onDelete(income._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeList;
