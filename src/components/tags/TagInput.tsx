import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTagNavigation } from './useTagNavigation';
import { TagList } from './TagList';
import { TagSuggestions } from './TagSuggestions';

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
  
  const {
    newTagName,
    setNewTagName,
    selectedIndex,
    setSelectedIndex,
    suggestions,
    handleKeyDown
  } = useTagNavigation({
    tags,
    selectedTags,
    onAddTag,
    onAddExistingTag
  });

  const getTagName = (tagId: string) => {
    return tags.find(t => t.id === tagId)?.name;
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
        <TagList 
            tags={tags} 
            selectedTags={selectedTags} 
            onRemoveTag={onRemoveTag} 
            getTagName={getTagName} 
        />
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
          <TagSuggestions
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            newTagName={newTagName}
            onSelect={onAddExistingTag}
            setNewTagName={setNewTagName}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
      </div>
    </div>
  );
};
