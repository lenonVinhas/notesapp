import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';
import { useTagItem } from './useTagItem';
import { TagEditForm } from './TagEditForm';

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
        "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 text-left group",
        isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
      )}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isActive ? "bg-zinc-900" : "bg-zinc-300"
            )} />
            <span className="truncate">{tag.name}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={startEditing}
              className="p-1 hover:bg-zinc-200 rounded"
              title={t('editTag')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-red-100 text-zinc-400 hover:text-red-500 rounded"
              title={t('deleteTag')}
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </>
      )}
    </NavLink>
  );
};
