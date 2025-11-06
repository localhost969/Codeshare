import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import Link from 'next/link';
import { Moon, Sun, LogOut, Folder, Plus, ChevronLeft, ChevronRight, Trash2, X as XIcon } from 'lucide-react';
import ModalDialog from '../UI/ModalDialog';
import ShimmerSkeleton from '../UI/ShimmerSkeleton';
import Sidebar from './Sidebar';

const API_BASE_URL = '/api';

interface Snippet {
  id: string;
  title: string;
  language: string;
  content: string;
  folderId?: string;
  updatedAt: string;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  snippetCount?: number;
}

export default function DashboardLayout({ children, onFolderSelect, onCreateSnippet, onTrashClick, activeView }: { children: React.ReactNode; onFolderSelect?: (folderId: string | null) => void; onCreateSnippet?: () => void; onTrashClick?: () => void; activeView?: string | null }) {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [folders, setFolders] = useState<Folder[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
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
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    onFolderSelect?.(folderId);
  };

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div style={{ color: 'var(--foreground)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300 relative"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen z-10">
        <Sidebar
          folders={folders}
          setFolders={setFolders}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeView={activeView ?? null}
          onFolderSelect={handleFolderSelect}
          onCreateSnippet={onCreateSnippet}
          onTrashClick={onTrashClick}
          modalDialog={modalDialog}
          setModalDialog={setModalDialog}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Contwent */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {activeView === 'folder' && selectedFolderId && (
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h1 className="text-lg font-semibold">
              Folder: {folders.find(f => f.id === selectedFolderId)?.name || <ShimmerSkeleton width="100px" height="20px" borderRadius="4px" />}
            </h1>
          </div>
        )}
        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
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
