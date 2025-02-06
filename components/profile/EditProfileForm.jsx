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
 
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.submit}
          </div>
        )}
 
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            
            <Field
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              error={errors.website}
            />
          </div>
 
          <Field
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            multiline
          />
 
          <Field
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
 
          <ImageUpload
            label="Profile Picture"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            previewClassName="w-32 h-32 rounded-full"
          />
 
          <ImageUpload
            label="Cover Picture"
            name="coverPic"
            value={formData.coverPic}
            onChange={handleChange}
            previewClassName="w-full h-48 rounded-lg"
          />
        </div>
 
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
 };
 
 const Field = ({ label, name, value, onChange, error, multiline }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {multiline ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="4"
        className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${
          error ? 'border-red-500' : ''
        }`}
      />
    )}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
 );
 
 const ImageUpload = ({ label, name, value, onChange, previewClassName }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type="file"
      name={name}
      accept="image/*"
      onChange={onChange}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
    {value && (
      <div className="mt-3">
        <img 
          src={value} 
          alt={`${label} Preview`} 
          className={`object-cover ${previewClassName}`}
        />
      </div>
    )}
  </div>
 );
 
 export default EditProfileForm;