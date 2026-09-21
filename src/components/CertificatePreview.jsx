import React from 'react';
import { Award, CheckCircle2, XCircle, Printer, Shield, ShieldCheck } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

const CertificatePreview = ({ certificate, onPrint }) => {
  if (!certificate) return null;

  const isValid = certificate.status === 'valid';

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Action Bar (hidden in print) */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4 no-print">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Official Industrial Safety Credential</span>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Main Certificate Sheet */}
      <div className="print-certificate-container w-full max-w-4xl bg-white border-8 border-slate-900 p-8 md:p-12 shadow-2xl rounded-sm relative overflow-hidden text-slate-900">
        {/* Inner Ornamental Border */}
        <div className="border-2 border-amber-500/80 p-6 md:p-8 relative bg-gradient-to-b from-amber-50/20 via-white to-amber-50/20">
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Shield className="w-96 h-96" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-md bg-amber-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-wider uppercase text-slate-900">
                AI SAFE
              </span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              National Industrial Safety & Augmented Reality Training Council
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-4 tracking-tight uppercase">
              Certificate of Safety Training
            </h1>
            <p className="text-xs text-amber-700 font-semibold tracking-wider mt-1 uppercase">
              Confined Space & Hazardous Operations Competency
            </p>
          </div>

          {/* Recipient Presentation */}
          <div className="text-center my-8">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">
              This is to officially certify that
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-2 font-serif tracking-normal underline decoration-amber-500/50 decoration-2 underline-offset-8">
              {certificate.workerName}
            </h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
              has successfully completed all rigorous AR simulation procedures, hazard detection protocols, atmospheric gas testing, and passed the official safety evaluation for:
            </p>
            <h3 className="text-lg md:text-xl font-black text-slate-800 mt-3 uppercase tracking-wide">
              {certificate.moduleTitle || 'Confined Space & Space Hazard Safety'}
            </h3>
            <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-700 font-mono text-xs font-bold rounded">
              Sector: {certificate.industry ? certificate.industry.toUpperCase() : 'HEAVY INDUSTRY'}
            </span>
          </div>

          {/* Performance & Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 my-6 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluation Score</span>
              <span className="text-lg md:text-xl font-extrabold text-emerald-600">{certificate.scorePercentage}%</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issue Date</span>
              <span className="text-xs md:text-sm font-bold text-slate-800">{formatDate(certificate.issueDate)}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
              <span className={`inline-flex items-center gap-1 text-xs md:text-sm font-extrabold ${isValid ? 'text-emerald-700' : 'text-red-700'}`}>
                {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {isValid ? 'VALID' : 'REVOKED'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module Code</span>
              <span className="text-xs md:text-sm font-mono font-bold text-slate-800">{certificate.moduleId}</span>
            </div>
          </div>

          {/* Verification & Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left: Authorized Signature */}
            <div className="text-center md:text-left">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center md:justify-start pb-1">
                <span className="font-serif italic text-sm text-slate-700 font-bold">Suraksha Safety Board</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mt-1">Director of Safety Operations</p>
              <p className="text-[9px] text-slate-400">AI Safe AR Certification Division</p>
            </div>

            {/* Center: Base64 QR Code */}
            <div className="flex flex-col items-center justify-center text-center">
              {certificate.qrCodeDataUrl ? (
                <div className="p-1.5 bg-white border border-slate-300 rounded shadow-sm">
                  <img
                    src={certificate.qrCodeDataUrl}
                    alt={`QR Verification for ${certificate.certificateId}`}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                  QR Code
                </div>
              )}
              <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">
                Scan to Verify Credential
              </span>
            </div>

            {/* Right: Certificate Identifier & Seal */}
            <div className="text-center md:text-right">
              <div className="h-10 border-b border-slate-400 flex items-end justify-center md:justify-end pb-1">
                <span className="font-mono text-xs font-bold text-slate-800">{certificate.certificateId}</span>
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 mt-1">Digital Certificate ID</p>
              <p className="text-[9px] text-slate-400 font-mono">
                {window.location.origin}/verify/{certificate.certificateId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
