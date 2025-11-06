import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import ModalDialog from '../UI/ModalDialog';

const API_BASE_URL = '/api';

interface TrashItem {
  id: string;
  title: string;
  language: string;
  content: string;
  deletedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  folderId?: string;
  folderName?: string | null;
}

const timestampToDate = (timestamp: { _seconds: number; _nanoseconds: number }) => {
  return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
};

export default function TrashView() {
  const [items, setItems] = useState<TrashItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalDialog, setModalDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    isDangerous?: boolean;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
  });

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/trash/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.trash);
      } else {
        setError('Failed to load trash');
      }
    } catch (err) {
      setError('Error loading trash');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (itemId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/snippets/${itemId}/restore`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      console.error('Failed to restore:', err);
    }
  };

  const handlePermanentDelete = async (itemId: string) => {
    setModalDialog({
      isOpen: true,
      title: 'Permanently Delete?',
      message: 'This action cannot be undone. The snippet will be permanently deleted.',
      type: 'confirm',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${API_BASE_URL}/trash/${itemId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            setItems(items.filter((item) => item.id !== itemId));
          }
        } catch (err) {
          console.error('Failed to delete:', err);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
        Loading trash...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">{error}</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <Trash2 size={64} style={{ color: 'var(--muted)' }} />
        <div className="text-center">
          <h3 className="text-xl font-medium" style={{ color: 'var(--foreground)' }}>Trash is empty</h3>
          <p className="text-base" style={{ color: 'var(--muted)' }}>Deleted items will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Trash ({items.length})</h2>
        <button
          onClick={fetchTrash}
          className="p-2 rounded-lg hover:opacity-80 transition"
          title="Refresh"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-6 flex flex-col gap-4"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--code-bg)',
            }}
          >
            <div className="flex-1 space-y-2">
              <div className="text-lg font-semibold">{item.title}</div>
              <div className="grid grid-cols-1 gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                <div><strong>Type:</strong> {item.language}</div>
                <div><strong>Deleted from:</strong> {item.folderName || 'Root'}</div>
                <div><strong>Created:</strong> {timestampToDate(item.createdAt).toLocaleDateString()}</div>
                <div><strong>Deleted:</strong> {timestampToDate(item.deletedAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => handleRestore(item.id)}
                className="p-3 rounded-lg hover:opacity-80 transition text-green-500 hover:bg-green-50"
                title="Restore"
              >
                <RotateCcw size={20} />
              </button>
              <button
                onClick={() => handlePermanentDelete(item.id)}
                className="p-3 rounded-lg hover:opacity-80 transition text-red-500 hover:bg-red-50"
                title="Permanently delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      <ModalDialog
        isOpen={modalDialog.isOpen}
        title={modalDialog.title}
        message={modalDialog.message}
        type={modalDialog.type}
        isDangerous={modalDialog.isDangerous}
        onConfirm={() => {
          if (modalDialog.onConfirm) {
            modalDialog.onConfirm();
          }
          setModalDialog({ ...modalDialog, isOpen: false });
        }}
        onClose={() => {
          setModalDialog({ ...modalDialog, isOpen: false });
        }}
        confirmText={modalDialog.type === 'confirm' ? 'Delete' : 'OK'}
        cancelText="Cancel"
      />
    </div>
  );
}
