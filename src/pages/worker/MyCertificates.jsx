import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldAlert, ArrowRight, RefreshCw } from 'lucide-react';
import { certificateApi } from '../../services/certificateApi';
import CertificateCard from '../../components/CertificateCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const MyCertificates = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await certificateApi.getMyCertificates();
      if (response?.success) {
        setCertificates(response.data || []);
      } else {
        setError(response?.message || 'Failed to fetch certificates.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to certificate registry.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving digital certificates..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            My Safety Credentials & Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official digital credentials issued upon passing industrial safety evaluations
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

      {/* Certificate Grid */}
      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No Certificates Earned Yet"
          description="Complete the Confined Space Safety AR training and achieve a score of 75% or higher on the assessment to earn your digital certification."
          actionText="Begin Space Hazard Training"
          onAction={() => (window.location.href = '/modules/SPACE_HAZARD')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.certificateId} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
