import { useState, useEffect } from 'react';
import { getComments } from "@/lib/posting";
import { Loader2 } from "lucide-react";

const CommentSkeleton = () => (
  <div className="animate-pulse mb-4">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="flex-1">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

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
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, refreshTrigger]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400 text-sm text-center">
          Failed to load comments
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      {isLoading ? (
        <div className="space-y-4 p-4">
          {[1, 2, 3].map(i => <CommentSkeleton key={i} />)}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 p-4">
          {comments.map((comment) => (
            <div key={comment.id} className="group">
              <div className="flex items-start gap-3">
                <img
                  src={comment.user?.profile?.profilePic || "/default-profile.png"}
                  alt={comment.user?.username}
                  className="w-8 h-8 rounded-full ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-800"
                />
                <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm dark:text-gray-200">
                      {comment.user?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No comments yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;