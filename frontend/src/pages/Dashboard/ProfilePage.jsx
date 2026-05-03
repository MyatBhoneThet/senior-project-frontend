import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import axiosInstance from '../../utils/axiosInstance';
import API_PATHS from '../../utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import useT from '../../hooks/useT';
import ProfilePageShell from '../../components/Profile/ProfilePageShell';
import ProfileHeaderActions from '../../components/Profile/ProfileHeaderActions';
import ProfilePhotoPanel from '../../components/Profile/ProfilePhotoPanel';
import ProfileInfoForm from '../../components/Profile/ProfileInfoForm';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const normalizePhoto = (profilePhoto) => {
  if (!profilePhoto) return null;
  if (profilePhoto.data) return `data:${profilePhoto.contentType};base64,${profilePhoto.data}`;
  if (typeof profilePhoto === 'string' && /^(https?:|blob:|data:)/.test(profilePhoto)) return profilePhoto;
  return `${BACKEND_URL}/${profilePhoto}`;
};

const transformGenderValue = (backendValue) => {
  const map = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    prefer_not_to_say: 'Prefer not to say',
    Male: 'Male',
    Female: 'Female',
    Other: 'Other',
    'Prefer not to say': 'Prefer not to say',
  };
  return map[backendValue] || 'Prefer not to say';
};

export default function ProfilePage() {
  const { t } = useT();
  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  const { user, updateUser, prefs } = useContext(UserContext);
  const isDark = prefs?.theme === 'dark';
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(API_PATHS.USER.ME)
      .then((res) => {
        const data = res.data;
        const transformed = {
          ...data,
          name: data.name || data.fullName || '',
          gender: transformGenderValue(data.gender),
          profilePhoto: normalizePhoto(data.profilePhoto),
        };
        updateUser(transformed);
        setFormData(transformed);
      })
      .catch((err) => {
        console.error(tt('profile.fetchError', 'Failed to fetch profile'), err);
        toast.error(tt('profile.fetchError', 'Failed to fetch profile'));
      })
      .finally(() => setLoading(false));
  }, []);

  const setField = (key, value) => {
    setFormData((p) => ({ ...p, [key]: value }));
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append('profilePhoto', file);

    const previewUrl = URL.createObjectURL(file);
    updateUser({ ...user, profilePhoto: previewUrl });
    setFormData((p) => ({ ...p, profilePhoto: previewUrl }));

    try {
      const res = await axiosInstance.post(API_PATHS.USER.UPLOAD_PHOTO, data);
      const finalUrl = normalizePhoto(res.data.user.profilePhoto);
      updateUser({ ...user, profilePhoto: finalUrl });
      setFormData((p) => ({ ...p, profilePhoto: finalUrl }));
    } catch (err) {
      console.error(tt('profile.uploadFail', 'Photo upload failed'), err);
      toast.error(tt('profile.uploadFailAlert', 'Failed to upload photo.'));
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const res = await axiosInstance.delete(API_PATHS.USER.REMOVE_PHOTO);
      const updated = { ...res.data.user, profilePhoto: null };
      updateUser(updated);
      setFormData((prev) => ({ ...prev, profilePhoto: null }));
    } catch (err) {
      console.error(tt('profile.removeFail', 'Photo remove failed'), err);
      updateUser({ ...user, profilePhoto: null });
      setFormData((prev) => ({ ...prev, profilePhoto: null }));
    }
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    setSaving(true);

    try {
      const { profilePhoto, ...rest } = formData;
      const submitData = {
        ...rest,
        fullName: rest.name || rest.fullName || '',
        name: rest.name || rest.fullName || '',
        age: rest.age ? Number(rest.age) : undefined,
        gender: transformGenderValue(rest.gender),
      };

      const res = await axiosInstance.put(API_PATHS.USER.UPDATE, submitData);
      const updated = { ...res.data, profilePhoto };
      updateUser(updated);
      setFormData((prev) => ({ ...prev, ...res.data, profilePhoto }));
      toast.success(tt('profile.updateSuccess', 'Profile updated successfully.'));
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        tt('profile.updateFail', 'Failed to save profile');
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const pageClass = isDark
    ? 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.11),transparent_26%),radial-gradient(circle_at_top_right,rgba(71,215,255,0.08),transparent_22%),linear-gradient(180deg,#090b11_0%,#05070b_100%)] text-white'
    : 'bg-[radial-gradient(circle_at_top_left,rgba(217,255,52,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.72),transparent_20%),linear-gradient(180deg,#fefbf8_0%,#f7f3ea_100%)] text-[#11131b]';
  const cardClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white shadow-[0_24px_90px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.08] backdrop-blur-2xl'
    : 'border-white/28 bg-white/28 text-[#11131b] shadow-[0_24px_90px_rgba(15,23,42,0.08)] ring-1 ring-white/45 backdrop-blur-3xl';
  const sectionDivider = isDark ? 'border-white/10' : 'border-white/45';
  const mutedText = isDark ? 'text-[#7b8095]' : 'text-[#6b6f80]';
  const labelText = isDark ? 'text-[#8a90a7]' : 'text-[#6b7080]';
  const inputClass = isDark
    ? 'border-white/10 bg-white/[0.05] text-white placeholder:text-[#848aa0]'
    : 'border-white/28 bg-white/28 text-[#11131b] placeholder:text-[#8a8f9f] backdrop-blur-3xl';
  const subtleSurface = isDark
    ? 'border-white/10 bg-white/[0.05]'
    : 'border-white/28 bg-white/22 backdrop-blur-3xl';

  return (
    <DashboardLayout activeMenu="Profile">
      <ProfilePageShell isDark={isDark} pageClass={pageClass}>
        <ProfileHeaderActions
          sectionDivider={sectionDivider}
          mutedText={mutedText}
          saving={saving}
          loading={loading}
          isDark={isDark}
          tt={tt}
          onSave={handleSubmit}
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
          <ProfilePhotoPanel
            isDark={isDark}
            cardClass={cardClass}
            mutedText={mutedText}
            subtleSurface={subtleSurface}
            formData={formData}
            user={user}
            tt={tt}
            onUpload={handleUpload}
            onRemove={handleRemovePhoto}
            loading={loading}
          />

          <ProfileInfoForm
            isDark={isDark}
            cardClass={cardClass}
            mutedText={mutedText}
            labelText={labelText}
            inputClass={inputClass}
            formData={formData}
            user={user}
            tt={tt}
            onSubmit={handleSubmit}
            setField={setField}
            loading={loading}
          />
        </div>
      </ProfilePageShell>
    </DashboardLayout>
  );
}
