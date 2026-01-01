import React from 'react';
import { X } from 'lucide-react';


interface TagListProps {
    tags: { id: string; name: string }[];
    selectedTags: string[];
    onRemoveTag: (tagId: string) => void;
    getTagName: (tagId: string) => string | undefined;
}

export const TagList: React.FC<TagListProps> = ({ selectedTags, onRemoveTag, getTagName }) => {
    return (
        <>
            {selectedTags.map(tagId => (
                <span key={tagId} className="flex items-center gap-1.5 bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-sm group/tag max-w-[200px]">
                    <span className="truncate">{getTagName(tagId)}</span>
                    <button onClick={() => onRemoveTag(tagId)} className="hover:text-red-500 opacity-0 group-hover/tag:opacity-100 transition-opacity">
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
        </>
    );
};
