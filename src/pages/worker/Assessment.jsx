import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  Languages,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { assessmentApi } from '../../services/assessmentApi';
import { LANGUAGES } from '../../utils/constants';
import AssessmentQuestion from '../../components/AssessmentQuestion';
import ProgressBar from '../../components/ProgressBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const Assessment = () => {
  const { moduleId = 'SPACE_HAZARD' } = useParams();
  const navigate = useNavigate();

  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [assessmentData, setAssessmentData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { Q1: 'B', Q2: 'B' }

  useEffect(() => {
    fetchQuestions(lang);
  }, [moduleId, lang]);

  const fetchQuestions = async (selectedLang) => {
    setLoading(true);
    setError('');
    try {
      const response = await assessmentApi.getAssessmentByModule(moduleId, selectedLang);
      if (response?.success && response.data) {
        setAssessmentData(response.data);
      } else {
        setError(response?.message || 'Failed to load questions.');
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve assessment from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < (assessmentData?.questions?.length || 0) - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const questions = assessmentData?.questions || [];
    const formattedAnswers = questions.map((q) => ({
      questionId: q.questionId,
      selectedOptionId: answers[q.questionId] || '',
    }));

    // Check if any unanswered
    const unansweredCount = formattedAnswers.filter((a) => !a.selectedOptionId).length;
    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await assessmentApi.submitAssessment(moduleId, formattedAnswers);
      if (response?.success && response.data) {
        // Navigate to result page with server response
        navigate('/assessment/result', {
          state: {
            result: response.data,
            message: response.message,
          },
          replace: true,
        });
      } else {
        setError(response?.message || 'Submission failed.');
      }
    } catch (err) {
      setError(err.message || 'Server failed to process submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving localized safety evaluation questions..." />;
  }

  const questions = assessmentData?.questions || [];
  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const isLast = currentIndex === totalQ - 1;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {moduleId}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Safety Competency Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Passing threshold: {assessmentData?.passingScorePercentage || 75}% • Answered: {answeredCount}/{totalQ}
          </p>
        </div>

        {/* Multilingual Selector */}
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-slate-400" />
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                  lang === l.code
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={l.label}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-1">
        <ProgressBar
          progress={totalQ > 0 ? ((currentIndex + 1) / totalQ) * 100 : 0}
          label={`Question ${currentIndex + 1} of ${totalQ}`}
          showPercentage={false}
          color="amber"
          size="sm"
        />
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Current Question Display */}
      {currentQ ? (
        <AssessmentQuestion
          question={currentQ}
          index={currentIndex}
          total={totalQ}
          selectedOptionId={answers[currentQ.questionId]}
          onSelectOption={handleSelectOption}
        />
      ) : (
        <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
          No questions available.
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentIndex === 0 || submitting}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          {questions.map((q, idx) => (
            <span
              key={q.questionId}
              onClick={() => setCurrentIndex(idx)}
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] cursor-pointer transition-colors ${
                idx === currentIndex
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                  : answers[q.questionId]
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </span>
          ))}
        </div>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <span>Grading...</span>
            ) : (
              <>
                <span>Submit Assessment</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bottom Advice */}
      <div className="text-center text-xs text-slate-400 pt-4">
        Official scores and certificate qualification are calculated exclusively by the backend scoring engine.
      </div>
    </div>
  );
};

export default Assessment;
