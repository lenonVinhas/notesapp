import React from 'react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';
import { NoNoteSelected } from './notes/NoNoteSelected';
import { NoteActions } from './notes/NoteActions';
import { useNoteEditor } from '../hooks/useNoteEditor';
import { EditorHeader } from './editor/EditorHeader';
import { EditorMetadata } from './editor/EditorMetadata';
import { EditorContent } from './editor/EditorContent';
import { EditorActions } from './editor/EditorActions';

export const NoteEditor: React.FC = () => {
  const { tags, archiveNote, unarchiveNote } = useNotesData();
  const { setActiveNoteId, openDeleteModal } = useNotesUI();
  
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
        <EditorHeader
          title={note.title}
          onTitleChange={updateTitle}
          onBack={() => setActiveNoteId(null)}
        />
        
        <EditorMetadata
          tags={tags}
          noteTags={note.tags}
          lastEdited={note.lastEdited}
          onAddTag={handleAddTag}
          onAddExistingTag={addExistingTag}
          onRemoveTag={removeTag}
        />

        <EditorContent
          content={note.content}
          onContentChange={updateContent}
        />

        <EditorActions
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>

      <NoteActions
        isArchived={note.isArchived}
        onArchive={handleArchive}
        onDelete={() => openDeleteModal(note.id)}
      />
    </div>
  );
};
