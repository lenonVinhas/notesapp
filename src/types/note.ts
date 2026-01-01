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

// Language type explicitly removed, should import from ../i18n if needed

