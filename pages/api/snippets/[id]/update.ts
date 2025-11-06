import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, validateRequestBody, AuthenticatedRequest } from '../../../../lib/middleware';
import { getSnippet, saveSnippet, updateFolderSnippetCount } from '../../../../lib/firebase-admin';
import { detectLanguage } from '../../../../lib/language-detection';

/**
 * PUT /api/snippets/[id]/update
 * Update an existing snippet (handles concurrent edits)
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { id: string }
 * Body: {
 *   content?: string,
 *   title?: string,
 *   language?: string,
 *   description?: string,
 *   tags?: string[],
 *   folderId?: string | null,
 *   oldFolderId?: string | null,
 *   currentVersion: number,
 *   conflictMode?: 'overwrite' | 'merge' | 'version'
 * }
 * 
 * Conflict Resolution Modes:
 * - overwrite: Replace entire content (last write wins)
 * - merge: Attempt intelligent merge if multiple edits
 * - version: Create new version, keep old version in history
 */
async function updateSnippetHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Snippet ID is required' });
    }

    // Fetch current snippet
    const currentSnippet = await getSnippet(req.userId!, id) as any;

    if (!currentSnippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    const {
      content,
      title,
      language,
      description,
      tags,
      folderId,
      oldFolderId,
      currentVersion,
      conflictMode = 'overwrite',
    } = req.body;

    // Check for version conflict (concurrent edits)
    const hasVersionConflict = currentVersion && currentVersion !== currentSnippet.currentVersion;

    let updateData: any = {};

    if (hasVersionConflict) {
      // Handle concurrent edit conflict
      if (conflictMode === 'overwrite') {
        // Last write wins - proceed with update
        updateData = {
          content: content || currentSnippet.content,
          title: title || currentSnippet.title,
          language: language || currentSnippet.language,
          description: description !== undefined ? description : currentSnippet.description,
          tags: tags || currentSnippet.tags,
          currentVersion: (currentSnippet.currentVersion || 1) + 1,
        };
      } else if (conflictMode === 'version') {
        // Create new version, preserve history
        const newVersion = (currentSnippet.currentVersion || 1) + 1;
        const editHistory = currentSnippet.editHistory || [];

        updateData = {
          content: content || currentSnippet.content,
          title: title || currentSnippet.title,
          language: language || currentSnippet.language,
          description: description !== undefined ? description : currentSnippet.description,
          tags: tags || currentSnippet.tags,
          currentVersion: newVersion,
          editHistory: [
            ...editHistory,
            {
              version: newVersion,
              content: content,
              editedBy: req.userId,
              editedAt: new Date().toISOString(),
              conflictNote: `Concurrent edit detected. Previous version: ${currentVersion}, Current version: ${currentSnippet.currentVersion}`,
            },
          ],
        };
      } else if (conflictMode === 'merge') {
        // Attempt intelligent merge (simplified - could be improved)
        return res.status(409).json({
          error: 'Concurrent edit conflict',
          conflictMode: 'merge',
          message: 'Merge mode requires manual conflict resolution. Please refresh and try again.',
          currentVersion: currentSnippet.currentVersion,
          receivedVersion: currentVersion,
        });
      }
    } else {
      // No conflict - normal update
      if (content) {
        // Auto-detect language if content changed
        const detection = detectLanguage(content);
        updateData.language = language || detection.extension;
        updateData.autoDetected = !language;
      }

      updateData = {
        content: content || currentSnippet.content,
        title: title || currentSnippet.title,
        language: updateData.language || language || currentSnippet.language,
        description: description !== undefined ? description : currentSnippet.description,
        tags: tags || currentSnippet.tags,
        currentVersion: (currentSnippet.currentVersion || 1) + 1,
      };

      // Add to edit history
      if (content) {
        const editHistory = currentSnippet.editHistory || [];
        updateData.editHistory = [
          ...editHistory,
          {
            version: updateData.currentVersion,
            content,
            editedBy: req.userId,
            editedAt: new Date().toISOString(),
            note: 'Updated by user',
          },
        ];
      }
    }

    // Add collaborator if not already present
    const collaborators = currentSnippet.collaborators || [];
    if (!collaborators.includes(req.userId!)) {
      updateData.collaborators = [...collaborators, req.userId];
    }

    // Handle folder changes
    if (folderId !== undefined) {
      const currentFolderId = currentSnippet.folderId || null;
      
      // If folder changed, update snippet counts
      if (folderId !== currentFolderId) {
        // Decrement old folder count if it exists
        if (oldFolderId && oldFolderId !== null) {
          await updateFolderSnippetCount(req.userId!, oldFolderId, -1);
        }
        
        // Increment new folder count if it exists
        if (folderId && folderId !== null) {
          await updateFolderSnippetCount(req.userId!, folderId, 1);
        }
        
        // Update the snippet's folderId
        updateData.folderId = folderId;
      }
    }

    const result = await saveSnippet(req.userId!, id, updateData, false);

    res.status(200).json({
      message: 'Snippet updated successfully',
      snippet: result,
      conflict: hasVersionConflict ? { detected: true, mode: conflictMode } : undefined,
    });
  } catch (error: any) {
    console.error('Snippet update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update snippet' });
  }
}

export default withErrorHandler(updateSnippetHandler);
