import React from 'react';
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector';

const ProfilePhotoPanel = ({ isDark, cardClass, mutedText, subtleSurface, formData, user, tt, onUpload, onRemove }) => (
  <section className={`rounded-[24px] border p-6 ${cardClass}`}>
    <h2 className={`text-[20px] font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('profile.photo', 'Profile Photo')}</h2>
    <p className={`mt-2 text-sm ${mutedText}`}>
      {tt('profile.photoDesc', 'Upload a clear identity photo for your account.')}
    </p>

    <div className="mt-6">
      <ProfilePhotoSelector
        photo={formData.profilePhoto}
        onUpload={onUpload}
        onRemove={onRemove}
      />
    </div>

    <div className={`mt-6 rounded-2xl border p-5 ${subtleSurface}`}>
      <div className={`text-[11px] uppercase tracking-[0.22em] ${mutedText}`}>
        {tt('profile.accountEmail', 'Account Email')}
      </div>
      <div className={`mt-2 text-lg font-semibold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>
        {formData.email || user?.email || '—'}
      </div>
    </div>
  </section>
);

export default ProfilePhotoPanel;
