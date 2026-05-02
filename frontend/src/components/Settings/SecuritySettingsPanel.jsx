import React from 'react';

const SecuritySettingsPanel = ({
  isDark,
  cardClass,
  mutedText,
  labelText,
  inputClass,
  sectionDivider,
  currPwd,
  newPwd,
  confirmPwd,
  changingPwd,
  deleteConfirm,
  deleting,
  tt,
  setCurrPwd,
  setNewPwd,
  setConfirmPwd,
  setDeleteConfirm,
  onChangePassword,
  onDeleteAccount,
}) => (
<section className={`rounded-[24px] border p-6 ${cardClass}`}>
    <h2 className={`text-[17px] font-medium ${isDark ? 'text-white' : 'text-[#11131b]'}`}>{tt('settings.security', 'Security')}</h2>
    <p className={`mt-2 text-sm ${mutedText}`}>
      {tt('settings.securityDesc', 'Update your password and manage account safety.')}
    </p>

    <div className="mt-8 space-y-5">
      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>
          {tt('settings.pwd.current', 'Current Password')}
        </label>
        <input
          type="password"
          value={currPwd}
          onChange={(e) => setCurrPwd(e.target.value)}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
        />
      </div>
      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>
          {tt('settings.pwd.new', 'New Password')}
        </label>
        <input
          type="password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
        />
      </div>
      <div>
        <label className={`mb-2 block text-xs tracking-[0.18em] ${labelText}`}>
          {tt('settings.pwd.confirm', 'Confirm New Password')}
        </label>
        <input
          type="password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          className={`w-full rounded-2xl border px-4 py-3 outline-none ${inputClass}`}
        />
      </div>

      <button
        type="button"
        onClick={onChangePassword}
        disabled={changingPwd}
        className={`w-full rounded-2xl px-5 py-3 text-sm font-bold ${
          changingPwd
            ? 'cursor-not-allowed bg-white/10 text-[#7b8095]'
            : 'bg-[#d9ff34] text-black hover:bg-[#cbf029]'
        }`}
      >
        {changingPwd ? tt('settings.pwd.updating', 'Updating...') : tt('settings.pwd.change', 'Change Password')}
      </button>
    </div>

    <div className={`mt-8 border-t pt-8 ${sectionDivider}`}>
      <h3 className="text-[17px] font-medium text-[#fb7185]">{tt('settings.deleteTitle', 'Delete Account')}</h3>
      <p className={`mt-2 text-sm ${labelText}`}>
        {tt('settings.deleteDesc', 'This action is irreversible. Type DELETE to confirm.')}
      </p>
      <input
        type="text"
        value={deleteConfirm}
        onChange={(e) => setDeleteConfirm(e.target.value)}
        placeholder="Type DELETE"
        className={`mt-4 w-full rounded-2xl border px-4 py-3 outline-none ${
          isDark
            ? 'border-[#fb7185]/20 bg-[#25141a] text-white'
            : 'border-[#fb7185]/30 bg-[#fff1f4] text-[#6f1028]'
        }`}
      />
      <button
        type="button"
        onClick={onDeleteAccount}
        disabled={deleting}
        className={`mt-4 w-full rounded-2xl px-5 py-3 text-sm font-bold ${
          deleting
            ? 'cursor-not-allowed bg-white/10 text-[#7b8095]'
            : 'bg-[#fb7185] text-white hover:bg-[#f43f5e]'
        }`}
      >
        {deleting ? tt('settings.deleting', 'Deleting...') : tt('settings.deleteAccount', 'Delete Account')}
      </button>
    </div>
  </section>
);

export default SecuritySettingsPanel;
