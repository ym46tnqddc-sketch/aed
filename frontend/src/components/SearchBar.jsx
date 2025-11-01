import React from 'react';

function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="search-wrapper">
      <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher par ville, code postal, adresse..."
        className="search-input"
      />
      {value && (
        <p className="search-results">
          {resultCount} défibrillateur{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

export default SearchBar;
