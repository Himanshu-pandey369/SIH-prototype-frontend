import React from 'react';
import { Check } from 'lucide-react';

const AssessmentQuestion = ({
  question,
  index,
  total,
  selectedOptionId,
  onSelectOption,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
          Question {index + 1} of {total}
        </span>
        <span className="text-xs font-semibold text-slate-500">
          {question.points || 20} Points
        </span>
      </div>

      <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6 leading-relaxed">
        {question.questionText}
      </h3>

      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.optionId;

          return (
            <button
              key={opt.optionId}
              type="button"
              onClick={() => onSelectOption(question.questionId, opt.optionId)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-500'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : opt.optionId}
              </div>

              <div className="flex-1 text-sm md:text-base text-slate-800 pt-0.5 leading-normal">
                {opt.text}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentQuestion;
