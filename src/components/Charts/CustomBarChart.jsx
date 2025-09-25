import React, { useContext, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserContext } from '../../context/UserContext';

const cssVar = (name, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return (v || '').trim() || fallback;
};

const CustomBarChart = ({ data = [] }) => {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';

  const COLORS = useMemo(() => {
    const PRIMARY = cssVar('--color-primary', '#16A34A');      // green-600
    const P500    = cssVar('--color-primary-500', '#22C55E');  // green-500
    const P200    = cssVar('--color-primary-200', '#BBF7D0');  // green-200
    // Alternate two tones for readability
    return [PRIMARY, P500, PRIMARY, P500, PRIMARY, P500, PRIMARY, P500];
  }, []);

  const gridStroke = isDark ? '#3F3F46' : cssVar('--color-primary-100', '#DCFCE7');
  const tickColor  = isDark ? '#E5E7EB' : '#334155';

  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0]?.payload || {};
      return (
        <div className={`shadow-md rounded-lg p-2 border ${isDark ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}>
          <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-green-300' : 'text-green-800'}`}>{p.category ?? p.month}</p>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Amount: <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>${p.amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={isDark ? 'bg-gray-900 mt-6 p-4 rounded-lg' : 'bg-white mt-6 p-4 rounded-lg'}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke="none" />
          <Tooltip content={<CustomToolTip />} />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
