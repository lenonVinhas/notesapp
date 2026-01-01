import React, { createContext, useContext } from 'react';
import { useNotesNavigation } from '../hooks/useNotesNavigation';

interface NotesUIContextType {
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
  openDeleteTagModal: (id: string) => void;
  closeDeleteTagModal: () => void;
}

const NotesUIContext = createContext<NotesUIContextType | undefined>(undefined);

export const NotesUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigation = useNotesNavigation();

  return (
    <NotesUIContext.Provider value={navigation}>
      {children}
    </NotesUIContext.Provider>
  );
};

export const useNotesUI = () => {
  const context = useContext(NotesUIContext);
  if (!context) {
    throw new Error('useNotesUI must be used within a NotesUIProvider');
  }
  return context;
};
