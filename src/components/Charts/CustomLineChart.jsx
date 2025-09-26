import React, { useContext, useMemo } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { UserContext } from '../../context/UserContext';

const CustomLineChart = ({ data = [] }) => {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';

  // Fixed to RED palette
  const colors = useMemo(() => {
    return {
      PRIMARY: '#DC2626', // red-600
      P300: '#FCA5A5',   // red-300
      P100: '#FEE2E2',   // red-100
    };
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0]?.payload || {};
      return (
        <div
          className={`shadow-md rounded-lg p-2 border ${
            isDark
              ? 'bg-gray-800 border-gray-600 text-gray-200'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <p
            className={`text-xs font-semibold mb-1 ${
              isDark ? 'text-red-300' : 'text-red-800'
            }`}
          >
            {p.category ?? p.month}
          </p>
          <p className="text-sm">
            Amount:{' '}
            <span className="text-sm font-medium">{p.amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const gridStroke = isDark ? '#3F3F46' : colors.P100;
  const tickColor = isDark ? '#E5E7EB' : '#334155';

  return (
    <div
      className={
        isDark
          ? 'bg-gray-900 rounded-lg p-2'
          : 'bg-white rounded-lg p-2'
      }
    >
      <ResponsiveContainer width="100%" height={190}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaPrimaryRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.PRIMARY} stopOpacity={0.35} />
              <stop offset="95%" stopColor={colors.PRIMARY} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: tickColor }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: tickColor }}
            stroke="none"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={colors.PRIMARY}
            fill="url(#areaPrimaryRed)"
            strokeWidth={3}
            dot={{ r: 3, fill: colors.P300 }}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
