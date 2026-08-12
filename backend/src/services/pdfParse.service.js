import pdfParse from 'pdf-parse';

export const parseUploadedPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // req.file.buffer is available when using multer.memoryStorage()
    const parsedData = await pdfParse(req.file.buffer);

    return res.status(200).json({
      text: parsedData.text,
      pages: parsedData.numpages,
      info: parsedData.info,
    });
  } catch (error) {
    console.error('PDF Parse Error:', error);
    return res.status(500).json({ message: 'Failed to parse PDF file.' });
  }
};