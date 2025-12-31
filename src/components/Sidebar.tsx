import React from 'react';
import { Home, Archive, Tag, Files, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { tags } = useNotes();
  const { t } = useLanguage();
  const { search } = useLocation();

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 w-64 border-r border-zinc-200 h-screen flex flex-col bg-white z-50 transition-transform duration-300 lg:translate-x-0 shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <NavLink to={`/${search}`} className="flex items-center gap-2 no-underline text-inherit" onClick={onClose}>
              <Files className="w-6 h-6" />
              <h1 className="text-xl font-bold">NotesApp</h1>
            </NavLink>
            <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 lg:hidden">
              <X className="w-5 h-5" />
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

interface TagItemProps {
  tag: { id: string; name: string };
  onClose?: () => void;
}

const TagItem: React.FC<TagItemProps> = ({ tag, onClose }) => {
  const { search } = useLocation();
  const { updateTag, deleteTag } = useNotes();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(tag.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      updateTag(tag.id, editName.trim());
      setIsEditing(false);
    }
  };

  const startEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(t('deleteTagConfirm'))) {
      deleteTag(tag.id);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleCreateSubmit} className="px-4 py-2">
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="w-full text-sm bg-transparent border-b border-zinc-900 outline-none"
        />
      </form>
    );
  }

  return (
    <NavLink
      to={`/tags/${tag.id}${search}`}
      onClick={onClose}
      className={({ isActive }) => cn(
        "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-left group",
        isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isActive ? "bg-zinc-900" : "bg-zinc-300"
            )} />
            <span className="truncate">{tag.name}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={startEditing}
              className="p-1 hover:bg-zinc-200 rounded"
              title={t('editTag')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 text-zinc-400 hover:text-red-500 rounded"
              title={t('deleteTag')}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </>
      )}
    </NavLink>
  );
};

