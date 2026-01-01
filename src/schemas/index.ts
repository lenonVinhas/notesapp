import { z } from 'zod';

export const TagSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()),
    lastEdited: z.string(),
    isArchived: z.boolean(),
});

export const NotesSchema = z.array(NoteSchema);
export const TagsSchema = z.array(TagSchema);

export const LanguageSchema = z.enum(['en', 'pt']);
