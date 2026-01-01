import { useSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom';

export const useNotesNavigation = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams(); // { noteId, tagId }

    const searchQuery = searchParams.get('q') || '';

    // Derived state from Router
    const activeNoteId = params.noteId || null;
    const selectedTagId = params.tagId || null;
    const isDeleting = location.pathname.endsWith('/delete');

    const view: 'all' | 'archived' = location.pathname.startsWith('/archived') ? 'archived' : 'all';

    const getPathForNote = (id: string | null, action?: 'delete') => {
        let newPath = '/';

        if (view === 'archived') {
            newPath = id ? `/archived/${id}` : '/archived';
        } else if (selectedTagId) {
            newPath = id ? `/tags/${selectedTagId}/${id}` : `/tags/${selectedTagId}`;
        } else {
            // All notes view
            newPath = id ? `/${id}` : '/';
        }

        if (action === 'delete' && id) {
            newPath += '/delete';
        }

        const paramsString = searchParams.toString();
        return paramsString ? `${newPath}?${paramsString}` : newPath;
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
        // We use the functional update to ensure we don't have stale searchParams if multiple updates happen
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (query) {
                newParams.set('q', query);
            } else {
                newParams.delete('q');
            }
            return newParams;
        }, { replace: true });
    };

    const setSelectedTagId = (id: string | null) => {
        const paramsString = searchParams.toString();
        const search = paramsString ? `?${paramsString}` : '';

        if (id) {
            navigate(`/tags/${id}${search}`);
        } else {
            navigate(`/${search}`);
        }
    };

    const setView = (v: 'all' | 'archived') => {
        const paramsString = searchParams.toString();
        const search = paramsString ? `?${paramsString}` : '';

        if (v === 'archived') {
            navigate(`/archived${search}`);
        } else {
            navigate(`/${search}`);
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
