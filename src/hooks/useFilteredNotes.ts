import { useMemo } from 'react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';

export const useFilteredNotes = () => {
    const { notes } = useNotesData();
    const { searchQuery, selectedTagId, view } = useNotesUI();

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
