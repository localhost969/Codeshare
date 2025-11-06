import React from 'react';
import { X } from 'lucide-react';

interface ModalDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'alert' | 'confirm';
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export default function ModalDialog({
  isOpen,
  title,
  message,
  type = 'alert',
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  isDangerous = false,
}: ModalDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    }}>
      <div
        className="rounded-lg p-6 max-w-sm w-full shadow-lg"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="mb-6" style={{ color: 'var(--foreground)' }}>
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors border"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
              }}
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm || onClose}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors text-white"
            style={{
              backgroundColor: isDangerous ? '#ef4444' : 'var(--accent)',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
