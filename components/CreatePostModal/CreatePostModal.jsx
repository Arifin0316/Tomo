// components/CreatePostModal/CreatePostModal.js
"use client"
import React, { useState } from 'react';
import { createPost } from '@/lib/posting';
import { toast } from 'react-hot-toast'; // Optional: for notifications

const CreatePostModal = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createPost({ image, caption });
      
      if (result.success) {
        toast.success('Post created successfully!');
        // Reset form
        setImage(null);
        setCaption('');
        onClose();
      } else {
        toast.error(result.message || 'Failed to create post');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImage(null);
    setCaption('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isSubmitting}
            />
          </div>
          {image && (
            <div>
              <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-md" />
              <button
                type="button"
                onClick={() => setImage(null)}
                className="mt-2 text-red-500 text-sm"
              >
                Remove Image
              </button>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows="3"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              disabled={isSubmitting || (!image && !caption)}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;