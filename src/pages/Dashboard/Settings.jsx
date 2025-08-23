// // import React, { useContext, useEffect, useState } from 'react';
// // import { toast } from 'react-hot-toast';
// // import { useNavigate } from 'react-router-dom';
// // import axiosInstance from '../../utils/axiosInstance';
// // import { API_PATHS } from '../../utils/apiPaths';
// // import { UserContext } from '../../context/UserContext';
// // import useT from '../../hooks/useT';

// // const DEFAULTS = {
// //   currency: 'THB',
// //   theme: 'light',
// //   weekStartsOn: 'Mon',
// //   language: 'en',
// // };

// // export default function Settings() {
// //   const { t } = useT();
// //   const { prefs, updatePrefs } = useContext(UserContext);

// //   const [settings, setSettings] = useState(DEFAULTS);
// //   const [savingPrefs, setSavingPrefs] = useState(false);

// //   const [currPwd, setCurrPwd] = useState('');
// //   const [newPwd, setNewPwd] = useState('');
// //   const [confirmPwd, setConfirmPwd] = useState('');
// //   const [changingPwd, setChangingPwd] = useState(false);

// //   const [deleteConfirm, setDeleteConfirm] = useState('');
// //   const [deleting, setDeleting] = useState(false);

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     setSettings((s) => ({ ...s, ...prefs }));
// //   }, [prefs]);

// //   const update = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

// //   const savePreferences = async () => {
// //     try {
// //       setSavingPrefs(true);
// //       // Instant UI change via context
// //       updatePrefs(settings);
// //       // Persist on backend (optional)
// //       await axiosInstance.put(API_PATHS.USER.UPDATE_PREFS, {
// //         currency: settings.currency,
// //         theme: settings.theme,
// //         weekStartsOn: settings.weekStartsOn,
// //         language: settings.language,
// //       });
// //       toast.success('Preferences saved');
// //     } catch (err) {
// //       toast.error(err?.response?.data?.message || 'Could not save preferences');
// //     } finally {
// //       setSavingPrefs(false);
// //     }
// //   };

// //   const resetPreferences = () => {
// //     setSettings(DEFAULTS);
// //     updatePrefs(DEFAULTS);
// //     toast.success('Restored defaults');
// //   };

// //   const handleChangePassword = async (e) => {
// //     e.preventDefault();
// //     if (!newPwd || !confirmPwd) return toast.error('Please enter a new password and confirm it.');
// //     if (newPwd.length < 8) return toast.error('New password must be at least 8 characters.');
// //     if (newPwd !== confirmPwd) return toast.error('New passwords do not match.');

// //     try {
// //       setChangingPwd(true);
// //       await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
// //         currentPassword: currPwd,
// //         newPassword: newPwd,
// //       });
// //       setCurrPwd(''); setNewPwd(''); setConfirmPwd('');
// //       toast.success('Password updated. Please log in again.');
// //       localStorage.removeItem('token');
// //       navigate('/login');
// //     } catch (err) {
// //       toast.error(err?.response?.data?.message || 'Could not change password');
// //     } finally {
// //       setChangingPwd(false);
// //     }
// //   };

// //   const handleDeleteAccount = async () => {
// //     if (deleteConfirm !== 'DELETE') return toast.error('Type DELETE to confirm');
// //     try {
// //       setDeleting(true);
// //       await axiosInstance.delete(API_PATHS.USER.DELETE_ME);
// //       toast.success('Account deleted');
// //       localStorage.removeItem('token');
// //       navigate('/login');
// //     } catch (err) {
// //       toast.error(err?.response?.data?.message || 'Could not delete account');
// //     } finally {
// //       setDeleting(false);
// //     }
// //   };

// //   return (
// //     <div className="space-y-8">
// //       <div>
// //         <h1 className="text-xl font-semibold mb-1">{t('settings.title')}</h1>
// //         <p className="text-slate-600 dark:text-slate-300 text-sm">
// //           Customize your app preferences and account.
// //         </p>
// //       </div>

// //       {/* Preferences */}
// //       <section className="card">
// //         <h2 className="text-base font-medium mb-4">Preferences</h2>

// //         {/* Theme */}
// //         <div className="mb-4">
// //           <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
// //             {t('settings.theme')}
// //           </label>
// //           <div className="flex gap-3">
// //             {['light', 'dark'].map((opt) => (
// //               <label key={opt} className="flex items-center gap-2 text-sm">
// //                 <input
// //                   type="radio"
// //                   name="theme"
// //                   value={opt}
// //                   checked={settings.theme === opt}
// //                   onChange={() => update('theme', opt)}
// //                 />
// //                 <span className="capitalize">{opt}</span>
// //               </label>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Language */}
// //         <div className="mb-4">
// //           <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
// //             {t('settings.language')}
// //           </label>
// //           <select
// //             className="form-select"
// //             value={settings.language}
// //             onChange={(e) => update('language', e.target.value)}
// //           >
// //             <option value="en">{t('settings.english')}</option>
// //             <option value="th">{t('settings.thai')}</option>
// //             <option value="my">{t('settings.burmese')}</option>
// //           </select>
// //         </div>

// //         {/* Currency */}
// //         <div className="mb-4">
// //           <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
// //             {t('settings.currency')}
// //           </label>
// //           <select
// //             className="form-select"
// //             value={settings.currency}
// //             onChange={(e) => update('currency', e.target.value)}
// //           >
// //             <option value="THB">THB — Thai Baht</option>
// //             <option value="USD">USD — US Dollar</option>
// //             <option value="MMK">MMK — Myanmar Kyat</option>
// //           </select>
// //         </div>

// //         {/* Week Starts On */}
// //         <div className="mb-6">
// //           <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">
// //             {t('settings.weekStartsOn')}
// //           </label>
// //           <select
// //             className="form-select"
// //             value={settings.weekStartsOn}
// //             onChange={(e) => update('weekStartsOn', e.target.value)}
// //           >
// //             <option value="Sun">Sunday</option>
// //             <option value="Mon">Monday</option>
// //           </select>
// //         </div>

// //         <div className="flex items-center gap-3">
// //           <button
// //             onClick={savePreferences}
// //             disabled={savingPrefs}
// //             className="btn-primary disabled:opacity-60"
// //           >
// //             {savingPrefs ? 'Saving…' : t('settings.save')}
// //           </button>
// //           <button onClick={resetPreferences} className="btn-secondary">
// //             Reset to defaults
// //           </button>
// //         </div>
// //       </section>

// //       {/* Change Password */}
// //       <section className="card">
// //         <h2 className="text-base font-medium mb-4">Change Password</h2>
// //         <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //           <input
// //             type="password"
// //             placeholder="Current password"
// //             className="form-input"
// //             value={currPwd}
// //             onChange={(e) => setCurrPwd(e.target.value)}
// //           />
// //           <input
// //             type="password"
// //             placeholder="New password (min 8 chars)"
// //             className="form-input"
// //             value={newPwd}
// //             onChange={(e) => setNewPwd(e.target.value)}
// //           />
// //           <input
// //             type="password"
// //             placeholder="Confirm new password"
// //             className="form-input"
// //             value={confirmPwd}
// //             onChange={(e) => setConfirmPwd(e.target.value)}
// //           />

// //           <div className="col-span-1 md:col-span-3">
// //             <button
// //               type="submit"
// //               disabled={changingPwd}
// //               className="btn-primary w-full md:w-auto disabled:opacity-60"
// //             >
// //               {changingPwd ? 'Updating…' : 'Update password'}
// //             </button>
// //           </div>
// //         </form>
// //       </section>

// //       {/* Delete Account */}
// //       <section className="card">
// //         <h2 className="text-base font-medium mb-2 text-rose-600">Delete Account</h2>
// //         <p className="text-sm text-rose-600 mb-4">
// //           This action is permanent and cannot be undone. Type <strong>DELETE</strong> to confirm.
// //         </p>
// //         <div className="flex flex-col md:flex-row gap-3">
// //           <input
// //             type="text"
// //             placeholder="Type DELETE to confirm"
// //             className="form-input"
// //             value={deleteConfirm}
// //             onChange={(e) => setDeleteConfirm(e.target.value)}
// //           />
// //           <button
// //             onClick={handleDeleteAccount}
// //             disabled={deleting}
// //             className="btn-secondary border-rose-400 text-rose-600 dark:border-rose-500 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-60"
// //           >
// //             {deleting ? 'Deleting…' : 'Delete account'}
// //           </button>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }

// import React, { useContext, useEffect, useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../utils/axiosInstance';
// import { API_PATHS } from '../../utils/apiPaths';
// import { UserContext } from '../../context/UserContext';
// import useT from '../../hooks/useT';

// const DEFAULTS = {
//   currency: 'THB',
//   theme: 'light',
//   weekStartsOn: 'Mon',
//   language: 'en',
// };

// export default function Settings() {
//   const { t } = useT();
//   const { prefs, updatePrefs } = useContext(UserContext);
//   const navigate = useNavigate();

//   const [activeSection, setActiveSection] = useState('general');
//   const [settings, setSettings] = useState(DEFAULTS);
//   const [savingPrefs, setSavingPrefs] = useState(false);
//   const [currPwd, setCurrPwd] = useState('');
//   const [newPwd, setNewPwd] = useState('');
//   const [confirmPwd, setConfirmPwd] = useState('');
//   const [changingPwd, setChangingPwd] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState('');
//   const [deleting, setDeleting] = useState(false);
  
//   // Notification settings
//   const [emailNotifications, setEmailNotifications] = useState(true);
//   const [pushNotifications, setPushNotifications] = useState(false);
//   const [marketingEmails, setMarketingEmails] = useState(true);

//   const sidebarItems = [
//     { id: 'general', label: 'General', icon: '⚙️' },
//     { id: 'notifications', label: 'Notifications', icon: '🔔' },
//     { id: 'security', label: 'Security', icon: '🛡️' },
//     { id: 'danger', label: 'Danger Zone', icon: '🗑️' },
//   ];

//   useEffect(() => {
//     setSettings((s) => ({ ...s, ...prefs }));
//   }, [prefs]);

//   const update = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

//   const savePreferences = async () => {
//     try {
//       setSavingPrefs(true);
//       // Instant UI change via context
//       updatePrefs(settings);
//       // Persist on backend
//       await axiosInstance.put(API_PATHS.USER.UPDATE_PREFS, {
//         currency: settings.currency,
//         theme: settings.theme,
//         weekStartsOn: settings.weekStartsOn,
//         language: settings.language,
//       });
//       toast.success('Preferences saved');
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Could not save preferences');
//     } finally {
//       setSavingPrefs(false);
//     }
//   };

//   const resetPreferences = () => {
//     setSettings(DEFAULTS);
//     updatePrefs(DEFAULTS);
//     toast.success('Restored defaults');
//   };

//   const handleChangePassword = async (e) => {
//     if (e) e.preventDefault();
//     if (!newPwd || !confirmPwd) return toast.error('Please enter a new password and confirm it.');
//     if (newPwd.length < 8) return toast.error('New password must be at least 8 characters.');
//     if (newPwd !== confirmPwd) return toast.error('New passwords do not match.');

//     try {
//       setChangingPwd(true);
//       await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
//         currentPassword: currPwd,
//         newPassword: newPwd,
//       });
//       setCurrPwd(''); setNewPwd(''); setConfirmPwd('');
//       toast.success('Password updated. Please log in again.');
//       localStorage.removeItem('token');
//       navigate('/login');
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Could not change password');
//     } finally {
//       setChangingPwd(false);
//     }
//   };

//   const handleDeleteAccount = async () => {
//     if (deleteConfirm !== 'DELETE') return toast.error('Type DELETE to confirm');
//     try {
//       setDeleting(true);
//       await axiosInstance.delete(API_PATHS.USER.DELETE_ME);
//       toast.success('Account deleted');
//       localStorage.removeItem('token');
//       navigate('/login');
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Could not delete account');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const ToggleSwitch = ({ checked, onChange }) => (
//     <button
//       onClick={() => onChange(!checked)}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
//         checked ? 'bg-blue-600' : 'bg-gray-200'
//       }`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//           checked ? 'translate-x-6' : 'translate-x-1'
//         }`}
//       />
//     </button>
//   );

//   const renderContent = () => {
//     switch (activeSection) {
//       case 'general':
//         return (
//           <div className="space-y-6">
//             {/* General Settings Card */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-lg">⚙️</span>
//                 <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>
//               </div>
//               <p className="text-sm text-gray-600 mb-6">Configure your basic preferences and display options</p>
              
//               {/* Theme */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-4 h-4 bg-gray-300 rounded"></div>
//                   <label className="text-sm font-medium text-gray-900">Theme</label>
//                 </div>
//                 <div className="flex gap-4">
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="theme"
//                       value="light"
//                       checked={settings.theme === 'light'}
//                       onChange={() => update('theme', 'light')}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-gray-700">Light</span>
//                   </label>
//                   <label className="flex items-center gap-2">
//                     <input
//                       type="radio"
//                       name="theme"
//                       value="dark"
//                       checked={settings.theme === 'dark'}
//                       onChange={() => update('theme', 'dark')}
//                       className="w-4 h-4 text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-gray-700">Dark</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Language */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-4 h-4 bg-gray-300 rounded"></div>
//                   <label className="text-sm font-medium text-gray-900">Language</label>
//                 </div>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={settings.language}
//                   onChange={(e) => update('language', e.target.value)}
//                 >
//                   <option value="en">English</option>
//                   <option value="th">Thai</option>
//                   <option value="my">Burmese</option>
//                 </select>
//               </div>

//               {/* Currency */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-4 h-4 bg-gray-300 rounded"></div>
//                   <label className="text-sm font-medium text-gray-900">Currency</label>
//                 </div>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={settings.currency}
//                   onChange={(e) => update('currency', e.target.value)}
//                 >
//                   <option value="THB">THB — Thai Baht</option>
//                   <option value="USD">USD — US Dollar</option>
//                   <option value="MMK">MMK — Myanmar Kyat</option>
//                 </select>
//               </div>

//               {/* Week starts on */}
//               <div className="mb-8">
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-4 h-4 bg-gray-300 rounded"></div>
//                   <label className="text-sm font-medium text-gray-900">Week starts on</label>
//                 </div>
//                 <select
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={settings.weekStartsOn}
//                   onChange={(e) => update('weekStartsOn', e.target.value)}
//                 >
//                   <option value="Sun">Sunday</option>
//                   <option value="Mon">Monday</option>
//                 </select>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={savePreferences}
//                   disabled={savingPrefs}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-sm font-medium"
//                 >
//                   💾 {savingPrefs ? 'Saving Changes' : 'Save Changes'}
//                 </button>
//                 <button 
//                   onClick={resetPreferences} 
//                   className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm font-medium"
//                 >
//                   🔄 Reset to Defaults
//                 </button>
//               </div>
//             </div>
//           </div>
//         );

//       case 'notifications':
//         return (
//           <div className="space-y-6">
//             {/* Notifications Card */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-lg">🔔</span>
//                 <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
//               </div>
//               <p className="text-sm text-gray-600 mb-6">Choose what notifications you want to receive</p>
              
//               <div className="space-y-6">
//                 {/* Email Notifications */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="font-medium text-gray-900 text-sm mb-1">Email Notifications</div>
//                     <div className="text-sm text-gray-600">Receive important updates via email</div>
//                   </div>
//                   <ToggleSwitch 
//                     checked={emailNotifications} 
//                     onChange={setEmailNotifications} 
//                   />
//                 </div>

//                 {/* Push Notifications */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="font-medium text-gray-900 text-sm mb-1">Push Notifications</div>
//                     <div className="text-sm text-gray-600">Get push notifications on your device</div>
//                   </div>
//                   <ToggleSwitch 
//                     checked={pushNotifications} 
//                     onChange={setPushNotifications} 
//                   />
//                 </div>

//                 {/* Marketing Emails */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="font-medium text-gray-900 text-sm mb-1">Marketing Emails</div>
//                     <div className="text-sm text-gray-600">Receive marketing and promotional content</div>
//                   </div>
//                   <ToggleSwitch 
//                     checked={marketingEmails} 
//                     onChange={setMarketingEmails} 
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'security':
//         return (
//           <div className="space-y-6">
//             {/* Security Card */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-lg">🛡️</span>
//                 <h2 className="text-lg font-semibold text-gray-900">Security</h2>
//               </div>
//               <p className="text-sm text-gray-600 mb-6">Manage your account security settings</p>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-900 mb-2">Current Password</label>
//                   <input
//                     type="password"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                     value={currPwd}
//                     onChange={(e) => setCurrPwd(e.target.value)}
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-900 mb-2">New Password</label>
//                     <input
//                       type="password"
//                       placeholder="Minimum 8 characters"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                       value={newPwd}
//                       onChange={(e) => setNewPwd(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-900 mb-2">Confirm New Password</label>
//                     <input
//                       type="password"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                       value={confirmPwd}
//                       onChange={(e) => setConfirmPwd(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="pt-4">
//                   <button
//                     onClick={handleChangePassword}
//                     disabled={changingPwd}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 text-sm font-medium"
//                   >
//                     {changingPwd ? 'Updating Password' : 'Update Password'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       case 'danger':
//         return (
//           <div className="space-y-6">
//             {/* Danger Zone Card */}
//             <div className="bg-white rounded-lg border border-red-200 p-6">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="text-lg">🗑️</span>
//                 <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
//               </div>
//               <p className="text-sm text-red-600 mb-6">Irreversible and destructive actions</p>
              
//               {/* Delete Account Section */}
//               <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                 <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
//                 <p className="text-sm text-red-700 mb-4">
//                   Once you delete your account, there is no going back. Please be certain. All your data will be permanently removed and cannot be recovered.
//                 </p>
//                 <p className="text-sm text-red-700 mb-4">
//                   Type <strong>DELETE</strong> to confirm:
//                 </p>
//                 <div className="space-y-3">
//                   <input
//                     type="text"
//                     placeholder="Type DELETE to confirm"
//                     className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
//                     value={deleteConfirm}
//                     onChange={(e) => setDeleteConfirm(e.target.value)}
//                   />
//                   <button
//                     onClick={handleDeleteAccount}
//                     disabled={deleting || deleteConfirm !== 'DELETE'}
//                     className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 text-sm font-medium"
//                   >
//                     🗑️ {deleting ? 'Deleting My Account' : 'Delete My Account'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="w-64 bg-white min-h-screen">
//           <div className="p-6">
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
//               <p className="text-sm text-gray-600">Manage your account preferences and settings</p>
//             </div>
            
//             <nav className="space-y-1">
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveSection(item.id)}
//                   className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors text-sm ${
//                     activeSection === item.id
//                       ? 'bg-blue-50 text-blue-700 font-medium'
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span>{item.icon}</span>
//                   {item.label}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1 p-8">
//           <div className="max-w-4xl">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';

const DEFAULTS = {
  currency: 'THB',
  theme: 'light',
  weekStartsOn: 'Mon',
  language: 'en',
};

export default function Settings() {
  const { t } = useT();
  const { prefs, updatePrefs } = useContext(UserContext);
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState(DEFAULTS);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [currPwd, setCurrPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  const sidebarItems = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'danger', label: 'Danger Zone', icon: '🗑️' },
  ];

  // Determine dark theme status
  const isDarkTheme = prefs?.theme === 'dark';

  useEffect(() => {
    setSettings((s) => ({ ...s, ...prefs }));
  }, [prefs]);

  const update = (k, v) => setSettings((prev) => ({ ...prev, [k]: v }));

  const savePreferences = async () => {
    try {
      setSavingPrefs(true);
      // Instant UI change via context
      updatePrefs(settings);
      // Persist on backend
      await axiosInstance.put(API_PATHS.USER.UPDATE_PREFS, {
        currency: settings.currency,
        theme: settings.theme,
        weekStartsOn: settings.weekStartsOn,
        language: settings.language,
      });
      toast.success('Preferences saved');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  const resetPreferences = () => {
    setSettings(DEFAULTS);
    updatePrefs(DEFAULTS);
    toast.success('Restored defaults');
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!newPwd || !confirmPwd) return toast.error('Please enter a new password and confirm it.');
    if (newPwd.length < 8) return toast.error('New password must be at least 8 characters.');
    if (newPwd !== confirmPwd) return toast.error('New passwords do not match.');

    try {
      setChangingPwd(true);
      await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword: currPwd,
        newPassword: newPwd,
      });
      setCurrPwd('');
      setNewPwd('');
      setConfirmPwd('');
      toast.success('Password updated. Please log in again.');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not change password');
    } finally {
      setChangingPwd(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return toast.error('Type DELETE to confirm');
    try {
      setDeleting(true);
      await axiosInstance.delete(API_PATHS.USER.DELETE_ME);
      toast.success('Account deleted');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not delete account');
    } finally {
      setDeleting(false);
    }
  };

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const renderContent = () => {
    const cardClass = isDarkTheme
      ? 'rounded-lg p-6 border bg-gray-800 border-gray-700 text-gray-200'
      : 'rounded-lg p-6 border bg-white border-gray-200 text-gray-900';

    const labelBaseClass = isDarkTheme ? 'text-gray-200' : 'text-gray-900';
    const textBaseClass = isDarkTheme ? 'text-gray-400' : 'text-gray-600';
    const inputBaseClass = isDarkTheme
      ? 'w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
      : 'w-full px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border bg-white border-gray-300 text-gray-700 placeholder-gray-500';

    const buttonPrimaryClass = `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      isDarkTheme
        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
    }`;

    const buttonSecondaryClass = `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      isDarkTheme
        ? 'border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500'
        : 'border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
    }`;

    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            {/* General Settings Card */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">⚙️</span>
                <h2 className={`text-lg font-semibold ${labelBaseClass}`}>General Settings</h2>
              </div>
              <p className={`text-sm mb-6 ${textBaseClass}`}>
                Configure your basic preferences and display options
              </p>

              {/* Theme */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <label className={`text-sm font-medium ${labelBaseClass}`}>Theme</label>
                </div>
                <div className="flex gap-4">
                  {['light', 'dark'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={opt}
                        checked={settings.theme === opt}
                        onChange={() => update('theme', opt)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className={textBaseClass + " capitalize"}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <label className={`text-sm font-medium ${labelBaseClass}`}>Language</label>
                </div>
                <select
                  className={inputBaseClass}
                  value={settings.language}
                  onChange={(e) => update('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="th">Thai</option>
                  <option value="my">Burmese</option>
                </select>
              </div>

              {/* Currency */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <label className={`text-sm font-medium ${labelBaseClass}`}>Currency</label>
                </div>
                <select
                  className={inputBaseClass}
                  value={settings.currency}
                  onChange={(e) => update('currency', e.target.value)}
                >
                  <option value="THB">THB — Thai Baht</option>
                  <option value="USD">USD — US Dollar</option>
                  <option value="MMK">MMK — Myanmar Kyat</option>
                </select>
              </div>

              {/* Week starts on */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-gray-500 rounded"></div>
                  <label className={`text-sm font-medium ${labelBaseClass}`}>Week starts on</label>
                </div>
                <select
                  className={inputBaseClass}
                  value={settings.weekStartsOn}
                  onChange={(e) => update('weekStartsOn', e.target.value)}
                >
                  <option value="Sun">Sunday</option>
                  <option value="Mon">Monday</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={savePreferences}
                  disabled={savingPrefs}
                  className={`${buttonPrimaryClass} ${
                    savingPrefs ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  💾 {savingPrefs ? 'Saving Changes' : 'Save Changes'}
                </button>
                <button
                  onClick={resetPreferences}
                  className={buttonSecondaryClass}
                >
                  🔄 Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            {/* Notifications Card */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🔔</span>
                <h2 className={`text-lg font-semibold ${labelBaseClass}`}>Notifications</h2>
              </div>
              <p className={`text-sm mb-6 ${textBaseClass}`}>
                Choose what notifications you want to receive
              </p>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`font-medium text-sm mb-1 ${labelBaseClass}`}>
                      Email Notifications
                    </div>
                    <div className={`text-sm ${textBaseClass}`}>
                      Receive important updates via email
                    </div>
                  </div>
                  <ToggleSwitch checked={emailNotifications} onChange={setEmailNotifications} />
                </div>

                {/* Push Notifications */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`font-medium text-sm mb-1 ${labelBaseClass}`}>
                      Push Notifications
                    </div>
                    <div className={`text-sm ${textBaseClass}`}>
                      Get push notifications on your device
                    </div>
                  </div>
                  <ToggleSwitch checked={pushNotifications} onChange={setPushNotifications} />
                </div>

                {/* Marketing Emails */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`font-medium text-sm mb-1 ${labelBaseClass}`}>
                      Marketing Emails
                    </div>
                    <div className={`text-sm ${textBaseClass}`}>
                      Receive marketing and promotional content
                    </div>
                  </div>
                  <ToggleSwitch checked={marketingEmails} onChange={setMarketingEmails} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            {/* Security Card */}
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🛡️</span>
                <h2 className={`text-lg font-semibold ${labelBaseClass}`}>Security</h2>
              </div>
              <p className={`text-sm mb-6 ${textBaseClass}`}>
                Manage your account security settings
              </p>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    className={inputBaseClass}
                    value={currPwd}
                    onChange={(e) => setCurrPwd(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Minimum 8 characters"
                      className={inputBaseClass}
                      value={newPwd}
                      onChange={(e) => setNewPwd(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelBaseClass}`}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className={inputBaseClass}
                      value={confirmPwd}
                      onChange={(e) => setConfirmPwd(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPwd}
                    className={`${buttonPrimaryClass} ${
                      changingPwd ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {changingPwd ? 'Updating Password' : 'Update Password'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'danger':
        return (
          <div className="space-y-6">
            {/* Danger Zone Card */}
            <div
              className={`rounded-lg p-6 border ${
                isDarkTheme
                  ? 'bg-red-900 border-red-700 text-red-300'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🗑️</span>
                <h2
                  className={`text-lg font-semibold ${
                    isDarkTheme ? 'text-red-400' : 'text-red-600'
                  }`}
                >
                  Danger Zone
                </h2>
              </div>
              <p className={`text-sm mb-6 ${
                isDarkTheme ? 'text-red-300' : 'text-red-600'
              }`}>
                Irreversible and destructive actions
              </p>

              {/* Delete Account Section */}
              <div
                className={`p-4 rounded-lg border ${
                  isDarkTheme ? 'bg-red-800 border-red-700' : 'bg-red-50 border-red-200'
                }`}
              >
                <h3
                  className={`font-medium mb-2 ${
                    isDarkTheme ? 'text-red-300' : 'text-red-900'
                  }`}
                >
                  Delete Account
                </h3>
                <p className={`text-sm mb-4 ${
                  isDarkTheme ? 'text-red-400' : 'text-red-700'
                }`}>
                  Once you delete your account, there is no going back. Please be certain. All your data will be permanently removed and cannot be recovered.
                </p>
                <p className={`text-sm mb-4 ${
                  isDarkTheme ? 'text-red-400' : 'text-red-700'
                }`}>
                  Type <strong>DELETE</strong> to confirm:
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Type DELETE to confirm"
                    className={inputBaseClass.replace(
                      'bg-white',
                      isDarkTheme ? 'bg-red-900 border-red-600' : 'bg-white border-red-300'
                    )}
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                  />
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting || deleteConfirm !== 'DELETE'}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      deleting || deleteConfirm !== 'DELETE'
                        ? 'opacity-50 cursor-not-allowed'
                        : isDarkTheme
                        ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                        : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    }`}
                  >
                    🗑️ {deleting ? 'Deleting My Account' : 'Delete My Account'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={isDarkTheme ? 'min-h-screen bg-gray-900 text-gray-100' : 'min-h-screen bg-gray-50 text-gray-900'}>
      <div className="flex">
        {/* Sidebar */}
        <div className={isDarkTheme ? 'w-64 bg-gray-800 min-h-screen' : 'w-64 bg-white min-h-screen'}>
          <div className="p-6">
            <div className="mb-8">
              <h1 className={isDarkTheme ? 'text-2xl font-bold text-white mb-1' : 'text-2xl font-bold text-gray-900 mb-1'}>
                Settings
              </h1>
              <p className={isDarkTheme ? 'text-sm text-gray-400' : 'text-sm text-gray-600'}>
                Manage your account preferences and settings
              </p>
            </div>

            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors text-sm ${
                    activeSection === item.id
                      ? isDarkTheme
                        ? 'bg-blue-700 text-white font-medium'
                        : 'bg-blue-50 text-blue-700 font-medium'
                      : isDarkTheme
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={isDarkTheme ? 'flex-1 p-8 bg-gray-900' : 'flex-1 p-8 bg-white'}>
          <div className="max-w-4xl">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
