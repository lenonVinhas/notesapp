import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Note, Tag } from '../types/note';

interface NotesContextType {
  notes: Note[]; // This will be the filtered list
  allNotes: Note[]; // Full list
  tags: Tag[];
  activeNoteId: string | null;
  searchQuery: string;
  selectedTagId: string | null;
  view: 'all' | 'archived';
  setActiveNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTagId: (id: string | null) => void;
  setView: (view: 'all' | 'archived') => void;
  createNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;
  addTag: (name: string) => Tag;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('notes-app-data');
    return saved ? JSON.parse(saved) : [];
  });

  const [tags, setTags] = useState<Tag[]>(() => {
    const saved = localStorage.getItem('notes-app-tags');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [view, setView] = useState<'all' | 'archived'>('all');

  useEffect(() => {
    localStorage.setItem('notes-app-data', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('notes-app-tags', JSON.stringify(tags));
  }, [tags]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch = 
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = !selectedTagId || note.tags.includes(selectedTagId);
        const matchesView = view === 'all' ? !note.isArchived : note.isArchived;

        return matchesSearch && matchesTag && matchesView;
      })
      .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
  }, [notes, searchQuery, selectedTagId, view]);

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      tags: [],
      lastEdited: new Date().toISOString(),
      isArchived: false,
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updates, lastEdited: new Date().toISOString() } : n))
    );
  };

  const deleteNote = (id: string) => {
    if (confirm('Are you sure?')) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (activeNoteId === id) setActiveNoteId(null);
    }
  };

  const archiveNote = (id: string) => {
    updateNote(id, { isArchived: true });
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const unarchiveNote = (id: string) => {
    updateNote(id, { isArchived: false });
  };

  const addTag = (name: string): Tag => {
    const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) return existing;

    const newTag: Tag = { id: crypto.randomUUID(), name };
    setTags((prev) => [...prev, newTag]);
    return newTag;
  };

  return (
    <NotesContext.Provider
      value={{
        notes: filteredNotes,
        allNotes: notes,
        tags,
        activeNoteId,
        searchQuery,
        selectedTagId,
        view,
        setActiveNoteId,
        setSearchQuery,
        setSelectedTagId,
        setView,
        createNote,
        updateNote,
        deleteNote,
        archiveNote,
        unarchiveNote,
        addTag,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
