import React from 'react';
import { Home, Archive, Tag, Files, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNotesData } from '../context/NotesDataContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';
import { TagItem } from './tags/TagItem';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { tags } = useNotesData();
  const { t } = useLanguage();
  const { search } = useLocation();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        aria-label="Main Navigation"
        className={cn(
          "fixed lg:static inset-y-0 left-0 w-64 border-r border-zinc-200 h-screen flex flex-col bg-white z-50 transition-transform duration-300 lg:translate-x-0 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <NavLink to={`/${search}`} className="flex items-center gap-2 no-underline text-inherit" onClick={onClose}>
              <Files className="w-6 h-6" />
              <h1 className="text-xl font-bold">NotesApp</h1>
            </NavLink>
            <button 
              onClick={onClose} 
              className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 lg:hidden focus:ring-2 focus:ring-zinc-900 rounded-lg outline-none"
              aria-label={t('closeMenu')}
            >
              <X className="w-5 h-6" />
            </button>
          </div>

          <nav className="space-y-1.5">
            <NavLink
              to={`/${search}`}
              end
              onClick={onClose}
              className={({ isActive }) => cn(
                "w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                isActive ? "bg-zinc-900 text-white shadow-lg shadow-zinc-100" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              {({ isActive }) => (
                <div className="flex items-center gap-3">
                  <Home className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
                  {t('allNotes')}
                </div>
              )}
            </NavLink>
            
            <NavLink
              to={`/archived${search}`}
              onClick={onClose}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200",
                isActive ? "bg-zinc-900 text-white shadow-lg shadow-zinc-100" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              )}
            >
              {({ isActive }) => (
                <>
                  <Archive className={cn("w-4 h-4", isActive ? "text-white" : "text-zinc-400")} />
                  {t('archivedNotes')}
                </>
              )}
            </NavLink>
          </nav>

          <div className="mt-10">
            <div className="flex items-center gap-2 px-4 mb-4">
               <Tag className="w-3.5 h-3.5 text-zinc-400" />
               <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em]">{t('tags')}</span>
            </div>
            <div className="space-y-1">
              {tags.map((tag) => (
                <TagItem key={tag.id} tag={tag} onClose={onClose} />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};


