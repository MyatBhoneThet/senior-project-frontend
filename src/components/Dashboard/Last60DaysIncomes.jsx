import React, { useEffect, useState, useContext } from 'react';
import CustomPieChart from '../Charts/CustomPieChart';
import { UserContext } from '../../context/UserContext'; 
import useT from '../../hooks/useT';
import { useCurrency } from '../../context/CurrencyContext';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const Last60DaysIncomes = ({ data, totalIncome, isDark }) => {
  const { prefs } = useContext(UserContext);
  const { format } = useCurrency();
  const { t } = useT();

  const tt = (key, fallback) => {
    const s = t(key);
    return s && s !== key ? s : fallback;
  };

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      const dataArr = data.map(item => ({
        name: `${item?.source} (${format(item?.amount)})`,
        amount: item?.amount,
      }));
      setChartData(dataArr);
    } else {
      setChartData([]);
    }
  }, [data, prefs?.currency, format]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="card flex items-center justify-center h-48">
        <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="mb-3">
            <svg
              className={`w-12 h-12 mx-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-sm">{tt('dashboard.noFinanceData', 'No financial data available.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-lg">{tt('dashboard.last60DaysIncomes', 'Last 60 Days Incomes')}</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label={tt('dashboard.totalIncome', 'Total Income')}
        totalAmount={format(totalIncome)}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default Last60DaysIncomes;
