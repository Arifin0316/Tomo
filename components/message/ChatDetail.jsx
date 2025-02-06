import React, { useState, useEffect, useCallback } from 'react';
import { 
  MoreHorizontal, 
  Phone, 
  Video, 
  Smile, 
  Send, 
  Image, 
  Paperclip 
} from 'lucide-react';
import { getChatMessages, sendMessage } from '@/lib/message';
import { useSession } from 'next-auth/react';

export default function ChatDetail({ selectedChat }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const loadMessages = useCallback(async () => {
    if (selectedChat && session?.user?.id) {
      const chatMessages = await getChatMessages(
        selectedChat.chatId, 
        session.user.id
      );
      
      // Only update if there are new messages
      setMessages(prevMessages => {
        // Compare the length and last message to avoid unnecessary updates
        if (
          chatMessages.length !== prevMessages.length || 
          (chatMessages.length > 0 && 
           prevMessages.length > 0 && 
           chatMessages[chatMessages.length - 1].id !== prevMessages[prevMessages.length - 1].id)
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
        type: 'sent',
        timestamp: new Date().toISOString()
      };

      // Update UI immediately
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
      setNewMessage('');

      try {
        // Send message to server
        await sendMessage(
          selectedChat.chatId, 
          session.user.id, 
          newMessage
        );

        // Refresh messages to get the actual server-side message
        loadMessages();
      } catch (error) {
        console.error('Failed to send message', error);
        // Remove optimistic message if send fails
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== optimisticMessage.id)
        );
      }
    }
  };

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Pilih percakapan
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <img 
            src={selectedChat.user?.profile?.profilePic || "/default-profile.png"} 
            alt={selectedChat.user?.username} 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="font-semibold">{selectedChat.user?.username}</h2>
            <p className="text-xs text-gray-500">Active now</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button>
            <Phone size={24} className="text-gray-600" />
          </button>
          <button>
            <Video size={24} className="text-gray-600" />
          </button>
          <button>
            <MoreHorizontal size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs p-3 rounded-2xl ${
                message.type === 'sent' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-black'
              }`}
            >
              {message.content}
              <div className="text-xs mt-1 opacity-70 text-right">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t flex items-center space-x-2">
        <button>
          <Smile size={24} className="text-gray-600" />
        </button>
        <button>
          <Image size={24} className="text-gray-600" />
        </button>
        <button>
          <Paperclip size={24} className="text-gray-600" />
        </button>
        <div className="flex-1">
          <input 
            type="text"
            placeholder="Kirim pesan..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 bg-gray-100 rounded-full focus:outline-none"
          />
        </div>
        <button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send 
            size={24} 
            className={`${
              newMessage.trim() 
                ? 'text-blue-500' 
                : 'text-gray-400'
            }`} 
          />
        </button>
      </div>
    </div>
  );
}