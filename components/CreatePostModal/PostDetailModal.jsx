"use client";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {
  Heart,
  MessageCircle,
  X,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import CommentsSection from "@/components/CreatePostModal/CommentsSection";
import CommentInput from "@/components/CreatePostModal/CommentInput";
import EditPostModal from "@/components/CreatePostModal/EditPostModal";
import { deletePost } from "@/lib/posting";

const UserOptionsDropdown = ({ user, post, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    onEdit();
    setIsOpen(false);
  };

  const handleDelete = async () => {
    // Confirmation toast
    toast((t) => (
      <div>
        <p>Are you sure you want to delete this post?</p>
        <div className="flex justify-end mt-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="mr-2 bg-gray-200 px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const result = await deletePost(post.id);
                if (result.success) {
                  toast.success('Post deleted successfully!');
                  onDelete();
                } else {
                  toast.error(`Failed to delete post: ${result.message}`);
                }
              } catch (error) {
                toast.error('An error occurred while deleting the post');
              }
            }} 
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      style: {
        border: '1px solid #ccc',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '16px',
      },
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={handleEdit}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

const PostDetailModal = ({ user, onClose, post: initialPost }) => {
  const [post, setPost] = useState(initialPost);
  const [refreshComments, setRefreshComments] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCommentSubmit = () => {
    setRefreshComments((prev) => prev + 1);
  };

  const handlePostUpdate = (updatedPost) => {
    setPost(updatedPost);
  };

  const handlePostDelete = () => {
    onClose(); // Close the modal after successful deletion
  };

  return (
    <>
      {/* Add Toaster for notifications */}
      <Toaster position="top-right" />
      
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-4xl w-full flex">
          {/* Image Section */}
          <div className="w-3/5">
            <img
              src={post.image || "/default-post.png"}
              alt="Post"
              className="w-full h-[600px] object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="w-2/5 p-6 flex flex-col">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={user.profile?.profilePic || "/default-profile.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="font-semibold">{user.username}</span>
              </div>

              {/* Only show options if the current user is the post owner */}
              {user.id === post.userId && (
                <UserOptionsDropdown
                  user={user}
                  post={post}
                  onEdit={() => setIsEditModalOpen(true)}
                  onDelete={handlePostDelete}
                />
              )}
            </div>

            <div className="flex-grow">
              <p className="mb-4">{post.content}</p>
              {/* Pass refreshTrigger to CommentsSection */}
              <CommentsSection
                postId={post.id}
                refreshTrigger={refreshComments}
              />
            </div>

            {/* Interactions */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-6 h-6 text-gray-600" />
                <span>{post.likes?.length || 0} Likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-6 h-6 text-gray-600" />
                <span>{post.comments?.length || 0} Comments</span>
              </div>
            </div>

            {/* Comment Input */}
            <CommentInput postId={post.id} onSubmit={handleCommentSubmit} />
          </div>
        </div>
      </div>
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onPostUpdate={handlePostUpdate}
      />
    </>
  );
};

export default PostDetailModal;