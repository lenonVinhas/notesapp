import React from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TagInput } from '../tags/TagInput';
import type { Tag } from '../../types/note';

interface EditorMetadataProps {
  tags: Tag[];
  noteTags: string[];
  lastEdited: string;
  onAddTag: (name: string) => void;
  onAddExistingTag: (tagId: string) => void;
  onRemoveTag: (tagId: string) => void;
}

export const EditorMetadata: React.FC<EditorMetadataProps> = ({
  tags,
  noteTags,
  lastEdited,
  onAddTag,
  onAddExistingTag,
  onRemoveTag,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 mb-4 md:mb-8 px-4 md:px-8">
      <TagInput
        tags={tags}
        selectedTags={noteTags}
        onAddTag={onAddTag}
        onAddExistingTag={onAddExistingTag}
        onRemoveTag={onRemoveTag}
      />

      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-6 text-sm text-zinc-400">
        <div className="flex items-center gap-2 md:w-32 shrink-0 whitespace-nowrap">
          <Clock className="w-4 h-4" />
          <span>{t('lastEdited')}</span>
        </div>
        <span className="font-medium text-zinc-500 truncate">
          {new Date(lastEdited).toLocaleString()}
        </span>
      </div>
    </div>
  );
};
