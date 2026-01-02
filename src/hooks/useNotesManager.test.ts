import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotesManager } from './useNotesManager';
import { StorageService } from '../services/storage';

vi.mock('../services/storage', () => ({
    StorageService: {
        get: vi.fn().mockResolvedValue([]),
        set: vi.fn().mockResolvedValue(undefined),
    },
    STORAGE_KEYS: {
        NOTES: 'notes-app-data',
        TAGS: 'notes-app-tags',
    },
}));

vi.mock('../context/SettingsContext', () => ({
    useSettings: vi.fn(() => ({
        storageMode: 'local',
        directoryPath: '',
        isInitializing: false,
        needsPermission: false,
    })),
}));

vi.mock('../context/NotificationContext', () => ({
    useNotification: vi.fn(() => ({
        notify: vi.fn(),
    })),
}));

describe('useNotesManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with data from StorageService', async () => {
        const mockNotes = [{ id: '1', title: 'Test', content: '', tags: [], lastEdited: '', isArchived: false }];
        const mockTags = [{ id: 't1', name: 'Tag1' }];

        vi.mocked(StorageService.get).mockImplementation(async (key: string) => {
            if (key === 'notes-app-data') return mockNotes;
            if (key === 'notes-app-tags') return mockTags;
            return [];
        });

        const { result } = renderHook(() => useNotesManager());

        // Wait for useEffect to load data
        await act(async () => {
            await Promise.resolve(); // Allow effects to run
        });

        expect(result.current.notes).toEqual(mockNotes);
        expect(result.current.tags).toEqual(mockTags);
    });

    it('should create a note', async () => {
        vi.mocked(StorageService.get).mockResolvedValue([]);
        const { result } = renderHook(() => useNotesManager());

        await act(async () => {
            await Promise.resolve();
        });

        let newNote;
        await act(async () => {
            newNote = result.current.createNote();
        });

        expect(result.current.notes).toHaveLength(1);
        expect(result.current.notes[0]).toEqual(newNote);
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-data', expect.arrayContaining([newNote]));
    });

    it('should update a note', async () => {
        const initialNote = { id: '1', title: 'Old', content: '', tags: [], lastEdited: '', isArchived: false };
        vi.mocked(StorageService.get).mockImplementation(async (key: string) => {
            if (key === 'notes-app-data') return [initialNote];
            return [];
        });
        const { result } = renderHook(() => useNotesManager());

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            result.current.updateNote('1', { title: 'New' });
        });

        expect(result.current.notes[0].title).toBe('New');
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-data', expect.arrayContaining([expect.objectContaining({ title: 'New' })]));
    });

    it('should delete a note', async () => {
        const initialNote = { id: '1', title: 'Delete me', content: '', tags: [], lastEdited: '', isArchived: false };
        vi.mocked(StorageService.get).mockImplementation(async (key: string) => {
            if (key === 'notes-app-data') return [initialNote];
            return [];
        });
        const { result } = renderHook(() => useNotesManager());

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            result.current.deleteNote('1');
        });

        expect(result.current.notes).toHaveLength(0);
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-data', []);
    });

    it('should add a tag', async () => {
        vi.mocked(StorageService.get).mockResolvedValue([]);
        const { result } = renderHook(() => useNotesManager());

        await act(async () => {
            await Promise.resolve();
        });

        let newTag;
        await act(async () => {
            newTag = result.current.addTag('Work');
        });

        expect(result.current.tags).toHaveLength(1);
        expect(result.current.tags[0].name).toBe('Work');
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-tags', [newTag]);
    });

    it('should not add duplicate tags', async () => {
        const existingTag = { id: 't1', name: 'Work' };
        vi.mocked(StorageService.get).mockImplementation(async (key: string) => {
            if (key === 'notes-app-tags') return [existingTag];
            return [];
        });
        const { result } = renderHook(() => useNotesManager());

        await act(async () => {
            await Promise.resolve();
        });

        let returnedTag;
        await act(async () => {
            returnedTag = result.current.addTag('work'); // Case-insensitive
        });

        expect(result.current.tags).toHaveLength(1);
        expect(returnedTag).toEqual(existingTag);
    });

    it('should update a tag', async () => {
        const initialTag = { id: 't1', name: 'OldTag' };
        vi.mocked(StorageService.get).mockImplementation(async (key: string) => {
            if (key === 'notes-app-tags') return [initialTag];
            return [];
        });
        const { result } = renderHook(() => useNotesManager());

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            result.current.updateTag('t1', 'NewTag');
        });

        expect(result.current.tags[0].name).toBe('NewTag');
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-tags', expect.arrayContaining([expect.objectContaining({ name: 'NewTag' })]));
    });

    it('should delete a tag and remove it from notes', async () => {
        const tagId = 't1';
        const tag = { id: tagId, name: 'TagToDelete' };
        const noteWithTag = {
            id: 'n1',
            title: 'Note',
            content: '',
            tags: [tagId, 'other-tag'],
            lastEdited: '',
            isArchived: false
        };

        vi.mocked(StorageService.get).mockImplementation(async (key: string) => {
            if (key === 'notes-app-tags') return [tag];
            if (key === 'notes-app-data') return [noteWithTag];
            return [];
        });

        const { result } = renderHook(() => useNotesManager());

        await act(async () => {
            await Promise.resolve();
        });

        await act(async () => {
            result.current.deleteTag(tagId);
        });

        expect(result.current.tags).toHaveLength(0);
        expect(result.current.notes[0].tags).toEqual(['other-tag']);
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-tags', []);
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-data', expect.arrayContaining([expect.objectContaining({ tags: ['other-tag'] })]));
    });
});
