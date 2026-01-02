import { useState, useEffect } from 'react';
import type { Note, Tag } from '../types/note';
import { useSettings } from '../context/SettingsContext';
import { NoteService } from '../services/NoteService';
import { TagService } from '../services/TagService';
import { useNotification } from '../context/NotificationContext';
import { NoteRepository } from '../services/repositories/NoteRepository';
import { TagRepository } from '../services/repositories/TagRepository';

export const useNotesManager = () => {
    const { storageMode, directoryPath, isInitializing: isSettingsInitializing, needsPermission } = useSettings();
    const [notes, setNotes] = useState<Note[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { notify } = useNotification();

    useEffect(() => {
        if (isSettingsInitializing || (storageMode === 'files' && needsPermission)) {
            setIsLoading(true);
            return;
        }

        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [savedNotes, savedTags] = await Promise.all([
                    NoteRepository.getAll(),
                    TagRepository.getAll()
                ]);
                setNotes(savedNotes);
                setTags(savedTags);
            } catch (error) {
                console.error('Failed to load notes or tags:', error);
                notify('error', 'Falha ao carregar notas. Verifique as permissões de acesso.');
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [isSettingsInitializing, storageMode, directoryPath, needsPermission]);

    useEffect(() => {
        if (!isLoading && !isSettingsInitializing && !(storageMode === 'files' && needsPermission)) {
            NoteRepository.saveAll(notes);
        }
    }, [notes, isLoading, isSettingsInitializing, storageMode, needsPermission]);

    useEffect(() => {
        if (!isLoading && !isSettingsInitializing && !(storageMode === 'files' && needsPermission)) {
            TagRepository.saveAll(tags);
        }
    }, [tags, isLoading, isSettingsInitializing, storageMode, needsPermission]);

    const createNote = () => {
        const newNote = NoteService.createDefaultNote();
        setNotes((prev) => [newNote, ...prev]);
        return newNote;
    };

    const getTagName = (tagId: string) => TagService.getName(tags, tagId);

    const updateNote = (id: string, updates: Partial<Note>) => {
        setNotes((prev) => NoteService.update(prev, id, updates));
    };

    const deleteNote = (id: string) => {
        setNotes((prev) => NoteService.delete(prev, id));
    };

    const archiveNote = (id: string) => {
        updateNote(id, { isArchived: true });
    };

    const unarchiveNote = (id: string) => {
        updateNote(id, { isArchived: false });
    };

    const addTag = (name: string): Tag => {
        const existing = TagService.findByName(tags, name);
        if (existing) return existing;

        const newTag = TagService.create(name);
        setTags((prev) => [...prev, newTag]);
        return newTag;
    };

    const updateTag = (id: string, name: string) => {
        setTags((prev) => TagService.update(prev, id, name));
    };

    const deleteTag = (id: string) => {
        setTags((prev) => TagService.delete(prev, id));
        setNotes((prev) => NoteService.removeTagReference(prev, id));
    };

    return {
        notes,
        tags,
        isLoading,
        createNote,
        updateNote,
        deleteNote,
        archiveNote,
        unarchiveNote,
        addTag,
        updateTag,
        deleteTag,
        getTagName,
    };
};
