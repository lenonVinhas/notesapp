import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { useNotes } from '../../context/NotesContext';
import { useLanguage } from '../../context/LanguageContext';

interface UseTagItemProps {
    tag: { id: string; name: string };
}

export const useTagItem = ({ tag }: UseTagItemProps) => {
    const { updateTag, deleteTag } = useNotes();
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(tag.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editName.trim()) {
            updateTag(tag.id, editName.trim());
            setIsEditing(false);
        }
    };

    const startEditing = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
    };

    const exitEditing = () => {
        setIsEditing(false);
        setEditName(tag.name); // Reset to original name on cancel
    };

    const handleDelete = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm(t('deleteTagConfirm'))) {
            deleteTag(tag.id);
        }
    };

    return {
        isEditing,
        editName,
        setEditName,
        startEditing,
        exitEditing,
        handleSubmit,
        handleDelete,
        inputRef
    };
};
