"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Home, Search, PlusSquare, User, MessageCircle, Compass
} from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import CreatePostModal from '@/components/CreatePostModal/CreatePostModal';
import SearchComponent from '@/components/Search/SearchComponent';
import { getChatList } from "@/lib/message"

const NavItem = ({ icon, label, href, isActive, onClick, isAuthAction }) => {
  // Handle Create Post button
  if (label === 'Buat') {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-300
          ${isActive 
            ? 'bg-gray-100 dark:bg-gray-700' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
          <div className="w-6 h-6 text-gray-700 dark:text-gray-300">
            {icon}
          </div>
          <span className={`hidden sm:block text-sm font-medium text-gray-800 dark:text-white
            ${isActive ? 'font-semibold' : ''}`}>
            {label}
          </span>
        </div>
      </div>
    );
  }

  if (label === 'Cari') {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-300
          ${isActive 
            ? 'bg-gray-100 dark:bg-gray-700' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
          <div className="w-6 h-6 text-gray-700 dark:text-gray-300">
            {icon}
          </div>
          <span className={`hidden sm:block text-sm font-medium text-gray-800 dark:text-white
            ${isActive ? 'font-semibold' : ''}`}>
            {label}
          </span>
        </div>
      </div>
    );
  }

  // Regular nav items
  return (
    <Link href={href}>
      <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-300
        ${isActive 
          ? 'bg-gray-100 dark:bg-gray-700' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
        <div className="w-6 h-6 text-gray-700 dark:text-gray-300">
          {icon}
        </div>
        <span className={`hidden sm:block text-sm font-medium text-gray-800 dark:text-white
          ${isActive ? 'font-semibold' : ''}`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function getUnreadCount() {
      if (session?.user?.id) {
        const chats = await getChatList(session.user.id);
        const total = chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
        setUnreadCount(total);
      }
    }
    getUnreadCount();
    const interval = setInterval(getUnreadCount, 3000);
    return () => clearInterval(interval);
  }, [session]);

  const handleLogin = (e) => {
    e.preventDefault();
    signIn();
  };

  const navItems =  [
    { icon: <Home />, label: 'Beranda', href: '/' },
    { 
      icon: <Search />, 
      label: 'Cari', 
      href: '#', 
      onClick: () => {
        setIsSearchModalOpen(true);
      }
    },
    { icon: <Compass />, label: 'Jelajah', href: '/explore' },
    { 
      icon: (
        <div className="relative">
          <MessageCircle />
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
      ), 
      label: 'Pesan', 
      href: '/messages' 
    },
    { 
      icon: <PlusSquare />, 
      label: 'Buat', 
      href: '#', 
      onClick: () => setIsCreateModalOpen(true) 
    },
    { icon: <User />, label: 'Profil', href: `/profile/${session?.user?.username}` },
  ];

  return (
    <>
      {/* Sidebar for tablet and desktop */}
      <div className="hidden z-50 sm:fixed sm:flex sm:left-0 sm:h-full border-r bg-white dark:bg-gray-900 dark:border-gray-700 sm:w-16 md:w-64 py-4 flex-col relative transition-colors duration-300">
        {/* Bagian navbar */}
        <nav className="flex-1 px-2">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              <NavItem
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                onClick={
                  item.label === 'Cari' 
                    ? () => setIsSearchModalOpen(!isSearchModalOpen) 
                    : item.onClick
                }
                isAuthAction={item.isAuthAction}
              />
              {item.label === 'Cari' && isSearchModalOpen && (
                <SearchComponent 
                  isOpen={true}
                  onClose={() => setIsSearchModalOpen(false)}
                />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed z-50 bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 sm:hidden transition-colors duration-300">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            if (item.label === 'Buat' || item.isAuthAction) {
              return (
                <div key={item.label} onClick={item.onClick} className="cursor-pointer">
                  <div className={`p-2 rounded-lg text-gray-700 dark:text-gray-300 
                    ${pathname === item.href ? 'text-blue-500 dark:text-blue-400' : ''}`}>
                    <div className="w-6 h-6">
                      {item.icon}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.label} href={item.href}>
                <div className={`p-2 rounded-lg text-gray-700 dark:text-gray-300 
                  ${pathname === item.href ? 'text-blue-500 dark:text-blue-400' : ''}`}>
                  <div className="w-6 h-6">
                    {item.icon}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
}