import { NextApiResponse } from 'next';
import { withAuth, withErrorHandler, validateRequestBody, AuthenticatedRequest } from '../../../lib/middleware';
import { saveFolder } from '../../../lib/firebase-admin';

/**
 * POST /api/folders/create
 * Create a new folder
 * 
 * Headers: { Authorization: Bearer <token> }
 * Body: {
 *   name: string,
 *   description?: string,
 *   color?: string
 * }
 */
async function createFolderHandler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authenticated = await withAuth(req, res);
  if (!authenticated) return;

  const validation = validateRequestBody(req.body, ['name']);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const { name, description = '', color = '#6366f1' } = req.body;

    // Generate folder ID
    const folderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const folderData = {
      name,
      description,
      color,
      isDeleted: false,
      snippetCount: 0,
    };

    const result = await saveFolder(req.userId!, folderId, folderData, true);

    res.status(201).json({
      message: 'Folder created successfully',
      folder: result,
    });
  } catch (error: any) {
    console.error('Folder creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create folder' });
  }
}

export default withErrorHandler(createFolderHandler);
