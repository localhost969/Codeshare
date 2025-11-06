import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../lib/middleware';
import { getTrashSnippets, permanentlyDeleteSnippet } from '../../../lib/firebase-admin';

/**
 * GET /api/trash/list
 * Get all snippets in trash
 * 
 * Headers: { Authorization: Bearer <token> }
 */
async function listTrashHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const trash = await getTrashSnippets(req.userId!);

    res.status(200).json({
      message: 'Trash retrieved successfully',
      count: trash.length,
      trash,
    });
  } catch (error: any) {
    console.error('Trash list error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve trash' });
  }
}

export default withErrorHandler(listTrashHandler);
