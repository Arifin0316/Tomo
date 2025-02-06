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

  // Jika tidak terbuka, return null
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 h-96 top-full left-0 mt-2 w-96 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-white p-3 border-b border-gray-100 flex items-center space-x-3">
        <button 
          onClick={onClose} 
          className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
        <div className="flex-grow">
          <SearchBar 
            onSearch={handleSearch} 
            initialQuery={query}
            autoFocus={true}
            placeholder="Cari pengguna..."
          />
        </div>
      </div>
      
      <div 
        className="max-h-[400px] overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {results.length > 0 ? (
          <SearchResults results={results} />
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>Cari pengguna dengan username atau nama</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;