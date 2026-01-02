import { type ZodSchema } from 'zod';

export interface StorageProvider {
    init(): Promise<void>;
    get<T>(key: string, defaultValue: T, schema?: ZodSchema<T>): Promise<T>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
    hasPermission(): Promise<boolean>;
    requestPermission(): Promise<boolean>;
}
