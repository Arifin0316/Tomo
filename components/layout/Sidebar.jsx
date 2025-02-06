"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Home, Search, PlusSquare, Heart, User, LogIn, LogOut,
  MessageCircle, Compass, Menu
} from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import CreatePostModal from '@/components/CreatePostModal/CreatePostModal';
import SearchComponent from '@/components/Search/SearchComponent';

const NavItem = ({ icon, label, href, isActive, onClick, isAuthAction }) => {
  // Handle auth actions (login/logout) differently
  if (isAuthAction) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors
          ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
          <div className="w-6 h-6">
            {icon}
          </div>
          <span className={`hidden sm:block text-sm font-medium
            ${isActive ? 'font-semibold' : ''}`}>
            {label}
          </span>
        </div>
      </div>
    );
  }

  // Handle Create Post button
  if (label === 'Buat') {
    return (
      <div onClick={onClick} className="cursor-pointer">
        <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors
          ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
          <div className="w-6 h-6">
            {icon}
          </div>
          <span className={`hidden sm:block text-sm font-medium
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
        <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors
          ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
          <div className="w-6 h-6">
            {icon}
          </div>
          <span className={`hidden sm:block text-sm font-medium
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
      <div className={`flex items-center gap-4 p-3 rounded-lg transition-colors
        ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
        <div className="w-6 h-6">
          {icon}
        </div>
        <span className={`hidden sm:block text-sm font-medium
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

  const handleLogin = (e) => {
    e.preventDefault();
    signIn();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    signOut({ callbackUrl: '/login' });
  };

  const loginItem = {
    icon: <LogIn />, 
    label: 'Login', 
    href: '#',
    onClick: handleLogin,
    isAuthAction: true
  };

  const logoutItem = {
    icon: <LogOut />, 
    label: 'Logout', 
    href: '#',
    onClick: handleLogout,
    isAuthAction: true
  };

  const navItems = session ? [
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
    { icon: <MessageCircle />, label: 'Pesan', href: '/messages' },
    { icon: <Heart />, label: 'Notifikasi', href: '/notifications' },
    { 
      icon: <PlusSquare />, 
      label: 'Buat', 
      href: '#', 
      onClick: () => setIsCreateModalOpen(true) 
    },
    { icon: <User />, label: 'Profil', href: `/profile/${session?.user?.username}` },
    logoutItem
  ] : [
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
    loginItem
  ];

  return (
    <>
      {/* Sidebar for tablet and desktop */}
      <div className="hidden sm:fixed sm:flex sm:left-0 sm:h-full border-r bg-white sm:w-16 md:w-64 py-4 flex-col relative">
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t sm:hidden">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            if (item.label === 'Buat' || item.isAuthAction) {
              return (
                <div key={item.label} onClick={item.onClick} className="cursor-pointer">
                  <div className={`p-2 rounded-lg ${pathname === item.href ? 'text-blue-500' : ''}`}>
                    <div className="w-6 h-6">
                      {item.icon}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.label} href={item.href}>
                <div className={`p-2 rounded-lg ${pathname === item.href ? 'text-blue-500' : ''}`}>
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