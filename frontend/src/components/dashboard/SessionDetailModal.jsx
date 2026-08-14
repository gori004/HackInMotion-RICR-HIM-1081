import Modal from "../shared/Modal";
import AnswerFeedback from "../interview/AnswerFeedback";
import { HelpCircle } from "lucide-react";

export default function SessionDetailModal({ session, isOpen, onClose }) {
  if (!session) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${session.role?.replace("-", " ")} — interview review`}>
      <div className="space-y-6">
        {session.questions?.map((q, i) => (
          <div key={i}>
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-800">{q.question}</p>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-3 ml-6">
              {q.answer}
            </p>
            <div className="ml-6">
              <AnswerFeedback feedback={q.feedback} />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}