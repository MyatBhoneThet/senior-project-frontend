import React, { useEffect, useState, useContext } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  Label
} from 'recharts';
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';
import { UserContext } from '../../context/UserContext';

const CustomPieChart = ({ data, label, colors, totalAmount }) => {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';

  // Center label colors
  const centerLabelColor = isDark ? '#9CA3AF' : '#6B7280'; // gray-400 / gray-500
  const centerValueColor = isDark ? '#FFFFFF' : '#111827'; // white / slate-900

  // Background container color
  const containerBg = isDark ? 'bg-gray-900' : 'bg-white';

  // Adjust tooltip and legend for dark theme
  const tooltipBg = isDark ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300';

  return (
    <div className={`${containerBg} p-2 rounded-lg`}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={100}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}

            {/* Center label */}
            <Label value={label} position="center" fill={centerLabelColor} fontSize={14} dy={-20} />
            <Label value={totalAmount} position="center" fill={centerValueColor} fontSize={24} fontWeight={600} dy={10} />
          </Pie>

          <Tooltip
            content={(props) => (
              <div className={`shadow-md rounded-lg p-2 border ${tooltipBg}`}>
                <CustomTooltip {...props} />
              </div>
            )}
          />
          <Legend content={(props) => <CustomLegend {...props} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
