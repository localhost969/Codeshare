import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '@/lib/middleware';
import { getSnippet } from '@/lib/firebase-admin';
import { generateShareToken, verifyShareToken } from '@/lib/share-tokens';

/**
 * POST /api/share/generate
 * Generate a share token/link for a snippet
 * 
 * Headers: { Authorization: Bearer <token> }
 * Body: {
 *   snippetId: string,
 *   expiresIn?: number (milliseconds, default: no expiry),
 *   readOnly?: boolean (default: false)
 * }
 */
async function generateShareHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { snippetId, expiresIn, readOnly = false } = req.body;

    if (!snippetId) {
      return res.status(400).json({ error: 'Snippet ID is required' });
    }

    // Verify ownership
    const snippet = (await getSnippet(req.userId!, snippetId)) as any;
    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    const shareToken = generateShareToken({
      snippetId,
      ownerId: req.userId!,
      readOnly,
      expiresIn,
    });

    res.status(201).json({
      message: 'Share token generated successfully',
      shareToken,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareToken}`,
      expiresAt: expiresIn ? new Date(Date.now() + expiresIn).toISOString() : null,
      readOnly,
    });
  } catch (error: any) {
    console.error('Share generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate share token' });
  }
}

export default withErrorHandler(generateShareHandler);
