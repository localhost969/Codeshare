import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, validateRequestBody, AuthenticatedRequest } from '../../../lib/middleware';
import { saveSnippet, getSnippet } from '../../../lib/firebase-admin';
import { detectLanguage } from '../../../lib/language-detection';

/**
 * POST /api/snippets/create
 * Create a new code snippet
 * 
 * Headers: { Authorization: Bearer <token> }
 * Body: {
 *   title?: string,
 *   content: string,
 *   language?: string,
 *   folderId?: string,
 *   description?: string,
 *   tags?: string[],
 *   isPublic?: boolean
 * }
 */
async function createSnippetHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  const validation = validateRequestBody(req.body, ['content']);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const {
      title,
      content,
      language,
      folderId,
      description,
      tags = [],
      isPublic = false,
    } = req.body;

    // Auto-detect language if not provided
    let detectedLanguage = language;
    let autoDetected = false;

    if (!language) {
      const detection = detectLanguage(content);
      detectedLanguage = detection.extension;
      autoDetected = true;
    }

    // Generate title if not provided
    const generatedTitle = title || `Snippet ${new Date().toLocaleString()}`;

    // Generate snippet ID
    const snippetId = `snippet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const snippetData = {
      title: generatedTitle,
      content,
      language: detectedLanguage,
      autoDetected,
      folderId: folderId || null,
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      isPublic,
      isDeleted: false,
      editHistory: [
        {
          version: 1,
          content,
          editedBy: req.userId,
          editedAt: new Date().toISOString(),
          note: 'Initial creation',
        },
      ],
      currentVersion: 1,
      collaborators: [req.userId],
    };

    const result = await saveSnippet(req.userId!, snippetId, snippetData, true);

    res.status(201).json({
      message: 'Snippet created successfully',
      snippet: result,
    });
  } catch (error: any) {
    console.error('Snippet creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create snippet' });
  }
}

export default withErrorHandler(createSnippetHandler);
