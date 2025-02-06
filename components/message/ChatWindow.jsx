// components/Chat/ChatWindow.js
import React from 'react';
import MessageBubble from '@/components/message/MessageBubble';
import MessageInput from '@/components/message/MessageInput';

const ChatWindow = ({ chat, currentUserId, onSendMessage }) => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {chat.messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isCurrentUser={message.userId === currentUserId}
          />
        ))}
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default ChatWindow;