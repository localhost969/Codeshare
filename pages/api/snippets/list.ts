import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../lib/middleware';
import { getSnippet, getUserSnippets } from '../../../lib/firebase-admin';

/**
 * GET /api/snippets/list?folderId=<id>
 * Get all snippets for the authenticated user
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { folderId?: string }
 */
async function listSnippetsHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { folderId } = req.query;

    const snippets = await getUserSnippets(
      req.userId!,
      typeof folderId === 'string' ? folderId : undefined
    );

    res.status(200).json({
      message: 'Snippets retrieved successfully',
      count: snippets.length,
      snippets,
    });
  } catch (error: any) {
    console.error('Snippet list error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve snippets' });
  }
}

export default withErrorHandler(listSnippetsHandler);
