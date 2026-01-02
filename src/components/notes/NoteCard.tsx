import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useNotesData } from '../../context/NotesDataContext';
import { useDateFormatter } from '../../utils/date';
import { cn } from '../../utils/cn';
import { Badge } from '../ui/Badge';

interface NoteCardProps {
  note: {
    id: string;
    title: string;
    tags: string[];
    lastEdited: string;
  };
  isActive: boolean;
  onClick: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, isActive, onClick }) => {
  const { t } = useLanguage();
  const { formatDate } = useDateFormatter();
  const { getTagName } = useNotesData();

  return (
    <button
      onClick={onClick}
      aria-selected={isActive}
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
      
      <div className="flex flex-wrap gap-1.5 font-medium">
        {note.tags.map(tagId => (
          <Badge key={tagId} variant="secondary" className="text-[10px] px-2 py-0 h-4 leading-none border-none text-zinc-500">
            {getTagName(tagId)}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium">
        <span>{formatDate(note.lastEdited)}</span>
      </div>
    </button>
  );
};
