import React from 'react';

const ProfileHeaderActions = ({ sectionDivider, mutedText, saving, loading, isDark, tt, onSave }) => (
  <div className={`mb-6 flex flex-col gap-4 border-b pb-5 md:flex-row md:items-start md:justify-between ${sectionDivider}`}>
    <div>
      <h1 className="text-2xl font-black uppercase tracking-[0.18em]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
        {tt('menu.profile', 'PROFILE')}
      </h1>
      <p className={`mt-2 text-sm ${mutedText}`}>
        {tt('profile.subtitle', 'Personal details and account identity')}
      </p>
    </div>

    <button
      type="button"
      onClick={onSave}
      disabled={saving || loading}
      className={`rounded-2xl px-6 py-3 text-sm font-black ${
        saving || loading
          ? 'cursor-not-allowed bg-white/10 text-[#7b8095]'
          : isDark ? 'bg-[#d9ff34] text-black hover:bg-[#cbf029]' : 'bg-[#84cc16] text-white hover:bg-[#65a30d]'
      }`}
    >
      {saving ? tt('common.saving', 'Saving...') : tt('profile.save', 'Save Profile')}
    </button>
  </div>
);

export default ProfileHeaderActions;
