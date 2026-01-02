import React from 'react';
import { Plus } from 'lucide-react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';
import { useFilteredNotes } from '../hooks/useFilteredNotes';
import { useLanguage } from '../context/LanguageContext';
import { NoteCard } from './notes/NoteCard';
import { NoteListEmptyState } from './notes/NoteListEmptyState';
import { Button } from './ui/Button';

export const NoteList: React.FC = () => {
  const { createNote } = useNotesData();
  const { activeNoteId, setActiveNoteId, searchQuery } = useNotesUI();
  const { filteredNotes } = useFilteredNotes();
  const { t } = useLanguage();

  const handleCreateNote = () => {
    const newNote = createNote();
    setActiveNoteId(newNote.id);
  };

  return (
    <div className="w-full md:w-80 border-r border-zinc-200 h-full flex flex-col bg-white overflow-hidden shrink-0">
      <div className="p-5">
        <Button
          onClick={handleCreateNote}
          className="w-full gap-2.5 py-6 shadow-md hover:shadow-xl"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          {t('createNewNote')}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <NoteListEmptyState searchQuery={searchQuery} />
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              onClick={() => setActiveNoteId(note.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
