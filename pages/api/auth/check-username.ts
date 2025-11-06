import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../lib/firebase-admin';
import { validateRequestBody } from '../../../lib/middleware';

/**
 * POST /api/auth/check-username
 * Checks if a username exists in the database
 * Body: { username: string }
 * Returns: { exists: boolean }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validation = validateRequestBody(req.body, ['username']);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { username } = req.body;

  try {
    const snapshot = await db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();
    res.status(200).json({ exists: !snapshot.empty });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
