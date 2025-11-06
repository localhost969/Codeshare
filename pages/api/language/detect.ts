import { NextApiResponse } from 'next';
import { withErrorHandler } from '../../../lib/middleware';
import { NextApiRequest } from 'next';
import { getSupportedLanguages, detectLanguage } from '../../../lib/language-detection';

/**
 * GET /api/language/detect
 * Auto-detect programming language from code
 * 
 * Query: { code: string }
 */
async function detectLanguageHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code parameter is required' });
    }

    const detection = detectLanguage(code);

    res.status(200).json({
      message: 'Language detected successfully',
      detection,
    });
  } catch (error: any) {
    console.error('Language detection error:', error);
    res.status(500).json({ error: error.message || 'Failed to detect language' });
  }
}

export default withErrorHandler(detectLanguageHandler);
