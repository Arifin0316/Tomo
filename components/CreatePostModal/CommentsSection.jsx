// components/CommentsSection/CommentsSection.jsx
'use client';

import { useState, useEffect } from 'react';
import { getComments } from "@/lib/posting";

const CommentsSection = ({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const fetchedComments = await getComments(postId);
        setComments(fetchedComments);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, refreshTrigger]); // Add refreshTrigger to dependency array

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <div className="border-t pt-4 overflow-y-auto max-h-64">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="mb-3">
            <div className="flex items-center">
              <img
                src={comment.user?.profile?.profilePic || "/default-profile.png"}
                alt="Commenter"
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <span className="font-semibold mr-2">{comment.user?.username}</span>
                <span>{comment.content}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No comments yet</p>
      )}
    </div>
  );
};

export default CommentsSection;