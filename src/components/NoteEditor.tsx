import React, { useState } from 'react';
import { Archive, Trash2, Tag as TagIcon, Clock, X, RotateCcw, ChevronLeft, StickyNote } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/cn';

export const NoteEditor: React.FC = () => {
  const { allNotes, tags, activeNoteId, updateNote, archiveNote, unarchiveNote, openDeleteModal, addTag, setActiveNoteId, deleteNote } = useNotes();
  const { t } = useLanguage();
  const [newTagName, setNewTagName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#FBFBFB] selection:bg-zinc-200">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-zinc-200 blur-3xl opacity-20 rounded-full scale-150 animate-pulse" />
          <div className="relative bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 group-hover:scale-105 transition-transform duration-500">
             <StickyNote className="w-16 h-16 text-zinc-200" strokeWidth={1.5} />
          </div>
        </div>
        <div className="text-center max-w-sm">
          <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight">
            {t('noNotesSelected')}
          </h3>
          <p className="text-zinc-500 leading-relaxed">
            {t('selectNoteDescription')}
          </p>
        </div>
      </div>
    );
  }

  const addExistingTag = (tagId: string) => {
    if (!note.tags.includes(tagId)) {
      updateNote(note.id, { tags: [...note.tags, tagId] });
    }
    setNewTagName('');
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!newTagName) return;

    const suggestions = tags.filter(t => 
      t.name.toLowerCase().includes(newTagName.toLowerCase()) && 
      !note.tags.includes(t.id)
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (suggestions.length + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (suggestions.length + 1)) % (suggestions.length + 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex < suggestions.length) {
        addExistingTag(suggestions[selectedIndex].id);
      } else {
        // Create new tag
        if (newTagName.trim()) {
           const tag = addTag(newTagName.trim());
           if (!note.tags.includes(tag.id)) {
              updateNote(note.id, { tags: [...note.tags, tag.id] });
           }
           setNewTagName('');
           setSelectedIndex(0);
        }
      }
    } else if (e.key === 'Escape') {
      setNewTagName('');
      setSelectedIndex(0);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      const tag = addTag(newTagName.trim());
      if (!note.tags.includes(tag.id)) {
        updateNote(note.id, { tags: [...note.tags, tag.id] });
      }
      setNewTagName('');
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
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
              <div className="flex items-center gap-2 text-sm text-zinc-400 w-32 shrink-0 whitespace-nowrap">
                <TagIcon className="w-4 h-4" />
                <span>{t('tags')}</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center flex-1">
                {note.tags.map(tagId => (
                  <span key={tagId} className="flex items-center gap-1.5 bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-sm group/tag">
                    {tags.find(t => t.id === tagId)?.name}
                    <button onClick={() => removeTag(tagId)} className="hover:text-red-500 opacity-0 group-hover/tag:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <div className="relative inline-block">
                  <form onSubmit={handleAddTag} className="flex items-center">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={e => {
                        setNewTagName(e.target.value);
                        setSelectedIndex(0);
                      }}
                      onKeyDown={handleKeyDown}
                      onBlur={() => {
                        // Delay hiding suggestions to allow clicking
                        setTimeout(() => setNewTagName(''), 200);
                      }}
                      className="text-sm outline-none border-b border-zinc-200 focus:border-zinc-900 bg-transparent py-0.5 px-1 w-24 placeholder:text-zinc-300"
                      placeholder={t('addTagPlaceholder')}
                    />
                  </form>
                  {/* Autocomplete Suggestions */}
                  {newTagName && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl z-20 overflow-hidden">
                      {tags
                        .filter(t => t.name.toLowerCase().includes(newTagName.toLowerCase()) && !note.tags.includes(t.id))
                        .map((tag, index) => (
                          <button
                            key={tag.id}
                            className={cn(
                              "w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2",
                              index === selectedIndex && "bg-zinc-100"
                            )}
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevent blur
                              addExistingTag(tag.id);
                            }}
                          >
                            <TagIcon className="w-3 h-3 text-zinc-400" />
                            <span className="truncate">{tag.name}</span>
                          </button>
                        ))
                      }
                      {newTagName && !tags.some(t => t.name.toLowerCase() === newTagName.toLowerCase()) && (
                        <div className="px-3 py-2 text-xs text-zinc-400 border-t border-zinc-50 bg-zinc-50/50">
                          {t('pressEnterToCreate')} "{newTagName}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

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
      <div className="absolute right-4 md:right-6 top-16 md:top-8 flex flex-col gap-2 p-1.5 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-xl shadow-xl transition-all opacity-40 group-hover:opacity-100 hover:scale-105 z-10">
        <button
          onClick={() => note.isArchived ? unarchiveNote(note.id) : archiveNote(note.id)}
          className={cn(
            "p-3 rounded-lg transition-all relative group/btn",
            note.isArchived 
              ? "text-blue-600 hover:bg-blue-50" 
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          )}
          title={note.isArchived ? t('unarchiveNote') : t('archiveNote')}
        >
          {note.isArchived ? <RotateCcw className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
          <span className="absolute right-full mr-3 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            {note.isArchived ? t('unarchiveNote') : t('archiveNote')}
          </span>
        </button>
        <div className="h-px bg-zinc-100 mx-2" />
        <button
          onClick={() => openDeleteModal(note.id)}
          className="p-3 text-zinc-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all relative group/btn"
          title={t('deleteNote')}
        >
          <Trash2 className="w-5 h-5" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-red-600 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            {t('deleteNote')}
          </span>
        </button>
      </div>
    </div>
  );
};
