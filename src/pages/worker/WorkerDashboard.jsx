import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Award,
  BarChart3,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { moduleApi } from '../../services/moduleApi';
import { progressApi } from '../../services/progressApi';
import { certificateApi } from '../../services/certificateApi';
import StatCard from '../../components/StatCard';
import ModuleCard from '../../components/ModuleCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const WorkerDashboard = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moduleData, setModuleData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [myCertificates, setMyCertificates] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch prototype active module SPACE_HAZARD
      const [modRes, progRes, certRes] = await Promise.all([
        moduleApi.getModuleByCode('SPACE_HAZARD'),
        progressApi.getModuleProgress('SPACE_HAZARD'),
        certificateApi.getMyCertificates(),
      ]);

      if (modRes?.success) {
        setModuleData(modRes.data);
      }
      if (progRes?.success) {
        setProgressData(progRes.data);
      }
      if (certRes?.success) {
        setMyCertificates(certRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading worker profile & safety metrics..." />;
  }

  // Calculate real metrics from backend data
  const validCerts = myCertificates.filter((c) => c.status === 'valid');
  const spaceCert = validCerts.find((c) => c.moduleId === 'SPACE_HAZARD');
  const completedCount = validCerts.length;
  const avgScore =
    validCerts.length > 0
      ? Math.round(validCerts.reduce((acc, c) => acc + c.scorePercentage, 0) / validCerts.length)
      : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
            Industrial Worker Portal
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Industry: <span className="font-semibold text-slate-700 capitalize">{user?.industry || 'Mining'}</span> • Language: <span className="font-semibold text-slate-700 uppercase">{user?.preferredLanguage || 'en'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {spaceCert ? (
            <Link
              to={`/certificates/${spaceCert.certificateId}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs shadow-sm transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>View Credential ({spaceCert.certificateId})</span>
            </Link>
          ) : (
            <Link
              to="/modules/SPACE_HAZARD"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-xs shadow-sm transition-colors"
            >
              <span>Resume AR Training</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDashboardData} />}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Modules"
          value="1"
          subtitle="Confined Space Prototype"
          icon={Layers}
          color="blue"
        />
        <StatCard
          title="Certified Modules"
          value={completedCount.toString()}
          subtitle="Assessments Passed"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Average Score"
          value={avgScore > 0 ? `${avgScore}%` : '—'}
          subtitle="Across Evaluations"
          icon={BarChart3}
          color="amber"
        />
        <StatCard
          title="Valid Certificates"
          value={validCerts.length.toString()}
          subtitle="QR Verifiable"
          icon={Award}
          color="slate"
        />
      </div>

      {/* Current Active Training Module */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">
              Current Assigned Training Module
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Prototype Scope: 1 Module
          </span>
        </div>

        {moduleData ? (
          <ModuleCard
            module={moduleData}
            progress={progressData}
            certificate={spaceCert}
          />
        ) : (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
            No module data available.
          </div>
        )}
      </div>

      {/* AR Training Simulation Guidance Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Augmented Reality Device Synchronization
            </span>
            <h3 className="text-xl font-bold text-white">
              AI Safe Android AR Simulation
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Open the AI Safe mobile application on your Android AR device. Complete the physical inspection checklists, gas detector checks, and safety harness verification before returning to this web terminal for final certification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/modules/SPACE_HAZARD"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors text-center"
            >
              Curriculum Checklist
            </Link>
            <Link
              to="/assessment/SPACE_HAZARD"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Take Safety Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
