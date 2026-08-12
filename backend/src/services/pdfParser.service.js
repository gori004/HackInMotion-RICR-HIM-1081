import pdfParse from '@cyber2024/pdf-parse-fixed';

export const parsePDF = async (buffer) => {
  try {
    const parsedData = await pdfParse(buffer);
    return parsedData.text;
  } catch (error) {
    throw new Error('Failed to parse PDF file: ' + error.message);
  }
};