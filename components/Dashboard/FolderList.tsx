import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import ModalDialog from '../UI/ModalDialog';
import ShimmerSkeleton from '../UI/ShimmerSkeleton';

const API_BASE_URL = '/api';

interface Folder {
  id: string;
  name: string;
  color: string;
  snippetCount?: number;
}

interface FolderListProps {
  onSelectFolder: (folderId: string) => void;
  onRefresh?: () => void;
}

export default function FolderList({ onSelectFolder, onRefresh }: FolderListProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');
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
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/folders/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure folders have snippetCount, fallback to 0 if missing
        setFolders(
          (data.folders || []).map((folder: any) => ({
            ...folder,
            snippetCount: typeof folder.snippetCount === 'number' ? folder.snippetCount : 0,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to fetch folders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/folders/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          color: newColor,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFolders([...folders, data.folder]);
        setNewName('');
        setShowNewFolder(false);
      }
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const handleUpdateFolder = async (folderId: string) => {
    if (!newName.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          color: newColor,
        }),
      });

      if (response.ok) {
        fetchFolders();
        setEditingFolder(null);
        setNewName('');
      }
    } catch (err) {
      console.error('Failed to update folder:', err);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    setModalDialog({
      isOpen: true,
      title: 'Delete Folder?',
      message: 'Snippets in this folder will be moved to trash. This action cannot be undone.',
      type: 'confirm',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${API_BASE_URL}/folders/${folderId}/delete`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moveSnippetsToRoot: false }),
          });

          if (response.ok) {
            fetchFolders();
          }
        } catch (err) {
          console.error('Failed to delete folder:', err);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <ShimmerSkeleton width="120px" height="24px" borderRadius="6px" />
          <ShimmerSkeleton width="100px" height="36px" borderRadius="8px" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--code-bg)',
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <ShimmerSkeleton width="75%" height="18px" borderRadius="4px" className="mb-1" />
                  <ShimmerSkeleton width="55%" height="14px" borderRadius="4px" />
                </div>
                <ShimmerSkeleton width="16px" height="16px" borderRadius="2px" />
              </div>

              <div className="flex gap-2">
                <ShimmerSkeleton height="32px" borderRadius="6px" />
                <ShimmerSkeleton width="32px" height="32px" borderRadius="6px" />
                <ShimmerSkeleton width="32px" height="32px" borderRadius="6px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Folders</h2>
        <button
          onClick={() => {
            setShowNewFolder(true);
            setNewName('');
            setNewColor('#6366f1');
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors text-white"
          style={{
            backgroundColor: 'var(--accent)',
          }}
        >
          <Plus size={18} /> New
        </button>
      </div>

      {/* New Folder Form */}
      {showNewFolder && (
        <form onSubmit={handleCreateFolder} className="p-4 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Folder name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              } as any}
              autoFocus
            />
            <div className="flex gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer"
                />
              </label>
              <button
                type="button"
                onClick={() => setShowNewFolder(false)}
                className="flex-1 py-2 px-3 rounded-lg border transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-lg font-semibold transition-colors text-white"
                style={{
                  backgroundColor: 'var(--accent)',
                }}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Folders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="p-4 rounded-lg border transition-all hover:shadow-lg"
            style={{
              borderColor: folder.color,
              backgroundColor: 'var(--code-bg)',
            }}
          >
            {editingFolder === folder.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateFolder(folder.id);
                }}
                className="space-y-2"
              >
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-2 py-1 rounded text-sm"
                  style={{
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingFolder(null)}
                    className="flex-1 py-1 px-2 rounded text-sm border"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-1 px-2 rounded text-sm text-white"
                    style={{
                      backgroundColor: 'var(--accent)',
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    {folder.name ? (
                      <h3 className="font-semibold">{folder.name}</h3>
                    ) : (
                      <ShimmerSkeleton width="75%" height="18px" borderRadius="4px" className="mb-1" />
                    )}
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {folder.snippetCount ?? 0} snippet{(folder.snippetCount ?? 0) === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: folder.color }}
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectFolder(folder.id)}
                    disabled={!folder.name}
                    className="flex-1 py-1 px-2 rounded text-sm border transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setEditingFolder(folder.id);
                      setNewName(folder.name);
                      setNewColor(folder.color);
                    }}
                    className="p-1 rounded text-xs hover:opacity-80"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="p-1 rounded text-xs text-red-500 hover:opacity-80"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {folders.length === 0 && !showNewFolder && (
        <div className="text-center py-8" style={{ color: 'var(--muted)' }}>
          <p>No folders yet</p>
          <p className="text-sm mt-2">Create one to organize your snippets</p>
        </div>
      )}

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
