// components/CommentInput/CommentInput.js
'use client';

import React, { useState } from 'react';
import { createComment } from '@/lib/posting';
import { toast } from 'react-hot-toast';

const CommentInput = ({ postId, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment({
        postId,
        content: comment
      });

      if (result.success) {
        setComment('');
        toast.success('Comment added successfully');
        // Call the onSubmit callback to trigger refresh
        onSubmit();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded-full px-4 py-2"
          disabled={isSubmitting}
        />
        {isSubmitting && <p className="text-sm text-gray-500 mt-1">Posting comment...</p>}
      </form>
    </div>
  );
};

export default CommentInput;