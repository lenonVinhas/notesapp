import React from 'react';
import { Archive, Trash2, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

interface NoteActionsProps {
  isArchived: boolean;
  onArchive: () => void;
  onDelete: () => void;
}

export const NoteActions: React.FC<NoteActionsProps> = ({ isArchived, onArchive, onDelete }) => {
  const { t } = useLanguage();

  return (
    <div className="absolute right-4 md:right-6 top-16 md:top-8 flex flex-col gap-2 p-1.5 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-xl shadow-xl transition-all opacity-40 group-hover:opacity-100 hover:scale-105 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={onArchive}
        className={cn(
          "h-11 w-11 rounded-lg transition-all relative group/btn",
          isArchived 
            ? "text-blue-600 hover:bg-blue-50 hover:text-blue-700" 
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
        )}
        aria-label={isArchived ? t('unarchiveNote') : t('archiveNote')}
      >
        {isArchived ? <RotateCcw className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
        <span className="absolute right-full mr-3 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
          {isArchived ? t('unarchiveNote') : t('archiveNote')}
        </span>
      </Button>
      <div className="h-px bg-zinc-100 mx-2" />
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="h-11 w-11 text-zinc-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all relative group/btn"
        aria-label={t('deleteNote')}
      >
        <Trash2 className="w-5 h-5" />
        <span className="absolute right-full mr-3 px-2 py-1 bg-red-600 text-white text-[10px] rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
          {t('deleteNote')}
        </span>
      </Button>
    </div>
  );
};
