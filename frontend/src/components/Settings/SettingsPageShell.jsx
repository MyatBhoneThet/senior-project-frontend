import React from 'react';

const SettingsPageShell = ({ isDark, pageClass, children }) => (
  <div className={`absolute inset-0 overflow-y-auto overflow-x-hidden ${pageClass}`}>
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`absolute -left-20 top-20 h-80 w-80 rounded-full blur-3xl ${isDark ? 'bg-[#d9ff34]/10' : 'bg-[#d9ff34]/18'}`} />
      <div className={`absolute right-6 top-40 h-96 w-96 rounded-full blur-3xl ${isDark ? 'bg-[#8b5cf6]/10' : 'bg-[#8b5cf6]/12'}`} />
      <div className={`absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full blur-3xl ${isDark ? 'bg-[#47d7ff]/8' : 'bg-white/50'}`} />
    </div>
    <div className="relative mx-auto max-w-[1320px] p-4 pt-4 md:p-5 md:pt-6">{children}</div>
  </div>
);

export default SettingsPageShell;
