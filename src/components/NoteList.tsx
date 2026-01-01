import React from 'react';
import { Plus } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { NoteCard } from './notes/NoteCard';
import { NoteListEmptyState } from './notes/NoteListEmptyState';

export const NoteList: React.FC = () => {
  const { notes, tags, activeNoteId, setActiveNoteId, createNote, searchQuery } = useNotes();
  const { t } = useLanguage();

  const getTagName = (tagId: string) => {
    return tags.find(t => t.id === tagId)?.name || '';
  };

  return (
    <div className="w-full md:w-80 border-r border-zinc-200 h-full flex flex-col bg-white overflow-hidden shrink-0">
      <div className="p-5">
        <button
          onClick={createNote}
          className="w-full flex items-center justify-center gap-2.5 bg-zinc-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all shadow-md hover:shadow-xl active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          {t('createNewNote')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <NoteListEmptyState searchQuery={searchQuery} />
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              onClick={() => setActiveNoteId(note.id)}
              getTagName={getTagName}
            />
          ))
        )}
      </div>
    </div>
  );
};
