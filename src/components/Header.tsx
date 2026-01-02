import React from 'react';
import { Search, Globe, X, Menu } from 'lucide-react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';
import { useFilteredNotes } from '../hooks/useFilteredNotes';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { searchQuery, setSearchQuery, view, selectedTagId } = useNotesUI();
  const { tags } = useNotesData();
  const { filteredNotes: notes } = useFilteredNotes();
  const { t, language, setLanguage } = useLanguage();

  const isSearching = searchQuery.length > 0;
  const selectedTag = tags.find(t => t.id === selectedTagId);

  const getTitle = () => {
    if (isSearching) {
      if (selectedTag) return `${t('searchInTag')} ${selectedTag.name}`;
      return view === 'all' ? t('searchInAll') : t('searchInArchived');
    }
    
    if (selectedTag) return selectedTag.name;
    return view === 'all' ? t('allNotes') : t('archivedNotes');
  };

  return (
    <header className="h-20 border-b border-zinc-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-6">
        <Button 
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden -ml-2.5 text-zinc-600"
          aria-label={t('openMenu')}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex flex-col">
          <h2 className="text-base md:text-xl font-bold text-zinc-900 transition-all tracking-tight">
            {getTitle()}
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
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 pr-11 bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 w-48 sm:w-64 md:w-80"
          />
          {isSearching && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full transition-all animate-in zoom-in"
            >
              <X className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-900" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
          className="flex items-center gap-2.5 text-sm font-bold text-zinc-600 border-zinc-100 hover:border-zinc-200 active:scale-95"
          aria-label={t('switchLanguage')}
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline uppercase tracking-widest">{language}</span>
        </Button>
      </div>
    </header>
  );
};
