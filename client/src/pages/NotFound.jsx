import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Home } from 'lucide-react';
import { GlassButton } from '../components/glass/GlassButton';
import { AnimatedResearchBackground } from '../components/background/AnimatedResearchBackground';

const NotFound = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between bg-[#fafafa]">
      <AnimatedResearchBackground />

      <header className="relative z-10 w-full px-6 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="bg-black text-white p-2 rounded-lg">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-bold text-base text-black tracking-tight">ResearchPro</span>
        </Link>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-md p-8 text-center backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
            <span className="font-mono text-xl font-bold text-black">404</span>
          </div>
          <h1 className="text-xl font-bold text-black mb-2">
            Page Not Found
          </h1>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            The requested research route or bibliographic asset could not be located on this server.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Link to="/">
              <GlassButton variant="secondary" className="w-full justify-center">
                <Home className="w-3.5 h-3.5 mr-1.5" /> Return Home
              </GlassButton>
            </Link>
            <Link to="/app">
              <GlassButton variant="primary" className="w-full justify-center">
                Open Workspace
              </GlassButton>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-neutral-400">
        ResearchPro Academic Intelligence Platform
      </footer>
    </div>
  );
};

export default NotFound;
