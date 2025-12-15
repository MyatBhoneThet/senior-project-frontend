import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import useT from "../../hooks/useT";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const { t } = useT();
  const tt = (key, fallback) => {
    const val = t?.(key);
    return val && val !== key ? val : fallback;
  };

  const { user, updateUser, prefs } = useContext(UserContext);
  const isDarkTheme = prefs?.theme === "dark";

  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const normalizePhoto = (profilePhoto) => {
    if (!profilePhoto) return null;
    if (profilePhoto.data) return `data:${profilePhoto.contentType};base64,${profilePhoto.data}`;
    if (typeof profilePhoto === "string" && profilePhoto.startsWith("http")) return profilePhoto;
    return `${BACKEND_URL}/${profilePhoto}`;
  };

  const transformGenderValue = (backendValue) => {
    const map = {
      male: "Male",
      female: "Female",
      other: "Other",
      prefer_not_to_say: "Prefer not to say",
      Male: "Male",
      Female: "Female",
      Other: "Other",
      "Prefer not to say": "Prefer not to say",
    };
    return map[backendValue] || "Prefer not to say";
  };

  useEffect(() => {
    axiosInstance
      .get(API_PATHS.USER.ME)
      .then((res) => {
        const data = res.data;
        const transformed = {
          ...data,
          gender: transformGenderValue(data.gender),
          profilePhoto: normalizePhoto(data.profilePhoto),
        };
        updateUser(transformed);
        setFormData(transformed);
      })
      .catch((err) =>
        console.error(tt("profile.fetchError", "Failed to fetch profile"), err)
      );
  }, []);

  const setField = (key, value) => {
    if (key.startsWith("contact.")) {
      const field = key.split(".")[1];
      setFormData((p) => ({ ...p, contact: { ...p.contact, [field]: value } }));
    } else if (key === "interests") {
      const arr = value.split(",").map((v) => v.trim()).filter(Boolean);
      setFormData((p) => ({ ...p, interests: arr }));
    } else if (key === "accomplishments") {
      const arr = value.split("\n").filter(Boolean);
      setFormData((p) => ({ ...p, accomplishments: arr }));
    } else {
      setFormData((p) => ({ ...p, [key]: value }));
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("profilePhoto", file);

    const previewUrl = URL.createObjectURL(file);
    updateUser({ ...user, profilePhoto: previewUrl });
    setFormData((p) => ({ ...p, profilePhoto: previewUrl }));

    try {
      const res = await axiosInstance.post(API_PATHS.USER.UPLOAD_PHOTO, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const finalUrl = normalizePhoto(res.data.user.profilePhoto);
      updateUser({ ...user, profilePhoto: finalUrl });
      setFormData((p) => ({ ...p, profilePhoto: finalUrl }));
    } catch (err) {
      console.error(tt("profile.uploadFail", "Photo upload failed:"), err.response?.data || err.message);
      alert(tt("profile.uploadFailAlert", "Failed to upload photo. You can still save your profile."));
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const res = await axiosInstance.delete(API_PATHS.USER.REMOVE_PHOTO);
      const updated = { ...res.data.user, profilePhoto: null };
      updateUser(updated);
      setFormData(updated);
    } catch (err) {
      console.error(tt("profile.removeFail", "Photo remove failed:"), err.response?.data || err.message);
      updateUser({ ...user, profilePhoto: null });
      setFormData((p) => ({ ...p, profilePhoto: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { profilePhoto, ...rest } = formData;
      const submitData = {
        ...rest,
        age: rest.age ? Number(rest.age) : undefined,
        gender: transformGenderValue(rest.gender),
      };

      const res = await axiosInstance.put(API_PATHS.USER.UPDATE, submitData);
      updateUser({ ...res.data, profilePhoto });
      setFormData({ ...res.data, profilePhoto });
      alert(tt("profile.updateSuccess", "Profile updated successfully!"));
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        tt("profile.updateFail", "Failed to save profile");
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  // Theme-based classes (GREEN primary)
  const containerClass = isDarkTheme
    ? "min-h-screen bg-gray-900 text-gray-100"
    : "min-h-screen bg-gray-50 text-gray-900";

  const cardClass = isDarkTheme
    ? "bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-sm text-gray-100"
    : "bg-white border border-gray-300 rounded-2xl p-8 shadow-sm text-gray-900";

  const labelClass = isDarkTheme ? "text-gray-200" : "text-gray-700";

  // Focus ring + border switched from purple -> GREEN (use your primary utilities)
  const inputClass = isDarkTheme
    ? "w-full border border-gray-700 rounded-lg px-4 py-3 bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-100 focus:border-green-400 transition-colors"
    : "w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-100 focus:border-green-400 transition-colors";

  // Save button switched from purple -> GREEN using .bg-primary utilities
  const buttonClass =
    "bg-primary hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <DashboardLayout activeMenu="Profile">
      <div className={`max-w-5xl mx-auto p-6 ${containerClass}`}>
        <h1 className="text-3xl font-bold mb-8">{tt("profile.title", "Profile")}</h1>
        <div className={cardClass}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <ProfilePhotoSelector
                photo={formData.profilePhoto}
                onUpload={handleUpload}
                onRemove={handleRemovePhoto}
              />
            </div>
            <form onSubmit={handleSubmit} className="w-full lg:w-2/3 space-y-6">
              <div>
                <label className={`block text-sm font-medium ${labelClass}`}>{tt("profile.name", "Name")}</label>
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={(e) => setField("name", e.target.value)}
                  className={inputClass}
                  placeholder={tt("profile.namePlaceholder", "Enter your name")}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${labelClass}`}>{tt("profile.username", "Username")}</label>
                <input
                  name="username"
                  value={formData.username || ""}
                  onChange={(e) => setField("username", e.target.value)}
                  className={inputClass}
                  placeholder={tt("profile.usernamePlaceholder", "Enter your username")}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${labelClass}`}>{tt("profile.bio", "Bio")}</label>
                <input
                  name="bio"
                  value={formData.bio || ""}
                  onChange={(e) => setField("bio", e.target.value)}
                  className={inputClass}
                  placeholder={tt("profile.bioPlaceholder", "Short bio about yourself")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${labelClass}`}>{tt("profile.age", "Age")}</label>
                  <input
                    name="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => setField("age", e.target.value)}
                    className={inputClass}
                    placeholder={tt("profile.agePlaceholder", "Your age")}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${labelClass}`}>{tt("profile.gender", "Gender")}</label>
                  <select
                    name="gender"
                    value={formData.gender || "Prefer not to say"}
                    onChange={(e) => setField("gender", e.target.value)}
                    className={inputClass}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
              </div>
              <div>
                <button type="submit" disabled={saving} className={buttonClass}>
                  {saving ? tt("profile.saving", "Saving...") : tt("profile.saveButton", "Save Profile")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
