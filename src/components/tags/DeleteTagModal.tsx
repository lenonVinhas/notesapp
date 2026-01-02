import React from 'react';
import { Trash2 } from 'lucide-react';
import { useMatch, useParams } from 'react-router-dom';
import { useNotesData } from '../../context/NotesDataContext';
import { useNotesUI } from '../../context/NotesUIContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const DeleteTagModal: React.FC = () => {
  const { deleteTag, notes: allNotes, tags } = useNotesData();
  const { closeDeleteTagModal } = useNotesUI();
  const { t } = useLanguage();
  
  const match = useMatch('/tags/:tagId/delete');
  const params = useParams();
  
  if (!match || !params.tagId) return null;
  
  const tagId = params.tagId;
  const tag = tags.find(t => t.id === tagId);
  
  if (!tag) {
    closeDeleteTagModal();
    return null;
  }

  const affectedNotesCount = allNotes.filter(note => note.tags.includes(tagId)).length;

  const handleConfirm = () => {
    deleteTag(tagId);
    closeDeleteTagModal();
  };

  return (
    <Modal
      isOpen={true}
      onClose={closeDeleteTagModal}
      title={`${t('deleteTag')} "${tag.name}"`}
      description={t('deleteTagConfirm')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={closeDeleteTagModal}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            className="flex-1"
          >
            {t('deleteTag')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center">
        <div className="bg-red-50 p-3 rounded-xl mb-6 border border-red-100">
          <Trash2 className="w-8 h-8 text-red-500" />
        </div>
        
        {affectedNotesCount > 0 && (
           <div className="mb-4 px-3 py-2 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-600">
             ⚠️ <strong>{affectedNotesCount}</strong> {affectedNotesCount === 1 ? t('notesAffectedOne') : t('notesAffectedMany')} {affectedNotesCount === 1 ? t('willBeAffectedOne') : t('willBeAffectedMany')}.
           </div>
        )}
      </div>
    </Modal>
  );
};
