import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

const AssessmentResult = () => {
  const location = useLocation();
  const result = location.state?.result;
  const message = location.state?.message;

  // If no result in history state, redirect back to dashboard
  if (!result) {
    return <Navigate to="/dashboard" replace />;
  }

  const {
    moduleId = 'SPACE_HAZARD',
    scorePercentage = 0,
    passingScorePercentage = 75,
    passed = false,
    earnedPoints = 0,
    totalPoints = 100,
    certificate,
    answerBreakdown = [],
  } = result;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Result Status Banner */}
      <div
        className={`rounded-2xl border p-8 text-center shadow-lg ${
          passed
            ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200'
            : 'bg-gradient-to-b from-red-50 to-white border-red-200'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {passed ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
            passed
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {passed ? 'Assessment Passed' : 'Assessment Not Passed'}
        </span>

        <h1 className="text-3xl font-black text-slate-900">
          {scorePercentage}%
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          {earnedPoints} of {totalPoints} Points Earned (Passing Required: {passingScorePercentage}%)
        </p>

        <p className="text-sm text-slate-700 max-w-md mx-auto mt-4 leading-relaxed">
          {message ||
            (passed
              ? 'Congratulations! You have demonstrated high proficiency in confined space safety procedures and earned your certification.'
              : 'You did not meet the 75% passing threshold required for regulatory safety compliance. Review the curriculum and retry.')}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {passed && certificate ? (
            <>
              <Link
                to={`/certificates/${certificate.certificateId}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View Official Certificate</span>
              </Link>
              <Link
                to={`/verify/${certificate.certificateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Verify Credential</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/assessment/${moduleId}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Safety Assessment</span>
              </Link>
              <Link
                to={`/modules/${moduleId}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Review Curriculum</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Answer Breakdown with Explanations */}
      {answerBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Evaluation Breakdown & Explanations
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {answerBreakdown.filter((a) => a.correct).length} of {answerBreakdown.length} Correct
            </span>
          </div>

          <div className="space-y-3">
            {answerBreakdown.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs ${
                  item.correct
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-red-50/40 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5 ${
                      item.correct
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {item.correct ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>
                  <div className="space-y-1">
                    <div className="font-bold text-slate-800">
                      Question {idx + 1} ({item.questionId})
                    </div>
                    <div className="text-slate-600">
                      Your Selected Answer:{' '}
                      <span className="font-mono font-bold text-slate-800">
                        {item.selectedOptionId || 'Not Answered'}
                      </span>
                    </div>
                    {item.explanation && (
                      <p className="text-slate-700 italic pt-1 border-t border-slate-100/80">
                        💡 Regulatory Explanation: {item.explanation}
                      </p>
                    )}
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold self-start sm:self-auto shrink-0 ${
                    item.correct
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.correct ? 'Correct (+20 Pts)' : 'Incorrect (0 Pts)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentResult;
