import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../lib/middleware';
import { getSnippet } from '../../../lib/firebase-admin';

/**
 * GET /api/snippets/[id]
 * Get a specific snippet by ID
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { id: string }
 */
async function getSnippetHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Snippet ID is required' });
    }

    const snippet = await getSnippet(req.userId!, id);

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    res.status(200).json({
      message: 'Snippet retrieved successfully',
      snippet,
    });
  } catch (error: any) {
    console.error('Get snippet error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve snippet' });
  }
}

export default withErrorHandler(getSnippetHandler);
