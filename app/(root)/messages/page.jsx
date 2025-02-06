"use client";

import React, { useState } from 'react';
import ChatList from '@/components/message/ChatList';
import ChatDetail from '@/components/message/ChatDetail';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen bg-white">
      {/* Chat List Sidebar */}
      <div className="w-full md:w-96 border-r border-gray-200">
        <ChatList onSelectChat={setSelectedChat} />
      </div>
      
      {/* Chat Detail (Hidden on mobile) */}
      <div className="hidden md:block flex-1">
        <ChatDetail selectedChat={selectedChat} />
      </div>
    </div>
  );
}