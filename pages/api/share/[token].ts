import { NextApiResponse } from 'next';
import { withErrorHandler } from '@/lib/middleware';
import { NextApiRequest } from 'next';
import { verifyShareToken } from '@/lib/share-tokens';
import { getSnippet } from '@/lib/firebase-admin';

/**
 * GET /api/share/[token]
 * Access a shared snippet without authentication
 * 
 * Query: { token: string }
 * 
 * Returns snippet data if token is valid
 */
async function accessSharedHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Share token is required' });
    }

    const tokenData = verifyShareToken(token);

    if (!tokenData) {
      return res.status(401).json({ error: 'Invalid or expired share token' });
    }

    // Get the snippet
    const snippet = await getSnippet(tokenData.ownerId, tokenData.snippetId);

    if (!snippet) {
      return res.status(404).json({ error: 'Shared snippet not found' });
    }

    res.status(200).json({
      message: 'Shared snippet accessed successfully',
      snippet: {
        ...snippet,
        readOnly: tokenData.readOnly,
      },
      sharedByUser: tokenData.ownerId,
    });
  } catch (error: any) {
    console.error('Share access error:', error);
    res.status(500).json({ error: error.message || 'Failed to access shared snippet' });
  }
}

export default withErrorHandler(accessSharedHandler);
