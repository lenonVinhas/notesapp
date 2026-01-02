import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService, STORAGE_KEYS } from '../services/storage';
import { FileSystemProvider } from '../services/providers/FileSystemProvider';
import { LocalStorageProvider } from '../services/providers/LocalStorageProvider';
import { FileHandleStorage } from '../utils/fileStorage';

type StorageMode = 'local' | 'files';

interface SettingsContextType {
  storageMode: StorageMode;
  setStorageMode: (mode: StorageMode) => Promise<void>;
  directoryPath: string | null;
  selectDirectory: () => Promise<void>;
  isInitializing: boolean;
  needsPermission: boolean;
  requestPermission: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storageMode, setStorageModeState] = useState<StorageMode>('local');
  const [directoryPath, setDirectoryPath] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [needsPermission, setNeedsPermission] = useState(false);

  useEffect(() => {
    const initSettings = async () => {
      try {
        const savedMode = await StorageService.getGlobal<StorageMode>(STORAGE_KEYS.STORAGE_MODE, 'local');
        
        if (savedMode === 'files') {
          const handle = await FileHandleStorage.get();
          if (handle) {
            const provider = new FileSystemProvider(handle);
            // Definir o provider imediatamente para que o useNotesManager saiba onde procurar
            await StorageService.setProvider(provider);
            
            // Verificar se temos permissão (sem solicitar, pois não há gesto do usuário)
            const hasAccess = await provider.hasPermission();
            
            if (hasAccess) {
              setStorageModeState('files');
              setDirectoryPath(handle.name);
              setNeedsPermission(false);
            } else {
              setStorageModeState('files');
              setDirectoryPath(handle.name);
              setNeedsPermission(true);
            }
          } else {
            setStorageModeState('local');
          }
        } else {
          setStorageModeState('local');
        }
      } catch (error) {
        console.error('Settings initialization failed:', error);
      } finally {
        setIsInitializing(false);
      }
    };
    initSettings();
  }, []);

  const requestPermission = async () => {
    const handle = await FileHandleStorage.get();
    if (handle) {
      const provider = new FileSystemProvider(handle);
      const granted = await provider.requestPermission();
      if (granted) {
        await StorageService.setProvider(provider);
        setNeedsPermission(false);
        // Notificar que o provider mudou/está pronto (o reload acontece naturalmente pelo state)
      }
    }
  };

  const selectDirectory = async () => {
    try {
      const handle = await (window as any).showDirectoryPicker();
      await FileHandleStorage.save(handle);
      const provider = new FileSystemProvider(handle);
      await StorageService.setProvider(provider);
      setStorageModeState('files');
      setDirectoryPath(handle.name);
      setNeedsPermission(false);
      await StorageService.setGlobal(STORAGE_KEYS.STORAGE_MODE, 'files');
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        console.error('Failed to select directory:', error);
      }
    }
  };

  const setStorageMode = async (mode: StorageMode) => {
    if (mode === 'local') {
      await StorageService.setProvider(new LocalStorageProvider());
      setStorageModeState('local');
      setDirectoryPath(null);
      setNeedsPermission(false);
      await StorageService.setGlobal(STORAGE_KEYS.STORAGE_MODE, 'local');
    } else if (mode === 'files') {
      await selectDirectory();
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      storageMode, 
      setStorageMode, 
      directoryPath, 
      selectDirectory, 
      isInitializing,
      needsPermission,
      requestPermission
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
