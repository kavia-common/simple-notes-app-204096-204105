import React from 'react';
import './Header.css';

/**
 * Header component with app title, search, and add note button
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Search query change handler
 * @param {Function} props.onAddNote - Add note button click handler
 */
// PUBLIC_INTERFACE
const Header = ({ searchQuery, onSearchChange, onAddNote }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">📝 My Notes</h1>
        </div>
        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
              aria-label="Search notes"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            onClick={onAddNote} 
            className="btn-add-note"
            aria-label="Create new note"
          >
            <span className="btn-icon">➕</span>
            <span className="btn-text">New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
