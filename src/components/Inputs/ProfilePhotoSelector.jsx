import React, { useState, useRef } from "react";

const ProfilePhotoSelector = ({ photo, onUpload, onRemove }) => {
  const [preview, setPreview] = useState(photo || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      try {
        await onUpload(e);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload photo. Please try again.");
        setPreview(photo || null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm">No photo</span>
            </div>
          )}
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition-colors duration-200"
        >
          {isUploading ? "Uploading..." : preview ? "Change Photo" : "Upload Photo"}
        </button>

        {preview && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-red-50 border border-red-300 text-red-700 hover:text-red-800 font-medium rounded-lg transition-colors duration-200"
          >
            Remove Photo
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 text-center max-w-xs">
        Choose a clear photo that represents you well. JPG, PNG, or GIF format.
      </p>
    </div>
  );
};

export default ProfilePhotoSelector;
