import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNotesNavigation } from './useNotesNavigation';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

const wrapper = ({ children, initialEntries = ['/'] }: { children: React.ReactNode, initialEntries?: string[] }) => (
    <MemoryRouter initialEntries={initialEntries}>
        <Routes>
            <Route path="/" element={children} />
            <Route path="/:noteId" element={children} />
            <Route path="/:noteId/delete" element={children} />
            
            <Route path="/archived" element={children} />
            <Route path="/archived/:noteId" element={children} />
            
            <Route path="/tags/:tagId" element={children} />
            <Route path="/tags/:tagId/:noteId" element={children} />
        </Routes>
    </MemoryRouter>
);

describe('useNotesNavigation', () => {
    it('should parse root path correctly', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/'] })
        });

        expect(result.current.view).toBe('all');
        expect(result.current.activeNoteId).toBeNull();
        expect(result.current.isDeleting).toBe(false);
    });

    it('should parse active note path correctly', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/note-1'] })
        });

        expect(result.current.view).toBe('all');
        expect(result.current.activeNoteId).toBe('note-1');
    });

    it('should parse archived view correctly', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/archived'] })
        });

        expect(result.current.view).toBe('archived');
        expect(result.current.activeNoteId).toBeNull();
    });

    it('should parse archived note correctly', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/archived/note-2'] })
        });

        expect(result.current.view).toBe('archived');
        expect(result.current.activeNoteId).toBe('note-2');
    });

    it('should parse tag view correctly', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/tags/tag-1'] })
        });

        expect(result.current.selectedTagId).toBe('tag-1');
        expect(result.current.activeNoteId).toBeNull();
    });

    it('should parse tag note correctly', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/tags/tag-1/note-3'] })
        });

        expect(result.current.selectedTagId).toBe('tag-1');
        expect(result.current.activeNoteId).toBe('note-3');
    });

    it('should detect delete action', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/note-1/delete'] })
        });

        expect(result.current.isDeleting).toBe(true);
        expect(result.current.activeNoteId).toBe('note-1');
    });

    it('should parse search query correctly', () => {
        const { result } = renderHook(() => useNotesNavigation(), {
            wrapper: (props) => wrapper({ ...props, initialEntries: ['/?q=hello'] })
        });

        expect(result.current.searchQuery).toBe('hello');
    });

});
