import React from 'react';
import { Home, Archive, Files, X, Settings as SettingsIcon } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNotesData } from '../context/NotesDataContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../utils/cn';
import { Button } from './ui/Button';
import { SidebarNavItem } from './sidebar/SidebarNavItem';
import { SidebarTagList } from './sidebar/SidebarTagList';
import { SidebarStorageBanner } from './sidebar/SidebarStorageBanner';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { tags } = useNotesData();
  const { t } = useLanguage();
  const { storageMode, needsPermission, requestPermission } = useSettings();
  const { search } = useLocation();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        aria-label="Main Navigation"
        className={cn(
          "fixed lg:static inset-y-0 left-0 w-64 border-r border-zinc-200 h-screen flex flex-col bg-white z-50 transition-transform duration-300 lg:translate-x-0 shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <NavLink to={`/${search}`} className="flex items-center gap-2 no-underline text-inherit" onClick={onClose}>
              <Files className="w-6 h-6" />
              <h1 className="text-xl font-bold">NotesApp</h1>
            </NavLink>
            <Button 
              variant="ghost"
              size="icon"
              onClick={onClose} 
              className="-mr-2 text-zinc-400 lg:hidden"
              aria-label={t('closeMenu')}
            >
              <X className="w-5 h-6" />
            </Button>
          </div>

          <nav className="space-y-1.5 focus:outline-none">
            <SidebarNavItem
              to="/"
              end
              icon={Home}
              label={t('allNotes')}
              onClick={onClose}
            />
            
            <SidebarNavItem
              to="/archived"
              icon={Archive}
              label={t('archivedNotes')}
              onClick={onClose}
            />
          </nav>

          <SidebarTagList tags={tags} onClose={onClose} />

          <div className="mt-auto pt-6 border-t border-zinc-100 space-y-4">
            {storageMode === 'files' && needsPermission && (
              <SidebarStorageBanner requestPermission={requestPermission} />
            )}

            <SidebarNavItem
              to="/settings"
              icon={SettingsIcon}
              label={t('settings')}
              onClick={onClose}
            />
          </div>
        </div>
      </aside>

      {/* SettingsModal removed in favor of routing */}
    </>
  );
};


