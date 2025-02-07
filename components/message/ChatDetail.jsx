import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  Phone,
  Video,
  Smile,
  Send,
  Image,
  Paperclip,
} from "lucide-react";
import { getChatMessages, sendMessage, markMessagesAsRead } from "@/lib/message";
import { useSession } from "next-auth/react";
import EmojiPicker from 'emoji-picker-react';

export default function ChatDetail({ selectedChat, onBack }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const loadMessages = useCallback(async () => {
    if (selectedChat && session?.user?.id) {
      const chatMessages = await getChatMessages(
        selectedChat.chatId,
        session.user.id
      );

      // Only update if there are new messages
      setMessages((prevMessages) => {
        if (
          chatMessages.length !== prevMessages.length ||
          (chatMessages.length > 0 &&
            prevMessages.length > 0 &&
            chatMessages[chatMessages.length - 1].id !==
              prevMessages[prevMessages.length - 1].id)
        ) {
          return chatMessages;
        }
        return prevMessages;
      });
    }
  }, [selectedChat, session]);

  // Initial load and periodic polling
  useEffect(() => {
    // Load messages immediately
    loadMessages();

    // Poll for new messages every 3 seconds
    const intervalId = setInterval(loadMessages, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [loadMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat && session?.user?.id) {
      // Optimistically add message to UI
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: newMessage,
        type: "sent",
        timestamp: new Date().toISOString(),
      };

      // Update UI immediately
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
      setNewMessage("");

      try {
        // Send message to server
        await sendMessage(selectedChat.chatId, session.user.id, newMessage);

        // Refresh messages to get the actual server-side message
        loadMessages();
      } catch (error) {
        console.error("Failed to send message", error);
        // Remove optimistic message if send fails
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== optimisticMessage.id)
        );
      }
    }
  };

  useEffect(() => {
    if (selectedChat && session?.user?.id) {
      markMessagesAsRead(selectedChat.chatId, session.user.id);
      loadMessages();
    }
  }, [selectedChat, session?.user?.id]);

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="p-5 flex justify-between items-center border-b dark:border-gray-700">
        <div className="flex items-center">
          <button 
            onClick={onBack} 
            className="mr-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft size={24} />
          </button>
          <img
            src={selectedChat.user?.profile?.profilePic || "/default-profile.png"}
            alt={selectedChat.user?.username}
            className="w-12 h-12 rounded-full mr-4 ring-2 ring-gray-200 dark:ring-gray-700"
          />
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white">
              {selectedChat.user?.username}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active now
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Phone size={24} />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Video size={24} />
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "sent" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl shadow-sm ${
                message.type === "sent"
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              {message.content}
              <div className={`text-xs mt-1 opacity-70 text-right ${
                message.type === "sent" ? "text-blue-100" : "text-gray-500 dark:text-gray-300"
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Message Input */}
      <div className="p-5 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <Smile size={24} />
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Image size={24} />
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            <Paperclip size={24} />
          </button>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Send a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 
                rounded-xl text-sm 
                text-gray-800 dark:text-white
                focus:outline-none 
                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                transition-all duration-300"
            />
          </div>
          <button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            className="p-2 rounded-full transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Send
              size={24}
              className={`${
                newMessage.trim() 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-400 dark:text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}