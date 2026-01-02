import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface TagListProps {
    tags: { id: string; name: string }[];
    selectedTags: string[];
    onRemoveTag: (tagId: string) => void;
    getTagName: (tagId: string) => string | undefined;
}

export const TagList: React.FC<TagListProps> = ({ selectedTags, onRemoveTag, getTagName }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {selectedTags.map(tagId => (
                <Badge key={tagId} variant="secondary" className="flex items-center gap-1.5 pr-1 py-1 group/tag">
                    <span className="truncate max-w-[150px]">{getTagName(tagId)}</span>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => onRemoveTag(tagId)} 
                        className="h-4 w-4 rounded-full opacity-0 group-hover/tag:opacity-100 transition-opacity hover:text-red-500"
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </Badge>
            ))}
        </div>
    );
};
