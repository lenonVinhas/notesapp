import { get, set, del } from 'idb-keyval';

const DB_KEY = 'notes-app-file-handle';

export const FileHandleStorage = {
    async save(handle: FileSystemDirectoryHandle): Promise<void> {
        await set(DB_KEY, handle);
    },

    async get(): Promise<FileSystemDirectoryHandle | null> {
        return await get(DB_KEY) || null;
    },

    async clear(): Promise<void> {
        await del(DB_KEY);
    }
};
