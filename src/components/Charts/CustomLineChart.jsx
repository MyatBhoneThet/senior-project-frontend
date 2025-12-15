import React, { useContext, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserContext } from "../../context/UserContext";
import moment from "moment";

const cssVar = (name, fallback) => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  return (v || "").trim() || fallback;
};

const CustomLineChart = ({ data = [], currencySymbol = '฿' }) => {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === "dark";

  const COLORS = useMemo(() => {
    // Red color scheme for expenses using CSS variables
    const PRIMARY = cssVar("--color-rose-500", "#EF4444"); // Red-500
    const P500 = cssVar("--color-rose-600", "#DC2626");   // Red-600
    const P100 = cssVar("--color-rose-200", "#FECACA");   // Red-200
    return { PRIMARY, P500, P100 };
  }, []);

  const gridStroke = isDark ? "#3F3F46" : "#E5E7EB";
  const tickColor = isDark ? "#E5E7EB" : "#334155";

  // 🔹 Format date safely for x-axis
  const safeFormatDate = (entry) => {
    const rawDate = entry?.date || entry?.createdAt || entry?.transactionDate;
    if (!rawDate) return "";
    const parsed = moment(rawDate, [
      moment.ISO_8601,
      "YYYY-MM-DD",
      "YYYY/MM/DD",
      "DD-MM-YYYY",
      "D MMM YYYY",
      "MMM D, YYYY",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    ]);
    return parsed.isValid() ? parsed.format("MMM D") : "";
  };

  // 🔹 Custom tooltip with transaction title/source
  const CustomToolTip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0]?.payload || {};
      const transactionTitle = p.source || p.title || "Expense";
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-red-400 font-semibold text-sm mb-1">
            {transactionTitle}
          </p>
          <p className="text-gray-300 text-sm">
            Amount:{" "}
            <span className="text-white font-medium">
              {typeof p.amount === 'number' ? p.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }) : '0.00'}{currencySymbol}
            </span>
          </p>
          {p.category && p.category !== "Uncategorized" && (
            <p className="text-gray-300 text-sm mt-1">
              Category:{" "}
              <span className="text-white font-medium">{p.category}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // 🔹 Enhanced responsive config
  const getChartConfig = () => {
    const dataLength = data.length;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    
    let angle = 0;
    let textAnchor = "middle";
    let interval = 0;
    
    if (dataLength > 8) {
      angle = -45;
      textAnchor = "end";
      interval = "preserveStartEnd";
    } else if (dataLength > 4) {
      angle = -30;
      textAnchor = "end";
    }
    
    return {
      margin: { top: 15, right: 10, left: 5, bottom: 25 },
      xAxisHeight: 45,
      yAxisWidth: 45,
      tickFontSize: isMobile ? 10 : 12,
      angle,
      textAnchor,
      interval,
      tickMargin: 10
    };
  };

  const chartConfig = getChartConfig();

  const chartData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      _formattedDate: safeFormatDate(d),
    }));
  }, [data]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={chartConfig.margin}
        >
          <defs>
            <linearGradient id="areaPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.PRIMARY} stopOpacity={0.35} />
              <stop offset="95%" stopColor={COLORS.PRIMARY} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={gridStroke}
            strokeDasharray="2 2"
            vertical={false}
          />

          <XAxis
            dataKey="_formattedDate"
            tick={{
              fontSize: chartConfig.tickFontSize,
              fill: tickColor,
              fontWeight: 500,
            }}
            stroke="none"
            angle={chartConfig.angle}
            textAnchor={chartConfig.textAnchor}
            height={chartConfig.xAxisHeight}
            interval={chartConfig.interval}
            tickMargin={chartConfig.tickMargin}
            minTickGap={2}
          />

          <YAxis
            tick={{
              fontSize: chartConfig.tickFontSize,
              fill: tickColor,
              fontWeight: 500,
            }}
            stroke="none"
            width={chartConfig.yAxisWidth}
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value;
            }}
          />

          <Tooltip content={<CustomToolTip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke={COLORS.PRIMARY}
            fill="url(#areaPrimary)"
            strokeWidth={2}
            dot={{ 
              r: 3, 
              fill: COLORS.P500,
              stroke: isDark ? "#1F2937" : "#FFFFFF",
              strokeWidth: 1 
            }}
            activeDot={{ 
              r: 5,
              fill: COLORS.P500,
              stroke: isDark ? "#1F2937" : "#FFFFFF",
              strokeWidth: 2
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
