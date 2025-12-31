import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNotesManager } from './useNotesManager';
import { StorageService } from '../services/storage';

vi.mock('../services/storage', () => ({
    StorageService: {
        get: vi.fn(),
        set: vi.fn(),
    },
    STORAGE_KEYS: {
        NOTES: 'notes-app-data',
        TAGS: 'notes-app-tags',
    },
}));

describe('useNotesManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with data from StorageService', () => {
        const mockNotes = [{ id: '1', title: 'Test', content: '', tags: [], lastEdited: '', isArchived: false }];
        const mockTags = [{ id: 't1', name: 'Tag1' }];

        vi.mocked(StorageService.get).mockImplementation((key: string) => {
            if (key === 'notes-app-data') return mockNotes;
            if (key === 'notes-app-tags') return mockTags;
            return [];
        });

        const { result } = renderHook(() => useNotesManager());

        expect(result.current.notes).toEqual(mockNotes);
        expect(result.current.tags).toEqual(mockTags);
    });

    it('should create a note', () => {
        vi.mocked(StorageService.get).mockReturnValue([]);
        const { result } = renderHook(() => useNotesManager());

        let newNote;
        act(() => {
            newNote = result.current.createNote();
        });

        expect(result.current.notes).toHaveLength(1);
        expect(result.current.notes[0]).toEqual(newNote);
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-data', expect.arrayContaining([newNote]));
    });

    it('should update a note', () => {
        const initialNote = { id: '1', title: 'Old', content: '', tags: [], lastEdited: '', isArchived: false };
        vi.mocked(StorageService.get).mockReturnValue([initialNote]);
        const { result } = renderHook(() => useNotesManager());

        act(() => {
            result.current.updateNote('1', { title: 'New' });
        });

        expect(result.current.notes[0].title).toBe('New');
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-data', expect.arrayContaining([expect.objectContaining({ title: 'New' })]));
    });

    it('should delete a note', () => {
        const initialNote = { id: '1', title: 'Delete me', content: '', tags: [], lastEdited: '', isArchived: false };
        vi.mocked(StorageService.get).mockReturnValue([initialNote]);
        const { result } = renderHook(() => useNotesManager());

        act(() => {
            result.current.deleteNote('1');
        });

        expect(result.current.notes).toHaveLength(0);
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-data', []);
    });

    it('should add a tag', () => {
        vi.mocked(StorageService.get).mockReturnValue([]);
        const { result } = renderHook(() => useNotesManager());

        let newTag;
        act(() => {
            newTag = result.current.addTag('Work');
        });

        expect(result.current.tags).toHaveLength(1);
        expect(result.current.tags[0].name).toBe('Work');
        expect(StorageService.set).toHaveBeenCalledWith('notes-app-tags', [newTag]);
    });

    it('should not add duplicate tags', () => {
        const existingTag = { id: 't1', name: 'Work' };
        vi.mocked(StorageService.get).mockImplementation((key: string) => {
            if (key === 'notes-app-tags') return [existingTag];
            return [];
        });
        const { result } = renderHook(() => useNotesManager());

        let returnedTag;
        act(() => {
            returnedTag = result.current.addTag('work'); // Case-insensitive
        });

        expect(result.current.tags).toHaveLength(1);
        expect(returnedTag).toEqual(existingTag);
    });
});
