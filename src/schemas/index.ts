import { z } from 'zod';

export const TagSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(50).trim(),
});

export const NoteSchema = z.object({
    id: z.string(),
    title: z.string().max(100).trim(),
    content: z.string().max(20000),
    tags: z.array(z.string()),
    lastEdited: z.string(),
    isArchived: z.boolean(),
});

export const NotesSchema = z.array(NoteSchema);
export const TagsSchema = z.array(TagSchema);

export const LanguageSchema = z.enum(['en', 'pt']);
