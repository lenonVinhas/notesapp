import { en } from './en';
import { pt } from './pt';

export type TranslationKey = keyof typeof en;

export const translations = {
    en,
    pt,
};

export type Language = keyof typeof translations;
