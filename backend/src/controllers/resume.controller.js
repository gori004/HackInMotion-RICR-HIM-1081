import { parsePDF } from '../services/pdfParser.service.js';
import { parseDOCX } from '../services/docxParser.service.js';

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { mimetype, buffer, originalname } = req.file;

    let parsedText = '';
    if (mimetype === 'application/pdf') {
      parsedText = await parsePDF(buffer);
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      parsedText = await parseDOCX(buffer);
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload a PDF or DOCX file.' });
    }

    return res.status(200).json({
      success: true,
      fileName: originalname,
      parsedText,
    });
  } catch (err) {
    console.error('[uploadResume]', err.message);
    return res.status(500).json({ message: err.message || 'Failed to process resume.' });
  }
};