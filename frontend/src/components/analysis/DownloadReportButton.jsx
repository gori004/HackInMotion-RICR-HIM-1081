import { useState } from "react";
import html2pdf from "html2pdf.js";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { Download } from "lucide-react";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function DownloadReportButton({
  targetId,
  fileName = "resume-match-report.pdf",
}) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    const element = document.getElementById(targetId);
    if (!element) {
      notifyError("Nothing to export yet — run an analysis first.");
      return;
    }

    setIsGenerating(true);
    try {
      await html2pdf()
        .set({
          margin: 0.5,
          filename: fileName,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(element)
        .save();
      notifySuccess("Report downloaded!");
    } catch (err) {
      notifyError("Couldn't generate the PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? (
        <Spinner size={16} />
      ) : (
        <Download size={16} className="mr-1.5" />
      )}
      {isGenerating ? "Generating..." : "Download PDF report"}
    </Button>
  );
}