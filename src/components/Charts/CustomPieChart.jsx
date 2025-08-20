import React, { useEffect, useState } from 'react';
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

const CustomPieChart = ({
  data,
  label,
  colors,
  totalAmount,
}) => {
  // Track whether the document is in dark mode (Tailwind uses .dark on <html>)
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains('dark'));

    // Observe class changes on <html> so we react to theme toggles
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });

    // In case something toggled before observer attached
    update();

    return () => observer.disconnect();
  }, []);

  // Choose colors based on theme
  // (Tailwind-ish equivalents: label ~ text-gray-500 / gray-400, value ~ slate-900 / white)
  const centerLabelColor = isDark ? '#9CA3AF' : '#6B7280';  // gray-400 / gray-500
  const centerValueColor = isDark ? '#FFFFFF' : '#111827';  // white / slate-900

  return (
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

          {/* Center label (small) */}
          <Label
            value={label}
            position="center"
            fill={centerLabelColor}
            fontSize={14}
            dy={-20}
          />

          {/* Center value (large) */}
          <Label
            value={totalAmount}
            position="center"
            fill={centerValueColor}
            fontSize={24}
            fontWeight={600}
            dy={10}
          />
        </Pie>

        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
