import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserContext } from '../../context/UserContext';

const CustomBarChart = ({ data }) => {
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';

  // Function to alternate bar colors based on theme
  const getBarColor = (index) => {
    if (isDarkTheme) {
      return index % 2 === 0 ? '#875cf5' : '#cfbefb';
    } else {
      return index % 2 === 0 ? '#875cf5' : '#cfbefb';
    }
  };

  // Custom tooltip adapted to dark/light mode
  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`shadow-md rounded-lg p-2 border ${
            isDarkTheme ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <p className={`text-xs font-semibold mb-1 ${isDarkTheme ? 'text-purple-400' : 'text-purple-800'}`}>
            {payload[0].payload.category}
          </p>
          <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Amount: <span className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              ${payload[0].payload.amount}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={isDarkTheme ? 'bg-gray-900 mt-6 p-4 rounded-lg' : 'bg-white mt-6 p-4 rounded-lg'}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid stroke={isDarkTheme ? '#444' : 'none'} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: isDarkTheme ? '#ccc' : '#555' }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: isDarkTheme ? '#ccc' : '#555' }} stroke="none" />
          <Tooltip content={CustomToolTip} />
          <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
