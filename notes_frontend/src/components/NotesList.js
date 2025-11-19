import React from 'react';
import './NotesList.css';

/**
 * Format date to readable string
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * NotesList component displays list of notes
 * @param {Object} props - Component props
 * @param {Array} props.notes - Array of notes to display
 * @param {string} props.selectedNoteId - Currently selected note ID
 * @param {Function} props.onSelectNote - Note selection handler
 */
// PUBLIC_INTERFACE
const NotesList = ({ notes, selectedNoteId, onSelectNote }) => {
  if (notes.length === 0) {
    return (
      <div className="notes-list">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No notes yet</h3>
          <p>Create your first note to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map(note => (
        <div
          key={note.id}
          className={`note-item ${note.id === selectedNoteId ? 'active' : ''}`}
          onClick={() => onSelectNote(note.id)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectNote(note.id);
            }
          }}
          aria-label={`Select note: ${note.title}`}
        >
          <div className="note-item-content">
            <h3 className="note-title">{note.title || 'Untitled Note'}</h3>
            <p className="note-preview">
              {note.body ? note.body.substring(0, 100) : 'No content'}
              {note.body && note.body.length > 100 ? '...' : ''}
            </p>
            <div className="note-meta">
              <span className="note-date">{formatDate(note.updatedAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
