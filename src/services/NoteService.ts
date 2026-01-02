import type { Note } from '../types/note';

export class NoteService {
    static createDefaultNote(): Note {
        return {
            id: crypto.randomUUID(),
            title: '',
            content: '',
            tags: [],
            lastEdited: new Date().toISOString(),
            isArchived: false,
        };
    }

    static update(notes: Note[], id: string, updates: Partial<Note>): Note[] {
        return notes.map((n) =>
            n.id === id
                ? {
                    ...n,
                    ...updates,
                    lastEdited: updates.lastEdited || new Date().toISOString(),
                }
                : n
        );
    }

    static delete(notes: Note[], id: string): Note[] {
        return notes.filter((n) => n.id !== id);
    }

    static removeTagReference(notes: Note[], tagId: string): Note[] {
        return notes.map((n) => ({
            ...n,
            tags: n.tags.filter((tId) => tId !== tagId),
        }));
    }
}
