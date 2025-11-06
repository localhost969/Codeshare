import { NextApiResponse } from 'next';
import { withErrorHandler } from '../../../lib/middleware';
import { NextApiRequest } from 'next';
import { getSupportedLanguages } from '../../../lib/language-detection';

/**
 * GET /api/language/supported
 * Get all supported programming languages
 */
async function supportedLanguagesHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const languages = getSupportedLanguages();

    res.status(200).json({
      message: 'Supported languages retrieved successfully',
      count: languages.length,
      languages,
    });
  } catch (error: any) {
    console.error('Supported languages error:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve languages' });
  }
}

export default withErrorHandler(supportedLanguagesHandler);
