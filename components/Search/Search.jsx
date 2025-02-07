"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { searchUsers } from '@/lib/search';
import Link from 'next/link';

const SearchBar = ({ onSearch, onFocus, onBlur }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
        <SearchIcon size={20} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search users"
        value={query}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full pl-12 pr-4 py-3 
          bg-gray-100 dark:bg-gray-700 
          rounded-xl text-sm 
          text-gray-800 dark:text-white
          focus:outline-none 
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          transition-all duration-300"
      />
      {query && (
        <button 
          onClick={() => {
            setQuery('');
            onSearch('');
            inputRef.current?.focus();
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 
            text-gray-500 dark:text-gray-400 
            hover:text-gray-700 dark:hover:text-white 
            transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-6">
        No users found
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
      {results.map((user) => (
        <Link 
          href={`/profile/${user.username}`}
          key={user.id} 
          className="flex items-center p-4 
            hover:bg-gray-50 dark:hover:bg-gray-700 
            cursor-pointer transition-colors group"
        >
          <img
            src={user.profile?.profilePic || "/default-profile.png"}
            alt={user.username}
            className="w-11 h-11 rounded-full mr-4 object-cover 
              ring-2 ring-gray-200 dark:ring-gray-700 
              group-hover:ring-gray-300 dark:group-hover:ring-gray-600 
              transition-all"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              {user.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.profile?.bio || "No bio available"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default function Search({ className }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef(null);

  const handleSearch = async (query) => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    try {
      const users = await searchUsers(query);
      setResults(users);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsSearching(false);
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${className || ''}`}
    >
      <SearchBar 
        onSearch={handleSearch}
        onFocus={() => setIsSearching(true)}
        onBlur={() => {
          // Delay to allow click on results
          setTimeout(() => {
            setIsSearching(false);
          }, 200);
        }}
      />
      {isSearching && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full z-50">
          <SearchResults results={results} />
        </div>
      )}
    </div>
  );
}