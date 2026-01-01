import React, { createContext, useContext } from 'react';
import type { Note, Tag } from '../types/note';
import { useNotesManager } from '../hooks/useNotesManager';

interface NotesDataContextType {
  notes: Note[];
  tags: Tag[];
  createNote: () => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;
  addTag: (name: string) => Tag;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
}

const NotesDataContext = createContext<NotesDataContextType | undefined>(undefined);

export const NotesDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const manager = useNotesManager();

  return (
    <NotesDataContext.Provider value={manager}>
      {children}
    </NotesDataContext.Provider>
  );
};

export const useNotesData = () => {
  const context = useContext(NotesDataContext);
  if (!context) {
    throw new Error('useNotesData must be used within a NotesDataProvider');
  }
  return context;
};
