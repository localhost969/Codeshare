import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../lib/middleware';
import { getUserFolders } from '../../../lib/firebase-admin';

/**
 * GET /api/folders/list
 * Get all folders for the authenticated user
 * 
 * Headers: { Authorization: Bearer <token> }
 */
async function listFoldersHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const folders = await getUserFolders(req.userId!);
    const { getUserSnippets } = await import('../../../lib/firebase-admin');

    // For each folder, fetch snippet count
    const foldersWithCount = await Promise.all(
      folders.map(async (folder: any) => {
        const snippets = await getUserSnippets(req.userId!, folder.id);
        return {
          ...folder,
          snippetCount: Array.isArray(snippets) ? snippets.length : 0,
        };
      })
    );

    res.status(200).json({
      message: 'Folders retrieved successfully',
      count: foldersWithCount.length,
      folders: foldersWithCount,
    });
  } catch (error: any) {
    console.error('Folders list error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve folders' });
  }
}

export default withErrorHandler(listFoldersHandler);
