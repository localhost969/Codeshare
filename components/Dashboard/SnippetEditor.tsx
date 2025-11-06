import React, { useState, useEffect } from 'react';
import { detectLanguage, getSupportedLanguages } from '../../lib/language-detection';
import { Save, X } from 'lucide-react';
import ModalDialog from '../UI/ModalDialog';
import ShimmerSkeleton from '../UI/ShimmerSkeleton';

const API_BASE_URL = '/api';

interface SnippetEditorProps {
  snippetId?: string | null;
  onBack: () => void;
  onFoldersUpdate?: () => void;
}

interface Folder {
  id: string;
  name: string;
  color: string;
}

export default function SnippetEditor({ snippetId, onBack, onFoldersUpdate }: SnippetEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [oldFolderId, setOldFolderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoDetect, setAutoDetect] = useState(!snippetId);
  const [supportedLanguages, setSupportedLanguages] = useState<Array<{ name: string; extension: string }>>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [modalDialog, setModalDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });
  const [isLoadingSnippet, setIsLoadingSnippet] = useState(!!snippetId);

  useEffect(() => {
    fetchSupportedLanguages();
    fetchFolders();
    if (snippetId) {
      fetchSnippet();
    }
  }, [snippetId]);

  useEffect(() => {
    if (autoDetect && content) {
      const detection = detectLanguage(content);
      setLanguage(detection.extension);
    }
  }, [content, autoDetect]);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/language/supported`);
      if (response.ok) {
        const data = await response.json();
        setSupportedLanguages(data.languages);
      }
    } catch (err) {
      console.error('Failed to fetch languages:', err);
    }
  };

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/folders/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFolders(data.folders || []);
      }
    } catch (err) {
      console.error('Failed to fetch folders:', err);
    }
  };

  const fetchSnippet = async () => {
    setIsLoadingSnippet(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/snippets/${snippetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const snippet = data.snippet;
        setTitle(snippet.title);
        setContent(snippet.content);
        setLanguage(snippet.language);
        setDescription(snippet.description || '');
        setTags(snippet.tags || []);
        setFolderId(snippet.folderId || null);
        setOldFolderId(snippet.folderId || null);
      }
    } catch (err) {
      console.error('Failed to fetch snippet:', err);
    } finally {
      setIsLoadingSnippet(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      setModalDialog({
        isOpen: true,
        title: 'Validation Error',
        message: 'Content cannot be empty',
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = snippetId
        ? `${API_BASE_URL}/snippets/${snippetId}/update`
        : `${API_BASE_URL}/snippets/create`;

      const method = snippetId ? 'PUT' : 'POST';
      const body = snippetId
        ? {
          content,
          title,
          language,
          description,
          tags,
          folderId,
          oldFolderId,
          currentVersion: 1,
          conflictMode: 'overwrite',
        }
        : {
          title,
          content,
          language,
          description,
          tags,
          folderId,
        };

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setModalDialog({
          isOpen: true,
          title: 'Success',
          message: 'Snippet saved successfully!',
        });
        setTimeout(() => {
          onBack();
        }, 500);
      } else {
        setModalDialog({
          isOpen: true,
          title: 'Error',
          message: 'Failed to save snippet',
        });
      }
    } catch (err) {
      console.error('Error saving snippet:', err);
      setModalDialog({
        isOpen: true,
        title: 'Error',
        message: 'Error saving snippet',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (isLoadingSnippet && snippetId) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <ShimmerSkeleton width="180px" height="28px" borderRadius="6px" />
          <div className="flex gap-2">
            <ShimmerSkeleton width="90px" height="36px" borderRadius="8px" />
            <ShimmerSkeleton width="90px" height="36px" borderRadius="8px" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <ShimmerSkeleton width="50px" height="16px" borderRadius="4px" className="mb-2" />
            <ShimmerSkeleton height="40px" borderRadius="8px" />
          </div>
          <div>
            <ShimmerSkeleton width="60px" height="16px" borderRadius="4px" className="mb-2" />
            <ShimmerSkeleton height="40px" borderRadius="8px" />
          </div>
          <div>
            <ShimmerSkeleton width="100px" height="16px" borderRadius="4px" className="mb-2" />
            <ShimmerSkeleton height="40px" borderRadius="8px" />
          </div>
        </div>

        <div>
          <ShimmerSkeleton width="80px" height="16px" borderRadius="4px" className="mb-2" />
          <ShimmerSkeleton height="60px" borderRadius="8px" />
        </div>

        <div>
          <ShimmerSkeleton width="40px" height="16px" borderRadius="4px" className="mb-2" />
          <ShimmerSkeleton height="36px" borderRadius="8px" className="mb-2" />
          <div className="flex gap-2">
            <ShimmerSkeleton width="70px" height="28px" borderRadius="14px" />
            <ShimmerSkeleton width="70px" height="28px" borderRadius="14px" />
            <ShimmerSkeleton width="70px" height="28px" borderRadius="14px" />
          </div>
        </div>

        <div>
          <ShimmerSkeleton width="35px" height="16px" borderRadius="4px" className="mb-2" />
          <ShimmerSkeleton height="280px" borderRadius="8px" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {snippetId ? 'Edit Snippet' : 'New Snippet'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors text-white disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent)',
            }}
          >
            <Save size={18} /> Save
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors border"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          >
            <X size={18} /> Close
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            } as any}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <div className="flex gap-2">
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setAutoDetect(false);
              }}
              className="flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              } as any}
            >
              {supportedLanguages.map((lang) => (
                <option key={lang.extension} value={lang.extension}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setAutoDetect(!autoDetect)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                autoDetect ? 'bg-accent text-white' : ''
              }`}
              style={{
                borderColor: 'var(--border)',
                backgroundColor: autoDetect ? 'var(--accent)' : 'transparent',
                color: autoDetect ? 'white' : 'var(--foreground)',
              }}
              title="Auto-detect language"
            >
              Auto
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Folder (Optional)</label>
          <select
            value={folderId || ''}
            onChange={(e) => setFolderId(e.target.value || null)}
            onFocus={() => fetchFolders()}
            className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            } as any}
          >
            <option value="">Root Folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                📁 {folder.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 resize-none"
          rows={2}
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--background)',
            color: 'var(--foreground)',
          } as any}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add tags"
            className="flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
            } as any}
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 rounded-lg font-semibold transition-colors text-white"
            style={{
              backgroundColor: 'var(--accent)',
            }}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'white',
              }}
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Code Editor */}
      <div>
        <label className="block text-sm font-medium mb-2">Code</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your code here..."
          className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 font-mono"
          rows={15}
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--code-bg)',
            color: 'var(--foreground)',
            fontFamily: 'var(--font-mono)',
          } as any}
        />
      </div>

      {/* Modal Dialog */}
      <ModalDialog
        isOpen={modalDialog.isOpen}
        title={modalDialog.title}
        message={modalDialog.message}
        type="alert"
        onClose={() => {
          setModalDialog({ ...modalDialog, isOpen: false });
        }}
      />
    </div>
  );
}
