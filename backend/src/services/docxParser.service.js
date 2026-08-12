import mammoth from "mammoth";

export const parseDOCX = async (fileBuffer) => {
  try {
    const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
    if (!value || value.trim().length === 0) {
      throw new Error("No readable text found in the DOCX file.");
    }
    return value.trim();
  } catch (err) {
    console.error("[parseDOCX]", err.message);
    throw new Error("Failed to parse DOCX file. It may be corrupted.");
  }
};