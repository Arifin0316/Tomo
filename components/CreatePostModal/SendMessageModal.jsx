"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { createOrGetChat, sendMessage } from "@/lib/message";
import toast from "react-hot-toast";

const SendMessageModal = ({ receiver, onClose }) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("Please log in to send a message");
      return;
    }
    if (!message.trim()) return;

    setIsSending(true);
    try {
      const chat = await createOrGetChat(session.user.id, receiver.id);
      await sendMessage(chat.id, session.user.id, message);
      toast.success("Message sent!");
      onClose();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-xl transform transition-all">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white">
            Send Message to {receiver.username}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl
                text-sm text-gray-800 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
                dark:focus:ring-blue-400 transition-all"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="p-3 rounded-xl bg-blue-500 hover:bg-blue-600 
                dark:bg-blue-600 dark:hover:bg-blue-700 text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors flex items-center justify-center"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMessageModal;