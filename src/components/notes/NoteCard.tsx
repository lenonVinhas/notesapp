import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDateFormatter } from '../../utils/date';
import { cn } from '../../utils/cn';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    tags: string[];
    lastEdited: string;
  };
  isActive: boolean;
  onClick: () => void;
  getTagName: (id: string) => string;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, isActive, onClick, getTagName }) => {
  const { t } = useLanguage();
  const { formatDate } = useDateFormatter();

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 border-b border-zinc-100 text-left transition-colors flex flex-col gap-2 relative",
        isActive ? "bg-zinc-50" : "hover:bg-zinc-50"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900" />
      )}
      <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1">
        {note.title || t('titlePlaceholder')}
      </h3>
      
      <div className="flex flex-wrap gap-1.5">
        {note.tags.map(tagId => (
          <span key={tagId} className="flex items-center gap-1 text-[10px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">
            {getTagName(tagId)}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
        <span>{formatDate(note.lastEdited)}</span>
      </div>
    </button>
  );
};
