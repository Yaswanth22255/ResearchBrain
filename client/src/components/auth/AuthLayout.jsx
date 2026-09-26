import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ResearchIntelligenceBackground } from '../background/ResearchIntelligenceBackground';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between bg-[#fafafa]">
      {/* Living Research Graph Intelligence Background */}
      <ResearchIntelligenceBackground />

      {/* Top Academic Header */}
      <header className="relative z-10 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5 group cursor-pointer">
          <div className="bg-black text-white p-2 rounded-lg group-hover:bg-neutral-800 transition-colors">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-bold text-base text-black tracking-tight">ResearchPro</span>
          <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest px-2 py-0.5 border border-neutral-300 rounded bg-white">
            Academic Identity
          </span>
        </Link>
        <Link 
          to="/" 
          className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
        >
          ← Return to Public Home
        </Link>
      </header>

      {/* Main Centered Form Card */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-md p-6 sm:p-8 backdrop-blur-md">
          {title && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-black">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>

      {/* Academic Security Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-neutral-400 border-t border-neutral-200/60 bg-white/50 backdrop-blur-xs">
        <div className="max-w-md mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Official Research Security v2.1</span>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-black transition-colors">Privacy Charter</a>
            <a href="#" className="hover:text-black transition-colors">Institutional Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
