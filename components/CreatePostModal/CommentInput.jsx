import React, { useState } from 'react';
import { createComment } from '@/lib/posting';
import { toast } from 'react-hot-toast';
import { Send, Loader2 } from 'lucide-react';

const CommentInput = ({ postId, onSubmit }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please write something');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createComment({ postId, content: comment });
      
      if (result.success) {
        setComment('');
        toast.success('Comment posted');
        onSubmit();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-full px-4 py-2.5 pr-12
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:outline-none
            placeholder-gray-500 dark:placeholder-gray-400
            text-gray-800 dark:text-gray-200"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2
            p-1.5 rounded-full
            bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700
            text-white transition-colors"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default CommentInput;