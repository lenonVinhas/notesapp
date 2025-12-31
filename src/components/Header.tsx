import React from 'react';
import { Search, Globe, X, Menu } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { searchQuery, setSearchQuery, view, notes } = useNotes();
  const { t, language, setLanguage } = useLanguage();

  const isSearching = searchQuery.length > 0;

  return (
    <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-6">
        <button 
          onClick={onMenuClick}
          className="p-2.5 -ml-2.5 text-zinc-600 hover:bg-zinc-50 rounded-xl lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <h2 className="text-base md:text-xl font-bold text-zinc-900 transition-all tracking-tight">
            {isSearching 
              ? (view === 'all' ? t('searchInAll') : t('searchInArchived'))
              : (view === 'all' ? t('allNotes') : t('archivedNotes'))
            }
          </h2>
          {isSearching && (
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.15em] mt-0.5 animate-in fade-in slide-in-from-left-2">
              {notes.length} {t('searchResults')}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="relative group/search">
          <Search className={cn(
            "w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-all duration-300",
            isSearching ? "text-zinc-900" : "text-zinc-400 group-focus-within/search:text-zinc-900 group-focus-within/search:scale-110"
          )} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-11 py-2.5 bg-zinc-50 border-transparent border rounded-xl text-sm focus:ring-4 focus:ring-zinc-900/5 w-48 sm:w-64 md:w-80 outline-none transition-all focus:bg-white focus:border-zinc-200 focus:shadow-sm"
          />
          {isSearching && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 rounded-full transition-all animate-in zoom-in"
            >
              <X className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-900" />
            </button>
          )}
        </div>

        <button
          onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
          className="p-2.5 hover:bg-zinc-50 rounded-xl transition-all flex items-center gap-2.5 text-sm font-bold text-zinc-600 border border-zinc-100 hover:border-zinc-200 hover:shadow-sm active:scale-95"
          title="Switch Language"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline uppercase tracking-widest">{language}</span>
        </button>
      </div>
    </header>
  );
};
