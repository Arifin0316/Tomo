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
  const unreadCount = chats
  console.log(unreadCount)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Pesan</h2>
        <button className="text-blue-500">
          <Edit size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none"
          />
          <Search 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => (
          <div 
            key={chat.chatId} 
            onClick={() => onSelectChat(chat)}
            className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
          >
            <img 
              src={chat.user?.profile?.profilePic || "/default-profile.png"} 
              alt={chat.user?.username} 
              className="w-14 h-14 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{chat.user?.username}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(chat.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                {chat.unreadCount > 0 && (
                  <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}