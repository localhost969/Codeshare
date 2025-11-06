import React, { useState, useEffect } from 'react';
import { Trash2, Share2, Home, ChevronRight, Folder } from 'lucide-react';
import ModalDialog from '../UI/ModalDialog';
import ShimmerSkeleton from '../UI/ShimmerSkeleton';

const API_BASE_URL = '/api';

interface Snippet {
  id: string;
  title: string;
  language: string;
  content: string;
  folderId?: string;
  updatedAt: string;
  createdAt: string;
}

interface SnippetListProps {
  folderId?: string;
  folderName?: string;
  onSelectSnippet: (id: string) => void;
  onNavigateRoot?: () => void;
  username?: string;
}

export default function SnippetList({ folderId, folderName, onSelectSnippet, onNavigateRoot, username }: SnippetListProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [snippetCount, setSnippetCount] = useState<number>(0);
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
    fetchSnippets();
  }, [folderId]);

  // Helper to parse Firestore timestamp or ISO string
  function parseDate(date: any): Date {
    if (!date) return new Date();
    if (typeof date === 'string') return new Date(date);
    if (typeof date === 'object' && typeof date._seconds === 'number')
      return new Date(date._seconds * 1000);
    return new Date();
  }

  const fetchSnippets = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const query = folderId ? `?folderId=${folderId}` : '';
      const response = await fetch(`${API_BASE_URL}/snippets/list${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setSnippets(data.snippets);
        setSnippetCount(data.count ?? data.snippets?.length ?? 0);
      } else {
        setError('Failed to load snippets');
      }
    } catch (err) {
      setError('Error loading snippets');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (snippetId: string) => {
    setModalDialog({
      isOpen: true,
      title: 'Move to Trash?',
      message: 'This snippet will be moved to trash. You can restore it later.',
      type: 'confirm',
      isDangerous: true,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`${API_BASE_URL}/snippets/${snippetId}/delete`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            setSnippets(snippets.filter((s) => s.id !== snippetId));
          }
        } catch (err) {
          console.error('Failed to delete snippet:', err);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-4  py-4 rounded-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateRoot}
              className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:opacity-80"
              title="Home"
            >
              <Home size={20} style={{ color: 'var(--accent)' }} />
              <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{username}</span>
            </button>
            
            {folderId && folderName && (
              <>
                <ChevronRight size={20} style={{ color: 'var(--muted)' }} />
                <div className="flex items-center gap-2 px-3 py-2">
                  <Folder size={20} style={{ color: 'var(--accent)' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                    {folderName}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="mb-2 text-xs" style={{ color: 'var(--muted)' }}>
          <ShimmerSkeleton width="80px" height="16px" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border p-4"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: `var(--code-bg)`,
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <ShimmerSkeleton width="80%" height="18px" borderRadius="4px" className="mb-1" />
                  <ShimmerSkeleton width="45%" height="14px" borderRadius="4px" />
                </div>
                <ShimmerSkeleton width="60px" height="24px" borderRadius="12px" />
              </div>
              <ShimmerSkeleton height="36px" borderRadius="4px" className="mb-3" count={2} gap="6px" />
              <div className="flex justify-between items-center">
                <ShimmerSkeleton width="100px" height="12px" borderRadius="4px" />
                <div className="flex gap-2">
                  <ShimmerSkeleton width="28px" height="28px" borderRadius="4px" />
                  <ShimmerSkeleton width="28px" height="28px" borderRadius="4px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">{error}</div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12" style={{ color: 'var(--muted)' }}>
        <p>No snippets yet</p>
        <p className="text-sm mt-2">Create your first snippet to get started</p>
      </div>
    );
  }

  return (
    <>
      {/* Professional Breadcrumb Navigation */}
        <div className="mb-4  py-4 rounded-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateRoot}
            className="flex items-center gap-2 px-3 py-2 rounded-md transition-colors hover:opacity-80"
            title="Home"
          >
            <Home size={20} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>{username}</span>
          </button>
          
          {folderId && folderName && (
            <>
              <ChevronRight size={20} style={{ color: 'var(--muted)' }} />
              <div className="flex items-center gap-2 px-3 py-2">
                <Folder size={20} style={{ color: 'var(--accent)' }} />
                <span className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  {folderName}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mb-2 text-xs" style={{ color: 'var(--muted)' }}>
        {snippetCount} snippet{snippetCount === 1 ? '' : 's'}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            className="group rounded-xl border p-5 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] cursor-pointer relative overflow-hidden"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: `var(--code-bg)`,
            }}
            onClick={() => onSelectSnippet(snippet.id)}
          >
            {/* Language Badge - Top Right */}
            <div className="absolute top-3 right-3 z-20">
              <span
                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium shadow-sm"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                }}
              >
                {snippet.language}
              </span>
            </div>

            {/* Subtle background gradient for depth */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-200"
              style={{ background: 'linear-gradient(135deg, var(--accent) 0%, transparent 50%)' }}
            ></div>

            <div className="relative z-10">
              {/* Header with title */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate mb-1" style={{ color: 'var(--foreground)' }}>
                    {snippet.title}
                  </h3>
                </div>
              </div>

              {/* Content preview */}
              <div className="mb-4">
                <p
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ color: 'var(--muted)' }}
                >
                  {snippet.content.substring(0, 120)}...
                </p>
              </div>

              {/* Footer with date and actions */}
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
                  Updated {parseDate(snippet.updatedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setModalDialog({
                      isOpen: true,
                      title: 'Coming Soon',
                      message: 'Share feature is coming soon!',
                      type: 'alert',
                    })}
                    className="p-2 rounded-lg hover:bg-opacity-10 transition-colors duration-150"
                    style={{ backgroundColor: 'transparent', color: 'var(--accent)' }}
                    title="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(snippet.id)}
                    className="p-2 rounded-lg hover:bg-red-50 hover:bg-opacity-10 transition-colors duration-150 text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
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
    </>
  );
}
