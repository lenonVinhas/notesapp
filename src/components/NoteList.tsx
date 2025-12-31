import React from 'react';
import { Plus, Tag as TagIcon, Search } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

export const NoteList: React.FC = () => {
  const { notes, tags, activeNoteId, setActiveNoteId, createNote } = useNotes();
  const { t } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} ${t('minutesAgo')}`;
    
    // Simple format for demo
    return date.toLocaleDateString();
  };

  const getTagName = (tagId: string) => {
    return tags.find(t => t.id === tagId)?.name || '';
  };

  return (
    <div className="w-80 border-r border-zinc-200 h-full flex flex-col bg-white overflow-hidden shrink-0">
      <div className="p-4 border-b border-zinc-200">
        <button
          onClick={createNote}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('createNewNote')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-zinc-300" />
            </div>
            <p className="text-zinc-900 font-medium text-sm mb-1">
              {useNotes().searchQuery ? t('noResultsFound') : t('noNotes')}
            </p>
            {useNotes().searchQuery && (
              <p className="text-zinc-400 text-xs italic line-clamp-2">
                "{useNotes().searchQuery}"
              </p>
            )}
          </div>
        ) : (
          notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={cn(
                "w-full p-4 border-b border-zinc-100 text-left transition-colors flex flex-col gap-2",
                activeNoteId === note.id ? "bg-zinc-50 border-l-2 border-l-zinc-900" : "hover:bg-zinc-50"
              )}
            >
              <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1">
                {note.title || t('titlePlaceholder')}
              </h3>
              
              <div className="flex flex-wrap gap-1">
                {note.tags.map(tagId => (
                  <span key={tagId} className="flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                    <TagIcon className="w-2.5 h-2.5" />
                    {getTagName(tagId)}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <span>{formatDate(note.lastEdited)}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
