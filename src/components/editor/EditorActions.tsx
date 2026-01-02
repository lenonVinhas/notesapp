import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';

interface EditorActionsProps {
  onSave: () => void;
  onCancel: () => void;
}

export const EditorActions: React.FC<EditorActionsProps> = ({ onSave, onCancel }) => {
  const { t } = useLanguage();

  return (
    <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex gap-3">
      <Button onClick={onSave}>
        {t('saveNote')}
      </Button>
      <Button variant="secondary" onClick={onCancel}>
        {t('cancel')}
      </Button>
    </div>
  );
};
