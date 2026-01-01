import React from 'react';
import { Trash2, X } from 'lucide-react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';
import { useLanguage } from '../context/LanguageContext';

export const DeleteModal: React.FC = () => {
  const { deleteNote } = useNotesData();
  const { isDeleting, activeNoteId, closeDeleteModal, setActiveNoteId } = useNotesUI();
  const { t } = useLanguage();

  if (!isDeleting || !activeNoteId) return null;

  const handleDelete = () => {
    deleteNote(activeNoteId);
    setActiveNoteId(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeDeleteModal}
      />
      
      {/* Modal Content - Refined Minimal Style */}
      <div className="relative bg-white border border-zinc-200 shadow-2xl rounded-2xl p-8 max-w-sm w-full animate-in zoom-in fade-in duration-300">
        <button 
          onClick={closeDeleteModal}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-red-50 p-3 rounded-xl mb-6 border border-red-100">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            {t('deleteNote')}
          </h2>
          <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
            {t('confirmDelete')}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={closeDeleteModal}
              className="flex-1 py-2.5 px-4 bg-white border border-zinc-200 text-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 transition-all active:scale-95"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2.5 px-4 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95"
            >
              {t('deleteNote')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
