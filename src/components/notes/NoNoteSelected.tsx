import React from 'react';
import { StickyNote } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const NoNoteSelected: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#FBFBFB] selection:bg-zinc-200">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-zinc-200 blur-3xl opacity-20 rounded-full scale-150 animate-pulse" />
        <div className="relative bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 group-hover:scale-105 transition-transform duration-500">
            <StickyNote className="w-16 h-16 text-zinc-200" strokeWidth={1.5} />
        </div>
      </div>
      <div className="text-center max-w-sm">
        <h3 className="text-xl font-semibold text-zinc-900 mb-2 tracking-tight">
          {t('noNotesSelected')}
        </h3>
        <p className="text-zinc-500 leading-relaxed">
          {t('selectNoteDescription')}
        </p>
      </div>
    </div>
  );
};
