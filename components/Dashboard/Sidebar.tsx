import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { Moon, Sun, LogOut, Folder, Plus, ChevronLeft, ChevronRight, Trash2, X as XIcon } from 'lucide-react';
import ModalDialog from '../UI/ModalDialog';
import ShimmerSkeleton from '../UI/ShimmerSkeleton';

const API_BASE_URL = '/api';

interface Folder {
  id: string;
  name: string;
  color: string;
  snippetCount?: number;
}

interface SidebarProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeView: string | null;
  onFolderSelect?: (folderId: string | null) => void;
  onCreateSnippet?: () => void;
  onTrashClick?: () => void;
  modalDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    isDangerous?: boolean;
    onConfirm?: () => void;
  };
  setModalDialog: React.Dispatch<React.SetStateAction<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    isDangerous?: boolean;
    onConfirm?: () => void;
  }>>;
  onLogout: () => void;
}

export default function Sidebar({
  folders,
  setFolders,
  sidebarOpen,
  setSidebarOpen,
  activeView,
  onFolderSelect,
  onCreateSnippet,
  onTrashClick,
  modalDialog,
  setModalDialog,
  onLogout,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Detect mobile device width for initial sidebar state
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
    // Only minimize on mount for mobile
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFolders();
    }
  }, [user]);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/folders/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders);
      }
    } catch (error) {
      console.error('Failed to fetch folders:', error);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/folders/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolderName,
          color: newFolderColor,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFolders([...folders, data.folder]);
        setNewFolderName('');
        setShowNewFolderModal(false);
        setModalDialog({
          isOpen: true,
          title: 'Success',
          message: 'Folder created successfully!',
          type: 'alert',
        });
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
      setModalDialog({
        isOpen: true,
        title: 'Error',
        message: 'Failed to create folder. Please try again.',
        type: 'alert',
      });
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
            setFolders(folders.filter((f) => f.id !== folderId));
            if (activeView === folderId) {
              onFolderSelect?.(null);
            }
            setModalDialog({
              isOpen: true,
              title: 'Deleted',
              message: 'Folder deleted successfully.',
              type: 'alert',
            });
          } else {
            setModalDialog({
              isOpen: true,
              title: 'Error',
              message: 'Failed to delete folder.',
              type: 'alert',
            });
          }
        } catch (error) {
          console.error('Failed to delete folder:', error);
          setModalDialog({
            isOpen: true,
            title: 'Error',
            message: 'An error occurred while deleting the folder.',
            type: 'alert',
          });
        }
      },
    });
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } h-dvh border-r transition-all duration-300 flex flex-col`}
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div
          className="px-4 py-3 border-b transition-colors duration-300"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className={`flex items-center gap-3 ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shrink-0 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: 'var(--accent)' }}
              title="CodeShare"
            >
              Cs
            </button>
            {sidebarOpen && <span className="font-bold">CodeShare</span>}
          </div>
        </div>

        {/* User Info */}
        <div
          className="px-4 py-3 border-b transition-colors duration-300"
          style={{ borderColor: 'var(--border)' }}
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-semibold opacity-60">Current Space :</span>
              <span className="font-semibold truncate">{user?.username}</span>
            </div>
          )}
        </div>

        {/* New Snippet Button */}
        <div className="px-4 py-3 border-b transition-colors duration-300" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => {
              onCreateSnippet?.();
            }}
            className={`px-3 py-2.5 rounded-lg transition-colors hover:opacity-80 flex items-center justify-center gap-2 font-semibold ${sidebarOpen ? 'w-full' : 'w-10 h-10'}`}
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
            title="New snippet"
          >
            <Plus size={18} />
            {sidebarOpen && 'New Snippet'}
          </button>
        </div>

        {/* Folder Icon for minimized state */}
        {!sidebarOpen && (
          <div className="px-4 py-3 border-b transition-colors duration-300" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => onFolderSelect?.(null)}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
              title="All Snippets"
            >
              <Folder size={25} />
            </button>
          </div>
        )}

        {/* Folders Section */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {sidebarOpen && (
            <>
              <div className="space-y-1">
                {/* All Snippets as Root Directory */}
                <div className={`flex items-center gap-1 rounded-lg transition-colors group ${activeView === null ? 'font-semibold' : ''}`}
                  style={{
                    border: activeView === null ? '2px solid var(--accent)' : 'none',
                    backgroundColor: 'transparent',
                  }}
                >
                  <button
                    onClick={() => {
                      onFolderSelect?.(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center gap-2 w-full"
                    style={{
                      color: activeView === null ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    <Folder size={16} />
                    All Snippets
                  </button>
                  <button
                    onClick={() => setShowNewFolderModal(true)}
                    className="p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="New folder"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Nested Folders under All Snippets */}
                <div className="pl-4 space-y-1">
                  {/* Folder List Loading State */}
                  {isLoadingFolders ? (
                    <div className="space-y-1 mt-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="px-3 py-2">
                          <ShimmerSkeleton height="32px" borderRadius="8px" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    folders.map((folder) => {
                      const isActive = activeView === folder.id;
                      return (
                        <div
                          key={folder.id}
                          className={`flex items-center gap-1 rounded-lg transition-colors group ${isActive ? 'font-semibold' : ''}`}
                          style={{
                            border: isActive ? '2px solid var(--accent)' : 'none',
                            backgroundColor: 'transparent',
                          }}
                        >
                          <button
                            onClick={() => {
                              onFolderSelect?.(folder.id);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg text-left text-sm transition-colors flex items-center gap-2 w-full"
                            style={{
                              color: isActive ? 'var(--accent)' : 'var(--foreground)',
                            }}
                            title={folder.name}
                          >
                            <Folder size={16} style={{ color: isActive ? 'var(--accent)' : 'var(--foreground)' }} />
                            <span className="truncate">{folder.name}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFolder(folder.id);
                            }}
                            className="p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete folder"
                          >
                            <Trash2 size={14} style={{ color: '#b91c1c' }} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div
          className="px-4 py-3 border-t transition-colors duration-300 space-y-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            onClick={() => {
              onTrashClick?.();
            }}
            className={`w-full px-3 py-2 rounded-lg transition-colors hover:opacity-80 flex items-center gap-2 ${activeView === 'trash' ? 'font-semibold' : ''}`}
            style={{
              border: activeView === 'trash' ? '2px solid var(--accent)' : 'none',
              backgroundColor: 'transparent',
              color: activeView === 'trash' ? 'var(--accent)' : 'var(--foreground)',
            }}
            title="Trash"
          >
            <Trash2 size={18} />
            {sidebarOpen && 'Trash'}
          </button>

          <button
            onClick={toggleTheme}
            className="w-full px-3 py-2 rounded-lg transition-colors hover:opacity-80 flex items-center gap-2"
            title="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            {sidebarOpen && (isDark ? 'Light' : 'Dark')}
          </button>

          <button
            onClick={onLogout}
            className="w-full px-3 py-2 rounded-lg transition-colors hover:opacity-80 flex items-center gap-2 text-red-500"
            title="Logout"
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full p-2.5 border-t transition-colors hover:opacity-80 flex justify-center"
          style={{ borderColor: 'var(--border)' }}
          title={sidebarOpen ? 'Collapse' : 'Expand'}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </aside>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}>
          <div
            className="rounded-lg overflow-hidden max-w-sm w-full shadow-lg"
            style={{
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            }}
          >
            {/* Blue Header */}
            <div className="px-5 py-3.5 flex items-center justify-between" style={{
              backgroundColor: 'var(--accent)',
            }}>
              <h2 className="text-base font-bold text-white">Create New Folder</h2>
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="text-white hover:opacity-80 transition-opacity"
              >
                <XIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 p-5">
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  '--tw-ring-color': 'var(--accent)',
                } as any}
                autoFocus
              />

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowNewFolderModal(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 py-2 px-3.5 rounded-lg font-medium transition-colors border"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="flex-1 py-2 px-3.5 rounded-lg font-medium transition-colors disabled:opacity-50 text-white"
                  style={{
                    backgroundColor: 'var(--accent)',
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}