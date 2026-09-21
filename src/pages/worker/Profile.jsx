import React from 'react';
import { User, Mail, Building2, Languages, Calendar, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">
          Worker Profile & Safety Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Identity and industrial accreditation information
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-md">
            {user?.name?.charAt(0) || 'W'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {user?.role}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {user?._id}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </span>
            <p className="font-medium text-slate-800 break-all">{user?.email}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5" /> Industry Sector
            </span>
            <p className="font-semibold text-slate-800 capitalize">{user?.industry || 'Mining'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Languages className="w-3.5 h-3.5" /> Preferred Language
            </span>
            <p className="font-semibold text-slate-800 uppercase">{user?.preferredLanguage || 'en'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5" /> Enrolled Since
            </span>
            <p className="font-medium text-slate-800">{formatDate(user?.createdAt)}</p>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Verified Training Profile</span>
            <p className="text-emerald-800 mt-0.5">
              Your profile is verified to hold and generate official digital certificates in compliance with national occupational safety frameworks.
            </p>
          </div>
        </div>

        {/* Logout Action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
