import React, { createContext, useContext, useMemo } from 'react';
import type { Note, Tag } from '../types/note';
import { useNotesNavigation } from '../hooks/useNotesNavigation';
import { useNotesManager } from '../hooks/useNotesManager';

interface NotesContextType { 
  notes: Note[];
  allNotes: Note[];
  tags: Tag[];
  activeNoteId: string | null;
  searchQuery: string;
  selectedTagId: string | null;
  view: 'all' | 'archived';
  isDeleting: boolean;
  setActiveNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTagId: (id: string | null) => void;
  setView: (view: 'all' | 'archived') => void;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
  createNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;
  addTag: (name: string) => Tag;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNotesNavigation();
  const manager = useNotesManager();

  const filteredNotes = useMemo(() => {
    return manager.notes
      .filter((note) => {
        const matchesSearch = 
          note.title.toLowerCase().includes(navigation.searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(navigation.searchQuery.toLowerCase());
        
        const matchesTag = !navigation.selectedTagId || note.tags.includes(navigation.selectedTagId);
        const matchesView = navigation.view === 'all' ? !note.isArchived : note.isArchived;

        return matchesSearch && matchesTag && matchesView;
      })
      .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
  }, [manager.notes, navigation.searchQuery, navigation.selectedTagId, navigation.view]);

  const createNote = () => {
    const newNote = manager.createNote();
    navigation.setActiveNoteId(newNote.id);
  };

  const deleteNote = (id: string) => {
    manager.deleteNote(id);
    if (navigation.activeNoteId === id) {
      navigation.setActiveNoteId(null);
    } else {
      navigation.closeDeleteModal();
    }
  };

  const archiveNote = (id: string) => {
    manager.archiveNote(id);
    if (navigation.activeNoteId === id) {
      navigation.setActiveNoteId(null);
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes: filteredNotes,
        allNotes: manager.notes,
        tags: manager.tags,
        activeNoteId: navigation.activeNoteId,
        searchQuery: navigation.searchQuery,
        selectedTagId: navigation.selectedTagId,
        view: navigation.view,
        isDeleting: navigation.isDeleting,
        setActiveNoteId: navigation.setActiveNoteId,
        setSearchQuery: navigation.setSearchQuery,
        setSelectedTagId: navigation.setSelectedTagId,
        setView: navigation.setView,
        openDeleteModal: navigation.openDeleteModal,
        closeDeleteModal: navigation.closeDeleteModal,
        createNote,
        updateNote: manager.updateNote,
        deleteNote,
        archiveNote,
        unarchiveNote: manager.unarchiveNote,
        addTag: manager.addTag,
        updateTag: manager.updateTag,
        deleteTag: manager.deleteTag,
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
