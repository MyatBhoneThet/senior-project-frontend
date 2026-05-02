import React from 'react';
import { LuWalletCards } from 'react-icons/lu';

const QuickActionsPanel = ({ quickActions, isDark, panelClass, labelText, mutedText, title, description }) => (
  <div className={`rounded-[24px] border p-6 ${panelClass}`}>
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className={`text-[13px] tracking-[0.1em] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{title}</h2>
        <p className={`mt-1 text-xs md:text-sm ${mutedText}`}>{description}</p>
      </div>
      <LuWalletCards className={`text-xl ${labelText}`} />
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {quickActions.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.title}
            type="button"
            onClick={item.action}
            className={`flex items-start gap-3 rounded-[20px] border p-4 text-left transition-all backdrop-blur-2xl ${
              isDark ? 'border-white/10 bg-white/[0.05] hover:bg-white/[0.08]' : 'border-white/28 bg-white/28 hover:bg-white/42'
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.bg}`}>
              <Icon className={`text-lg ${item.color}`} />
            </div>
            <div>
              <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{item.title}</div>
              <div className={`mt-1 text-xs md:text-sm ${mutedText}`}>{item.subtitle}</div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default QuickActionsPanel;
