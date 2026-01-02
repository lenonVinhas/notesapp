import { type ZodSchema } from 'zod';
import type { StorageProvider } from './providers/types';
import { LocalStorageProvider } from './providers/LocalStorageProvider';

export const STORAGE_KEYS = {
    NOTES: 'notes-app-data',
    TAGS: 'notes-app-tags',
    LANGUAGE: 'notes-app-language',
    STORAGE_MODE: 'notes-app-storage-mode', // 'local' ou 'files'
} as const;

export class StorageService {
    private static provider: StorageProvider = new LocalStorageProvider();
    private static globalProvider: StorageProvider = new LocalStorageProvider();

    static async setProvider(newProvider: StorageProvider): Promise<void> {
        this.provider = newProvider;
        await this.provider.init();
    }

    // Global operations (always localStorage)
    static async getGlobal<T>(key: string, defaultValue: T, schema?: ZodSchema<T>): Promise<T> {
        return this.globalProvider.get(key, defaultValue, schema);
    }

    static async setGlobal<T>(key: string, value: T): Promise<void> {
        return this.globalProvider.set(key, value);
    }

    // Provider-specific operations (could be localStorage or FileSystem)
    static async get<T>(key: string, defaultValue: T, schema?: ZodSchema<T>): Promise<T> {
        return this.provider.get(key, defaultValue, schema);
    }

    static async set<T>(key: string, value: T): Promise<void> {
        return this.provider.set(key, value);
    }

    static async remove(key: string): Promise<void> {
        return this.provider.remove(key);
    }
}
