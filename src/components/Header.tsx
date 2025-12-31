import React from 'react';
import { Search, Globe, X } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

export const Header: React.FC = () => {
  const { searchQuery, setSearchQuery, view, notes } = useNotes();
  const { t, language, setLanguage } = useLanguage();

  const isSearching = searchQuery.length > 0;

  return (
    <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-6 bg-white shrink-0">
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-zinc-900 transition-all">
          {isSearching 
            ? (view === 'all' ? t('searchInAll') : t('searchInArchived'))
            : (view === 'all' ? t('allNotes') : t('archivedNotes'))
          }
        </h2>
        {isSearching && (
          <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider animate-in fade-in slide-in-from-left-1">
            {notes.length} {t('searchResults')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group/search">
          <Search className={cn(
            "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
            isSearching ? "text-zinc-900" : "text-zinc-400 group-focus-within/search:text-zinc-900"
          )} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2 bg-zinc-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-zinc-200 w-64 outline-none transition-all focus:bg-white focus:shadow-sm"
          />
          {isSearching && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 rounded-full transition-colors animate-in zoom-in"
            >
              <X className="w-3 h-3 text-zinc-500" />
            </button>
          )}
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
