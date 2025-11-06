import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken as verifyJWT, extractToken } from './jwt';

export interface AuthenticatedRequest extends NextApiRequest {
  userId?: string;
  username?: string;
  user?: { userId: string; username: string };
}

/**
 * Middleware to verify JWT authentication
 */
export async function withAuth(
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<boolean> {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      res.status(401).json({ error: 'Missing authentication token' });
      return false;
    }

    const decoded = verifyJWT(token);
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    return true;
  } catch (error: any) {
    console.error('[Middleware] Authentication error:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
    return false;
  }
}

/**
 * Validate HTTP method
 */
export function validateMethod(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
): boolean {
  if (!req.method || !allowedMethods.includes(req.method)) {
    res.status(405).json({
      error: `Method ${req.method} not allowed. Allowed: ${allowedMethods.join(', ')}`,
    });
    return false;
  }
  return true;
}

/**
 * Error handler wrapper
 */
export function withErrorHandler(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      console.error('API Error:', error);

      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal server error';

      res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      });
    }
  };
}

/**
 * Rate limiting key generator
 */
export function getRateLimitKey(req: NextApiRequest, userId?: string): string {
  if (userId) return userId;
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') return forwardedFor;
  return 'anonymous';
}

/**
 * Validate request body
 */
export function validateRequestBody(
  body: any,
  requiredFields: string[]
): { valid: boolean; error?: string } {
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  return { valid: true };
}
