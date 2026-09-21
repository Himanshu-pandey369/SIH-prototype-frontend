import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Activity,
  Award,
  ShieldCheck,
  Building2,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { formatDate } from '../../utils/formatDate';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getDashboardStats();
      if (response?.success && response.data) {
        setStats(response.data);
      } else {
        setError(response?.message || 'Failed to fetch admin stats.');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to administrative metrics service.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Compiling safety analytics & operational telemetry..." />;
  }

  const { summary, moduleMetrics, industryBreakdown = {}, recentCertificates = [], recentSimulations = [] } = stats || {};

  // Compute total industry count for percentage calculation
  const totalIndustryWorkers = Object.values(industryBreakdown).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
            System Administration Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Safety Training Operations & Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Prototype: <span className="font-mono font-bold text-slate-700">SPACE_HAZARD</span> • Confined Space Regulations
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchStats} />}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Workers"
          value={summary?.totalWorkers || 0}
          subtitle="Enrolled workforce"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="AR Simulations Completed"
          value={summary?.totalSimulations || 0}
          subtitle="Interactive runs"
          icon={Activity}
          color="amber"
        />
        <StatCard
          title="Valid Certificates"
          value={summary?.totalCertificates || 0}
          subtitle="QR verifiable"
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Active Modules"
          value="1"
          subtitle="SPACE_HAZARD (SIH 2026)"
          icon={ShieldCheck}
          color="slate"
        />
      </div>

      {/* Middle Row: Module Metrics & Industry Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Performance Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {moduleMetrics?.moduleId || 'SPACE_HAZARD'}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Single Active Prototype
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {moduleMetrics?.title || 'Confined Space & Space Hazard Safety'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Industrial compliance tracking for atmospheric hazard testing (O2 deficiency, H2S, CO), forced ventilation, LOTO, and emergency rescue retrievals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 block">Total Certified</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {moduleMetrics?.totalCertifiedWorkers || 0}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 block">Avg Passing Score</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">
                {moduleMetrics?.averagePassingScore || 0}%
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 block">Pass Threshold</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">
                75%
              </span>
            </div>
          </div>
        </div>

        {/* Industry Sector Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                Workforce by Industry
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Industrial sectors participating in AR training
            </p>
          </div>

          <div className="space-y-4 my-6">
            {Object.entries(industryBreakdown).map(([ind, count]) => {
              const pct = Math.round((count / totalIndustryWorkers) * 100);
              return (
                <div key={ind} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="capitalize">{ind}</span>
                    <span>{count} workers ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/admin/workers"
            className="w-full text-center py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
          >
            <span>View All Workers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom Tables: Recent Certificates & Recent Simulations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Certificates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Recent Certificates Issued
            </h3>
            <Link
              to="/admin/certificates"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-x-auto">
            {recentCertificates.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No certificates issued yet.
              </div>
            ) : (
              recentCertificates.map((cert) => (
                <div key={cert.certificateId} className="p-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-500">
                      {cert.certificateId}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-0.5">{cert.workerName}</h4>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(cert.issueDate)} • Score: <strong className="text-emerald-600">{cert.scorePercentage}%</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
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
                      className="p-1 rounded text-slate-400 hover:text-slate-600"
                      title="Open Public QR Verification"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent AR Simulations */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Recent AR Simulations
            </h3>
            <Link
              to="/admin/results"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              View All Logs
            </Link>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-x-auto">
            {recentSimulations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No AR simulation logs recorded yet.
              </div>
            ) : (
              recentSimulations.map((sim, idx) => (
                <div key={sim._id || idx} className="p-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-amber-700">
                      {sim.moduleId || 'SPACE_HAZARD'}
                    </span>
                    <h4 className="font-bold text-slate-900 mt-0.5">
                      {sim.userId?.name || 'Worker'}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Time: {sim.timeTakenSeconds || 0}s • Hazards Found: {sim.hazardsIdentified || 0}/{sim.totalHazards || 5}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Completed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
