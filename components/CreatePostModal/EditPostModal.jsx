// components/EditPostModal/EditPostModal.js
"use client"
import React, { useState, useEffect } from 'react';
import { updatePost } from '@/lib/posting';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const EditPostModal = ({ isOpen, onClose, post, onPostUpdate }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialImage, setInitialImage] = useState(null);

  // Reset form when post changes
  useEffect(() => {
    if (post) {
      setCaption(post.content || '');
      setImage(post.image);
      setInitialImage(post.image);
    }
  }, [post]);

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
      // Only send image if it's changed
      const imageToSend = image !== initialImage ? image : null;

      const result = await updatePost({
        postId: post.id,
        image: imageToSend,
        caption
      });
      
      if (result.success) {
        toast.success('Post updated successfully!');
        onPostUpdate(result.post);
        onClose();
      } else {
        toast.error(result.message || 'Failed to update post');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset to initial state
    setImage(initialImage);
    setCaption(post.content || '');
    onClose();
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-4">Edit Post</h2>
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
            <div className="relative">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-md" 
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
              >
                Remove
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
              disabled={isSubmitting || (!image && !caption.trim())}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;