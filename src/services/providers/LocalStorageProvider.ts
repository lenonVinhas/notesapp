import type { StorageProvider } from './types';
import { type ZodSchema } from 'zod';

export class LocalStorageProvider implements StorageProvider {
    async init(): Promise<void> {
        // Nada necessário para o localStorage
        return Promise.resolve();
    }

    async get<T>(key: string, defaultValue: T, schema?: ZodSchema<T>): Promise<T> {
        try {
            const saved = localStorage.getItem(key);
            if (!saved) return defaultValue;

            const parsed = JSON.parse(saved);

            if (schema) {
                const result = schema.safeParse(parsed);
                if (!result.success) {
                    console.error(`Validation error for key "${key}":`, result.error);
                    return defaultValue;
                }
                return result.data;
            }

            return parsed;
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return defaultValue;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }

    async remove(key: string): Promise<void> {
        localStorage.removeItem(key);
    }

    async hasPermission(): Promise<boolean> {
        return true;
    }

    async requestPermission(): Promise<boolean> {
        return true;
    }
}
