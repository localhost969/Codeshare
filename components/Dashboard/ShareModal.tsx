import React, { useState } from 'react';
import { Share2, Copy } from 'lucide-react';

const API_BASE_URL = '/api';

interface ShareModalProps {
  snippetId: string;
  snippetTitle: string;
  onClose: () => void;
}

export default function ShareModal({ snippetId, snippetTitle, onClose }: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState('');
  const [readOnly, setReadOnly] = useState(true);
  const [expiryType, setExpiryType] = useState<'none' | '1h' | '1d' | '1w'>('1w');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const expiryDurations: Record<string, number | undefined> = {
    none: undefined,
    '1h': 3600000,
    '1d': 86400000,
    '1w': 604800000,
  };

  const handleGenerateLink = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/share/generate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippetId,
          readOnly,
          expiresIn: expiryDurations[expiryType],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareUrl(data.shareUrl);
      }
    } catch (err) {
      console.error('Failed to generate share link:', err);
      alert('Failed to generate share link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-lg p-6 max-w-md w-full"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--foreground)',
          borderColor: 'var(--border)',
        }}
      >
        <h2 className="text-xl font-bold mb-4">Share: {snippetTitle}</h2>

        <div className="space-y-4">
          {/* Settings */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={readOnly}
                onChange={(e) => setReadOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Read-only (viewers cannot edit)</span>
            </label>
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-sm font-medium mb-2">Link expiry:</label>
            <select
              value={expiryType}
              onChange={(e) => setExpiryType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
              } as any}
            >
              <option value="none">Never expires</option>
              <option value="1h">1 hour</option>
              <option value="1d">1 day</option>
              <option value="1w">1 week</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateLink}
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-lg font-semibold transition-colors text-white disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'var(--accent)',
            }}
          >
            <Share2 size={18} />
            {isLoading ? 'Generating...' : 'Generate Link'}
          </button>

          {/* Share URL Display */}
          {shareUrl && (
            <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-medium mb-2">Share URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded text-sm font-mono"
                  style={{
                    backgroundColor: 'var(--code-bg)',
                    color: 'var(--foreground)',
                  }}
                />
                <button
                  onClick={handleCopyUrl}
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'white',
                  }}
                  title="Copy"
                >
                  <Copy size={18} />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-500 mt-2">Copied to clipboard!</p>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-lg font-semibold transition-colors border"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
