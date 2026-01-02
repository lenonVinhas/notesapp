import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((type: NotificationType, message: string) => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, type, message }]);
    
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const icons: Record<NotificationType, LucideIcon> = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const colors: Record<NotificationType, string> = {
    success: "bg-emerald-50 border-emerald-100 text-emerald-900 icon-emerald-500",
    error: "bg-red-50 border-red-100 text-red-900 icon-red-500",
    info: "bg-blue-50 border-blue-100 text-blue-900 icon-blue-500",
  };

  const contextValue = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
          {notifications.map((n) => {
            const Icon = icons[n.type];
            return (
              <div
                key={n.id}
                className={cn(
                  "p-4 rounded-2xl border shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300 pointer-events-auto",
                  colors[n.type]
                )}
              >
                <div className="shrink-0 p-1.5 rounded-xl bg-white/50 border border-current/10">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="flex-1 text-sm font-semibold">{n.message}</p>
                <button
                  onClick={() => removeNotification(n.id)}
                  className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 opacity-40 shrink-0" />
                </button>
              </div>
            );
          })}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
