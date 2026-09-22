import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Calendar,
  Award,
  ArrowLeft,
  QrCode,
  Building2,
} from 'lucide-react';
import { certificateApi } from '../../services/certificateApi';
import { formatDate } from '../../utils/formatDate';
import { getVerificationUrl, generateQRCodeDataUrl } from '../../utils/qrHelper';
import LoadingSpinner from '../../components/LoadingSpinner';

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [dynamicQrUrl, setDynamicQrUrl] = useState('');
  const [errorStatus, setErrorStatus] = useState(null); // 'not_found' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState(certificateId || '');

  useEffect(() => {
    if (certificateId && certificateId !== 'demo') {
      verifyId(certificateId);
    } else {
      setCertData(null);
      setErrorStatus(null);
    }
  }, [certificateId]);

  useEffect(() => {
    if (certData?.certificateId) {
      const url = getVerificationUrl(certData.certificateId);
      generateQRCodeDataUrl(url).then((qr) => {
        if (qr) setDynamicQrUrl(qr);
      });
    }
  }, [certData]);

  const verifyId = async (id) => {
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage('');
    setCertData(null);
    setDynamicQrUrl('');

    try {
      const response = await certificateApi.verifyCertificate(id.trim().toUpperCase());
      if (response?.success && response.data) {
        setCertData(response.data);
      } else {
        setErrorStatus('not_found');
        setErrorMessage(response?.message || 'Certificate not found.');
      }
    } catch (err) {
      setErrorStatus('not_found');
      setErrorMessage(err.message || 'Certificate record was not found in the national safety ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/verify/${searchQuery.trim().toUpperCase()}`);
    }
  };

  const isValid = certData?.status === 'valid';
  const isRevoked = certData?.status === 'revoked';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 mb-3">
          <QrCode className="w-5 h-5 text-amber-600" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Public Verification Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Industrial Safety Certificate Verification
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Verify authentic AR competency credentials issued by the AI Safe platform for DGMS & industrial safety compliance.
        </p>

        {/* Certificate Lookup Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. SURAKSHA-SPACE-2026-0001"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Search className="w-4 h-4" /> Verify
          </button>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <LoadingSpinner text="Querying digital safety ledger..." />
        </div>
      )}

      {/* Not Found / Error State */}
      {!loading && errorStatus && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 md:p-12 text-center shadow-sm max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Certificate Not Found</h2>
          <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
            The certificate ID <span className="font-mono font-bold text-red-600">{certificateId}</span> could not be verified. It may be invalid, misspelled, or forged.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center gap-4">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to AI Safe Home
            </Link>
          </div>
        </div>
      )}

      {/* Initial state (no search yet) */}
      {!loading && !errorStatus && !certData && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500 max-w-xl mx-auto">
          <QrCode className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-medium text-slate-700">Scan QR Code or Search Certificate ID</p>
          <p className="text-xs text-slate-400 mt-1">
            Examiners can point their mobile camera at the printed certificate QR code to land directly on this verification result.
          </p>
        </div>
      )}

      {/* Success Result Display */}
      {!loading && certData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-200">
          {/* Status Banner */}
          <div
            className={`p-6 md:p-8 text-white ${
              isValid
                ? 'bg-emerald-700'
                : 'bg-red-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  {isValid ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-200" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-200" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/80">
                    Official Verification Result
                  </span>
                  <h2 className="text-2xl font-black text-white mt-0.5">
                    {isValid ? '✓ Certificate Valid & Verified' : '⚠ Certificate Revoked'}
                  </h2>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-white/70 block uppercase">Verification Status</span>
                <span className="text-sm font-mono font-extrabold uppercase px-2.5 py-1 rounded bg-white/20 text-white inline-block mt-1">
                  {certData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Certified Worker
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                    {certData.workerName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Industry Sector: <strong className="capitalize">{certData.industry || 'Mining'}</strong></span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Safety Training Module
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {certData.moduleTitle || 'Confined Space & Space Hazard Safety'}
                  </h4>
                  <span className="inline-block mt-1 text-xs font-mono font-bold text-slate-500">
                    Module ID: {certData.moduleId}
                  </span>
                </div>
              </div>

              {/* Right Side: Score, Issue Date, QR */}
              <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="grid grid-cols-2 gap-4 text-center pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Assessment Score
                    </span>
                    <p className="text-2xl font-black text-emerald-600 mt-1">
                      {certData.scorePercentage}%
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Issue Date
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-2 flex items-center justify-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(certData.issueDate)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                      Certificate Identifier
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {certData.certificateId}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Verified directly by AI Safe Distributed Ledger
                    </p>
                  </div>

                  {(dynamicQrUrl || certData.qrCodeDataUrl) && (
                    <div className="p-1 bg-white border border-slate-200 rounded shadow-sm shrink-0">
                      <img
                        src={dynamicQrUrl || certData.qrCodeDataUrl}
                        alt="Verification QR"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compliance Guarantee Footer */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-950">Verified by AI Safe National Training System</span>
                <p className="mt-0.5 text-amber-800">
                  This public verification confirms that the worker named above completed official AR hazard detection simulations and achieved competency under DGMS / OSHA standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
