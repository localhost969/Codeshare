
import * as admin from 'firebase-admin';

/**
 * Validate Firebase credentials are available
 */
function validateFirebaseCredentials(): void {
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
  ];

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}. ` +
        `Please ensure all Firebase credentials are set in your environment.`
    );
  }
}

/**
 * Initialize Firebase Admin SDK with robust error handling
 */
function initializeFirebaseAdmin(): admin.app.App {
  try {
    // Validate credentials before attempting initialization
    validateFirebaseCredentials();

    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('[Firebase] Admin SDK already initialized');
      return admin.app();
    }

    const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

    const app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('[Firebase] Admin SDK initialized successfully');
    return app;
  } catch (error) {
    console.error('[Firebase] Initialization failed:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Initialize on module load
let initialized = false;
let initError: Error | null = null;

try {
  initializeFirebaseAdmin();
  initialized = true;
} catch (error) {
  initError = error instanceof Error ? error : new Error(String(error));
  console.error('[Firebase] Critical initialization error:', initError.message);
}

/**
 * Get Firestore instance with initialization check
 */
export function getFirestore(): FirebaseFirestore.Firestore {
  if (!initialized) {
    throw new Error(
      'Firebase Admin SDK failed to initialize. ' +
        (initError ? `Error: ${initError.message}` : 'Unknown error.')
    );
  }
  return admin.firestore();
}

/**
 * Get Auth instance with initialization check
 */
export function getAuth(): admin.auth.Auth {
  if (!initialized) {
    throw new Error(
      'Firebase Admin SDK failed to initialize. ' +
        (initError ? `Error: ${initError.message}` : 'Unknown error.')
    );
  }
  return admin.auth();
}

// Export convenience references (will throw if not initialized when accessed)
export const db = admin.firestore();
export const auth = admin.auth();

/**
 * Get user document from Firestore
 */
export async function getUserDoc(userId: string) {
  try {
    if (!userId?.trim()) {
      throw new Error('Invalid userId provided');
    }
    const doc = await getFirestore().collection('users').doc(userId).get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('[Firebase] Error fetching user:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Create a new user document
 */
export async function createUserDoc(userId: string, userData: Record<string, any>) {
  try {
    if (!userId?.trim()) {
      throw new Error('Invalid userId provided');
    }
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid userData provided');
    }
    await getFirestore().collection('users').doc(userId).set({
      ...userData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('[Firebase] Error creating user:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Verify Firebase ID token
 */
export async function verifyToken(token: string) {
  try {
    if (!token?.trim()) {
      throw new Error('Invalid or empty token provided');
    }
    const decoded = await getAuth().verifyIdToken(token);
    return decoded;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Firebase] Token verification failed:', errorMessage);
    throw error;
  }
}

/**
 * Get snippet document by ID
 */
export async function getSnippet(userId: string, snippetId: string) {
  try {
    if (!userId?.trim() || !snippetId?.trim()) {
      throw new Error('Invalid userId or snippetId provided');
    }
    const doc = await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('snippets')
      .doc(snippetId)
      .get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('[Firebase] Error fetching snippet:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Get all snippets for a user (excluding trash)
 */
export async function getUserSnippets(userId: string, folderId?: string) {
  try {
    if (!userId?.trim()) {
      throw new Error('Invalid userId provided');
    }
    let query = getFirestore()
      .collection('users')
      .doc(userId)
      .collection('snippets')
      .where('isDeleted', '==', false);

    if (folderId?.trim()) {
      query = query.where('folderId', '==', folderId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[Firebase] Error fetching snippets:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Create or update snippet
 */
export async function saveSnippet(
  userId: string,
  snippetId: string,
  snippetData: Record<string, any>,
  isNew: boolean = false
) {
  try {
    if (!userId?.trim() || !snippetId?.trim()) {
      throw new Error('Invalid userId or snippetId provided');
    }
    if (!snippetData || typeof snippetData !== 'object') {
      throw new Error('Invalid snippetData provided');
    }
    const data = {
      ...snippetData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(isNew && { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
    };

    await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('snippets')
      .doc(snippetId)
      .set(data, { merge: !isNew });

    return { id: snippetId, ...data };
  } catch (error) {
    console.error('[Firebase] Error saving snippet:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Get folder document
 */
export async function getFolder(userId: string, folderId: string) {
  try {
    if (!userId?.trim() || !folderId?.trim()) {
      throw new Error('Invalid userId or folderId provided');
    }
    const doc = await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('folders')
      .doc(folderId)
      .get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  } catch (error) {
    console.error('[Firebase] Error fetching folder:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Get all folders for a user
 */
export async function getUserFolders(userId: string) {
  try {
    if (!userId?.trim()) {
      throw new Error('Invalid userId provided');
    }
    const snapshot = await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('folders')
      .where('isDeleted', '==', false)
      .get();
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('[Firebase] Error fetching folders:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Create or update folder
 */
export async function saveFolder(
  userId: string,
  folderId: string,
  folderData: Record<string, any>,
  isNew: boolean = false
) {
  try {
    if (!userId?.trim() || !folderId?.trim()) {
      throw new Error('Invalid userId or folderId provided');
    }
    if (!folderData || typeof folderData !== 'object') {
      throw new Error('Invalid folderData provided');
    }
    const data = {
      ...folderData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...(isNew && { createdAt: admin.firestore.FieldValue.serverTimestamp() }),
    };

    await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('folders')
      .doc(folderId)
      .set(data, { merge: !isNew });

    return { id: folderId, ...data };
  } catch (error) {
    console.error('[Firebase] Error saving folder:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Update folder snippet count
 */
export async function updateFolderSnippetCount(
  userId: string,
  folderId: string | null,
  increment: number
) {
  try {
    if (!folderId || !userId?.trim()) {
      return; // Skip if no folder ID or invalid user
    }
    
    const folderRef = getFirestore()
      .collection('users')
      .doc(userId)
      .collection('folders')
      .doc(folderId);

    await folderRef.update({
      snippetCount: admin.firestore.FieldValue.increment(increment),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('[Firebase] Error updating folder snippet count:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Soft delete snippet (move to trash)
 */
export async function deleteSnippet(userId: string, snippetId: string) {
  try {
    if (!userId?.trim() || !snippetId?.trim()) {
      throw new Error('Invalid userId or snippetId provided');
    }
    await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('snippets')
      .doc(snippetId)
      .update({
        isDeleted: true,
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    console.error('[Firebase] Error deleting snippet:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Restore snippet from trash
 */
export async function restoreSnippet(userId: string, snippetId: string) {
  try {
    if (!userId?.trim() || !snippetId?.trim()) {
      throw new Error('Invalid userId or snippetId provided');
    }
    await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('snippets')
      .doc(snippetId)
      .update({
        isDeleted: false,
        deletedAt: admin.firestore.FieldValue.delete(),
      });
  } catch (error) {
    console.error('[Firebase] Error restoring snippet:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Get trash snippets
 */
export async function getTrashSnippets(userId: string) {
  try {
    if (!userId?.trim()) {
      throw new Error('Invalid userId provided');
    }
    const snapshot = await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('snippets')
      .where('isDeleted', '==', true)
      .get();

    const snippets = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch folder names for snippets that have folderId
    const folderPromises = snippets
      .filter(snippet => snippet.folderId)
      .map(async (snippet) => {
        try {
          const folderDoc = await getFirestore()
            .collection('users')
            .doc(userId)
            .collection('folders')
            .doc(snippet.folderId)
            .get();
          return {
            folderId: snippet.folderId,
            folderName: folderDoc.exists ? folderDoc.data()?.name : 'Unknown Folder'
          };
        } catch (error) {
          console.error(`Error fetching folder ${snippet.folderId}:`, error);
          return {
            folderId: snippet.folderId,
            folderName: 'Unknown Folder'
          };
        }
      });

    const folderResults = await Promise.all(folderPromises);
    const folderMap = new Map(folderResults.map(result => [result.folderId, result.folderName]));

    // Add folderName to snippets
    return snippets.map(snippet => ({
      ...snippet,
      folderName: snippet.folderId ? folderMap.get(snippet.folderId) : null
    }));
  } catch (error) {
    console.error('[Firebase] Error fetching trash:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

/**
 * Permanently delete snippet
 */
export async function permanentlyDeleteSnippet(userId: string, snippetId: string) {
  try {
    if (!userId?.trim() || !snippetId?.trim()) {
      throw new Error('Invalid userId or snippetId provided');
    }
    await getFirestore()
      .collection('users')
      .doc(userId)
      .collection('snippets')
      .doc(snippetId)
      .delete();
  } catch (error) {
    console.error('[Firebase] Error permanently deleting snippet:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}
