import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, validateRequestBody, AuthenticatedRequest } from '../../../lib/middleware';
import { getFolder, saveFolder } from '../../../lib/firebase-admin';

/**
 * PUT /api/folders/[id]
 * Update a folder
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { id: string }
 * Body: {
 *   name?: string,
 *   description?: string,
 *   color?: string
 * }
 */
async function updateFolderHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    const currentFolder = (await getFolder(req.userId!, id)) as any;

    if (!currentFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const { name, description, color } = req.body;

    const updateData = {
      name: name || currentFolder.name,
      description: description !== undefined ? description : currentFolder.description,
      color: color || currentFolder.color,
    };

    const result = await saveFolder(req.userId!, id, updateData, false);

    // Fetch snippet count for this folder
    let snippetCount = 0;
    try {
      const { getUserSnippets } = await import('../../../lib/firebase-admin');
      const snippets = await getUserSnippets(req.userId!, id);
      snippetCount = Array.isArray(snippets) ? snippets.length : 0;
    } catch (e) {
      // If function or fetch fails, fallback to 0
      snippetCount = 0;
    }

    res.status(200).json({
      message: 'Folder updated successfully',
      folder: result,
      snippetCount,
    });
  } catch (error: any) {
    console.error('Folder update error:', error);
    res.status(500).json({ error: error.message || 'Failed to update folder' });
  }
}

export default withErrorHandler(updateFolderHandler);
