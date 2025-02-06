"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { searchUsers } from '@/lib/search';

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
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <SearchIcon size={20} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Cari pengguna"
        value={query}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {query && (
        <button 
          onClick={() => {
            setQuery('');
            onSearch('');
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
      <div className="text-center text-gray-500 py-4">
        Tidak ada pengguna ditemukan
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      {results.map((user) => (
        <div 
          key={user.id} 
          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <img
            src={user.profile?.profilePic || "/default-profile.png"}
            alt={user.username}
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{user.username}</p>
            <p className="text-xs text-gray-500">
              {user.profile?.bio || "Tidak ada bio"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Search() {
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
    <div ref={containerRef} className="relative w-full">
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