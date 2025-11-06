import crypto from 'crypto';

interface ShareTokenPayload {
  snippetId: string;
  ownerId: string;
  readOnly: boolean;
  expiresIn?: number; // milliseconds
}

interface DecodedToken {
  snippetId: string;
  ownerId: string;
  readOnly: boolean;
  expiresAt?: number;
}

// In-memory token store (in production, use Redis or database)
const tokenStore = new Map<string, { payload: DecodedToken; createdAt: number }>();

/**
 * Generate a secure share token for a snippet
 */
export function generateShareToken(data: ShareTokenPayload): string {
  const payload: DecodedToken = {
    snippetId: data.snippetId,
    ownerId: data.ownerId,
    readOnly: data.readOnly,
    ...(data.expiresIn && { expiresAt: Date.now() + data.expiresIn }),
  };

  // Create a random token
  const token = crypto.randomBytes(32).toString('hex');

  // Store the payload
  tokenStore.set(token, {
    payload,
    createdAt: Date.now(),
  });

  return token;
}

/**
 * Verify and decode a share token
 */
export function verifyShareToken(token: string): DecodedToken | null {
  const stored = tokenStore.get(token);

  if (!stored) {
    return null;
  }

  const { payload } = stored;

  // Check if token has expired
  if (payload.expiresAt && payload.expiresAt < Date.now()) {
    tokenStore.delete(token);
    return null;
  }

  return payload;
}

/**
 * Revoke a share token
 */
export function revokeShareToken(token: string): boolean {
  return tokenStore.delete(token);
}

/**
 * Get all active tokens (for debugging/admin)
 */
export function getAllActiveTokens(): Array<{ token: string; payload: DecodedToken }> {
  const now = Date.now();
  const active = [];

  for (const [token, { payload }] of tokenStore.entries()) {
    if (!payload.expiresAt || payload.expiresAt > now) {
      active.push({ token, payload });
    } else {
      tokenStore.delete(token);
    }
  }

  return active;
}

/**
 * Cleanup expired tokens (call periodically)
 */
export function cleanupExpiredTokens(): number {
  const now = Date.now();
  let count = 0;

  for (const [token, { payload }] of tokenStore.entries()) {
    if (payload.expiresAt && payload.expiresAt < now) {
      tokenStore.delete(token);
      count++;
    }
  }

  return count;
}
