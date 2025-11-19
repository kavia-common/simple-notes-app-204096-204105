import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import { getAllNotes, createNote, updateNote, deleteNote, searchNotes } from './services/notesService';
import './App.css';

/**
 * Main App component
 * Manages the notes application state and coordinates between components
 */
// PUBLIC_INTERFACE
function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Load notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchNotes(searchQuery);
      // Sort by most recent first
      const sorted = filtered.sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setNotes(sorted);
    } else {
      loadNotes();
    }
  }, [searchQuery]);

  /**
   * Load all notes and sort by most recent
   */
  const loadNotes = () => {
    const allNotes = getAllNotes();
    // Sort by most recent first (newest first)
    const sorted = allNotes.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    setNotes(sorted);
  };

  /**
   * Handle adding a new note
   */
  const handleAddNote = () => {
    setSelectedNoteId(null);
    setIsCreatingNew(true);
  };

  /**
   * Handle selecting a note from the list
   */
  const handleSelectNote = (noteId) => {
    setSelectedNoteId(noteId);
    setIsCreatingNew(false);
  };

  /**
   * Handle saving a note (create or update)
   */
  const handleSaveNote = (noteData) => {
    if (noteData.id) {
      // Update existing note
      const updated = updateNote(noteData.id, {
        title: noteData.title,
        body: noteData.body
      });
      if (updated) {
        loadNotes();
        setSelectedNoteId(updated.id);
      }
    } else {
      // Create new note
      const newNote = createNote({
        title: noteData.title,
        body: noteData.body
      });
      loadNotes();
      setSelectedNoteId(newNote.id);
      setIsCreatingNew(false);
    }
  };

  /**
   * Handle deleting a note
   */
  const handleDeleteNote = (noteId) => {
    const success = deleteNote(noteId);
    if (success) {
      loadNotes();
      setSelectedNoteId(null);
      setIsCreatingNew(false);
    }
  };

  /**
   * Handle canceling new note creation
   */
  const handleCancelNew = () => {
    setIsCreatingNew(false);
    setSelectedNoteId(null);
  };

  /**
   * Handle search query change
   */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Get the currently selected note
  const selectedNote = selectedNoteId 
    ? notes.find(note => note.id === selectedNoteId) 
    : null;

  return (
    <div className="App">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddNote={handleAddNote}
      />
      <div className="app-container">
        <aside className="sidebar">
          <NotesList 
            notes={notes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
          />
        </aside>
        <main className="main-content">
          <NoteEditor 
            note={isCreatingNew ? {} : selectedNote}
            onSave={handleSaveNote}
            onDelete={handleDeleteNote}
            onCancel={handleCancelNew}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
