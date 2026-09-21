import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  QrCode,
  WifiOff,
  Flame,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Users,
  Search,
  Check,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LANGUAGES } from '../../utils/constants';

const Landing = () => {
  const { isAuthenticated, isWorker, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [certSearchId, setCertSearchId] = useState('');

  const handleVerifySearch = (e) => {
    e.preventDefault();
    if (certSearchId.trim()) {
      navigate(`/verify/${certSearchId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 md:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              SIH 2026 Prototype • Industrial AR Training
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              AI SAFE
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-amber-400">
              AR-Based Industrial Safety Training & Certification
            </p>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Interactive augmented reality simulations and verifiable digital certification designed for workers in high-risk mining, steel, and mica operations.
            </p>

            {/* Highlights Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium text-slate-300">
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> AR Simulation
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Server-Side Scoring
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Digital Certificates
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Instant QR Verification
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Offline Sync Architecture
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Go to {isAdmin ? 'Admin Portal' : 'Training Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Start Training</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}

              {/* Instant Verification Search */}
              <form onSubmit={handleVerifySearch} className="w-full sm:w-auto flex items-center">
                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={certSearchId}
                    onChange={(e) => setCertSearchId(e.target.value)}
                    placeholder="Enter Certificate ID..."
                    className="w-full pl-3 pr-24 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    Verify
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Prototype Module */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Active Prototype Training Module
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Confined Space & Space Hazard Safety
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Module Code: <span className="font-mono font-bold text-slate-800">SPACE_HAZARD</span>. Focuses on safe entry procedures, atmospheric hazards, and life-critical rescue decisions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                DGMS & OSHA Regulatory Standards
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Core Safety Competencies
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Industrial workers practice dangerous confined space tasks in a safe augmented reality simulation on Android devices before taking a strict multilingual competency assessment.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: '1. Hazard Identification', desc: 'Identify oxygen depletion (< 19.5%) and deadly buildup of Hydrogen Sulfide (H2S) & Carbon Monoxide.' },
                  { title: '2. PPE Identification', desc: 'Verify 4-gas atmospheric monitors, full-body retrieval harness, self-contained breathing apparatus.' },
                  { title: '3. Atmosphere / Gas Safety', desc: 'Enforce testing sequence: Oxygen content first, then flammable vapors, followed by toxic gases.' },
                  { title: '4. Buddy System & Attendant', desc: 'Establish continuous exterior standby attendant communication and emergency winch retrieval.' },
                  { title: '5. Safe Entry Decision (LOTO)', desc: 'Isolate electrical and mechanical energy sources (Lockout/Tagout) before granting entry permit.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 sm:p-8 text-white border border-slate-800 space-y-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500 text-slate-950">
                    SPACE_HAZARD
                  </span>
                  <span className="text-xs text-slate-400 font-medium">5 Questions • Pass 75%</span>
                </div>
                <h4 className="text-lg font-bold text-white">
                  Simulation & Assessment Criteria
                </h4>
                <ul className="text-xs text-slate-300 space-y-2.5">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Interactive AR Hazard Identification Checklist
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Forced Mechanical Ventilation Sequence
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Evaluation available in English, Hindi, and Santali
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    Immediate SURAKSHA-SPACE digital certificate on passing
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Link
                  to={isAuthenticated ? '/modules/SPACE_HAZARD' : '/register'}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                >
                  <span>Launch Training Curriculum</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-[11px] text-slate-400 text-center">
                  AR training executes on Android AI Safe app • Web platform tracks records
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            End-To-End Safety Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How AI Safe Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Register / Login', desc: 'Select industry (mining, steel, mica) & language.' },
            { step: '02', title: 'AR Training', desc: 'Perform interactive confined space entry in Android AR.' },
            { step: '03', title: 'Take Assessment', desc: 'Answer 5 safety questions with hidden answer keys.' },
            { step: '04', title: 'Pass Assessment', desc: 'Server scores answers; requires score ≥ 75%.' },
            { step: '05', title: 'Digital Certificate', desc: 'Automatic SURAKSHA certificate generated with QR.' },
            { step: '06', title: 'Scan QR Code', desc: 'Examiners scan QR to instantly verify legitimacy.' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm relative group hover:border-amber-400 transition-colors"
            >
              <div>
                <span className="text-xs font-mono font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {item.step}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-3">{item.title}</h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multilingual Support */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-10 text-white border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Inclusive Workforce Design
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Native Multilingual Assessment
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Industrial workers in Eastern India mining belts speak regional languages. The AI Safe backend actively serves questions and assessments translated into:
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {LANGUAGES.map((lang) => (
                  <div key={lang.code} className="bg-slate-800/80 rounded-xl p-3 border border-slate-700 text-center">
                    <p className="text-base font-bold text-amber-400">{lang.native}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{lang.label} ({lang.code})</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <p className="text-amber-400 font-bold">// Real Sample Santali (sat) Assessment Query</p>
              <p className="text-slate-400">GET /api/v1/assessments/module/SPACE_HAZARD?lang=sat</p>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
                <p className="text-emerald-400">Q1: Confined space re bolo maṛang safe oxygen level tinạk tahēn jạrur-a?</p>
                <p className="text-slate-400">• [A] 16.0%</p>
                <p className="text-slate-400">• [B] 19.5% (Safe minimum)</p>
                <p className="text-slate-400">• [C] 23.5%</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
