import React from 'react';
import { Trash2, X } from 'lucide-react';
import { useMatch, useParams } from 'react-router-dom';
import { useNotesData } from '../../context/NotesDataContext';
import { useNotesUI } from '../../context/NotesUIContext';
import { useLanguage } from '../../context/LanguageContext';

export const DeleteTagModal: React.FC = () => {
  const { deleteTag, notes: allNotes, tags } = useNotesData();
  const { closeDeleteTagModal } = useNotesUI();
  const { t } = useLanguage();
  
  // Check if we are in the delete route
  const match = useMatch('/tags/:tagId/delete');
  const params = useParams();
  
  if (!match || !params.tagId) return null;
  
  const tagId = params.tagId;
  const tag = tags.find(t => t.id === tagId);
  
  if (!tag) {
    // If tag doesn't exist (maybe already deleted or invalid URL), just close
    closeDeleteTagModal();
    return null;
  }

  // Count affected notes
  const affectedNotesCount = allNotes.filter(note => note.tags.includes(tagId)).length;

  const handleConfirm = () => {
    deleteTag(tagId);
    closeDeleteTagModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeDeleteTagModal}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white border border-zinc-200 shadow-2xl rounded-2xl p-8 max-w-sm w-full animate-in zoom-in fade-in duration-300">
        <button 
          onClick={closeDeleteTagModal}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="bg-red-50 p-3 rounded-xl mb-6 border border-red-100">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          
          <h2 className="text-xl font-bold text-zinc-900 mb-2">
            {t('deleteTag')} "{tag.name}"
          </h2>
          <p className="text-sm text-zinc-500 mb-2 leading-relaxed">
            {t('deleteTagConfirm')}
          </p>
          
          {affectedNotesCount > 0 && (
             <div className="mb-8 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-600">
               ⚠️ <strong>{affectedNotesCount}</strong> {affectedNotesCount === 1 ? t('notesAffectedOne') : t('notesAffectedMany')} {affectedNotesCount === 1 ? t('willBeAffectedOne') : t('willBeAffectedMany')}.
             </div>
          )}
          {affectedNotesCount === 0 && (
            <div className="mb-8" />
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={closeDeleteTagModal}
              className="flex-1 py-2.5 px-4 bg-white border border-zinc-200 text-zinc-600 text-sm font-semibold rounded-lg hover:bg-zinc-50 transition-all active:scale-95"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 px-4 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95"
            >
              {t('deleteTag')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
