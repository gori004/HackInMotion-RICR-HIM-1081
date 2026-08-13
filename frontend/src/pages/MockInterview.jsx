import { useState } from "react";
import InterviewSetup from "../components/interview/InterviewSetup";
import QuestionCard from "../components/interview/QuestionCard";
import AnswerEditor from "../components/interview/AnswerEditor";
import VoiceInputButton from "../components/interview/VoiceInputButton";
import AnswerFeedback from "../components/interview/AnswerFeedback";
import Card, { CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { SkeletonCard } from "../components/ui/Skeleton";
import { AlertCircle, ArrowRight, Trophy } from "lucide-react";
import { startInterview, submitAnswer, getInterviewSummary } from "../services/interviewApi";

const STAGES = {
  SETUP: "setup",
  LOADING: "loading",
  QUESTION: "question",
  SUBMITTING: "submitting",
  FEEDBACK: "feedback",
  COMPLETE: "complete",
};

export default function MockInterview() {
  const [stage, setStage] = useState(STAGES.SETUP);
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [category, setCategory] = useState("behavioral");
  const [lastFeedback, setLastFeedback] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const handleStart = async (config) => {
    setStage(STAGES.LOADING);
    setError("");
    try {
      const data = await startInterview(config);
      setInterviewId(data.interviewId);
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTotalQuestions(data.totalQuestions);
      setCategory(data.category);
      setStage(STAGES.QUESTION);
    } catch (err) {
      setError(err.message);
      setStage(STAGES.SETUP);
    }
  };

  const handleAnswerSubmit = async (answerText) => {
    setStage(STAGES.SUBMITTING);
    setError("");
    try {
      const data = await submitAnswer(interviewId, { questionIndex, answerText });
      setLastFeedback(data.feedback);
      setStage(STAGES.FEEDBACK);

      if (data.isComplete) {
        setTimeout(async () => {
          const summaryData = await getInterviewSummary(interviewId);
          setSummary(summaryData);
          setStage(STAGES.COMPLETE);
        }, 0);
      } else {
        setCurrentQuestion(data.nextQuestion.question);
        setQuestionIndex(data.nextQuestion.questionIndex);
        setCategory(data.nextQuestion.category);
      }
    } catch (err) {
      setError(err.message);
      setStage(STAGES.QUESTION);
    }
  };

  const handleContinue = () => {
    setLastFeedback(null);
    setVoiceTranscript("");
    setStage(STAGES.QUESTION);
  };

  if (stage === STAGES.SETUP) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <InterviewSetup onStart={handleStart} />
      </div>
    );
  }

  if (stage === STAGES.LOADING) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <SkeletonCard />
        <div className="flex justify-center">
          <Spinner size={28} />
        </div>
      </div>
    );
  }

  if (stage === STAGES.COMPLETE && summary) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-amber-500" size={28} />
            <CardHeader title="Interview complete!" subtitle="Here's how you did overall." />
          </div>
          <p className="text-4xl font-bold text-indigo-600 mb-4">{summary.overallScore}/100</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Strengths</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {summary.strengths.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Focus areas</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {summary.improvements.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <QuestionCard
        question={currentQuestion}
        currentIndex={questionIndex}
        totalQuestions={totalQuestions}
        category={category}
      />

      {stage === STAGES.FEEDBACK ? (
        <>
          <AnswerFeedback feedback={lastFeedback} />
          <Button onClick={handleContinue} className="w-full" size="lg">
            Next Question <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </>
      ) : (
        <Card>
          <VoiceInputButton onTranscriptChange={setVoiceTranscript} />
          <div className="mt-4">
            <AnswerEditor
              key={questionIndex}
              initialValue={voiceTranscript}
              isSubmitting={stage === STAGES.SUBMITTING}
              onSubmit={handleAnswerSubmit}
            />
          </div>
        </Card>
      )}
    </div>
  );
}