const { z } = require("zod");

const ResumeExtractionSchema = z.object({
  hardSkills: z.array(z.string()),
  softSkills: z.array(z.string()),
  experience: z.array(z.object({ title: z.string(), years: z.number() })),
  education: z.array(z.string()),
});
const {
  ResumeExtractionSchema,
  JDExtractionSchema,
} = require("../schemas/atsResponseSchema");
// ...
const resumeData = ResumeExtractionSchema.parse(
  JSON.parse(resumeExtraction.choices[0].message.content),
);
const jdData = JDExtractionSchema.parse(
  JSON.parse(jdExtraction.choices[0].message.content),
);
return { resumeData, jdData };
const JDExtractionSchema = z.object({
  mustHaveSkills: z.array(z.string()),
  niceToHaveSkills: z.array(z.string()),
  responsibilities: z.array(z.string()),
  seniorityLevel: z.enum(["entry", "mid", "senior", "lead"]),
});

module.exports = { ResumeExtractionSchema, JDExtractionSchema };
