import { NextApiResponse } from 'next';
import { db, createUserDoc } from '../../../lib/firebase-admin';
import { generateToken } from '../../../lib/jwt';
import { withErrorHandler, validateRequestBody } from '../../../lib/middleware';
import { AuthenticatedRequest } from '../../../lib/middleware';

/**
 * POST /api/auth/register
 * Register a new user with username and password
 * 
 * Body: { username: string, password: string }
 * 
 * Returns: JWT token
 */
async function registerHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const validation = validateRequestBody(req.body, ['username', 'password']);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const { username, password } = req.body;

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if username already exists
    const usernameSnapshot = await db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();

    if (!usernameSnapshot.empty) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Generate userId
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user document in Firestore
    await createUserDoc(userId, {
      username,
      password,
      displayName: username,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    });

    // Generate JWT token
    const token = generateToken(userId, username);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId,
        username,
      },
    });
  } catch (error: any) {
    console.error('[API] Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
}

export default withErrorHandler(registerHandler);
