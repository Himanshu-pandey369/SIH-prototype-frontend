import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-white tracking-wide">AI SAFE</span>
          <span>— Industrial AR Safety Training & Certification Platform</span>
        </div>
        <div className="text-center md:text-right text-slate-500 space-y-0.5">
          <p>Confined Space Safety Training Prototype (SIH 2026)</p>
          <p>Languages: English • हिन्दी • ᱥᱟᱱᱛᱟᱲᱤ</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
