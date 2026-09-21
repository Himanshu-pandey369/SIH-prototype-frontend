import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Award, ExternalLink } from 'lucide-react';
import { certificateApi } from '../../services/certificateApi';
import CertificatePreview from '../../components/CertificatePreview';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const CertificateDetail = () => {
  const { certificateId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    fetchCert();
  }, [certificateId]);

  const fetchCert = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await certificateApi.getCertificateById(certificateId);
      if (response?.success && response.data) {
        setCertificate(response.data);
      } else {
        setError(response?.message || 'Certificate not found.');
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve certificate details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Rendering security certificate..." />;
  }

  if (error || !certificate) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <ErrorMessage
          title="Certificate Error"
          message={error || 'The requested certificate was not found.'}
          onRetry={fetchCert}
        />
        <div className="mt-4">
          <Link
            to="/certificates"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Certificates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button (hidden in print) */}
      <div className="flex items-center justify-between no-print max-w-4xl mx-auto">
        <Link
          to="/certificates"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certificates
        </Link>

        <Link
          to={`/verify/${certificate.certificateId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
        >
          <span>Open Public Verification Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <CertificatePreview certificate={certificate} />
    </div>
  );
};

export default CertificateDetail;
