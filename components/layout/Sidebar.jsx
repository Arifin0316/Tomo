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

const NavItem = ({ icon, label, href, isActive, onClick }) => {
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

  const loginItem = {
    icon: <LogIn />, 
    label: 'Login', 
    href: '/login', 
    onClick: () => signIn()
  };

  const logoutItem = {
    icon: <LogOut />, 
    label: 'Logout', 
    href: '#', 
    onClick: () => signOut({ callbackUrl: '/login' })
  };

  const navItems = session ? [
    { icon: <Home />, label: 'Beranda', href: '/' },
    { icon: <Search />, label: 'Cari', href: '/search' },
    { icon: <Compass />, label: 'Jelajah', href: '/explore' },
    { icon: <MessageCircle />, label: 'Pesan', href: '/messages' },
    { icon: <Heart />, label: 'Notifikasi', href: '/notifications' },
    { 
      icon: <PlusSquare />, 
      label: 'Buat', 
      href: '/create', 
      onClick: () => setIsCreateModalOpen(true) 
    },
    { icon: <User />, label: 'Profil', href:`/profile/${session?.user?.username}`},
    logoutItem
  ] : [
    { icon: <Home />, label: 'Beranda', href: '/' },
    { icon: <Compass />, label: 'Jelajah', href: '/explore' },
    loginItem
  ];

  return (
    <>
      {/* Sidebar for tablet and desktop */}
      <div className="hidden sm:fixed sm:flex sm:left-0 sm:h-full border-r bg-white sm:w-16 md:w-64 py-4 flex-col">
        <div className="px-4 mb-6">
          <h1 className="text-xl font-bold hidden md:block">Ayouth</h1>
          <span className="sm:block md:hidden text-2xl font-bold">A</span>
        </div>

        <nav className="flex-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
              onClick={item.onClick}
            />
          ))}
        </nav>

        <div className="px-4 mb-4">
          <button className="flex items-center gap-4 p-3 w-full hover:bg-gray-50 rounded-lg">
            <Menu className="w-6 h-6" />
            <span className="hidden md:block text-sm font-medium">Lainnya</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t sm:hidden">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            if (item.label === 'Buat') {
              return (
                <div key={item.href} onClick={item.onClick}>
                  <div className={`p-2 rounded-lg ${pathname === item.href ? 'text-blue-500' : ''}`}>
                    <div className="w-6 h-6">
                      {item.icon}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.href} href={item.href} onClick={item.onClick}>
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