import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useLanguage } from '../../context/LanguageContext';

interface TagSuggestionsProps {
    suggestions: { id: string; name: string }[];
    selectedIndex: number;
    newTagName: string;
    onSelect: (tagId: string) => void;
    setNewTagName: (name: string) => void;
    setSelectedIndex: (index: number) => void;
}

export const TagSuggestions: React.FC<TagSuggestionsProps> = ({
    suggestions,
    selectedIndex,
    newTagName,
    onSelect,
    setNewTagName,
    setSelectedIndex
}) => {
    const { t } = useLanguage();

    if (!newTagName) return null;

    return (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl z-20 overflow-hidden">
            {suggestions.map((tag, index) => (
                <button
                    key={tag.id}
                    className={cn(
                        "w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2",
                        index === selectedIndex && "bg-zinc-100"
                    )}
                    onMouseDown={(e) => {
                        e.preventDefault(); // Prevent blur
                        onSelect(tag.id);
                        setNewTagName('');
                        setSelectedIndex(0);
                    }}
                >
                    <TagIcon className="w-3 h-3 text-zinc-400" />
                    <span className="truncate">{tag.name}</span>
                </button>
            ))}
            {newTagName && !suggestions.some(t => t.name.toLowerCase() === newTagName.toLowerCase()) && (
                <div className={cn(
                    "px-3 py-2 text-xs text-zinc-400 border-t border-zinc-50 bg-zinc-50/50",
                     selectedIndex === suggestions.length && "bg-zinc-100" // Highlight if selected
                )}>
                    {t('pressEnterToCreate')} "{newTagName}"
                </div>
            )}
        </div>
    );
};
