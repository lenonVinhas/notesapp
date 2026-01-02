import type { Tag } from '../types/note';

export class TagService {
    static create(name: string): Tag {
        return {
            id: crypto.randomUUID(),
            name,
        };
    }

    static update(tags: Tag[], id: string, name: string): Tag[] {
        return tags.map((t) => (t.id === id ? { ...t, name } : t));
    }

    static delete(tags: Tag[], id: string): Tag[] {
        return tags.filter((t) => t.id !== id);
    }

    static findByName(tags: Tag[], name: string): Tag | undefined {
        return tags.find((t) => t.name.toLowerCase() === name.toLowerCase());
    }

    static getName(tags: Tag[], id: string): string {
        return tags.find((t) => t.id === id)?.name || '';
    }
}
