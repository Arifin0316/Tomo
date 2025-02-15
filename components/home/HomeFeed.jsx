"use client";
import SendMessageModal from "../CreatePostModal/SendMessageModal";
import { useState, useTransition } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreVertical,
} from "lucide-react";
import PostDetailModal from "@/components/CreatePostModal/PostDetailModal";
import { createOrGetChat, sendMessage } from "@/lib/message";
import { useSession } from "next-auth/react";
import { togglePostLike } from "@/lib/home";
import toast from "react-hot-toast";
import Link from "next/link";

const HomeFeed = ({ initialPosts }) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [messageReceiver, setMessageReceiver] = useState(null);

  const handlePostSelect = (post, user) => {
    setSelectedPost(post);
    setSelectedUser(user);
  };

  const handleSendMessage = (receiver) => {
    if (!session?.user?.id) {
      toast.error("Please log in to send a message");
      return;
    }
    setMessageReceiver(receiver);
  };

  const handleLike = (postId) => {
    startTransition(async () => {
      try {
        const result = await togglePostLike(postId);

        if (result.success) {
          const updatedPosts = posts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes:
                    result.action === "liked"
                      ? [...post.likes, { userId: "current_user" }]
                      : post.likes.filter(
                          (like) => like.userId !== "current_user"
                        ),
                }
              : post
          );

          setPosts(updatedPosts);

          toast(result.action === "liked" ? "Post liked!" : "Post unliked", {
            icon: result.action === "liked" ? "❤️" : "💔",
          });
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to toggle like");
      }
    });
  };

  return (
    <>
    <div className="max-w-xl mx-auto space-y-8 py-8 px-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between p-4">
            <Link
              href={`profile/${post.user.username}`}
              className="flex items-center group"
            >
              <img
                src={post.user.profile?.profilePic || "/default-profile.png"}
                alt={`${post.user.username}'s profile`}
                className="w-10 h-10 rounded-full mr-3 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-300 transition-all"
              />
              <span className="font-semibold text-gray-800 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                {post.user.username}
              </span>
            </Link>
            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Post Image */}
          <div
            onClick={() => handlePostSelect(post, post.user)}
            className="cursor-pointer group"
          >
            <img
              src={post.image || "/default-post.png"}
              alt="Post"
              className="w-full aspect-square object-cover transition-transform group-hover:scale-105 duration-300"
            />
          </div>

          {/* Post Interactions */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLike(post.id)}
                  disabled={isPending}
                  className="group flex items-center space-x-1 hover:text-gray-600 dark:hover:text-white"
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      post.likes.some((like) => like.userId === "current_user")
                        ? "text-red-500 fill-current scale-110"
                        : "text-gray-600 dark:text-gray-400 group-hover:text-red-500"
                    }`}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white">
                    {post.likes.length}
                  </span>
                </button>
                <button
                  onClick={() => handlePostSelect(post, post.user)}
                  className="group flex items-center space-x-1 hover:text-gray-600 dark:hover:text-white"
                >
                  <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white">
                    {post.comments.length}
                  </span>
                </button>
                <button
                  onClick={() => handleSendMessage(post.user)}
                  className="group hover:text-gray-600 dark:hover:text-white"
                >
                  <Send className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-green-500" />
                </button>
              </div>
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* Likes and Caption */}
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                {post.likes.length} likes
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <span className="font-semibold mr-2">{post.user.username}</span>
                {post.content}
              </p>
              {post.comments.length > 0 && (
                <button
                  onClick={() => handlePostSelect(post, post.user)}
                  className="text-gray-500 dark:text-gray-400 mt-1 text-sm hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  View {post.comments.length} comments
                </button>
              )}
            </div>
          </div>
        </div>
        
      ))}
    </div>
       {/* Post Detail Modal */}
       {selectedPost && selectedUser && (
        <PostDetailModal
          user={selectedUser}
          post={selectedPost}
          onClose={() => {
            setSelectedPost(null);
            setSelectedUser(null);
          }}
        />
      )}
      {messageReceiver && (
        <SendMessageModal
          receiver={messageReceiver}
          onClose={() => setMessageReceiver(null)}
        />
      )}
    </>
  );
};

export default HomeFeed;
