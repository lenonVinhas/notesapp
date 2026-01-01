import React from 'react';
import { Search, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface NoteListEmptyStateProps {
  searchQuery: string;
}

export const NoteListEmptyState: React.FC<NoteListEmptyStateProps> = ({ searchQuery }) => {
  const { t } = useLanguage();

  return (
    <div className="p-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-zinc-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
        {searchQuery ? (
          <Search className="w-6 h-6 text-zinc-300" />
        ) : (
          <FileText className="w-6 h-6 text-zinc-300" />
        )}
      </div>
      <p className="text-zinc-900 font-medium text-sm mb-1 mt-2">
        {searchQuery ? t('noResultsFound') : t('selectNote')}
      </p>
      {searchQuery && (
        <p className="text-zinc-400 text-xs italic line-clamp-2">
          "{searchQuery}"
        </p>
      )}
    </div>
  );
};
