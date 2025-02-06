import React, { useState, useEffect, useRef } from 'react';

const SearchBar = ({ 
  onSearch, 
  initialQuery = '', 
  autoFocus = false 
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
    <div className="w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Cari"
        value={query}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;