import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, AlertTriangle, ArrowRight, Award } from 'lucide-react';
import ProgressBar from './ProgressBar';

const ModuleCard = ({ module, progress, certificate }) => {
  const isCertified = Boolean(certificate && certificate.status === 'valid');
  const percentage = progress?.percentageProgress || 0;
  const status = isCertified ? 'CERTIFIED' : (progress?.status || 'NOT_STARTED');

  const statusBadge = () => {
    switch (status) {
      case 'CERTIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Award className="w-3.5 h-3.5" /> Certified
          </span>
        );
      case 'SIMULATION_COMPLETED':
      case 'ASSESSMENT_COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Ready for Assessment
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:border-slate-300 transition-all">
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-700 tracking-wider">
              {module.moduleId || 'SPACE_HAZARD'}
            </span>
            {statusBadge()}
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {module.title || 'Confined Space & Space Hazard Safety'}
          </h3>

          <p className="text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
            {module.description}
          </p>

          <div className="grid grid-cols-2 gap-3 my-5 py-3 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>{module.arScenarioConfig?.targetHazardsCount || 5}</strong> Critical Hazards
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                <strong>{Math.round((module.arScenarioConfig?.timeLimitSeconds || 300) / 60)}</strong> Mins Training
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4">
            <ProgressBar
              progress={isCertified ? 100 : percentage}
              label="Simulation Progress"
              color={isCertified ? 'emerald' : 'amber'}
            />
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/modules/${module.moduleId || 'SPACE_HAZARD'}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>{isCertified ? 'Review Training' : percentage > 0 ? 'Continue Training' : 'Start Training'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isCertified && certificate && (
              <Link
                to={`/certificates/${certificate.certificateId}`}
                className="inline-flex items-center justify-center p-2.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                title="View Earned Certificate"
              >
                <Award className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
