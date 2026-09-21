import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, User, LogOut, Menu, X, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md group-hover:bg-amber-400 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                AI SAFE
                {isAdmin && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    ADMIN
                  </span>
                )}
              </span>
              <span className="block text-[10px] tracking-wider uppercase text-slate-400 font-medium -mt-1">
                Industrial Safety AR
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive('/') ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/verify/demo"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname.startsWith('/verify') ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Verify Certificate
                </Link>
              </>
            ) : isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive('/admin') ? 'text-amber-400 bg-slate-800 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/workers"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive('/admin/workers') ? 'text-amber-400 bg-slate-800 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Workers
                </Link>
                <Link
                  to="/admin/certificates"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive('/admin/certificates') ? 'text-amber-400 bg-slate-800 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Certificates
                </Link>
                <Link
                  to="/admin/results"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive('/admin/results') ? 'text-amber-400 bg-slate-800 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Simulation Logs
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive('/dashboard') ? 'text-amber-400 bg-slate-800 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/modules/SPACE_HAZARD"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname.startsWith('/modules') || location.pathname.startsWith('/assessment')
                      ? 'text-amber-400 bg-slate-800 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Space Hazard Training
                </Link>
                <Link
                  to="/certificates"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname.startsWith('/certificates') ? 'text-amber-400 bg-slate-800 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  My Certificates
                </Link>
              </>
            )}
          </div>

          {/* Desktop Right Side CTA / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-lg transition-colors shadow-sm"
                >
                  Worker Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 transition-colors border border-slate-700 text-xs"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-5 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Overview
              </Link>
              <Link
                to="/verify/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Verify Certificate
              </Link>
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-200 bg-slate-800 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold bg-amber-500 text-slate-950 rounded-lg"
                >
                  Worker Register
                </Link>
              </div>
            </>
          ) : isAdmin ? (
            <>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/workers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Workers
              </Link>
              <Link
                to="/admin/certificates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Certificates
              </Link>
              <Link
                to="/admin/results"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Simulation Logs
              </Link>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center px-3">
                <span className="text-xs text-slate-400">{user?.name} (Admin)</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-red-400 font-semibold"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Worker Dashboard
              </Link>
              <Link
                to="/modules/SPACE_HAZARD"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Space Hazard Training
              </Link>
              <Link
                to="/certificates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                My Certificates
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Profile Settings
              </Link>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center px-3">
                <span className="text-xs text-slate-400">{user?.name} (Worker)</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-xs text-red-400 font-semibold"
                >
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
