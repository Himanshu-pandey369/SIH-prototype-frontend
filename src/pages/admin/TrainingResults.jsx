import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { formatDate } from '../../utils/formatDate';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';

const TrainingResults = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulations, setSimulations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.getDashboardStats();
      if (response?.success && response.data) {
        setSimulations(response.data.recentSimulations || []);
      } else {
        setError(response?.message || 'Failed to load simulation logs.');
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve simulation logs.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving AR simulation operational records..." />;
  }

  const filtered = simulations.filter((sim) => {
    const workerName = sim.userId?.name || '';
    const email = sim.userId?.email || '';
    const mod = sim.moduleId || '';
    return (
      workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            AR Simulation Telemetry & Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Physical simulation records transmitted from Android Unity AR training sessions
          </p>
        </div>

        <button
          onClick={fetchSimulations}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh</span>
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchSimulations} />}

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search worker or module..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>
      </div>

      {/* Logs Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No Simulation Logs Available"
          description="Simulation records will appear here as workers complete their Android AR runs."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Worker</th>
                  <th className="px-6 py-3.5">Module</th>
                  <th className="px-6 py-3.5">Hazards Identified</th>
                  <th className="px-6 py-3.5">Time Taken</th>
                  <th className="px-6 py-3.5">Safety Violations</th>
                  <th className="px-6 py-3.5">Notes</th>
                  <th className="px-6 py-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((sim, idx) => (
                  <tr key={sim._id || idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{sim.userId?.name || 'Worker'}</div>
                      <div className="font-mono text-[11px] text-slate-400">{sim.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-amber-700">
                      {sim.moduleId || 'SPACE_HAZARD'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">
                        {sim.hazardsIdentified}
                      </span>
                      <span className="text-slate-400"> / {sim.totalHazards || 5}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {sim.timeTakenSeconds ? `${sim.timeTakenSeconds}s` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {sim.safetyViolations?.length > 0 ? (
                        <span className="text-red-600 font-bold">
                          {sim.safetyViolations.length} Violations
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">None (Clean Run)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                      {sim.notes || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(sim.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingResults;
