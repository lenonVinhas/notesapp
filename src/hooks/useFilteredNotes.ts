import { useMemo } from 'react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';

export const useFilteredNotes = () => {
    const { notes } = useNotesData(); // notes from manager are all notes (unsorted/unfiltered)
    // wait, useNotesManager just returned 'notes' which was state.
    // NotesContext sorted it.

    // Actually useNotesManager returned notes.
    // NotesContext filtered and sorted them.

    const { searchQuery, selectedTagId, view } = useNotesUI();

    // We need to access 'notes' from data context, which are all notes.
    // Note: createNote etc updates the 'notes' in data context.

    const filteredNotes = useMemo(() => {
        return notes
            .filter((note) => {
                const matchesSearch =
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesTag = !selectedTagId || note.tags.includes(selectedTagId);
                const matchesView = view === 'all' ? !note.isArchived : note.isArchived;

                return matchesSearch && matchesTag && matchesView;
            })
            .sort((a, b) => new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime());
    }, [notes, searchQuery, selectedTagId, view]);

    return { filteredNotes, allNotes: notes };
};
