import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../../lib/middleware';
import { deleteSnippet } from '../../../../lib/firebase-admin';

/**
 * DELETE /api/snippets/[id]/delete
 * Soft delete a snippet (move to trash)
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { id: string }
 */
async function deleteSnippetHandler(req: AuthenticatedRequest, res: NextApiResponse) {
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

    await deleteSnippet(req.userId!, id);

    res.status(200).json({
      message: 'Snippet moved to trash successfully',
      snippetId: id,
    });
  } catch (error: any) {
    console.error('Delete snippet error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete snippet' });
  }
}

export default withErrorHandler(deleteSnippetHandler);
