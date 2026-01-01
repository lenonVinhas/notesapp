import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService, STORAGE_KEYS } from '../services/storage';
import { translations, type Language, type TranslationKey } from '../i18n';
import { LanguageSchema } from '../schemas';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => 
    StorageService.get<Language>(STORAGE_KEYS.LANGUAGE, 'en', LanguageSchema)
  );

  useEffect(() => {
    StorageService.set(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  const t = (key: TranslationKey) => {
    const text = translations[language][key];
    if (!text) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return text;
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
