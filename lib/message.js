"use server"
import prisma from "@/lib/prisma";



// Get chat list for a user
export async function getChatList(userId) {
  const chats = await prisma.chatMember.findMany({
    where: { userId },
    include: {
      chat: {
        include: {
          members: {
            include: { user: { select: { id: true, username: true, profile: true } } }
          },
          messages: {
            where: {
              AND: [
                { isRead: false },
                { userId: { not: userId } } // Pesan dari pengguna lain
              ]
            },
            select: { id: true }
          },
          _count: {
            select: {
              messages: {
                where: {
                  AND: [
                    { isRead: false },
                    { userId: { not: userId } }
                  ]
                }
              }
            }
          }
        }
      }
    }
  });

  return chats.map(chatMember => ({
    chatId: chatMember.chat.id,
    user: chatMember.chat.members.find(m => m.userId !== userId)?.user,
    lastMessage: chatMember.chat.messages[0]?.content,
    timestamp: chatMember.chat.messages[0]?.createdAt,
    unreadCount: chatMember.chat._count.messages
  }));
}

export async function markMessagesAsRead(chatId, userId) {
  await prisma.message.updateMany({
    where: {
      chatId,
      userId: { not: userId },
      isRead: false
    },
    data: { isRead: true }
  });
}
// Get messages for a specific chat
export async function getChatMessages(chatId, userId) {
  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { id: true, username: true, profile: true } } }
  })

  return messages.map(message => ({
    id: message.id,
    content: message.content,
    image: message.image,
    timestamp: message.createdAt,
    sender: {
      id: message.user.id,
      username: message.user.username,
      profilePic: message.user.profile?.profilePic
    },
    type: message.userId === userId ? 'sent' : 'received'
  }))
}

// Create a new message
export async function sendMessage(chatId, userId, content, image) {
  return await prisma.message.create({
    data: {
      chatId,
      userId,
      content,
      image
    }
  })
}

// Create a new chat
export async function createChat(participants) {
  return await prisma.chat.create({
    data: {
      members: {
        create: participants.map(userId => ({ userId }))
      }
    }
  })
}


export async function createOrGetChat(currentUserId, otherUserId) {
  try {
    // Existing implementation
    let chat = await prisma.chat.findFirst({
      where: {
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: otherUserId } } }
        ]
      }
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          members: {
            create: [
              { userId: currentUserId },
              { userId: otherUserId }
            ]
          }
        }
      });
    }

    return chat;
  } catch (error) {
    console.error('Failed to create or get chat:', error);
    throw error;
  }
}