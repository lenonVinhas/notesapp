import React from 'react';
import { Home, Archive, Tag, Files } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

export const Sidebar: React.FC = () => {
  const { tags } = useNotes();
  const { t } = useLanguage();
  const { search } = useLocation();

  return (
    <aside className="w-64 border-r border-zinc-200 h-screen flex flex-col bg-white">
      <div className="p-6">
        <NavLink to={`/${search}`} className="flex items-center gap-2 mb-8 no-underline text-inherit">
          <Files className="w-6 h-6" />
          <h1 className="text-xl font-bold">NotesApp</h1>
        </NavLink>

        <nav className="space-y-1">
          <NavLink
            to={`/${search}`}
            end
            className={({ isActive }) => cn(
              "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4" />
              {t('allNotes')}
            </div>
          </NavLink>
          
          <NavLink
            to={`/archived${search}`}
            className={({ isActive }) => cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            )}
          >
            <Archive className="w-4 h-4" />
            {t('archivedNotes')}
          </NavLink>
        </nav>

        <div className="mt-8">
          <div className="flex items-center gap-2 px-3 mb-2">
             <Tag className="w-4 h-4 text-zinc-400" />
             <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{t('tags')}</span>
          </div>
          <div className="space-y-1">
            {tags.map((tag) => (
              <NavLink
                key={tag.id}
                to={`/tags/${tag.id}${search}`}
                className={({ isActive }) => cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left",
                  isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                <span className="truncate">{tag.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
