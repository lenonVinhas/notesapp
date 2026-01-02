import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Edit3, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';
import { useTagItem } from './useTagItem';
import { TagEditForm } from './TagEditForm';
import { Button } from '../ui/Button';

interface TagItemProps {
  tag: { id: string; name: string };
  onClose?: () => void;
}

export const TagItem: React.FC<TagItemProps> = ({ tag, onClose }) => {
  const { search } = useLocation();
  const { t } = useLanguage();
  
  const {
    isEditing,
    editName,
    setEditName,
    startEditing,
    exitEditing,
    handleSubmit,
    handleDelete,
    inputRef
  } = useTagItem({ tag });

  if (isEditing) {
    return (
      <TagEditForm
        value={editName}
        onChange={setEditName}
        onSubmit={handleSubmit}
        onBlur={exitEditing}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
      />
    );
  }

  return (
    <NavLink
      to={`/tags/${tag.id}${search}`}
      onClick={onClose}
      className={({ isActive }) => cn(
        "w-full flex items-center justify-between px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 text-left group",
        isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors shrink-0",
              isActive ? "bg-zinc-900" : "bg-zinc-300"
            )} />
            <span className="truncate">{tag.name}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={startEditing}
              className="h-7 w-7 text-zinc-400 hover:text-zinc-900"
              aria-label={t('editTag')}
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-7 w-7 text-zinc-400 hover:text-red-600 hover:bg-red-50"
              aria-label={t('deleteTag')}
            >
               <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </>
      )}
    </NavLink>
  );
};
