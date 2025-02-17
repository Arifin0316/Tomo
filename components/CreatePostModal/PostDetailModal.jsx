import { useState, useTransition } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Heart,
  MessageCircle,
  X,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
} from "lucide-react";
import CommentsSection from "@/components/CreatePostModal/CommentsSection";
import CommentInput from "@/components/CreatePostModal/CommentInput";
import EditPostModal from "@/components/CreatePostModal/EditPostModal";
import { deletePost } from "@/lib/posting";
import { useSession } from "next-auth/react";
import { togglePostLike } from "@/lib/home";

const UserOptionsDropdown = ({ user, post, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete this post?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const result = await deletePost(post.id);
                if (result.success) {
                  toast.success("Post deleted");
                  onDelete();
                } else {
                  toast.error(result.message);
                }
              } catch (error) {
                toast.error("Failed to delete post");
              }
            }}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 text-sm transition-colors"
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
  const { data: session, status } = useSession();
  const [post, setPost] = useState(initialPost);
  const [refreshComments, setRefreshComments] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLiked = post.likes?.some((like) => like.userId === session?.user?.id);

  const handleLike = () => {
    if (!session?.user?.id) {
      toast.error("Please log in to like posts");
      return;
    }

    startTransition(async () => {
      try {
        const result = await togglePostLike(post.id);

        if (result.success) {
          // Update post state with new likes
          setPost((prev) => ({
            ...prev,
            likes:
              result.action === "liked"
                ? [...prev.likes, { userId: session.user.id }]
                : prev.likes.filter((like) => like.userId !== session.user.id),
          }));

          // Show success toast
          toast(result.action === "liked" ? "Post liked!" : "Post unliked", {
            icon: result.action === "liked" ? "❤️" : "💔",
          });
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Like error:", error);
        toast.error("Failed to update like");
      }
    });
  };

  return (
    <>
      <div className="fixed inset-0 h-screen w-full bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl shadow-2xl transform transition-all">
          {/* Responsive container */}
          <div className="flex flex-col md:flex-row">
            {/* Image Section - Full width on mobile, 3/5 on desktop */}
            <div className="w-full md:w-3/5 bg-black">
              <img
                src={post.image || "/default-post.png"}
                alt="Post"
                className="w-full h-[300px] md:h-[600px] object-cover"
              />
            </div>

            {/* Details Section - Full width on mobile, 2/5 on desktop */}
            <div className="w-full md:w-2/5 flex flex-col bg-white dark:bg-gray-900">
              {/* Header */}
              <div className="p-4 border-b dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profile?.profilePic || "/default-profile.png"}
                      alt="Profile"
                      className="w-10 h-10 rounded-full ring-2 ring-offset-2 ring-gray-100 dark:ring-gray-800"
                    />
                    <div>
                      <span className="font-semibold dark:text-white">
                        {user.username}
                      </span>
                      <p className="text-xs text-gray-500">Original Poster</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.id === session?.user?.id && (
                      <UserOptionsDropdown
                        user={user}
                        post={post}
                        onEdit={() => setIsEditModalOpen(true)}
                        onDelete={onClose}
                      />
                    )}
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content & Comments - Scrollable */}
              <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-[400px]">
                <div className="p-4">
                  <p className="text-gray-800 dark:text-gray-200 mb-4">
                    {post.content}
                  </p>
                </div>
                <CommentsSection
                  postId={post.id}
                  refreshTrigger={refreshComments}
                />
              </div>

              {/* Footer */}
              <div className="border-t dark:border-gray-800 p-4">
                {/* Interactions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      disabled={isPending}
                      className="flex items-center gap-1 group"
                    >
                      <Heart
                        className={`w-6 h-6 transition-all ${
                          isLiked
                            ? "fill-red-500 text-red-500 scale-110"
                            : "text-gray-600 dark:text-gray-400 group-hover:text-red-500"
                        } ${isPending ? "opacity-50" : ""}`}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {post.likes?.length || 0}
                      </span>
                    </button>
                    <button className="flex items-center gap-1 group">
                      <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {post.comments?.length || 0}
                      </span>
                    </button>
                    <button className="flex items-center gap-1 group">
                      <Share2 className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-green-500" />
                    </button>
                  </div>
                </div>

                {/* Comment Input */}
                <CommentInput
                  postId={post.id}
                  onSubmit={() => setRefreshComments((prev) => prev + 1)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        post={post}
        onPostUpdate={setPost}
      />
    </>
  );
};

export default PostDetailModal;
