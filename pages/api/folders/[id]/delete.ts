import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, AuthenticatedRequest } from '../../../../lib/middleware';
import { db } from '../../../../lib/firebase-admin';

/**
 * DELETE /api/folders/[id]
 * Soft delete a folder
 * 
 * Headers: { Authorization: Bearer <token> }
 * Query: { id: string }
 * Body: { moveSnippetsToRoot?: boolean }
 * 
 * If moveSnippetsToRoot is true, all snippets in folder are moved to root (folderId = null)
 * If false, snippets are moved to trash as well
 */
async function deleteFolderHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  try {
    const { id } = req.query;
    const { moveSnippetsToRoot = false } = req.body || {};

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    // Get all snippets in folder
    const snippetsSnapshot = await db
      .collection('users')
      .doc(req.userId!)
      .collection('snippets')
      .where('folderId', '==', id)
      .where('isDeleted', '==', false)
      .get();

    // Handle snippets in folder
    const batch = db.batch();

    snippetsSnapshot.docs.forEach((doc: any) => {
      const snippetRef = db
        .collection('users')
        .doc(req.userId!)
        .collection('snippets')
        .doc(doc.id);

      if (moveSnippetsToRoot) {
        batch.update(snippetRef, { folderId: null });
      } else {
        batch.update(snippetRef, { isDeleted: true, deletedAt: new Date() });
      }
    });

    // Soft delete folder
    const folderRef = db.collection('users').doc(req.userId!).collection('folders').doc(id);
    batch.update(folderRef, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    await batch.commit();

    res.status(200).json({
      message: 'Folder deleted successfully',
      folderId: id,
      snippetsAffected: snippetsSnapshot.size,
      action: moveSnippetsToRoot ? 'moved_to_root' : 'moved_to_trash',
    });
  } catch (error: any) {
    console.error('Folder delete error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete folder' });
  }
}

export default withErrorHandler(deleteFolderHandler);
