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

import Resume from "../models/Resume.model.js";

export const getMyResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("-rawText")
      .sort({ createdAt: -1 });
    res.status(200).json(resumes);
  } catch (err) {
    next(err);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });
    res.status(200).json(resume);
  } catch (err) {
    next(err);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });
    res.status(200).json({ message: "Resume deleted." });
  } catch (err) {
    next(err);
  }
};