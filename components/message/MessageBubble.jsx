// components/Chat/MessageBubble.js
import React from 'react';

const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isCurrentUser ? 'bg-indigo-500 text-white' : 'bg-gray-200'
        }`}
      >
        <p>{message.content}</p>
        <span className="text-xs text-gray-400 block mt-1">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;