import React, { useEffect, useState, useContext } from 'react';
import CustomPieChart from '../Charts/CustomPieChart';
import { UserContext } from '../../context/UserContext'; // adjust path if needed
import useT from '../../hooks/useT';

// Currency symbol mapping
const currencySymbols = {
  USD: '$',
  THB: '฿',
  EUR: '€',
  MMK: 'Ks',
  GBP: '£',
};

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const { prefs } = useContext(UserContext); // Get selected currency
  const currencySymbol = currencySymbols[prefs?.currency] || '';
  const { t } = useT();

  // helper: translate with safe fallback if key missing
  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  const [chartData, setChartData] = useState([]);

  const prepareChartData = (data) => {
    const dataArr = data?.map((item) => ({
      // source is user-entered text; keep as-is, just append formatted amount
      name: `${item?.source} (${currencySymbol}${item?.amount})`,
      amount: item?.amount,
    })) || [];
    setChartData(dataArr);
  };

  useEffect(() => {
    prepareChartData(data);
    return () => {};
  }, [data, prefs?.currency]); // re-run if currency changes

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">{tt('dashboard.last60DaysIncome', 'Last 60 Days Income')}</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label={tt('dashboard.totalIncome', 'Total Income')}
        totalAmount={`${currencySymbol}${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomeWithChart;
