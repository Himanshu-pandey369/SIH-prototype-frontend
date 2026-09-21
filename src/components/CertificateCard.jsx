import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, XCircle, ExternalLink, Calendar, Shield } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import { formatScore } from '../utils/formatScore';

const CertificateCard = ({ certificate }) => {
  const isValid = certificate.status === 'valid';
  const scoreInfo = formatScore(certificate.scorePercentage);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all overflow-hidden flex flex-col justify-between">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isValid ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono text-slate-500 font-medium">
                {certificate.certificateId}
              </span>
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {certificate.moduleTitle || 'Space Hazard Safety'}
              </h4>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isValid
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isValid ? (
              <>
                <CheckCircle2 className="w-3 h-3" /> Valid
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" /> Revoked
              </>
            )}
          </span>
        </div>
      </div>

      <div className="p-5 bg-slate-50/50 space-y-2.5 text-xs text-slate-600">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Certified Worker:</span>
          <span className="font-semibold text-slate-800">{certificate.workerName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Assessment Score:</span>
          <span className={`font-bold ${scoreInfo.textColor}`}>{certificate.scorePercentage}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Issue Date:
          </span>
          <span className="font-medium text-slate-700">{formatDate(certificate.issueDate)}</span>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
        <Link
          to={`/certificates/${certificate.certificateId}`}
          className="flex-1 text-center px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
        >
          View Certificate
        </Link>
        <Link
          to={`/verify/${certificate.certificateId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          title="Open Public QR Verification"
        >
          <span>Verify</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>
      </div>
    </div>
  );
};

export default CertificateCard;
