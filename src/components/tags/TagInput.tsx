import React, { useState } from 'react';
import { Tag as TagIcon, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

interface TagInputProps {
  tags: { id: string; name: string }[];
  selectedTags: string[];
  onAddTag: (tagName: string) => void;
  onAddExistingTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  selectedTags, 
  onAddTag, 
  onAddExistingTag, 
  onRemoveTag 
}) => {
  const { t } = useLanguage();
  const [newTagName, setNewTagName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const getTagName = (tagId: string) => {
    return tags.find(t => t.id === tagId)?.name;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!newTagName) return;

    const suggestions = tags.filter(t => 
      t.name.toLowerCase().includes(newTagName.toLowerCase()) && 
      !selectedTags.includes(t.id)
    );

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      onAddTag(newTagName.trim());
      setNewTagName('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
      <div className="flex items-center gap-2 text-sm text-zinc-400 w-32 shrink-0 whitespace-nowrap">
        <TagIcon className="w-4 h-4" />
        <span>{t('tags')}</span>
      </div>
      <div className="flex flex-wrap gap-2 items-center flex-1">
        {selectedTags.map(tagId => (
          <span key={tagId} className="flex items-center gap-1.5 bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-sm group/tag">
            {getTagName(tagId)}
            <button onClick={() => onRemoveTag(tagId)} className="hover:text-red-500 opacity-0 group-hover/tag:opacity-100 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <div className="relative inline-block">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={newTagName}
              onChange={e => {
                setNewTagName(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking
                setTimeout(() => setNewTagName(''), 200);
              }}
              className="text-sm outline-none border-b border-zinc-200 focus:border-zinc-900 bg-transparent py-0.5 px-1 w-24 placeholder:text-zinc-300"
              placeholder={t('addTagPlaceholder')}
            />
          </form>
          {/* Autocomplete Suggestions */}
          {newTagName && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-zinc-200 rounded-lg shadow-xl z-20 overflow-hidden">
              {tags
                .filter(t => t.name.toLowerCase().includes(newTagName.toLowerCase()) && !selectedTags.includes(t.id))
                .map((tag, index) => (
                  <button
                    key={tag.id}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-zinc-50 transition-colors flex items-center gap-2",
                      index === selectedIndex && "bg-zinc-100"
                    )}
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent blur
                      onAddExistingTag(tag.id);
                      setNewTagName('');
                      setSelectedIndex(0);
                    }}
                  >
                    <TagIcon className="w-3 h-3 text-zinc-400" />
                    <span className="truncate">{tag.name}</span>
                  </button>
                ))
              }
              {newTagName && !tags.some(t => t.name.toLowerCase() === newTagName.toLowerCase()) && (
                <div className="px-3 py-2 text-xs text-zinc-400 border-t border-zinc-50 bg-zinc-50/50">
                  {t('pressEnterToCreate')} "{newTagName}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
