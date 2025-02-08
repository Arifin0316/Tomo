"use client";
import React, { useState } from 'react';
import { ImageUp, X } from 'lucide-react';

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
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({...prev, [name]: reader.result}));
      };
      if (file) reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({...prev, [name]: value}));
    }
    if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
  };
 
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
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
 
  const handleRemoveImage = (field) => {
    setFormData(prev => ({...prev, [field]: ''}));
  };
 
  return ( 
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-2xl transition-all duration-300">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.submit && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center">
            <span>{errors.submit}</span>
          </div>
        )}
 
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Your username"
            />
            
            <InputField
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={errors.website}
              placeholder="https://yourwebsite.com"
            />
          </div>
 
          <InputField
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
            placeholder="Tell us about yourself"
          />
 
          <InputField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your current city"
          />
 
          <ImageUploadField
            label="Profile Picture"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            onRemove={() => handleRemoveImage('profilePic')}
            previewClassName="w-32 h-32 rounded-full object-cover"
          />
 
          <ImageUploadField
            label="Cover Picture"
            name="coverPic"
            value={formData.coverPic}
            onChange={handleChange}
            onRemove={() => handleRemoveImage('coverPic')}
            previewClassName="w-full h-48 rounded-lg object-cover"
          />
        </div>
 
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md shadow-blue-500/30 dark:shadow-blue-700/30 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};
 
const InputField = ({ label, name, value, onChange, error, multiline, placeholder }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    {multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="4"
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all duration-300 resize-none"
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-xl border ${
          error 
            ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-700 focus:ring-blue-500 dark:focus:ring-blue-600'
        } dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 transition-all duration-300`}
      />
    )}
    {error && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>}
  </div>
);
 
const ImageUploadField = ({ label, name, value, onChange, onRemove, previewClassName }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      <input
        type="file"
        name={name}
        accept="image/*"
        onChange={onChange}
        className="hidden"
        id={`${name}-upload`}
      />
      <label 
        htmlFor={`${name}-upload`} 
        className="flex items-center justify-center w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer"
      >
        <ImageUp className="mr-2" />
        Upload {label}
      </label>
    </div>
    
    {value && (
      <div className="mt-4 relative">
        <img 
          src={value} 
          alt={`${label} Preview`} 
          className={`${previewClassName} relative`}
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    )}
  </div>
);
 
export default EditProfileForm;