import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  Languages,
  Calendar,
  Award,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const WorkerDetails = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [worker, setWorker] = useState(null);
  const [workerCertificates, setWorkerCertificates] = useState([]);

  useEffect(() => {
    fetchWorkerData();
  }, [id]);

  const fetchWorkerData = async () => {
    setLoading(true);
    setError('');
    try {
      const [workersRes, certsRes] = await Promise.all([
        adminApi.getAllWorkers(),
        adminApi.getAllCertificates(),
      ]);

      if (workersRes?.success) {
        const found = workersRes.data.find((w) => w._id === id);
        if (found) {
          setWorker(found);
        } else {
          setError('Worker record not found.');
        }
      }

      if (certsRes?.success) {
        // Filter certificates issued to this worker by name or userId
        const certs = certsRes.data.filter(
          (c) => c.userId === id || (worker && c.workerName === worker.name)
        );
        setWorkerCertificates(certs);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve worker record.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving worker profile & certificate records..." />;
  }

  if (error || !worker) {
    return (
      <div className="space-y-4 max-w-xl mx-auto py-8">
        <ErrorMessage message={error || 'Worker record not found.'} onRetry={fetchWorkerData} />
        <Link
          to="/admin/workers"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Workers Roster
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link
        to="/admin/workers"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Workers Roster
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
            {worker.name?.charAt(0) || 'W'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{worker.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {worker.role}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {worker._id}
              </span>
            </div>
          </div>
        </div>

        {/* Worker Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5" /> Email
            </span>
            <p className="font-mono font-medium text-slate-800">{worker.email}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5" /> Industry Sector
            </span>
            <p className="font-semibold text-slate-800 capitalize">{worker.industry || 'mining'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Languages className="w-3.5 h-3.5" /> Preferred Language
            </span>
            <p className="font-semibold text-slate-800 uppercase">{worker.preferredLanguage || 'en'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Registered On
            </span>
            <p className="font-medium text-slate-800">{formatDate(worker.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Issued Certificates Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Safety Certificates Issued to Worker
        </h3>

        {workerCertificates.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 italic">
            This worker has not yet completed and passed a training evaluation for certification.
          </p>
        ) : (
          <div className="space-y-3">
            {workerCertificates.map((cert) => (
              <div
                key={cert.certificateId}
                className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-slate-500">{cert.certificateId}</span>
                  <h4 className="font-bold text-slate-900 mt-0.5">{cert.moduleTitle}</h4>
                  <span className="text-slate-500">
                    Issued: {formatDate(cert.issueDate)} • Score: <strong className="text-emerald-600">{cert.scorePercentage}%</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      cert.status === 'valid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {cert.status}
                  </span>
                  <Link
                    to={`/verify/${cert.certificateId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDetails;
