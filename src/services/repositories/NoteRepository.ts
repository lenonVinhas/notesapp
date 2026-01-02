import { StorageService, STORAGE_KEYS } from '../storage';
import { NotesSchema } from '../../schemas';
import type { Note } from '../../types/note';

export class NoteRepository {
    static async getAll(): Promise<Note[]> {
        return StorageService.get<Note[]>(STORAGE_KEYS.NOTES, [], NotesSchema);
    }

    static async saveAll(notes: Note[]): Promise<void> {
        return StorageService.set(STORAGE_KEYS.NOTES, notes);
    }
}
