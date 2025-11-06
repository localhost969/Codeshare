import { NextApiResponse } from 'next';
import { db } from '../../../lib/firebase-admin';
import { generateToken } from '../../../lib/jwt';
import { withErrorHandler, validateRequestBody } from '../../../lib/middleware';
import { AuthenticatedRequest } from '../../../lib/middleware';

/**
 * POST /api/auth/login
 * Login user with username and password
 * 
 * Body: { username: string, password: string }
 * 
 * Returns: JWT token
 */
async function loginHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validation = validateRequestBody(req.body, ['username', 'password']);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const { username, password } = req.body;

    // Find user by username in Firestore
    const usersSnapshot = await db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const userData = usersSnapshot.docs[0].data();
    const userId = usersSnapshot.docs[0].id;

    // Check if password field exists in user data
    if (!userData.password || typeof userData.password !== 'string') {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify password by direct comparison
    if (password !== userData.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = generateToken(userId, userData.username);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        userId,
        username: userData.username,
      },
    });
  } catch (error: any) {
    console.error('[API] Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
}

export default withErrorHandler(loginHandler);
