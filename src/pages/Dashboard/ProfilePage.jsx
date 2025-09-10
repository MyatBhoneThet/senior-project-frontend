// // pages/ProfilePage.jsx
// import React, { useState, useEffect, useContext } from "react";
// import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
// import axiosInstance from "../../utils/axiosInstance";
// import API_PATHS from "../../utils/apiPaths";
// import { UserContext } from "../../context/UserContext";

// const ProfilePage = () => {
//   const { user, updateUser } = useContext(UserContext); // use global user
//   const [formData, setFormData] = useState({});
//   const [saving, setSaving] = useState(false);

//   // Normalize photo URLs
//   const normalizePhoto = (photoPath) => {
//     if (!photoPath) return null;
//     return photoPath.startsWith("http") ? photoPath : `http://localhost:8000/${photoPath}`;
//   };

//   // Map backend gender values
//   const transformGenderValue = (backendValue) => {
//     const genderMap = {
//       male: "Male",
//       female: "Female",
//       other: "Other",
//       prefer_not_to_say: "Prefer not to say",
//       Male: "Male",
//       Female: "Female",
//       Other: "Other",
//       "Prefer not to say": "Prefer not to say",
//     };
//     return genderMap[backendValue] || "Prefer not to say";
//   };

//   // Fetch user profile on mount
//   useEffect(() => {
//     axiosInstance
//       .get(API_PATHS.USER.ME)
//       .then((res) => {
//         const userData = res.data;
//         const transformedData = {
//           ...userData,
//           gender: transformGenderValue(userData.gender),
//           profilePhoto: normalizePhoto(userData.profilePhoto),
//         };
//         updateUser(transformedData); // update global context
//         setFormData((prev) => (Object.keys(prev).length === 0 ? transformedData : prev));
//       })
//       .catch((err) => console.error("Failed to fetch user profile", err));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("contact.")) {
//       const field = name.split(".")[1];
//       setFormData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
//     } else if (name === "interests") {
//       const interestsArray = value.split(",").map((item) => item.trim()).filter(Boolean);
//       setFormData((prev) => ({ ...prev, interests: interestsArray }));
//     } else if (name === "accomplishments") {
//       const accomplishmentsArray = value.split("\n").filter(Boolean);
//       setFormData((prev) => ({ ...prev, accomplishments: accomplishmentsArray }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const data = new FormData();
//     data.append("profilePhoto", file);

//     const previewUrl = URL.createObjectURL(file);
//     updateUser({ ...user, profilePhoto: previewUrl }); // preview in sidebar
//     setFormData((prev) => ({ ...prev, profilePhoto: previewUrl }));

//     try {
//       const res = await axiosInstance.post("/api/v1/users/me/photo", data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const finalUrl = normalizePhoto(res.data.user.profilePhoto);
//       updateUser({ ...user, profilePhoto: finalUrl }); // final photo
//       setFormData((prev) => ({ ...prev, profilePhoto: finalUrl }));
//     } catch (err) {
//       console.error("Photo upload failed:", err.response?.data || err.message);
//       alert("Failed to upload photo. You can still save your profile without it.");
//     }
//   };

//   const handleRemovePhoto = async () => {
//     try {
//       const res = await axiosInstance.delete("/api/v1/users/me/photo");
//       const updatedUser = { ...res.data.user, profilePhoto: null };
//       updateUser(updatedUser);
//       setFormData(updatedUser);
//     } catch (err) {
//       console.error("Photo remove failed:", err.response?.data || err.message);
//       updateUser({ ...user, profilePhoto: null });
//       setFormData((prev) => ({ ...prev, profilePhoto: null }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSaving(true);

//     const correctedGender = transformGenderValue(formData.gender);
//     const submitData = { ...formData, age: formData.age ? Number(formData.age) : undefined, gender: correctedGender };

//     axiosInstance
//       .put("/api/v1/auth/me", submitData)
//       .then((res) => {
//         updateUser(res.data); // update global context
//         setFormData(res.data);
//         alert("Profile updated successfully");
//       })
//       .catch((err) => {
//         console.error("Update error:", err);
//         const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save profile";
//         alert(`Error: ${errorMessage}`);
//       })
//       .finally(() => setSaving(false));
//   };

//   if (!user) {
//     return (
//       <div className="max-w-5xl mx-auto p-6">
//         <div className="flex justify-center items-center min-h-64">
//           <p className="text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-8 text-gray-900">Profile</h1>

//       <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="w-full lg:w-1/3 flex flex-col items-center">
//             <ProfilePhotoSelector
//               photo={user.profilePhoto}
//               onUpload={handleUpload}
//               onRemove={handleRemovePhoto}
//             />
//           </div>

//           <form onSubmit={handleSubmit} className="w-full lg:w-2/3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Name */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                 <input name="name" value={formData.name || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter your name" />
//               </div>

//               {/* Username */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Username</label>
//                 <input name="username" value={formData.username || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter your username" />
//               </div>

//               {/* Bio */}
//               <div className="md:col-span-2 space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Bio</label>
//                 <input name="bio" value={formData.bio || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="A short bio about yourself" />
//               </div>

//               {/* Age */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Age</label>
//                 <input name="age" type="number" value={formData.age || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Your age" />
//               </div>

//               {/* Gender */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">Gender</label>
//                 <select name="gender" value={formData.gender || "Prefer not to say"} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors">
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                   <option value="Prefer not to say">Prefer not to say</option>
//                 </select>
//               </div>
//             </div>

//             <div className="mt-8">
//               <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
//                 {saving ? "Saving..." : "Save Basic Info"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

const ProfilePage = () => {
  const { user, updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const normalizePhoto = (profilePhoto) => {
    if (!profilePhoto) return null;
    if (profilePhoto.data) return `data:${profilePhoto.contentType};base64,${profilePhoto.data}`;
    if (profilePhoto.startsWith("http")) return profilePhoto;
    return `${BACKEND_URL}/${profilePhoto}`;
  };

  const transformGenderValue = (backendValue) => {
    const genderMap = {
      male: "Male",
      female: "Female",
      other: "Other",
      prefer_not_to_say: "Prefer not to say",
      Male: "Male",
      Female: "Female",
      Other: "Other",
      "Prefer not to say": "Prefer not to say",
    };
    return genderMap[backendValue] || "Prefer not to say";
  };

  useEffect(() => {
    axiosInstance
      .get(API_PATHS.USER.ME)
      .then((res) => {
        const userData = res.data;
        const transformedData = {
          ...userData,
          gender: transformGenderValue(userData.gender),
          profilePhoto: normalizePhoto(userData.profilePhoto),
        };
        updateUser(transformedData);
        setFormData(transformedData);
      })
      .catch((err) => console.error("Failed to fetch user profile", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
    } else if (name === "interests") {
      const interestsArray = value.split(",").map((item) => item.trim()).filter(Boolean);
      setFormData((prev) => ({ ...prev, interests: interestsArray }));
    } else if (name === "accomplishments") {
      const accomplishmentsArray = value.split("\n").filter(Boolean);
      setFormData((prev) => ({ ...prev, accomplishments: accomplishmentsArray }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("profilePhoto", file);

    const previewUrl = URL.createObjectURL(file);
    updateUser({ ...user, profilePhoto: previewUrl });
    setFormData((prev) => ({ ...prev, profilePhoto: previewUrl }));

    try {
      const res = await axiosInstance.post(API_PATHS.USER.UPLOAD_PHOTO, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const finalUrl = normalizePhoto(res.data.user.profilePhoto);
      updateUser({ ...user, profilePhoto: finalUrl });
      setFormData((prev) => ({ ...prev, profilePhoto: finalUrl }));
    } catch (err) {
      console.error("Photo upload failed:", err.response?.data || err.message);
      alert("Failed to upload photo. You can still save your profile without it.");
    }
  };

  const handleRemovePhoto = async () => {
    try {
      const res = await axiosInstance.delete(API_PATHS.USER.REMOVE_PHOTO);
      const updatedUser = { ...res.data.user, profilePhoto: null };
      updateUser(updatedUser);
      setFormData(updatedUser);
    } catch (err) {
      console.error("Photo remove failed:", err.response?.data || err.message);
      updateUser({ ...user, profilePhoto: null });
      setFormData((prev) => ({ ...prev, profilePhoto: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const correctedGender = transformGenderValue(formData.gender);
    const submitData = { ...formData, age: formData.age ? Number(formData.age) : undefined, gender: correctedGender };

    axiosInstance
      .put(API_PATHS.USER.UPDATE, submitData)
      .then((res) => {
        updateUser(res.data);
        setFormData(res.data);
        alert("Profile updated successfully");
      })
      .catch((err) => {
        console.error("Update error:", err);
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to save profile";
        alert(`Error: ${errorMessage}`);
      })
      .finally(() => setSaving(false));
  };

  if (!user) {
    return (
      <DashboardLayout activeMenu="Profile">
        <div className="flex justify-center items-center min-h-64">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Profile</h1>
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 flex flex-col items-center">
              <ProfilePhotoSelector
                photo={formData.profilePhoto}
                onUpload={handleUpload}
                onRemove={handleRemovePhoto}
              />
            </div>

            <form onSubmit={handleSubmit} className="w-full lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input name="name" value={formData.name || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter your name" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input name="username" value={formData.username || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Enter your username" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <input name="bio" value={formData.bio || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="A short bio about yourself" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input name="age" type="number" value={formData.age || ""} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors" placeholder="Your age" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select name="gender" value={formData.gender || "Prefer not to say"} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="mt-8">
                <button type="submit" disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? "Saving..." : "Save Basic Info"}
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
