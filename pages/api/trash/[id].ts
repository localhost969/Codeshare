import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../lib/middleware';
import { permanentlyDeleteSnippet } from '../../../lib/firebase-admin';

/**
 * DELETE /api/trash/[id]
 * Permanently delete a snippet from trash
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { id: string }
 */
async function deletePermanentlyHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Snippet ID is required' });
    }

    await permanentlyDeleteSnippet(req.userId!, id);

    res.status(200).json({
      message: 'Snippet permanently deleted',
      snippetId: id,
    });
  } catch (error: any) {
    console.error('Permanent delete error:', error);
    res.status(500).json({ error: error.message || 'Failed to permanently delete snippet' });
  }
}

export default withErrorHandler(deletePermanentlyHandler);
