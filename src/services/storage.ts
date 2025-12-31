export const STORAGE_KEYS = {
    NOTES: 'notes-app-data',
    TAGS: 'notes-app-tags',
    LANGUAGE: 'notes-app-language',
} as const;

export class StorageService {
    static get<T>(key: string, defaultValue: T): T {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    }

    static set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }

    static remove(key: string): void {
        localStorage.removeItem(key);
    }
}
