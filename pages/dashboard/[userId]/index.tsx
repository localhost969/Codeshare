import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth-context';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import SnippetList from '@/components/Dashboard/SnippetList';
import SnippetEditor from '@/components/Dashboard/SnippetEditor';
import TrashView from '@/components/Dashboard/TrashView';
import FolderList from '@/components/Dashboard/FolderList';

type View = 'snippets' | 'editor' | 'folders' | 'trash';

export default function DashboardPage() {
  const router = useRouter();
  const { userId } = router.query;
  const { user, isLoading: authLoading } = useAuth();

  const [view, setView] = useState<View>('snippets');
  const [selectedSnippet, setSelectedSnippet] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<string | null>(null); // controls sidebar highlight
  const [selectedFolderName, setSelectedFolderName] = useState<string | null>(null);

  React.useEffect(() => {
    if (!authLoading && (!user || user.userId !== userId)) {
      router.push('/');
    }
  }, [user, authLoading, userId, router]);

  const handleCreateNew = () => {
    setSelectedSnippet(null);
    setView('editor');
  };

  const handleSelectSnippet = (snippetId: string) => {
    setSelectedSnippet(snippetId);
  };

  const handleBackToList = () => {
    setView('snippets');
    setSelectedSnippet(null);
  };

  const handleSelectFolder = (folderId: string) => {
    setActiveView(folderId);
    setView('snippets');
    fetchFolderName(folderId);
  };

  const fetchFolderName = async (folderId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/folders/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const folder = data.folders?.find((f: any) => f.id === folderId);
        setSelectedFolderName(folder?.name || null);
      }
    } catch (err) {
      console.error('Failed to fetch folder name:', err);
    }
  };

  return (
    <DashboardLayout 
      activeView={view === 'trash' ? 'trash' : activeView}
      onFolderSelect={(folderId) => {
        setActiveView(folderId); // highlight folder in sidebar
        setView('snippets');
        if (folderId) {
          fetchFolderName(folderId);
        } else {
          setSelectedFolderName(null);
        }
      }}
      onCreateSnippet={() => {
        setSelectedSnippet(null);
        setView('editor');
        setActiveView(null); // highlight All Snippets when creating new
      }}
      onTrashClick={() => {
        setView('trash');
        setActiveView('trash'); // highlight Trash in sidebar
      }}
    >
      <div className="h-full flex flex-col">
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {view === 'snippets' && (
            <>
              {selectedSnippet ? (
                <SnippetEditor
                  snippetId={selectedSnippet}
                  onBack={handleBackToList}
                />
              ) : (
                <div>
                  <SnippetList
                    folderId={activeView && activeView !== 'trash' ? activeView : undefined}
                    folderName={selectedFolderName || undefined}
                    onSelectSnippet={handleSelectSnippet}
                    onNavigateRoot={() => setActiveView(null)}
                    username={user?.username}
                  />
                </div>
              )}
            </>
          )}

          {view === 'editor' && (
            <SnippetEditor
              snippetId={selectedSnippet}
              onBack={handleBackToList}
            />
          )}

          {view === 'folders' && (
            <FolderList
              onSelectFolder={handleSelectFolder}
            />
          )}

          {view === 'trash' && <TrashView />}
        </div>
      </div>
    </DashboardLayout>
  );
}
