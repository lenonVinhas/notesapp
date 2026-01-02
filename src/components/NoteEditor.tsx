import React from 'react';
import { Clock, ChevronLeft } from 'lucide-react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';
import { useLanguage } from '../context/LanguageContext';
import { TagInput } from './tags/TagInput';
import { NoNoteSelected } from './notes/NoNoteSelected';
import { NoteActions } from './notes/NoteActions';
import { useNoteEditor } from '../hooks/useNoteEditor';

export const NoteEditor: React.FC = () => {
  const { tags, archiveNote, unarchiveNote } = useNotesData();
  const { setActiveNoteId, openDeleteModal } = useNotesUI();
  const { t } = useLanguage();
  
  const { 
    note, 
    handleSave, 
    handleCancel, 
    addExistingTag, 
    handleAddTag, 
    removeTag, 
    updateTitle, 
    updateContent 
  } = useNoteEditor();

  if (!note) {
    return <NoNoteSelected />;
  }

  const handleArchive = () => {
    if (note.isArchived) {
      unarchiveNote(note.id);
    } else {
      archiveNote(note.id);
      setActiveNoteId(null);
    }
  };

  return (
    <div className="flex-1 flex bg-white overflow-hidden relative group">
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
              onChange={(e) => updateTitle(e.target.value)}
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
            onChange={(e) => updateContent(e.target.value)}
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

      <NoteActions
        isArchived={note.isArchived}
        onArchive={handleArchive}
        onDelete={() => openDeleteModal(note.id)}
      />
    </div>
  );
};
