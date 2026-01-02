import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Textarea } from '../ui/Textarea';

interface EditorContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({ content, onContentChange }) => {
  const { t } = useLanguage();

  return (
    <div className="px-8 pb-8 flex-1 overflow-hidden">
      <Textarea
        className="w-full h-full resize-none border-none outline-none text-zinc-600 leading-relaxed placeholder:text-zinc-200 bg-transparent px-0 focus-visible:ring-0"
        placeholder={t('contentPlaceholder')}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
      />
    </div>
  );
};
