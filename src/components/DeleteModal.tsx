import React from 'react';
import { Trash2 } from 'lucide-react';
import { useNotesData } from '../context/NotesDataContext';
import { useNotesUI } from '../context/NotesUIContext';
import { useLanguage } from '../context/LanguageContext';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

export const DeleteModal: React.FC = () => {
  const { deleteNote, notes: allNotes } = useNotesData();
  const { isDeleting, activeNoteId, closeDeleteModal, setActiveNoteId } = useNotesUI();
  const { t } = useLanguage();

  const note = allNotes.find(n => n.id === activeNoteId!);

  const handleDelete = () => {
    deleteNote(activeNoteId);
    setActiveNoteId(null);
    closeDeleteModal();
  };

  return (
    <Modal
      isOpen={isDeleting && !!activeNoteId}
      onClose={closeDeleteModal}
      title={`${t('deleteNote')} "${note?.title || t('titlePlaceholder')}"`}
      description={t('confirmDelete')}
      footer={
        <>
          <Button
            variant="secondary"
            onClick={closeDeleteModal}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            className="flex-1"
          >
            {t('deleteNote')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center">
        <div className="bg-red-50 p-3 rounded-xl mb-6 border border-red-100">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        
        <p className="text-zinc-500 text-sm text-center mb-2">
          {t('confirmDelete')}
        </p>
      </div>
    </Modal>
  );
};
