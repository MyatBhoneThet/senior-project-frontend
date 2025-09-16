import React from 'react';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import { LuArrowRight } from 'react-icons/lu';
import moment from 'moment';
import useT from '../../hooks/useT';

const RecentIncome = ({ transactions, onSeeMore }) => {
  const { t } = useT();

  // translate with fallback if key missing
  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">{tt('dashboard.income', 'Income')}</h5>

        <button className="card-btn" onClick={onSeeMore}>
          {tt('dashboard.seeMore', 'See More')} <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 3)?.map((item) => (
          <TransactionInfoCard
            key={item._id}
            title={item.source}
            icon={item.icon}
            date={moment(item.date).format('Do MMM YYYY')}
            amount={item.amount}
            type="income"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default RecentIncome;
