import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
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

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // URL derived state
  const searchQuery = searchParams.get('q') || '';
  
  const segments = location.pathname.split('/').filter(Boolean);
  let view: 'all' | 'archived' = 'all';
  let selectedTagId: string | null = null;
  let activeNoteId: string | null = null;

  if (segments[0] === 'archived') {
    view = 'archived';
    activeNoteId = segments[1] || null;
  } else if (segments[0] === 'tags') {
    selectedTagId = segments[1] || null;
    activeNoteId = segments[2] || null;
  } else {
    view = 'all';
    activeNoteId = segments[0] || null;
  }

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

  const setActiveNoteId = (id: string | null) => {
    let newPath = '/';
    if (view === 'archived') {
      newPath = id ? `/archived/${id}` : '/archived';
    } else if (selectedTagId) {
      newPath = id ? `/tags/${selectedTagId}/${id}` : `/tags/${selectedTagId}`;
    } else {
      newPath = id ? `/${id}` : '/';
    }
    navigate(`${newPath}${location.search}`);
  };

  const setSearchQuery = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const setSelectedTagId = (id: string | null) => {
    if (id) {
      navigate(`/tags/${id}${location.search}`);
    } else {
      navigate(`/${location.search}`);
    }
  };

  const setView = (v: 'all' | 'archived') => {
    if (v === 'archived') {
      navigate(`/archived${location.search}`);
    } else {
      navigate(`/${location.search}`);
    }
  };

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
