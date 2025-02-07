import React, { useState, useEffect } from 'react';
import { Edit, Search } from 'lucide-react';
import { getChatList } from '@/lib/message';
import { useSession } from 'next-auth/react';

export default function ChatList({ onSelectChat, refreshChatList }) {
  const { data: session } = useSession();
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadChats() {
      if (session?.user?.id) {
        const userChats = await getChatList(session.user.id);
        setChats(userChats);
      }
    }
    loadChats();
  }, [session]);

  const filteredChats = chats.filter(chat => 
    chat.user?.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Messages</h2>
        <button className="text-blue-600 dark:text-blue-400 
          hover:bg-blue-50 dark:hover:bg-blue-900/20 
          p-2 rounded-full transition-colors">
          <Edit size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-6 pb-0">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search conversations" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 
              bg-gray-100 dark:bg-gray-700 
              rounded-xl text-sm 
              text-gray-800 dark:text-white
              border border-transparent
              focus:outline-none 
              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
              focus:border-transparent
              transition-all duration-300
              placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Search 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 
              text-gray-500 dark:text-gray-400" 
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <div 
              key={chat.chatId} 
              onClick={() => onSelectChat(chat)}
              className="flex items-center p-4 
                hover:bg-gray-50 dark:hover:bg-gray-700 
                cursor-pointer 
                transition-colors 
                group"
            >
              <div className="relative mr-4">
                <img 
                  src={chat.user?.profile?.profilePic || "/default-profile.png"} 
                  alt={chat.user?.username} 
                  className="w-14 h-14 rounded-full 
                    ring-2 ring-gray-200 dark:ring-gray-700 
                    group-hover:ring-gray-300 dark:group-hover:ring-gray-600 
                    transition-all"
                />
                {chat.unreadCount > 0 && (
                  <span className="absolute bottom-0 right-0 
                    bg-blue-500 text-white 
                    rounded-full 
                    w-5 h-5 
                    flex items-center justify-center 
                    text-xs 
                    ring-2 ring-white dark:ring-gray-800">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                    {chat.user?.username}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-grow">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <p>No conversations found</p>
            <p className="text-sm mt-2">Start a new chat or adjust your search</p>
          </div>
        )}
      </div>
    </div>
  );
}