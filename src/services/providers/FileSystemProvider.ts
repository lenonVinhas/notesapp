import type { StorageProvider } from './types';
import { type ZodSchema } from 'zod';

export class FileSystemProvider implements StorageProvider {
    private directoryHandle: FileSystemDirectoryHandle | null = null;

    constructor(directoryHandle?: FileSystemDirectoryHandle) {
        if (directoryHandle) {
            this.directoryHandle = directoryHandle;
        }
    }

    async hasPermission(): Promise<boolean> {
        if (!this.directoryHandle) return false;
        const status = await (this.directoryHandle as any).queryPermission?.({ mode: 'readwrite' });
        return status === 'granted';
    }

    async requestPermission(): Promise<boolean> {
        if (!this.directoryHandle) return false;
        const status = await (this.directoryHandle as any).requestPermission?.({ mode: 'readwrite' });
        return status === 'granted';
    }

    async init(): Promise<void> {
        if (!this.directoryHandle) {
            throw new Error('Directory handle not provided. Please select a directory first.');
        }
        // No init, we only want to check permission during the user gesture phase if possible
    }

    async get<T>(key: string, defaultValue: T, schema?: ZodSchema<T>): Promise<T> {
        if (!this.directoryHandle) return defaultValue;

        try {
            const fileHandle = await this.directoryHandle.getFileHandle(`${key}.json`, { create: false });
            const file = await fileHandle.getFile();
            const content = await file.text();
            const parsed = JSON.parse(content);

            if (schema) {
                const result = schema.safeParse(parsed);
                if (!result.success) {
                    console.error(`Validation error for file "${key}.json":`, result.error);
                    return defaultValue;
                }
                return result.data;
            }

            return parsed;
        } catch (error) {
            // Se o arquivo não existe, retornamos o valor padrão de forma silenciosa
            if ((error as any).name === 'NotFoundError') {
                return defaultValue;
            }
            console.error(`Error reading file "${key}.json":`, error);
            return defaultValue;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        if (!this.directoryHandle) return;

        try {
            const fileHandle = await this.directoryHandle.getFileHandle(`${key}.json`, { create: true });
            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(value, null, 2));
            await writable.close();
        } catch (error) {
            console.error(`Error writing file "${key}.json":`, error);
        }
    }

    async remove(key: string): Promise<void> {
        if (!this.directoryHandle) return;

        try {
            await this.directoryHandle.removeEntry(`${key}.json`);
        } catch (error) {
            if ((error as any).name !== 'NotFoundError') {
                console.error(`Error removing file "${key}.json":`, error);
            }
        }
    }

    setDirectoryHandle(handle: FileSystemDirectoryHandle) {
        this.directoryHandle = handle;
    }
}
