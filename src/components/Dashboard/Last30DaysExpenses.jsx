import React from 'react';
import { useEffect, useState } from 'react';
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';
import useT from '../../hooks/useT';

const Last30DaysExpenses = ({ date }) => {
  const [chartData, setChartData] = useState([]);
  const { t } = useT();

  // safe translate with fallback
  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  useEffect(() => {
    const result = prepareExpenseBarChartData(date);
    setChartData(result);
    return () => {};
  }, [date]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">
          {tt('dashboard.last30DaysExpenses', 'Last 30 Days Expenses')}
        </h5>
      </div>

      <CustomBarChart data={chartData} />
    </div>
  );
};

export default Last30DaysExpenses;
