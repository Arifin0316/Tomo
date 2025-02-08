'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-black flex items-center justify-center">
      <motion.div 
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: {
            duration: 0.6,
            type: "spring",
            stiffness: 120
          }
        }}
      >
        {/* Logo Animation */}
        <motion.div
          className="w-40 h-40 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl dark:shadow-lg dark:shadow-blue-500/30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="w-24 h-24 text-blue-600 dark:text-blue-400"
          >
            <path d="M16 8l2-2 2 2 2-2" />
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l4 4 4-4" />
          </svg>
        </motion.div>

        {/* Loading Text */}
        <motion.h1
          className="mt-8 text-3xl font-bold text-white dark:text-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: {
              delay: 0.4,
              duration: 0.6
            }
          }}
        >
          Memuat Konten
        </motion.h1>

        {/* Loading Dots */}
        <motion.div 
          className="flex space-x-2 mt-4"
          initial="hidden"
          animate="visible"
        >
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="w-4 h-4 bg-white dark:bg-gray-600 rounded-full"
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    delay: dot * 0.2,
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }
              }}
            />
          ))}
        </motion.div>

        {/* Subtle Background Animation */}
        <motion.div
          className="absolute inset-0 bg-white/10 dark:bg-black/20 -z-10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.1, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingScreen;