import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

// Mock crypto.randomUUID
Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: () => Math.random().toString(36).substring(2, 15),
    },
});
