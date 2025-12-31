import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../types/note';

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
    confirmDelete: 'Are you sure you want to delete this note?',
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
    confirmDelete: 'Tem certeza que deseja excluir esta nota?',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('notes-app-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('notes-app-language', language);
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
