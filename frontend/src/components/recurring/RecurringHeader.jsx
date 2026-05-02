import React from 'react';

const RecurringHeader = ({ mutedText, sectionDivider, title, subtitle }) => (
  <div className={`mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between ${sectionDivider}`}>
    <div>
      <h1 className="text-2xl font-black tracking-[0.18em]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        {title}
      </h1>
      <p className={`mt-2 text-sm ${mutedText}`}>{subtitle}</p>
    </div>
  </div>
);

export default RecurringHeader;
