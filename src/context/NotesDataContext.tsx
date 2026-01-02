import React, { createContext, useContext, useMemo } from 'react';
import type { Note, Tag } from '../types/note';
import { useNotesManager } from '../hooks/useNotesManager';

interface NotesDataState {
  notes: Note[];
  tags: Tag[];
  isLoading: boolean;
}

interface NotesDataActions {
  createNote: () => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  archiveNote: (id: string) => void;
  unarchiveNote: (id: string) => void;
  addTag: (name: string) => Tag;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  getTagName: (id: string) => string;
}

const NotesDataStateContext = createContext<NotesDataState | undefined>(undefined);
const NotesDataActionsContext = createContext<NotesDataActions | undefined>(undefined);

export const NotesDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notes, tags, isLoading, ...actions } = useNotesManager();

  const state = useMemo(() => ({ notes, tags, isLoading }), [notes, tags, isLoading]);
  const memoizedActions = useMemo(() => actions, [
    actions.createNote,
    actions.updateNote,
    actions.deleteNote,
    actions.archiveNote,
    actions.unarchiveNote,
    actions.addTag,
    actions.updateTag,
    actions.deleteTag,
    actions.getTagName
  ]);

  return (
    <NotesDataStateContext.Provider value={state}>
      <NotesDataActionsContext.Provider value={memoizedActions}>
        {children}
      </NotesDataActionsContext.Provider>
    </NotesDataStateContext.Provider>
  );
};

export const useNotesData = () => {
  const state = useContext(NotesDataStateContext);
  const actions = useContext(NotesDataActionsContext);
  if (!state || !actions) {
    throw new Error('useNotesData must be used within a NotesDataProvider');
  }
  return { ...state, ...actions };
};

export const useNotesState = () => {
  const context = useContext(NotesDataStateContext);
  if (!context) {
    throw new Error('useNotesState must be used within a NotesDataProvider');
  }
  return context;
};

export const useNotesActions = () => {
  const context = useContext(NotesDataActionsContext);
  if (!context) {
    throw new Error('useNotesActions must be used within a NotesDataProvider');
  }
  return context;
};
