import React from 'react';
import { AlertTriangle, XCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, title = 'Error Encountered' }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-5 my-4 text-red-900 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 text-sm">{title}</h4>
          <p className="text-sm text-red-700 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 hover:bg-red-200 text-red-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
