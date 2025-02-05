"use client";
import React, { useState } from 'react';

const EditProfileForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    website: user?.profile?.website || '',
    profilePic: user?.profile?.profilePic || '',
    coverPic: user?.profile?.coverPic || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      // Handle file upload
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [name]: reader.result
        }));
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (formData.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {errors.submit}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.username ? 'border-red-500' : ''}`}
        />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Website</label>
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.website ? 'border-red-500' : ''}`}
        />
        {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <input
          type="file"
          name="profilePic"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
        {formData.profilePic && (
          <img 
            src={formData.profilePic} 
            alt="Profile Preview" 
            className="mt-2 w-32 h-32 object-cover rounded-full"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Picture</label>
        <input
          type="file"
          name="coverPic"
          accept="image/*"
          onChange={handleChange}
          className="mt-1 block w-full"
        />
        {formData.coverPic && (
          <img 
            src={formData.coverPic} 
            alt="Cover Preview" 
            className="mt-2 w-full h-48 object-cover"
          />
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;