import React, { useEffect } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import useT from '../../hooks/useT';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  const { t, lang } = useT();

  // translate with safe fallback
  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  // Optional: localize month/day names in Moment based on selected language
  useEffect(() => {
    try {
      moment.locale(lang || 'en');
    } catch {
      moment.locale('en');
    }
  }, [lang]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-semibold">
          {tt('dashboard.recentTransactions', 'Recent Transactions')}
        </h5>

        <button className="card-btn" onClick={onSeeMore}>
          {tt('dashboard.seeMore', 'See More')} <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 3)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.type == 'expense' ? item.category : item.source}
            icon={item.icon}
            date={moment(item.date).format('Do MMM YYYY')}
            amount={item.amount}
            type={item.type}
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
