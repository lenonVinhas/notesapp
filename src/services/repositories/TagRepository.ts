import { StorageService, STORAGE_KEYS } from '../storage';
import { TagsSchema } from '../../schemas';
import type { Tag } from '../../types/note';

export class TagRepository {
    static async getAll(): Promise<Tag[]> {
        return StorageService.get<Tag[]>(STORAGE_KEYS.TAGS, [], TagsSchema);
    }

    static async saveAll(tags: Tag[]): Promise<void> {
        return StorageService.set(STORAGE_KEYS.TAGS, tags);
    }
}
