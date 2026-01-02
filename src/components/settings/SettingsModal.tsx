import React from 'react';
import { Monitor, Folder, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { storageMode, setStorageMode, directoryPath, selectDirectory, needsPermission, requestPermission } = useSettings();
  const { t } = useLanguage();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={t('settings')}
      closeLabel={t('cancel')}
      footer={
        <Button 
          variant="secondary"
          onClick={onClose}
        >
          {t('closeMenu')}
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Storage Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
            {t('storage')}
          </h3>
          
          <div className="grid gap-3">
            {/* Browser Storage Option */}
            <button
              onClick={() => setStorageMode('local')}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                storageMode === 'local' 
                  ? "border-zinc-900 bg-zinc-50" 
                  : "border-zinc-100 hover:border-zinc-200"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-lg",
                storageMode === 'local' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
              )}>
                <Monitor className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-zinc-900">{t('browserStorage')}</p>
                <p className="text-sm text-zinc-500">{t('browserStorageDesc')}</p>
              </div>
              {storageMode === 'local' && <Check className="w-5 h-5 text-zinc-900" />}
            </button>

            {/* File System Option */}
            <div
              className={cn(
                "flex flex-col p-4 rounded-xl border-2 transition-all",
                storageMode === 'files' 
                  ? "border-zinc-900 bg-zinc-50" 
                  : "border-zinc-100"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-2.5 rounded-lg",
                  storageMode === 'files' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
                )}>
                  <Folder className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-zinc-900">{t('localFolder')}</p>
                  <p className="text-sm text-zinc-500">{t('localFolderDesc')}</p>
                </div>
                {storageMode === 'files' && <Check className="w-5 h-5 text-zinc-900" />}
              </div>

              {storageMode === 'files' && (
                <div className="mt-4 pt-4 border-t border-zinc-200/50">
                  {needsPermission ? (
                    <div className="p-4 bg-zinc-900 rounded-xl space-y-3">
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {t('reauthorizeDescription')}
                      </p>
                      <Button 
                        variant="secondary"
                        onClick={requestPermission}
                        className="w-full bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold"
                      >
                        {t('reauthorizeAccess')}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-500 truncate max-w-[200px]">
                        {directoryPath || t('noneSelected')}
                      </span>
                      <Button 
                        onClick={selectDirectory}
                        className="h-8 py-0 text-xs"
                      >
                        {t('changeFolder')}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {storageMode !== 'files' && (
                <Button 
                  onClick={() => setStorageMode('files')}
                  className="mt-4 w-full"
                >
                  {t('useLocalFolder')}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Language Section could be added here too */}
      </div>
    </Modal>
  );
};
