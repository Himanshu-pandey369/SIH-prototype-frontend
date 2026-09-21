import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';

const Certificates = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [certificates, setCertificates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Confirmation Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const [targetStatus, setTargetStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    setActionError('');
    try {
      const response = await adminApi.getAllCertificates();
      if (response?.success) {
        setCertificates(response.data || []);
      } else {
        setError(response?.message || 'Failed to fetch certificates.');
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve certificate registry.');
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (cert, status) => {
    setSelectedCert(cert);
    setTargetStatus(status);
    setActionError('');
    setModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedCert || !targetStatus) return;

    setUpdating(true);
    setActionError('');
    try {
      const response = await adminApi.updateCertificateStatus(
        selectedCert.certificateId,
        targetStatus
      );

      if (response?.success) {
        // Update local state directly
        setCertificates((prev) =>
          prev.map((c) =>
            c.certificateId === selectedCert.certificateId
              ? { ...c, status: targetStatus }
              : c
          )
        );
        setModalOpen(false);
      } else {
        setActionError(response?.message || 'Failed to update certificate status.');
      }
    } catch (err) {
      setActionError(err.message || 'Server error updating status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving digital certificates ledger..." />;
  }

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.certificateId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.workerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || cert.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Digital Safety Certificates Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit, inspect, revoke, or reinstate issued SURAKSHA digital credentials
          </p>
        </div>

        <button
          onClick={fetchCertificates}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchCertificates} />}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificate ID or worker..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 shrink-0">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            <option value="ALL">All Certificates</option>
            <option value="valid">Valid Only</option>
            <option value="revoked">Revoked Only</option>
          </select>
        </div>
      </div>

      {/* Certificates Table */}
      {filteredCertificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certificates Found"
          description="There are currently no certificates matching your filter or query."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Certificate ID</th>
                  <th className="px-6 py-3.5">Worker Name</th>
                  <th className="px-6 py-3.5">Module</th>
                  <th className="px-6 py-3.5">Score</th>
                  <th className="px-6 py-3.5">Issue Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCertificates.map((cert) => {
                  const isValid = cert.status === 'valid';

                  return (
                    <tr key={cert.certificateId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-900">
                        {cert.certificateId}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {cert.workerName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-slate-600 font-bold">
                          {cert.moduleId}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">
                        {cert.scorePercentage}%
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(cert.issueDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            isValid
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isValid ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isValid ? 'Valid' : 'Revoked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={`/verify/${cert.certificateId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px]"
                          title="Open Public QR Verification Page"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </Link>

                        {isValid ? (
                          <button
                            onClick={() => openStatusModal(cert, 'revoked')}
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[11px] transition-colors"
                          >
                            Revoke
                          </button>
                        ) : (
                          <button
                            onClick={() => openStatusModal(cert, 'valid')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] transition-colors"
                          >
                            Reinstate
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={targetStatus === 'revoked' ? 'Confirm Certificate Revocation' : 'Reinstate Certificate'}
      >
        <div className="space-y-4 text-xs text-slate-600">
          {actionError && <ErrorMessage message={actionError} />}

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p>
              Target Certificate ID: <strong className="font-mono text-slate-900">{selectedCert?.certificateId}</strong>
            </p>
            <p>
              Worker: <strong className="text-slate-900">{selectedCert?.workerName}</strong>
            </p>
            <p>
              Module: <strong className="text-slate-900">{selectedCert?.moduleTitle}</strong>
            </p>
          </div>

          {targetStatus === 'revoked' ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-900">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Revocation Warning</p>
                <p className="mt-0.5">
                  Revoking this certificate will immediately cause public QR scans to display a <strong>Certificate Revoked</strong> alert. This should only be used if safety violations or procedural fraud occurred.
                </p>
              </div>
            </div>
          ) : (
            <p>
              Are you sure you want to reinstate this certificate to <strong>VALID</strong> status? Public QR checks will report it as authentic.
            </p>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              onClick={() => setModalOpen(false)}
              disabled={updating}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              className={`px-4 py-2 rounded-lg text-white font-bold transition-colors ${
                targetStatus === 'revoked'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {updating ? 'Updating...' : targetStatus === 'revoked' ? 'Confirm Revoke' : 'Reinstate Certificate'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Certificates;
