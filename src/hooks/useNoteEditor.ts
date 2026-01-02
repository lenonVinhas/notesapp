import { useRef, useEffect } from 'react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';

export const useNoteEditor = () => {
    const { notes, updateNote, deleteNote, addTag } = useNotesData();
    const { activeNoteId, setActiveNoteId } = useNotesUI();

    const note = notes.find((n) => n.id === activeNoteId);

    const initialStateRef = useRef<{ title: string; content: string; lastEdited: string } | null>(null);
    const lastNoteIdRef = useRef<string | null>(null);

    useEffect(() => {
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
    }, [activeNoteId, note?.id, note?.title, note?.content, note?.lastEdited]);

    const handleSave = () => {
        // Changes are already saved via auto-save, just close the editor
        setActiveNoteId(null);
    };

    const handleCancel = () => {
        if (!note) {
            setActiveNoteId(null);
            return;
        }

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

    const addExistingTag = (tagId: string) => {
        if (!note) return;
        if (!note.tags.includes(tagId)) {
            updateNote(note.id, { tags: [...note.tags, tagId] });
        }
    };

    const handleAddTag = (tagName: string) => {
        if (!note) return;
        const tag = addTag(tagName);
        if (!note.tags.includes(tag.id)) {
            updateNote(note.id, { tags: [...note.tags, tag.id] });
        }
    };

    const removeTag = (tagId: string) => {
        if (!note) return;
        updateNote(note.id, { tags: note.tags.filter(id => id !== tagId) });
    };

    const updateTitle = (title: string) => {
        if (!note) return;
        updateNote(note.id, { title });
    };

    const updateContent = (content: string) => {
        if (!note) return;
        updateNote(note.id, { content });
    };

    return {
        note,
        handleSave,
        handleCancel,
        addExistingTag,
        handleAddTag,
        removeTag,
        updateTitle,
        updateContent
    };
};
