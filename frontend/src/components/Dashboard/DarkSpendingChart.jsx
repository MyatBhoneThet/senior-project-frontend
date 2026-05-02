import React, { useContext } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';

const CustomTooltip = ({ active, payload, isDark }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={`rounded-lg border p-3 shadow-xl backdrop-blur-xl ${isDark ? 'border-white/10 bg-white/[0.08]' : 'border-white/35 bg-white/45'}`}>
        <div className="flex items-center gap-2 text-sm font-bold">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          <span className={`capitalize ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{data.name}:</span>
          <span style={{ color: data.color }}>{data.value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const DarkSpendingChart = ({ data, format }) => {
  const { prefs } = useContext(UserContext) || {};
  const isDark = prefs?.theme === 'dark';
  const themeGreen = isDark ? '#a3e635' : '#84cc16';
  const COLORS = ['#8b5cf6', themeGreen, '#eab308', '#fb7185', '#38bdf8', '#f97316', '#22d3ee'];

  const chartData = Array.isArray(data) && data.length > 0 ? data : [];

  // Attach color to each item for tooltip
  const coloredData = chartData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length],
  }));

  const totalAmount = chartData.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalLabel = typeof format === 'function' ? format(totalAmount) : `$${totalAmount.toFixed(0)}`;
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';

  const { t } = useT();
  const tt = (k, f) => { const v = t?.(k); return v && v !== k ? v : f; };

  return (
    <div className={`h-[260px] w-full overflow-hidden rounded-[22px] border p-5 flex flex-col relative ${cardClass}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-[13px] font-medium tracking-[0.1em] ${isDark ? 'text-gray-100' : 'text-[#11131b]'}`}>{tt('dashboard.expenses', 'Expenses')}</h3>
        <span className={`text-[10px] tracking-widest ${isDark ? 'text-gray-500' : 'text-[#6b7080]'}`}>{tt('dashboard.byCategory', 'By category')}</span>
      </div>

      {coloredData.length === 0 ? (
        <div className={`flex flex-1 items-center justify-center text-[11px] font-medium tracking-widest ${isDark ? 'text-gray-500' : 'text-[#6b7080]'}`}>
          {tt('dashboard.noSpendingData', 'No spending data')}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between">
          <div className="h-full w-1/2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
              <Pie
                  data={coloredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {coloredData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`rounded-full text-lg font-medium tracking-tighter shadow-sm ${isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-[#11131b]'}`}>
                {totalLabel}
              </span>
            </div>
          </div>

          <div className={`max-h-[200px] w-1/2 overflow-y-auto pl-4 flex flex-col justify-center gap-3 scrollbar-thin ${isDark ? 'scrollbar-thumb-gray-700' : 'scrollbar-thumb-gray-300'}`}>
            {coloredData.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className={`max-w-[80px] truncate text-xs font-medium capitalize tracking-wide ${isDark ? 'text-gray-400' : 'text-[#5f6476]'}`}>{item.name}</span>
                </div>
                <span className="text-xs font-black tracking-widest" style={{ color: item.color }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkSpendingChart;
