import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white border border-zinc-200 shadow-2xl rounded-2xl p-8 max-w-sm w-full animate-in zoom-in fade-in duration-300",
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-zinc-400" />
        </button>

        <div className="flex flex-col items-center text-center">
          {title && (
            <h2 className="text-xl font-bold text-zinc-900 mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {children}

          {footer && <div className="flex gap-3 w-full mt-6">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
};
