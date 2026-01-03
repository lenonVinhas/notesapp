import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ArrowLeft } from 'lucide-react';
import { SettingsContent } from './SettingsContent';

export const SettingsView: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  const location = useLocation();
  const isOpen = location.pathname === '/settings';
  const isMobile = useMediaQuery('(max-width: 520px)');

  if (!isOpen) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-zinc-100">
          <button
            onClick={handleClose}
            className="p-2 -ml-2 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors"
            aria-label={t('cancel')}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-zinc-900">{t('settings')}</h1>
        </div>
        
        {/* Mobile Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <SettingsContent />
          
          <div className="mt-12 pb-12">
            <Button 
              variant="secondary"
              onClick={handleClose}
              className="w-full font-bold py-4 text-base rounded-2xl"
            >
              {t('closeMenu')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('settings')}
      size="xl"
      closeLabel={t('cancel')}
      footer={
        <Button 
          variant="secondary"
          onClick={handleClose}
          className="font-bold px-6"
        >
          {t('closeMenu')}
        </Button>
      }
    >
      <SettingsContent />
    </Modal>
  );
};
