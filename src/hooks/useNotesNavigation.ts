import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';

export const useNotesNavigation = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const searchQuery = searchParams.get('q') || '';

    const segments = location.pathname.split('/').filter(Boolean);
    let view: 'all' | 'archived' = 'all';
    let selectedTagId: string | null = null;
    let activeNoteId: string | null = null;
    let isDeleting = false;

    if (segments[segments.length - 1] === 'delete') {
        isDeleting = true;
        segments.pop();
    }

    if (segments[0] === 'archived') {
        view = 'archived';
        activeNoteId = segments[1] || null;
    } else if (segments[0] === 'tags') {
        selectedTagId = segments[1] || null;
        activeNoteId = segments[2] || null;
    } else {
        view = 'all';
        activeNoteId = segments[0] || null;
    }

    const getPathForNote = (id: string | null, action?: 'delete') => {
        let newPath = '/';
        if (view === 'archived') {
            newPath = id ? `/archived/${id}` : '/archived';
        } else if (selectedTagId) {
            newPath = id ? `/tags/${selectedTagId}/${id}` : `/tags/${selectedTagId}`;
        } else {
            newPath = id ? `/${id}` : '/';
        }

        if (action === 'delete' && id) {
            newPath += '/delete';
        }

        return `${newPath}${location.search}`;
    };

    const setActiveNoteId = (id: string | null) => {
        navigate(getPathForNote(id));
    };

    const openDeleteModal = (id: string) => {
        navigate(getPathForNote(id, 'delete'));
    };

    const closeDeleteModal = () => {
        navigate(getPathForNote(activeNoteId));
    };

    const setSearchQuery = (query: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (query) {
            newParams.set('q', query);
        } else {
            newParams.delete('q');
        }
        setSearchParams(newParams);
    };

    const setSelectedTagId = (id: string | null) => {
        if (id) {
            navigate(`/tags/${id}${location.search}`);
        } else {
            navigate(`/${location.search}`);
        }
    };

    const setView = (v: 'all' | 'archived') => {
        if (v === 'archived') {
            navigate(`/archived${location.search}`);
        } else {
            navigate(`/${location.search}`);
        }
    };

    return {
        view,
        selectedTagId,
        activeNoteId,
        isDeleting,
        searchQuery,
        setActiveNoteId,
        openDeleteModal,
        closeDeleteModal,
        setSearchQuery,
        setSelectedTagId,
        setView,
    };
};
