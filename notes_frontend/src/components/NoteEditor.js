import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

/**
 * NoteEditor component for creating and editing notes
 * @param {Object} props - Component props
 * @param {Object} props.note - Current note object
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onCancel - Cancel handler
 */
// PUBLIC_INTERFACE
const NoteEditor = ({ note, onSave, onDelete, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setBody(note.body || '');
      setHasChanges(false);
    } else {
      setTitle('');
      setBody('');
      setHasChanges(false);
    }
  }, [note]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!title.trim() && !body.trim()) {
      alert('Please add a title or content to save the note.');
      return;
    }

    onSave({
      id: note?.id,
      title: title.trim() || 'Untitled Note',
      body: body.trim()
    });
    setHasChanges(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (note?.id) {
      onDelete(note.id);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (!note && !title && !body) {
    return (
      <div className="note-editor">
        <div className="editor-empty-state">
          <div className="empty-icon">✨</div>
          <h2>Welcome to My Notes</h2>
          <p>Select a note from the list or create a new one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <div className="editor-actions">
          <button
            onClick={handleSave}
            className={`btn-save ${hasChanges ? 'has-changes' : ''}`}
            disabled={!hasChanges}
            aria-label="Save note"
          >
            💾 Save
          </button>
          {note?.id && (
            <button
              onClick={handleDelete}
              className="btn-delete"
              aria-label="Delete note"
            >
              🗑️ Delete
            </button>
          )}
          {!note?.id && (
            <button
              onClick={onCancel}
              className="btn-cancel"
              aria-label="Cancel"
            >
              ✕ Cancel
            </button>
          )}
        </div>
        {hasChanges && <span className="unsaved-indicator">● Unsaved changes</span>}
      </div>

      <div className="editor-content">
        <input
          type="text"
          placeholder="Note title..."
          value={title}
          onChange={handleTitleChange}
          className="note-title-input"
          aria-label="Note title"
        />
        <textarea
          placeholder="Start writing your note..."
          value={body}
          onChange={handleBodyChange}
          className="note-body-input"
          aria-label="Note content"
        />
      </div>

      {showDeleteConfirm && (
        <div className="delete-modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Note?</h3>
            <p>Are you sure you want to delete "{title || 'Untitled Note'}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="btn-modal-cancel">
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn-modal-delete">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
