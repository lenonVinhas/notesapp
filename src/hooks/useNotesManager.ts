import { useState, useEffect } from 'react';
import type { Note, Tag } from '../types/note';
import { StorageService, STORAGE_KEYS } from '../services/storage';
import { NotesSchema, TagsSchema } from '../schemas';

export const useNotesManager = () => {
    const [notes, setNotes] = useState<Note[]>(() =>
        StorageService.get<Note[]>(STORAGE_KEYS.NOTES, [], NotesSchema)
    );

    const [tags, setTags] = useState<Tag[]>(() =>
        StorageService.get<Tag[]>(STORAGE_KEYS.TAGS, [], TagsSchema)
    );

    useEffect(() => {
        StorageService.set(STORAGE_KEYS.NOTES, notes);
    }, [notes]);

    useEffect(() => {
        StorageService.set(STORAGE_KEYS.TAGS, tags);
    }, [tags]);

    const createNote = () => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: '',
            content: '',
            tags: [],
            lastEdited: new Date().toISOString(),
            isArchived: false,
        };
        setNotes((prev) => [newNote, ...prev]);
        return newNote;
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes((prev) =>
            prev.map((n) =>
                n.id === id
                    ? {
                        ...n,
                        ...updates,
                        lastEdited: updates.lastEdited || new Date().toISOString(),
                    }
                    : n
            )
        );
    };

    const deleteNote = (id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
    };

    const archiveNote = (id: string) => {
        updateNote(id, { isArchived: true });
    };

    const unarchiveNote = (id: string) => {
        updateNote(id, { isArchived: false });
    };

    const addTag = (name: string): Tag => {
        const existing = tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
        if (existing) return existing;

        const newTag: Tag = { id: crypto.randomUUID(), name };
        setTags((prev) => [...prev, newTag]);
        return newTag;
    };

    const updateTag = (id: string, name: string) => {
        setTags((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
    };

    const deleteTag = (id: string) => {
        setTags((prev) => prev.filter((t) => t.id !== id));
        setNotes((prev) =>
            prev.map((n) => ({
                ...n,
                tags: n.tags.filter((tId) => tId !== id),
            }))
        );
    };

    return {
        notes,
        tags,
        createNote,
        updateNote,
        deleteNote,
        archiveNote,
        unarchiveNote,
        addTag,
        updateTag,
        deleteTag,
    };
};
