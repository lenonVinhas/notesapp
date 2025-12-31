export interface Tag {
    id: string;
    name: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[]; // IDs of tags
    lastEdited: string; // ISO date
    isArchived: boolean;
}

export type Language = 'en' | 'pt';
