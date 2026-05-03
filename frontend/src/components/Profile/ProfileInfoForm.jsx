import React from 'react';
import { SkeletonBlock } from '../Dashboard/DashboardSkeleton';

const FieldSkeleton = ({ isDark, wide = false }) => (
  <div className={wide ? 'md:col-span-2' : ''}>
    <SkeletonBlock isDark={isDark} className="h-3 w-28 rounded" />
    <SkeletonBlock isDark={isDark} className="mt-3 h-12 w-full rounded-2xl" />
  </div>
);

const ProfileInfoForm = ({ isDark, cardClass, mutedText, labelText, inputClass, formData, user, tt, onSubmit, setField, loading = false }) => (
  <form onSubmit={onSubmit} className={`rounded-[24px] border p-6 ${cardClass}`}>
    <h2 className={`text-[20px] font-bold ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('profile.personalInfo', 'Personal Information')}</h2>
    <p className={`mt-2 text-sm ${mutedText}`}>
      {tt('profile.personalInfoDesc', 'Manage the public and personal fields attached to your account.')}
    </p>

    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {loading ? (
        <>
          <FieldSkeleton isDark={isDark} wide />
          <FieldSkeleton isDark={isDark} />
          <FieldSkeleton isDark={isDark} />
          <div className="md:col-span-2">
            <SkeletonBlock isDark={isDark} className="h-3 w-20 rounded" />
            <SkeletonBlock isDark={isDark} className="mt-3 h-28 w-full rounded-2xl" />
          </div>
          <FieldSkeleton isDark={isDark} />
          <FieldSkeleton isDark={isDark} />
        </>
      ) : (
      <>
      <div className="md:col-span-2">
        <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${labelText}`}>
          {tt('profile.fullName', 'Full Name')}
        </label>
        <input
          value={formData.name || formData.fullName || ''}
          onChange={(e) => setField('name', e.target.value)}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
          placeholder={tt('profile.namePlaceholder', 'Enter your name')}
        />
      </div>

      <div>
        <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${labelText}`}>
          {tt('profile.username', 'Username')}
        </label>
        <input
          value={formData.username || ''}
          onChange={(e) => setField('username', e.target.value)}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
          placeholder={tt('profile.usernamePlaceholder', 'Enter your username')}
        />
      </div>

      <div>
        <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${labelText}`}>
          {tt('profile.age', 'Age')}
        </label>
        <input
          type="number"
          value={formData.age || ''}
          onChange={(e) => setField('age', e.target.value)}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
          placeholder={tt('profile.agePlaceholder', 'Your age')}
        />
      </div>

      <div className="md:col-span-2">
        <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${labelText}`}>
          {tt('profile.bio', 'Bio')}
        </label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => setField('bio', e.target.value)}
          rows={4}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
          placeholder={tt('profile.bioPlaceholder', 'Short bio about yourself')}
        />
      </div>

      <div>
        <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${labelText}`}>
          {tt('profile.gender', 'Gender')}
        </label>
        <select
          value={formData.gender || 'Prefer not to say'}
          onChange={(e) => setField('gender', e.target.value)}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
        >
          <option value="male">{tt('profile.genders.male', 'Male')}</option>
          <option value="female">{tt('profile.genders.female', 'Female')}</option>
          <option value="other">{tt('profile.genders.other', 'Other')}</option>
          <option value="prefer_not_to_say">{tt('profile.genders.none', 'Prefer not to say')}</option>
        </select>
      </div>

      <div>
        <label className={`mb-2 block text-xs font-semibold uppercase tracking-[0.18em] ${labelText}`}>
          {tt('profile.email', 'Email')}
        </label>
        <input
          value={formData.email || user?.email || ''}
          readOnly
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${isDark ? 'border-white/10 bg-white/[0.03] text-[#7b8095]' : 'border-black/10 bg-[rgba(17,19,27,0.03)] text-[#6b7080]'}`}
        />
      </div>
      </>
      )}
    </div>
  </form>
);

export default ProfileInfoForm;
