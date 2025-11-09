import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const InfoCard = ({ icon, label, value, color }) => {
  const { prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';

  return (
    <div
      className={`
        flex gap-6 p-6 rounded-2xl shadow-sm border
        ${isDark 
          ? 'bg-gray-900 border-gray-700 text-gray-200' 
          : 'bg-white border-gray-200/50 text-gray-900'
        }
      `}
    >
      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          text-white text-[26px] drop-shadow-lg shadow-lg
          ${color}
          ${isDark ? 'opacity-90' : ''}
          transition-transform duration-300 hover:scale-105
        `}
      >
        {icon}
      </div>

      <div>
        <h6 className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </h6>

        <span className={`text-[22px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
