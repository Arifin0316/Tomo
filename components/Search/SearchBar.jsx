import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  initialQuery = '', 
  autoFocus = false,
  placeholder = "Search",
  className = ""
}) => {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef(null);

  useEffect(() => {
    // Sync initial query
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    // Autofocus if enabled
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
        <SearchIcon size={20} />
      </div>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-3 
          bg-gray-100 dark:bg-gray-700 
          rounded-xl text-sm 
          text-gray-800 dark:text-white
          border border-transparent
          focus:outline-none 
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
          focus:border-transparent
          transition-all duration-300
          placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;