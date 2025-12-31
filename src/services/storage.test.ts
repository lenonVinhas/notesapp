import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StorageService } from './storage';

describe('StorageService', () => {
    const key = 'test-key';
    const data = { foo: 'bar' };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    it('should set and get data correctly', () => {
        StorageService.set(key, data);
        expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(data));

        // Manual mock behavior for get
        vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(data));

        const retrieved = StorageService.get(key, {});
        expect(retrieved).toEqual(data);
    });

    it('should return default value if key does not exist', () => {
        vi.spyOn(localStorage, 'getItem').mockReturnValue(null);
        const retrieved = StorageService.get(key, { default: true });
        expect(retrieved).toEqual({ default: true });
    });

    it('should return default value if JSON is invalid', () => {
        vi.spyOn(localStorage, 'getItem').mockReturnValue('invalid-json');
        const retrieved = StorageService.get(key, { default: true });
        expect(retrieved).toEqual({ default: true });
    });

    it('should remove item', () => {
        StorageService.remove(key);
        expect(localStorage.removeItem).toHaveBeenCalledWith(key);
    });
});
