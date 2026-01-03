import React from 'react';
import { Monitor, Folder, Check } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export const SettingsContent: React.FC = () => {
  const { storageMode, setStorageMode, directoryPath, selectDirectory, needsPermission, requestPermission } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="space-y-12 py-4">
      {/* Storage Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-zinc-900">{t('storage')}</h2>
          <p className="text-sm text-zinc-500">{t('localFolderDesc')}</p>
        </div>
        
        <div className="grid gap-4">
          {/* Browser Storage Option */}
          <button
            onClick={() => setStorageMode('local')}
            className={cn(
              "flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all group",
              storageMode === 'local' 
                ? "border-zinc-900 bg-zinc-50 shadow-sm" 
                : "border-zinc-100 hover:border-zinc-200 hover:bg-zinc-50/50"
            )}
          >
            <div className={cn(
              "p-3 rounded-xl transition-colors",
              storageMode === 'local' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200"
            )}>
              <Monitor className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-zinc-900 text-base">{t('browserStorage')}</p>
              <p className="text-sm text-zinc-500 leading-relaxed">{t('browserStorageDesc')}</p>
            </div>
            {storageMode === 'local' && (
              <div className="bg-zinc-900 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>

          {/* File System Option */}
          <div
            className={cn(
              "flex flex-col p-5 rounded-2xl border-2 transition-all",
              storageMode === 'files' 
                ? "border-zinc-900 bg-zinc-50 shadow-sm" 
                : "border-zinc-100"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                storageMode === 'files' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
              )}>
                <Folder className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-zinc-900 text-base">{t('localFolder')}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">{t('localFolderDesc')}</p>
              </div>
              {storageMode === 'files' && (
                <div className="bg-zinc-900 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {storageMode === 'files' && (
              <div className="mt-6 pt-6 border-t border-zinc-200/50">
                {needsPermission ? (
                  <div className="p-5 bg-zinc-900 rounded-2xl space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {t('reauthorizeDescription')}
                    </p>
                    <Button 
                      variant="secondary"
                      onClick={requestPermission}
                      className="w-full bg-white hover:bg-zinc-100 text-zinc-900 font-bold py-3"
                    >
                      {t('reauthorizeAccess')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        {directoryPath ? t('selectedFolder') : t('noneSelected')}
                      </p>
                      <p className="text-sm font-medium text-zinc-600 break-all">
                        {directoryPath || t('noneSelected')}
                      </p>
                    </div>
                    <Button 
                      onClick={selectDirectory}
                      variant="secondary"
                      className="border-zinc-200 hover:bg-white"
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
                className="mt-6 w-full py-3"
              >
                {t('useLocalFolder')}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="h-px bg-zinc-100" />

      <section>
        <h2 className="text-lg font-bold text-zinc-900 mb-4">{t('aboutNotesApp')}</h2>
        <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
          <p className="text-sm text-zinc-600 leading-relaxed">
            {t('privacyDescription')}
          </p>
        </div>
      </section>
    </div>
  );
};
