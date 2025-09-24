import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const CustomLegend = ({ payload }) => {
  const { prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === 'dark';

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4 space-x-6">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center space-x-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          ></div>
          <span
            className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CustomLegend;
