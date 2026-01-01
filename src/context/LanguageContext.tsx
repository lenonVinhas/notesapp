import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types/note';
import { StorageService, STORAGE_KEYS } from '../services/storage';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    allNotes: 'All notes',
    archivedNotes: 'Archived notes',
    createNewNote: 'Create new note',
    tags: 'Tags',
    lastEdited: 'Last edited',
    archiveNote: 'Archive note',
    unarchiveNote: 'Unarchive note',
    deleteNote: 'Delete note',
    saveNote: 'Save note',
    cancel: 'Cancel',
    searchPlaceholder: 'Search...',
    minutesAgo: 'minutes ago',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: 'days ago',
    noNotes: 'No notes found',
    titlePlaceholder: 'Note title',
    contentPlaceholder: 'Start writing...',
    searchInAll: 'Searching in All Notes',
    searchInArchived: 'Searching in Archived',
    searchResults: 'results',
    clearSearch: 'Clear',
    noResultsFound: 'No results found for',
    confirmDelete: 'Are you sure you want to delete this note?',
    selectNote: 'Select a note to view or create a new one',
    noNotesSelected: 'Start your journey',
    selectNoteDescription: 'Select a note from the list to view it or create a new one right now.',
    deleteTagConfirm: 'Are you sure you want to delete this tag?',
    editTag: 'Edit tag',
    deleteTag: 'Delete tag',
    addTagPlaceholder: '+ tag',
    pressEnterToCreate: 'Press Enter to create',
    notesAffectedOne: 'note',
    notesAffectedMany: 'notes',
    willBeAffectedOne: 'will be affected',
    willBeAffectedMany: 'will be affected',
    searchInTag: 'Searching in',
  },
  pt: {
    allNotes: 'Todas as notas',
    archivedNotes: 'Notas arquivadas',
    createNewNote: 'Criar nova nota',
    tags: 'Tags',
    lastEdited: 'Última edição',
    archiveNote: 'Arquivar nota',
    unarchiveNote: 'Desarquivar nota',
    deleteNote: 'Excluir nota',
    saveNote: 'Salvar nota',
    cancel: 'Cancelar',
    searchPlaceholder: 'Pesquisar...',
    minutesAgo: 'minutos atrás',
    today: 'Hoje',
    yesterday: 'Ontem',
    daysAgo: 'dias atrás',
    noNotes: 'Nenhuma nota encontrada',
    titlePlaceholder: 'Título da nota',
    contentPlaceholder: 'Comece a escrever...',
    searchInAll: 'Pesquisando em Todas as notas',
    searchInArchived: 'Pesquisando em Arquivadas',
    searchResults: 'resultados',
    clearSearch: 'Limpar',
    noResultsFound: 'Nenhum resultado encontrado para',
    confirmDelete: 'Tem certeza que deseja excluir esta nota?',
    selectNote: 'Selecione uma nota para visualizar ou crie uma nova',
    noNotesSelected: 'Inicie sua jornada',
    selectNoteDescription: 'Selecione uma nota da lista ao lado para visualizá-la ou crie algo novo agora mesmo.',
    deleteTagConfirm: 'Tem certeza que deseja excluir esta tag?',
    editTag: 'Editar tag',
    deleteTag: 'Excluir tag',
    addTagPlaceholder: '+ tag',
    pressEnterToCreate: 'Pressione Enter para criar',
    notesAffectedOne: 'nota',
    notesAffectedMany: 'notas',
    willBeAffectedOne: 'será afetada',
    willBeAffectedMany: 'serão afetadas',
    searchInTag: 'Pesquisando em',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => 
    StorageService.get<Language>(STORAGE_KEYS.LANGUAGE, 'en')
  );

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
