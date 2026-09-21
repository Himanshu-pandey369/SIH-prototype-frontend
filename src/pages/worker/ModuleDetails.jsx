import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Smartphone,
  CheckSquare,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { moduleApi } from '../../services/moduleApi';
import { progressApi } from '../../services/progressApi';
import { certificateApi } from '../../services/certificateApi';
import ProgressBar from '../../components/ProgressBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Modal from '../../components/Modal';

const SCENARIO_STEPS = [
  {
    stepKey: 'PPE_INSPECTION',
    hazardKey: 'DEFECTIVE_HARNESS',
    title: '1. Personal Protective Equipment (PPE) Check',
    desc: 'Verify multi-gas detector calibration, full-body retrieval harness, and safety lifeline.',
  },
  {
    stepKey: 'ATMOSPHERIC_O2_CHECK',
    hazardKey: 'O2_DEFICIENCY_DETECTED',
    title: '2. Atmospheric Oxygen Concentration Testing',
    desc: 'Measure initial oxygen concentration. Minimum safe baseline is 19.5% by volume.',
  },
  {
    stepKey: 'TOXIC_GAS_TEST',
    hazardKey: 'H2S_CO_ACCUMULATION',
    title: '3. Flammable & Toxic Contaminant Testing',
    desc: 'Verify zero detectable accumulation of Hydrogen Sulfide (H2S) and Carbon Monoxide (CO).',
  },
  {
    stepKey: 'VENTILATION_SETUP',
    hazardKey: 'UNVENTILATED_POCKETS',
    title: '4. Continuous Forced Mechanical Ventilation',
    desc: 'Deploy positive-pressure air duct fans continuously before and during human entry.',
  },
  {
    stepKey: 'LOTO_AND_ENTRY_DECISION',
    hazardKey: 'LIVE_ELECTRICAL_PNEUMATIC',
    title: '5. Lockout/Tagout (LOTO) & Standby Attendant',
    desc: 'Isolate upstream valves and electrical switches. Position standby attendant at exterior.',
  },
];

const ModuleDetails = () => {
  const { moduleId = 'SPACE_HAZARD' } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [module, setModule] = useState(null);
  const [progress, setProgressData] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const [arModalOpen, setArModalOpen] = useState(false);
  const [updatingStep, setUpdatingStep] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [moduleId]);

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const [modRes, progRes, certRes] = await Promise.all([
        moduleApi.getModuleByCode(moduleId),
        progressApi.getModuleProgress(moduleId),
        certificateApi.getMyCertificates(),
      ]);

      if (modRes?.success) setModule(modRes.data);
      if (progRes?.success) setProgressData(progRes.data);
      if (certRes?.success) {
        const found = certRes.data.find(
          (c) => c.moduleId === moduleId && c.status === 'valid'
        );
        setCertificate(found || null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load module details.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to complete a step (communicates with backend /progress/step)
  const handleCompleteStep = async (stepKey, hazardKey) => {
    setUpdatingStep(true);
    try {
      const response = await progressApi.updateStepProgress({
        moduleId,
        stepKey,
        hazardKey,
      });
      if (response?.success) {
        setProgressData(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to record step progress.');
    } finally {
      setUpdatingStep(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving module curriculum & progress..." />;
  }

  if (!module) {
    return (
      <ErrorMessage
        title="Module Not Found"
        message={`The training module '${moduleId}' could not be located.`}
      />
    );
  }

  const completedStepsList = progress?.completedSteps || [];
  const isCertified = Boolean(certificate);
  const percentage = isCertified ? 100 : (progress?.percentageProgress || 0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <Link to="/dashboard" className="hover:text-slate-800">
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-800">{module.moduleId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {module.title}
          </h1>
        </div>

        {isCertified ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Award className="w-4 h-4" /> Certified Safe
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-4 h-4" /> Pass Target: {module.passingScorePercentage}%
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchDetails} />}

      {/* Overview & Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
              Module Curriculum Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {module.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">Critical Hazards</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                  {module.arScenarioConfig?.targetHazardsCount || 5} Hazards
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 block">AR Time Limit</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                  {Math.round((module.arScenarioConfig?.timeLimitSeconds || 300) / 60)} Minutes
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-xs text-slate-500 block">Languages</span>
                <span className="text-sm font-bold text-amber-600 mt-1 block">
                  EN • HI • SAT
                </span>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Key Safety Competencies
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Atmospheric Oxygen:</strong> Detect and prevent entry below 19.5% safe concentration.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Testing Order:</strong> Correct testing protocol: Oxygen first, Flammables second, Toxics third.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Continuous Ventilation:</strong> Positive-pressure mechanical blowers must run throughout entry.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Lockout/Tagout:</strong> Complete isolation of electrical, hydraulic, and chemical conduits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Non-Entry Retrieval:</strong> Standby attendants must never enter unprotected; initiate winch retrieval.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Sidebar: Progress & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Training Progress
              </h3>
              <p className="text-xs text-slate-500">
                {completedStepsList.length} of {SCENARIO_STEPS.length} AR scenario milestones verified
              </p>
            </div>

            <ProgressBar
              progress={percentage}
              color={isCertified ? 'emerald' : 'amber'}
              size="lg"
            />

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setArModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Start AR Training (Android)</span>
              </button>

              <Link
                to={`/assessment/${moduleId}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Take Safety Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {isCertified && certificate && (
                <Link
                  to={`/certificates/${certificate.certificateId}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>View Earned Certificate</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AR Scenario Checklist Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              AR Simulation Milestones & Checklist
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These steps are recorded when completed in Unity AR or marked below for review.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
            Scene: {module.arScenarioConfig?.sceneName || 'SpaceHazardMineLevel1'}
          </span>
        </div>

        <div className="space-y-3">
          {SCENARIO_STEPS.map((step, idx) => {
            const isDone = completedStepsList.includes(step.stepKey);

            return (
              <div
                key={step.stepKey}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{step.desc}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono text-slate-400">
                      Hazard Tag: {step.hazardKey}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCompleteStep(step.stepKey, step.hazardKey)}
                      disabled={updatingStep}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AR Training Instructions Modal */}
      <Modal
        isOpen={arModalOpen}
        onClose={() => setArModalOpen(false)}
        title="Augmented Reality Training Instructions"
      >
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <Smartphone className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <span className="font-bold block text-sm">Open the AI Safe Android AR Application</span>
              <p>
                The augmented reality training experience is developed separately in Unity for Android devices with ARCore support.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900">How to proceed:</h4>
            <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
              <li>Launch the <strong>AI Safe Android app</strong> on your mobile device or AR headset.</li>
              <li>Scan your physical confined space doorway or hazard testing plane.</li>
              <li>Complete the 5 scenario tasks (O2 sensor check, ventilation deployment, LOTO).</li>
              <li>The simulation results will sync automatically back to your worker profile.</li>
              <li>Return to this web dashboard and click <strong>Take Safety Assessment</strong>.</li>
            </ol>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              onClick={() => setArModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModuleDetails;
