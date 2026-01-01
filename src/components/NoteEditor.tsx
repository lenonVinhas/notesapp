import React from 'react';
import { Clock, ChevronLeft } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { TagInput } from './tags/TagInput';
import { NoNoteSelected } from './notes/NoNoteSelected';
import { NoteActions } from './notes/NoteActions';

export const NoteEditor: React.FC = () => {
  const { allNotes, tags, activeNoteId, updateNote, archiveNote, unarchiveNote, openDeleteModal, addTag, setActiveNoteId, deleteNote } = useNotes();
  const { t } = useLanguage();
  
  // Track initial state for "Undo" functionality when clicking Cancel
  const initialStateRef = React.useRef<{ title: string; content: string; lastEdited: string } | null>(null);
  const lastNoteIdRef = React.useRef<string | null>(null);

  const note = allNotes.find((n) => n.id === activeNoteId);

  // Capture initial state when a new note is opened
  React.useEffect(() => {
    if (activeNoteId && note && activeNoteId !== lastNoteIdRef.current) {
      initialStateRef.current = {
        title: note.title,
        content: note.content,
        lastEdited: note.lastEdited
      };
      lastNoteIdRef.current = activeNoteId;
    } else if (!activeNoteId) {
      initialStateRef.current = null;
      lastNoteIdRef.current = null;
    }
  }, [activeNoteId, note?.id]);

  if (!note) {
    return <NoNoteSelected />;
  }

  const addExistingTag = (tagId: string) => {
    if (!note.tags.includes(tagId)) {
      updateNote(note.id, { tags: [...note.tags, tagId] });
    }
  };

  const handleAddTag = (tagName: string) => {
    const tag = addTag(tagName);
    if (!note.tags.includes(tag.id)) {
      updateNote(note.id, { tags: [...note.tags, tag.id] });
    }
  };

  const removeTag = (tagId: string) => {
    updateNote(note.id, { tags: note.tags.filter(id => id !== tagId) });
  };

  const handleSave = () => {
    // Changes are already saved via auto-save, just close the editor
    setActiveNoteId(null);
  };

  const handleCancel = () => {
    if (initialStateRef.current) {
      const isNewNote = !initialStateRef.current.title && !initialStateRef.current.content && !note.tags.length;
      
      if (isNewNote) {
        // If it was a brand new empty note, delete it
        deleteNote(note.id);
      } else {
        // Revert to initial state including the timestamp
        updateNote(note.id, {
          title: initialStateRef.current.title,
          content: initialStateRef.current.content,
          lastEdited: initialStateRef.current.lastEdited
        });
      }
    }
    setActiveNoteId(null);
  };

  return (
    <div className="flex-1 flex bg-white overflow-hidden relative group">
      {/* Main Editor Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 md:p-8 pb-4">
          <div className="md:hidden mb-4">
            <button 
              onClick={() => setActiveNoteId(null)}
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 text-sm font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('allNotes')}
            </button>
          </div>
          <div className="mb-4 md:mb-8 pr-16 text-pretty">
            <input
              type="text"
              className="text-3xl font-bold text-zinc-900 border-none outline-none placeholder:text-zinc-200 w-full"
              placeholder={t('titlePlaceholder')}
              value={note.title}
              onChange={(e) => updateNote(note.id, { title: e.target.value })}
            />
          </div>

            <div className="flex flex-col gap-4 mb-4 md:mb-8">
            <TagInput
              tags={tags}
              selectedTags={note.tags}
              onAddTag={handleAddTag}
              onAddExistingTag={addExistingTag}
              onRemoveTag={removeTag}
            />

            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2 md:w-32 shrink-0 whitespace-nowrap">
                <Clock className="w-4 h-4" />
                <span>{t('lastEdited')}</span>
              </div>
              <span className="font-medium text-zinc-500 truncate">{new Date(note.lastEdited).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 flex-1 overflow-hidden">
          <textarea
            className="w-full h-full resize-none border-none outline-none text-zinc-600 leading-relaxed placeholder:text-zinc-200"
            placeholder={t('contentPlaceholder')}
            value={note.content}
            onChange={(e) => updateNote(note.id, { content: e.target.value })}
          />
        </div>

        <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex gap-3">
          <button
            className="px-6 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all hover:shadow-lg active:scale-95"
            onClick={handleSave}
          >
            {t('saveNote')}
          </button>
          <button
            className="px-6 py-2 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-all"
            onClick={handleCancel}
          >
            {t('cancel')}
          </button>
        </div>
      </div>

      {/* Floating Action Bar - UX Optimized */}
      <NoteActions
        isArchived={note.isArchived}
        onArchive={() => note.isArchived ? unarchiveNote(note.id) : archiveNote(note.id)}
        onDelete={() => openDeleteModal(note.id)}
      />
    </div>
  );
};
