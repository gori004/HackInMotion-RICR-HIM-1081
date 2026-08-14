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
import { AlertCircle, ArrowRight, Trophy, RefreshCw } from "lucide-react";
import { startInterview, submitAnswer, completeInterview } from "../services/interviewApi";
import { notifyError } from "../utils/toast";

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
  const [category, setCategory] = useState("technical");
  const [lastFeedback, setLastFeedback] = useState(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const handleStart = async (config) => {
    setStage(STAGES.LOADING);
    setError("");
    try {
      const data = await startInterview(config);
      const sessionId = data.sessionId || data._id || data.data?._id;
      const questions = data.questions || [];

      setInterviewId(sessionId);
      setCurrentQuestion(questions[0]?.question || data.question);
      setQuestionIndex(0);
      setTotalQuestions(questions.length || data.totalQuestions || 5);
      setCategory(questions[0]?.type || data.category || "technical");
      setStage(STAGES.QUESTION);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to start interview";
      setError(errorMsg);
      notifyError(errorMsg);
      setStage(STAGES.SETUP);
    }
  };

  const handleAnswerSubmit = async (answerText) => {
    setStage(STAGES.SUBMITTING);
    setError("");
    try {
      const data = await submitAnswer(interviewId, {
        questionIndex,
        question: currentQuestion,
        answer: answerText,
      });

      setLastFeedback(data.feedback || data);
      const isComplete = data.isComplete || questionIndex + 1 >= totalQuestions;
      setIsLastQuestion(isComplete);

      if (!isComplete && data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion.question);
        setCategory(data.nextQuestion.type || "technical");
      }

      setStage(STAGES.FEEDBACK);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to evaluate answer";
      setError(errorMsg);
      notifyError(errorMsg);
      setStage(STAGES.QUESTION);
    }
  };

  const handleContinue = async () => {
    if (isLastQuestion) {
      setStage(STAGES.LOADING);
      try {
        const summaryData = await completeInterview(interviewId);
        setSummary(summaryData.data || summaryData);
        setStage(STAGES.COMPLETE);
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Failed to load summary";
        setError(errorMsg);
        notifyError(errorMsg);
        setStage(STAGES.FEEDBACK);
      }
    } else {
      setQuestionIndex((prev) => prev + 1);
      setLastFeedback(null);
      setVoiceTranscript("");
      setStage(STAGES.QUESTION);
    }
  };

  const handleRestart = () => {
    setStage(STAGES.SETUP);
    setInterviewId(null);
    setCurrentQuestion(null);
    setQuestionIndex(0);
    setLastFeedback(null);
    setSummary(null);
    setVoiceTranscript("");
    setError("");
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
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-amber-500" size={32} />
            <CardHeader title="Interview Complete!" subtitle="Here is your overall performance breakdown." />
          </div>
          <p className="text-5xl font-extrabold text-indigo-600 mb-6">
            {summary.overallScore ?? summary.score ?? 85}/100
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm font-semibold text-green-900 mb-2">Key Strengths</p>
              <ul className="text-sm text-green-800 space-y-1.5">
                {(summary.strengths || ["Strong technical knowledge", "Clear structured answers"]).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-sm font-semibold text-amber-900 mb-2">Areas to Improve</p>
              <ul className="text-sm text-amber-800 space-y-1.5">
                {(summary.improvements || summary.focusAreas || ["Provide more specific metrics with STAR method"]).map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
          <Button onClick={handleRestart} className="mt-6 w-full flex items-center justify-center gap-2">
            <RefreshCw size={16} /> Start Another Mock Interview
          </Button>
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
        <div className="space-y-4">
          <AnswerFeedback feedback={lastFeedback} />
          <Button onClick={handleContinue} className="w-full" size="lg">
            {isLastQuestion ? "View Final Summary & Results" : "Next Question"}{" "}
            <ArrowRight size={16} className="ml-1.5" />
          </Button>
        </div>
      ) : (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your Response</span>
            <VoiceInputButton onTranscriptChange={(text) => setVoiceTranscript((prev) => prev ? `${prev} ${text}` : text)} />
          </div>
          <div className="mt-2">
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