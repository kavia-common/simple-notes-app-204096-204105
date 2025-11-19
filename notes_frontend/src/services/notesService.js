/**
 * Notes Service
 * Manages notes data persistence using localStorage as fallback.
 * Can be extended to use backend API when REACT_APP_API_BASE is configured.
 */

const STORAGE_KEY = 'notes_app_data';

/**
 * Get all notes from storage
 * @returns {Array} Array of note objects
 */
// PUBLIC_INTERFACE
export const getAllNotes = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading notes from storage:', error);
    return [];
  }
};

/**
 * Get a single note by ID
 * @param {string} id - Note ID
 * @returns {Object|null} Note object or null if not found
 */
// PUBLIC_INTERFACE
export const getNoteById = (id) => {
  const notes = getAllNotes();
  return notes.find(note => note.id === id) || null;
};

/**
 * Create a new note
 * @param {Object} noteData - Note data (title, body)
 * @returns {Object} Created note with ID and timestamps
 */
// PUBLIC_INTERFACE
export const createNote = (noteData) => {
  const notes = getAllNotes();
  const newNote = {
    id: Date.now().toString(),
    title: noteData.title || 'Untitled Note',
    body: noteData.body || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  notes.push(newNote);
  saveNotes(notes);
  return newNote;
};

/**
 * Update an existing note
 * @param {string} id - Note ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated note or null if not found
 */
// PUBLIC_INTERFACE
export const updateNote = (id, updates) => {
  const notes = getAllNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index === -1) {
    return null;
  }
  
  notes[index] = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  saveNotes(notes);
  return notes[index];
};

/**
 * Delete a note by ID
 * @param {string} id - Note ID
 * @returns {boolean} True if deleted, false if not found
 */
// PUBLIC_INTERFACE
export const deleteNote = (id) => {
  const notes = getAllNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  
  if (filteredNotes.length === notes.length) {
    return false; // Note not found
  }
  
  saveNotes(filteredNotes);
  return true;
};

/**
 * Search notes by query string (searches title and body)
 * @param {string} query - Search query
 * @returns {Array} Filtered notes
 */
// PUBLIC_INTERFACE
export const searchNotes = (query) => {
  if (!query || query.trim() === '') {
    return getAllNotes();
  }
  
  const notes = getAllNotes();
  const lowerQuery = query.toLowerCase();
  
  return notes.filter(note => 
    note.title.toLowerCase().includes(lowerQuery) ||
    note.body.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Save notes array to localStorage
 * @param {Array} notes - Notes array
 */
const saveNotes = (notes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to storage:', error);
  }
};
