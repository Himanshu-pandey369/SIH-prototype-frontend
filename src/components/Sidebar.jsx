import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Award,
  User,
  Users,
  FileCheck2,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();

  const workerLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/modules/SPACE_HAZARD', label: 'Space Hazard Module', icon: ShieldAlert },
    { to: '/certificates', label: 'My Certificates', icon: Award },
    { to: '/profile', label: 'Worker Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/workers', label: 'Registered Workers', icon: Users },
    { to: '/admin/certificates', label: 'Certificates Management', icon: FileCheck2 },
    { to: '/admin/results', label: 'AR Simulation Logs', icon: Activity },
  ];

  const links = isAdmin ? adminLinks : workerLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'ADMINISTRATION' : 'TRAINING PORTAL'}
          </span>
          <nav className="mt-2 space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin' || item.to === '/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-slate-500 group-hover:text-slate-800" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Prototype Scope Notice */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            SIH 2026 Prototype
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Active Module: <span className="font-semibold text-slate-700">SPACE_HAZARD</span>
          </p>
        </div>
      </div>

      {/* User Info Bar at bottom of sidebar */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="truncate">
          <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
          <p className="text-[11px] text-slate-500 capitalize truncate">
            {user?.role} • {user?.industry || 'Mining'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
