import React, { useContext } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { UserContext } from '../../context/UserContext';

const CustomLineChart = ({ data }) => {
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`shadow-md rounded-lg p-2 border ${
            isDarkTheme
              ? 'bg-gray-800 border-gray-600 text-gray-200'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <p className="text-xs font-semibold text-purple-400 mb-1">{payload[0].payload.category}</p>
          <p className="text-sm">
            Amount: <span className="text-sm font-medium">{payload[0].payload.amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={isDarkTheme ? 'bg-gray-900 rounded-lg p-2' : 'bg-white rounded-lg p-2'}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={isDarkTheme ? '#444' : 'none'}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: isDarkTheme ? '#ccc' : '#555' }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: isDarkTheme ? '#ccc' : '#555' }}
            stroke="none"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#875cf5"
            fill="url(#incomeGradient)"
            strokeWidth={3}
            dot={{ r: 3, fill: '#ab8df8' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
