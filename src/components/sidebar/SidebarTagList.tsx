import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TagItem } from '../tags/TagItem';
import type { Tag } from '../../types/note';

interface SidebarTagListProps {
  tags: Tag[];
  onClose?: () => void;
}

export const SidebarTagList: React.FC<SidebarTagListProps> = ({ tags, onClose }) => {
  const { t } = useLanguage();

  return (
    <div className="mt-10 overflow-y-auto flex-1 -mx-2 px-2 pb-4 pt-4 border-t border-zinc-100">
      <div className="flex items-center gap-2 px-4 mb-4">
        <TagIcon className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.1em]">{t('tags')}</span>
      </div>
      <div className="space-y-1">
        {tags.map((tag) => (
          <TagItem key={tag.id} tag={tag} onClose={onClose} />
        ))}
      </div>
    </div>
  );
};
