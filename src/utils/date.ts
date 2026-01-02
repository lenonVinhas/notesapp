import { useLanguage } from '../context/LanguageContext';

export const useDateFormatter = () => {
    const { t, language } = useLanguage();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 60) {
            return `${diffMins} ${t('minutesAgo')}`;
        }

        const locale = language === 'pt' ? 'pt-BR' : 'en-US';

        return new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return { formatDate };
};
