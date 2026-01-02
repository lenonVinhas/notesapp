import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Input } from '../ui/Input';

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onBack: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ title, onTitleChange, onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="p-4 md:p-8 pb-4">
      <div className="md:hidden mb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          {t('allNotes')}
        </button>
      </div>
      <div className="mb-4 md:mb-8 pr-16 text-pretty">
        <Input
          type="text"
          className="text-3xl font-bold text-zinc-900 border-none outline-none placeholder:text-zinc-200 w-full bg-transparent px-0 h-auto focus-visible:ring-0"
          placeholder={t('titlePlaceholder')}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
    </div>
  );
};
