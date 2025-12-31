import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotesProvider, useNotes } from './NotesContext';
import { MemoryRouter } from 'react-router-dom';
import { StorageService } from '../services/storage';

vi.mock('../services/storage', () => ({
  StorageService: {
    get: vi.fn(),
    set: vi.fn(),
  },
  STORAGE_KEYS: {
    NOTES: 'notes-app-data',
    TAGS: 'notes-app-tags',
    LANGUAGE: 'notes-app-language',
  },
}));

// Test component to access context
const TestComponent = () => {
  const { notes, searchQuery, view } = useNotes();
  return (
    <div>
      <div data-testid="search-query">{searchQuery}</div>
      <div data-testid="view">{view}</div>
      <ul data-testid="notes-list">
        {notes.map(n => <li key={n.id}>{n.title}</li>)}
      </ul>
    </div>
  );
};

const renderWithContext = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <NotesProvider>
        <TestComponent />
      </NotesProvider>
    </MemoryRouter>
  );
};

describe('NotesContext Integration', () => {
  const mockNotes = [
    { id: '1', title: 'Work Note', content: 'Testing content', tags: [], lastEdited: new Date().toISOString(), isArchived: false },
    { id: '2', title: 'Personal Note', content: 'Buy milk', tags: ['t1'], lastEdited: new Date().toISOString(), isArchived: false },
    { id: '3', title: 'Archived Note', content: 'Old stuff', tags: [], lastEdited: new Date().toISOString(), isArchived: true },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(StorageService.get).mockImplementation((key: string) => {
      if (key === 'notes-app-data') return mockNotes;
      if (key === 'notes-app-tags') return [{ id: 't1', name: 'Personal' }];
      return [];
    });
  });

  it('should show only non-archived notes by default', () => {
    renderWithContext(['/']);
    const notesList = screen.getByTestId('notes-list');
    expect(notesList.children).toHaveLength(2);
    expect(screen.getByText('Work Note')).toBeDefined();
    expect(screen.getByText('Personal Note')).toBeDefined();
    expect(screen.queryByText('Archived Note')).toBeNull();
  });

  it('should filter notes by search query', () => {
    renderWithContext(['/?q=Work']);
    const notesList = screen.getByTestId('notes-list');
    expect(notesList.children).toHaveLength(1);
    expect(screen.getByText('Work Note')).toBeDefined();
    expect(screen.queryByText('Personal Note')).toBeNull();
  });

  it('should filter notes by tag', () => {
    renderWithContext(['/tags/t1']);
    const notesList = screen.getByTestId('notes-list');
    expect(notesList.children).toHaveLength(1);
    expect(screen.getByText('Personal Note')).toBeDefined();
    expect(screen.queryByText('Work Note')).toBeNull();
  });

  it('should show archived notes when in archived view', () => {
    renderWithContext(['/archived']);
    const notesList = screen.getByTestId('notes-list');
    expect(notesList.children).toHaveLength(1);
    expect(screen.getByText('Archived Note')).toBeDefined();
    expect(screen.queryByText('Work Note')).toBeNull();
  });

  it('should sort notes by lastEdited descending', () => {
    const olderNote = { ...mockNotes[0], id: 'old', title: 'Old Note', lastEdited: '2020-01-01T00:00:00.000Z' };
    const newerNote = { ...mockNotes[1], id: 'new', title: 'New Note', lastEdited: '2025-01-01T00:00:00.000Z' };
    vi.mocked(StorageService.get).mockReturnValue([olderNote, newerNote]);

    renderWithContext(['/']);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0].textContent).toBe('New Note');
    expect(listItems[1].textContent).toBe('Old Note');
  });
});
