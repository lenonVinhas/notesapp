import React from 'react';
import { Search, Globe } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery, view } = useNotes();
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-6 bg-white shrink-0">
      <h2 className="text-lg font-semibold text-zinc-900">
        {view === 'all' ? t('allNotes') : t('archivedNotes')}
      </h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 w-64 outline-none"
          />
        </div>

        <button
          onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
          className="p-2 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2 text-sm text-zinc-600 border border-zinc-200"
          title="Switch Language"
        >
          <Globe className="w-4 h-4" />
          <span className="uppercase font-medium">{language}</span>
        </button>
      </div>
    </header>
  );
};
