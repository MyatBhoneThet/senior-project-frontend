import React from 'react';

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className="
        flex gap-6 
        bg-white dark:bg-slate-800 
        p-6 rounded-2xl 
        shadow-md shadow-gray-100 dark:shadow-black/10  
        border border-gray-200/50 dark:border-white/10
      "
    >
      <div
        className={`
          w-14 h-14 flex items-center justify-center 
          text-[26px] text-white ${color} 
          rounded-full drop-shadow-xl shadow-lg 
          hover:scale-105 transition-transform duration-300
        `}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </h6>
        <span className="text-[22px] text-slate-900 dark:text-white">
          {value}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;
