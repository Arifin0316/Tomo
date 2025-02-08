"use client";

import React, { useState } from 'react';
import ChatList from '@/components/message/ChatList';
import ChatDetail from '@/components/message/ChatDetail';

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [chatListKey, setChatListKey] = useState(0);
  const refreshChatList = () => setChatListKey(prev => prev + 1);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowDetail(true);
    if (refreshChatList) refreshChatList(); 
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${showDetail ? 'hidden' : 'w-full'} md:w-96 md:block border-r border-gray-200`}>
      <ChatList key={chatListKey} onSelectChat={handleSelectChat} refreshChatList={refreshChatList} />
      </div>
      
      <div className={`${showDetail ? 'w-full' : 'hidden'} md:block flex-1`}>
        <ChatDetail 
          selectedChat={selectedChat} 
          onBack={() => setShowDetail(false)}
        />
      </div>
    </div>
  );
}