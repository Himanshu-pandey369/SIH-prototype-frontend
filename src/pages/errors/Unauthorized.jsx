import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md bg-white rounded-2xl border border-red-200 p-8 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900">403</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-1">Access Restricted</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Administrative security privileges are required to view this resource. Your account role ({user?.role || 'worker'}) does not have permission.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5" /> Return to Worker Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
