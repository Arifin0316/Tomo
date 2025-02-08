// app/layout.tsx
"use client";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/footer";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SessionProvider>
        <Sidebar />
        <main className="md:ml-64 sm:-ml-20 pb-16 md:pb-0">
          {children}
          <Toaster position="top-center" />
          <Footer />
        </main>
        
      </SessionProvider>
    </div>
  );
}
