import { useState, useRef, useEffect, type MouseEvent } from 'react';
import { useNotesData } from '../../context/NotesDataContext';
import { useNotesUI } from '../../context/NotesUIContext';

interface UseTagItemProps {
    tag: { id: string; name: string };
}

export const useTagItem = ({ tag }: UseTagItemProps) => {
    const { updateTag } = useNotesData();
    const { openDeleteTagModal } = useNotesUI();

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
        setEditName(tag.name);
    };

    const handleDelete = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openDeleteTagModal(tag.id);
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
