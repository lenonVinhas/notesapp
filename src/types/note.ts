export interface Tag {
    id: string;
    name: string;
}

export interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    lastEdited: string;
    isArchived: boolean;
}

