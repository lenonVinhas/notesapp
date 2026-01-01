import { useState, type KeyboardEvent } from 'react';

interface UseTagNavigationProps {
    tags: { id: string; name: string }[];
    selectedTags: string[];
    onAddTag: (tagName: string) => void;
    onAddExistingTag: (tagId: string) => void;
}

export const useTagNavigation = ({
    tags,
    selectedTags,
    onAddTag,
    onAddExistingTag
}: UseTagNavigationProps) => {
    const [newTagName, setNewTagName] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const suggestions = tags.filter(t =>
        t.name.toLowerCase().includes(newTagName.toLowerCase()) &&
        !selectedTags.includes(t.id)
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!newTagName) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % (suggestions.length + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + (suggestions.length + 1)) % (suggestions.length + 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex < suggestions.length) {
                onAddExistingTag(suggestions[selectedIndex].id);
            } else {
                // Create new tag
                if (newTagName.trim()) {
                    onAddTag(newTagName.trim());
                }
            }
            setNewTagName('');
            setSelectedIndex(0);
        } else if (e.key === 'Escape') {
            setNewTagName('');
            setSelectedIndex(0);
        }
    };

    return {
        newTagName,
        setNewTagName,
        selectedIndex,
        setSelectedIndex,
        suggestions,
        handleKeyDown
    };
};
