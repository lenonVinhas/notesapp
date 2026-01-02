import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';

interface SidebarStorageBannerProps {
  requestPermission: () => void;
}

export const SidebarStorageBanner: React.FC<SidebarStorageBannerProps> = ({ requestPermission }) => {
  const { t } = useLanguage();

  return (
    <div className="px-4 py-3 bg-zinc-900 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-white">
          <SettingsIcon className="w-4 h-4 animate-pulse text-zinc-400" />
          <span className="text-xs font-bold leading-none">{t('permissionNeeded')}</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-tight">
          {t('reauthorizeDescription')}
        </p>
        <Button
          variant="secondary"
          onClick={requestPermission}
          className="w-full mt-1 bg-white hover:bg-zinc-100 text-zinc-900 text-[11px] font-bold h-7"
        >
          {t('reauthorizeAccess')}
        </Button>
      </div>
    </div>
  );
};
