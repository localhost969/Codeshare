import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../../lib/middleware';
import { restoreSnippet } from '../../../../lib/firebase-admin';

/**
 * POST /api/snippets/[id]/restore
 * Restore a snippet from trash
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { id: string }
 */
async function restoreSnippetHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Snippet ID is required' });
    }

    await restoreSnippet(req.userId!, id);

    res.status(200).json({
      message: 'Snippet restored successfully',
      snippetId: id,
    });
  } catch (error: any) {
    console.error('Restore snippet error:', error);
    res.status(500).json({ error: error.message || 'Failed to restore snippet' });
  }
}

export default withErrorHandler(restoreSnippetHandler);
