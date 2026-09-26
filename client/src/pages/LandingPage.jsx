import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Map, Lightbulb, CheckCircle, PenTool, ArrowRight, ShieldCheck, FileText, Menu, X, FolderOpen } from 'lucide-react';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { ResearchIntelligenceBackground } from '../components/background/ResearchIntelligenceBackground';

import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#fafafa]">
      {/* Living Research Graph Intelligence Background */}
      <ResearchIntelligenceBackground />

      {/* Floating White Glass Navbar */}
      <nav className="glass-nav fixed top-0 w-full z-50 px-6 md:px-12 py-3.5 flex justify-between items-center transition-all duration-300">
        <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
          <div className="bg-black text-white p-2 rounded-lg group-hover:bg-neutral-800 transition-colors">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-black tracking-tight">ResearchPro</span>
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest px-2 py-0.5 border border-neutral-300 rounded bg-white">
            Intelligence
          </span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-6 xl:space-x-8 text-sm font-medium text-neutral-700">
          <Link to="/" className="text-black font-semibold">Home</Link>
          <Link to="/app" className="hover:text-black transition-colors">Workspaces</Link>
          <Link to="/app/discover" className="hover:text-black transition-colors">Discovery</Link>
          <Link to="/app/explore" className="hover:text-black transition-colors">Thematic Map</Link>
          <Link to="/app/ideation" className="hover:text-black transition-colors">Ideation</Link>
          <Link to="/app/verification" className="hover:text-black transition-colors">Verification</Link>
          <Link to="/app/drafting" className="hover:text-black transition-colors">Drafting</Link>
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2.5">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-2.5 py-1 bg-neutral-100 rounded-lg border border-neutral-200 text-xs">
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="font-semibold text-black max-w-[120px] truncate">{user?.name}</span>
                </div>
                <GlassButton variant="secondary" onClick={() => navigate('/app')}>
                  Workspace
                </GlassButton>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 border border-neutral-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <GlassButton variant="secondary" onClick={() => navigate('/login')}>
                  Sign In
                </GlassButton>
                <GlassButton variant="primary" onClick={() => navigate('/register')}>
                  Create Account
                </GlassButton>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[60px] left-0 w-full bg-white/95 backdrop-blur-xl border-b border-neutral-200 z-40 px-6 py-6 space-y-3 shadow-lg">
          {isAuthenticated && (
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between mb-2">
              <div className="text-xs">
                <div className="font-bold text-black">{user?.name}</div>
                <div className="text-neutral-500 text-[11px] truncate">{user?.email}</div>
              </div>
              <span className="text-[10px] font-semibold bg-neutral-200 px-2 py-0.5 rounded text-neutral-800">Active</span>
            </div>
          )}
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block px-3 py-2 rounded-lg text-sm font-bold text-black bg-neutral-100"
          >
            Home
          </Link>
          <Link 
            to="/app" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Workspaces & Projects
          </Link>
          <Link 
            to="/app/discover" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Literature Discovery
          </Link>
          <Link 
            to="/app/explore" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Thematic Landscape Map
          </Link>
          <Link 
            to="/app/ideation" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Ideation & Gaps
          </Link>
          <Link 
            to="/app/verification" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Citation Verification
          </Link>
          <Link 
            to="/app/drafting" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Manuscript Drafting
          </Link>
          
          <div className="pt-3 border-t border-neutral-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <GlassButton variant="primary" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/app'); }}>
                  Enter Workspace →
                </GlassButton>
                <GlassButton variant="secondary" className="w-full" onClick={handleLogout}>
                  Sign Out
                </GlassButton>
              </>
            ) : (
              <>
                <GlassButton variant="primary" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                  Sign In
                </GlassButton>
                <GlassButton variant="secondary" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}>
                  Create Account
                </GlassButton>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center relative z-10">
        <div className="text-center max-w-4xl mb-14">
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-xs border border-neutral-200 px-3.5 py-1.5 rounded-full text-neutral-800 text-xs font-semibold tracking-wide mb-6 shadow-2xs">
            <span className="inline-block w-2 h-2 rounded-full bg-black"></span>
            <span>Neuro-Symbolic Evidence Verification Engine Active</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black tracking-tight leading-[1.12] mb-6">
            Turn Academic Literature <br className="hidden sm:inline" />
            Into <span className="underline decoration-neutral-300 underline-offset-8">Research Ideas</span>
          </h1>
          
          <p className="text-base sm:text-lg text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            A formal research intelligence platform to discover high-impact papers, map scientific clusters, surface empirical research gaps, and automatically verify citations against literature.
          </p>

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <GlassButton 
              variant="primary" 
              className="text-base px-7 py-3" 
              onClick={() => navigate('/app')}
            >
              Start Research <ArrowRight className="ml-2 h-4 w-4" />
            </GlassButton>
            <GlassButton 
              variant="secondary" 
              className="text-base px-7 py-3" 
              onClick={() => navigate('/app/discover')}
            >
              Explore Literature
            </GlassButton>
          </div>
        </div>

        {/* Monochromatic Product Preview Workspace */}
        <GlassPanel className="w-full max-w-5xl relative p-3 sm:p-5 mb-24 overflow-hidden bg-white/90 border border-neutral-200 shadow-md">
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
            {/* Window Topbar */}
            <div className="h-10 border-b border-neutral-200 flex items-center justify-between px-4 bg-neutral-50/90">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
              </div>
              <div className="text-xs font-mono text-neutral-500">
                workspace://academic-intelligence/session_active
              </div>
              <div className="text-[11px] font-semibold px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-neutral-800">
                Evidence Audit Pass
              </div>
            </div>

            {/* Inner Preview Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-3 border-r border-neutral-100 pr-4">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">Literature Corpus</div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700">
                  <div className="font-semibold text-black mb-1">OpenAlex + PubMed Hybrid</div>
                  <div className="text-neutral-500">128 Papers Indexed & Ranked</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs text-neutral-700">
                  <div className="font-semibold text-black mb-1">Semantic Clusters</div>
                  <div className="text-neutral-500">3 Thematic Domains Identified</div>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center text-xs font-bold text-black uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 mr-1.5 text-black" /> Verified Citation Claim
                    </span>
                    <span className="text-[11px] bg-neutral-100 border border-neutral-300 text-neutral-800 font-semibold px-2 py-0.5 rounded">
                      Pass • Rule #01-#04
                    </span>
                  </div>
                  <p className="text-sm font-medium text-neutral-800">
                    "Scaling parameter capacity systematically yields emergent capabilities across reasoning benchmarks."
                  </p>
                  <div className="mt-3 text-xs text-neutral-500 flex items-center border-t border-neutral-100 pt-2 justify-between">
                    <span>Source: Wei et al., 2022 (doi: 10.48550/arXiv.2206.07682)</span>
                    <span className="font-semibold text-black">100% Bibliographic Match</span>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <div className="flex items-center text-xs font-bold text-black uppercase tracking-wider mb-2">
                    <Lightbulb className="w-4 h-4 mr-1.5 text-black" /> Identified Literature Gap
                  </div>
                  <p className="text-sm text-neutral-700">
                    Absence of deterministic verification mechanisms for factual accuracy in domain-specific tasks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Monochromatic Workflow Section */}
        <div className="w-full mb-28">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">
              Methodology
            </span>
            <h2 className="text-3xl font-extrabold text-black mb-3">
              The Systematic Research Workflow
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto text-sm sm:text-base">
              From exploratory literature retrieval to audit-ready, citation-backed draft formulations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-neutral-200 -z-10 -translate-y-1/2"></div>
            
            {[
              { num: '01', title: 'Discover', desc: 'Hybrid literature search across databases', icon: Search, link: '/app/discover' },
              { num: '02', title: 'Explore', desc: 'Cluster themes and publication trajectories', icon: Map, link: '/app/explore' },
              { num: '03', title: 'Understand', desc: 'Synthesize grounded evidence extracts', icon: BookOpen, link: '/app/ideation' },
              { num: '04', title: 'Ideate', desc: 'Surface research gaps and novel questions', icon: Lightbulb, link: '/app/ideation' },
              { num: '05', title: 'Verify', desc: 'Rule-based citation and claim verification', icon: ShieldCheck, link: '/app/verification' },
            ].map((step, idx) => (
              <div 
                key={idx} 
                onClick={() => navigate(step.link)} 
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm mb-4 border border-black shadow-xs group-hover:bg-neutral-800 transition-colors">
                  {step.num}
                </div>
                <div className="bg-white border border-neutral-200 p-5 rounded-xl w-full text-center shadow-2xs group-hover:border-neutral-400 group-hover:shadow-xs transition-all">
                  <step.icon className="w-5 h-5 mx-auto mb-2 text-neutral-700 group-hover:text-black transition-colors" />
                  <h3 className="font-bold text-sm text-black mb-1">{step.title}</h3>
                  <p className="text-xs text-neutral-500 leading-normal">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monochromatic Core Capabilities */}
        <div className="w-full mb-20">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2 block">
              Platform Features
            </span>
            <h2 className="text-3xl font-extrabold text-black mb-3">
              Core Research Capabilities
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto text-sm sm:text-base">
              Built specifically for academic researchers, universities, and laboratories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="flex flex-col h-full bg-white border border-neutral-200 p-7">
              <div className="bg-neutral-100 text-black p-3 rounded-lg w-fit mb-5 border border-neutral-200">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Hybrid Literature Discovery</h3>
              <p className="text-neutral-600 text-sm mb-6 flex-grow leading-relaxed">
                Retrieve and rank peer-reviewed papers using synchronized keyword and semantic embeddings across PubMed and OpenAlex.
              </p>
              <GlassButton variant="secondary" className="w-full justify-between" onClick={() => navigate('/app/discover')}>
                <span>Explore Discovery</span>
                <span>→</span>
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full bg-white border border-neutral-200 p-7">
              <div className="bg-neutral-100 text-black p-3 rounded-lg w-fit mb-5 border border-neutral-200">
                <Map className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Thematic Landscape Mapping</h3>
              <p className="text-neutral-600 text-sm mb-6 flex-grow leading-relaxed">
                Deconstruct retrieved publications into methodology clusters, application domains, and publication timeline charts.
              </p>
              <GlassButton variant="secondary" className="w-full justify-between" onClick={() => navigate('/app/explore')}>
                <span>Explore Themes</span>
                <span>→</span>
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full bg-white border border-neutral-200 p-7">
              <div className="bg-neutral-100 text-black p-3 rounded-lg w-fit mb-5 border border-neutral-200">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Grounded Synthesis</h3>
              <p className="text-neutral-600 text-sm mb-6 flex-grow leading-relaxed">
                Generate structured summaries with direct passage extractions and bibliographic references from source documents.
              </p>
              <GlassButton variant="secondary" className="w-full justify-between" onClick={() => navigate('/app/ideation')}>
                <span>Analyze Literature</span>
                <span>→</span>
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full bg-white border border-neutral-200 p-7">
              <div className="bg-neutral-100 text-black p-3 rounded-lg w-fit mb-5 border border-neutral-200">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Research Gap Identification</h3>
              <p className="text-neutral-600 text-sm mb-6 flex-grow leading-relaxed">
                Identify unresolved contradictions, unaddressed methodological limitations, and emergent domain frontiers.
              </p>
              <GlassButton variant="secondary" className="w-full justify-between" onClick={() => navigate('/app/ideation')}>
                <span>Find Gaps</span>
                <span>→</span>
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full bg-white border border-neutral-200 p-7">
              <div className="bg-neutral-100 text-black p-3 rounded-lg w-fit mb-5 border border-neutral-200">
                <PenTool className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Research Question Generation</h3>
              <p className="text-neutral-600 text-sm mb-6 flex-grow leading-relaxed">
                Formulate rigorous, testable hypotheses and structured academic research questions derived from empirical evidence.
              </p>
              <GlassButton variant="secondary" className="w-full justify-between" onClick={() => navigate('/app/ideation')}>
                <span>Generate Questions</span>
                <span>→</span>
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full bg-white border border-neutral-300 p-7 shadow-xs">
              <div className="bg-black text-white p-3 rounded-lg w-fit mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Neuro-Symbolic Verification</h3>
              <p className="text-neutral-600 text-sm mb-6 flex-grow leading-relaxed">
                Audit every claim deterministically against cited literature. Verify citation existence, metadata validity, and claim support.
              </p>
              <GlassButton variant="primary" className="w-full justify-between" onClick={() => navigate('/app/verification')}>
                <span>Verify Citations</span>
                <span>→</span>
              </GlassButton>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Monochromatic Academic Footer */}
      <footer className="border-t border-neutral-200 bg-white/90 backdrop-blur-md py-8 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
          <div className="flex items-center space-x-2.5 mb-4 md:mb-0">
            <div className="p-1 rounded bg-black text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-bold text-neutral-900 text-sm">ResearchPro</span>
            <span className="text-neutral-300">|</span>
            <span>Academic Research Intelligence Platform</span>
          </div>
          <div className="flex space-x-6 font-medium text-neutral-600">
            <Link to="/app" className="hover:text-black transition-colors">Workspace</Link>
            <Link to="/app/discover" className="hover:text-black transition-colors">Discovery</Link>
            <Link to="/app/verification" className="hover:text-black transition-colors">Verification Audit</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
