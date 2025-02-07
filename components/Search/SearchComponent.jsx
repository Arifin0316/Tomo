import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { searchUsers } from '@/lib/search';
import { X } from 'lucide-react';

const SearchComponent = ({ isOpen, onClose }) => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const users = await searchUsers(searchQuery);
    setResults(users);
  };

  // If not open, return null
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 top-full left-0 mt-4 w-full max-w-md mx-auto 
      bg-white dark:bg-gray-800 
      rounded-2xl 
      shadow-2xl dark:shadow-xl 
      border border-gray-200 dark:border-gray-700 
      overflow-hidden 
      transform transition-all duration-300 ease-in-out">
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 
        flex items-center space-x-4">
        <button 
          onClick={onClose} 
          className="text-gray-600 dark:text-gray-300 
            hover:bg-gray-100 dark:hover:bg-gray-700 
            p-2 rounded-full 
            transition-colors 
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <X size={24} />
        </button>
        <div className="flex-grow">
          <SearchBar 
            onSearch={handleSearch} 
            initialQuery={query}
            autoFocus={true}
            placeholder="Search users..."
            className="w-full"
          />
        </div>
      </div>
      
      <div 
        className="max-h-[400px] overflow-y-auto 
          bg-gray-50 dark:bg-gray-900 
          scrollbar-thin 
          scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 
          scrollbar-track-gray-100 dark:scrollbar-track-gray-800"
      >
        {results.length > 0 ? (
          <SearchResults results={results} />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10 px-4">
            <p>Search for users by username or name</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;