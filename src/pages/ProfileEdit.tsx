import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaUser, FaSave, FaTimes } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateProfile } from "../store/slices/profileSlice";

import PageLoader from "./Fallbacks/PageLoader";

interface FormData {
  name: string;
  bio: string;
  avatar: string;
}

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.profile);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    bio: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);

  // Load data from Redux state
  useEffect(() => {
    if (profileData.id) {
      setFormData({
        name: profileData.name,
        bio: profileData.bio || "",
        avatar: profileData.avatar,
      });
    }
    setLoading(false);
  }, [profileData]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (
    field: "avatar",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({ ...prev, [field]: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    navigate(-1);
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="rounded-lg border bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                navigate(-1);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <FaTimes className="mr-2 inline" />
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <FaSave className="mr-2 inline" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Profile Picture
        </h2>
        <div className="flex flex-col items-center gap-4">
          {/* Dashed Upload Box */}
          <label className="relative cursor-pointer">
            <div className="flex h-50 w-50 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
              {formData.avatar ? (
                <div className="relative h-full w-full p-5">
                  <img
                    src={formData.avatar}
                    alt="Profile"
                    className="h-full w-full rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <FaCamera size={32} className="mb-3 text-gray-400" />
                  <span className="text-lg font-medium">Upload Photo</span>
                  <span className="mt-1 text-sm">Click to select image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload("avatar", e)}
              className="hidden"
            />
          </label>

          {/* Upload Instructions */}
          <div className="text-center text-sm text-gray-600">
            <p className="font-medium">Recommended size: 400 x 400px</p>
            <p className="mt-1">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Basic Information
        </h2>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            <FaUser className="mr-2 inline" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your full name"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
    </form>
  );
};

export default ProfileEdit;
