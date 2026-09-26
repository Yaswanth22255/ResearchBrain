import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Map, Lightbulb, CheckCircle, PenTool, ArrowRight } from 'lucide-react';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Floating Glass Navbar */}
      <nav className="glass-nav fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600/10 p-2 rounded-lg border border-indigo-200/50">
            <BookOpen className="h-6 w-6 text-indigo-600" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">ResearchBrain</span>
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/app/discover" className="hover:text-indigo-600 transition-colors">Discover</Link>
          <Link to="/app/explore" className="hover:text-indigo-600 transition-colors">Explore</Link>
          <Link to="/app/ideation" className="hover:text-indigo-600 transition-colors">Ideate</Link>
          <Link to="/app/drafting" className="hover:text-indigo-600 transition-colors">Draft</Link>
        </div>
        <div className="flex space-x-3">
          <GlassButton variant="secondary" onClick={() => navigate('/app')}>Sign In</GlassButton>
          <GlassButton variant="primary" onClick={() => navigate('/app')}>Start Research</GlassButton>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
        <div className="text-center max-w-4xl mb-12">
          <div className="inline-flex items-center space-x-2 bg-indigo-50/50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Neuro-Symbolic Verification Engine Active
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Turn Academic Literature Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Research Ideas</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Discover relevant papers, explore research themes, identify potential research gaps, generate evidence-grounded research questions, and verify citations automatically.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <GlassButton variant="primary" className="text-lg px-8 py-3" onClick={() => navigate('/app')}>
              Start Research <ArrowRight className="ml-2 h-5 w-5" />
            </GlassButton>
            <GlassButton variant="secondary" className="text-lg px-8 py-3" onClick={() => navigate('/app/discover')}>
              Explore Literature
            </GlassButton>
          </div>
        </div>

        {/* Product Preview */}
        <GlassPanel className="w-full max-w-5xl relative p-2 md:p-4 mb-20 overflow-hidden bg-white/40 border-white/60 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-100/50 shadow-sm overflow-hidden flex flex-col">
            <div className="h-10 border-b border-gray-100 flex items-center px-4 space-x-2 bg-gray-50/50">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
              <div className="space-y-4">
                <div className="h-4 w-1/2 bg-indigo-100 rounded"></div>
                <div className="h-3 w-full bg-gray-100 rounded"></div>
                <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
                <div className="h-24 w-full bg-indigo-50/50 border border-indigo-100/50 rounded-lg flex items-center justify-center text-indigo-300 text-sm">Relevant Papers</div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center text-indigo-600 font-medium text-sm mb-2">
                    <CheckCircle className="w-4 h-4 mr-2" /> Verified Claim
                  </div>
                  <p className="text-sm text-gray-700">"Large language models exhibit emergent abilities when scaled beyond 10B parameters."</p>
                  <div className="mt-3 text-xs text-gray-500 flex items-center border-t border-gray-50 pt-2">
                    <BookOpen className="w-3 h-3 mr-1" /> Source: Wei et al., 2022
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center text-amber-600 font-medium text-sm mb-2">
                    <Lightbulb className="w-4 h-4 mr-2" /> Potential Research Gap
                  </div>
                  <p className="text-sm text-gray-700">Lack of evaluation frameworks for hallucination in domain-specific tasks.</p>
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>

        {/* Workflow */}
        <div className="w-full mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Complete Research Workflow</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">A systematic, evidence-grounded approach to developing novel research contributions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-100 -z-10 -translate-y-1/2"></div>
            
            {[
              { num: '01', title: 'Discover', icon: Search, link: '/app/discover' },
              { num: '02', title: 'Explore', icon: Map, link: '/app/explore' },
              { num: '03', title: 'Understand', icon: BookOpen, link: '/app/ideation' },
              { num: '04', title: 'Ideate', icon: Lightbulb, link: '/app/ideation' },
              { num: '05', title: 'Verify', icon: CheckCircle, link: '/app/verification' },
            ].map((step, idx) => (
              <div key={idx} onClick={() => navigate(step.link)} className="flex flex-col items-center group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-bold mb-4 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors shadow-sm">
                  {step.num}
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 p-4 rounded-xl w-full text-center shadow-sm group-hover:shadow-md group-hover:border-indigo-200 transition-all">
                  <step.icon className="w-6 h-6 mx-auto mb-2 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                  <h3 className="font-semibold text-slate-800">{step.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Core Features */}
        <div className="w-full mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Capabilities</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to move from an initial query to a verified research draft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard className="flex flex-col h-full">
              <div className="bg-blue-100 text-blue-700 p-3 rounded-lg w-fit mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hybrid Literature Discovery</h3>
              <p className="text-slate-600 mb-6 flex-grow">Find relevant academic papers using combined keyword and semantic retrieval from major databases.</p>
              <GlassButton variant="secondary" className="w-full" onClick={() => navigate('/app/discover')}>
                Explore Discovery →
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full">
              <div className="bg-purple-100 text-purple-700 p-3 rounded-lg w-fit mb-4">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Research Theme Exploration</h3>
              <p className="text-slate-600 mb-6 flex-grow">Understand the research landscape by exploring methods, datasets, applications, and topic clusters.</p>
              <GlassButton variant="secondary" className="w-full" onClick={() => navigate('/app/explore')}>
                Explore Themes →
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full">
              <div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg w-fit mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Grounded Analysis</h3>
              <p className="text-slate-600 mb-6 flex-grow">Generate structured summaries directly connected to retrieved evidence and source documents.</p>
              <GlassButton variant="secondary" className="w-full" onClick={() => navigate('/app/ideation')}>
                Analyze Literature →
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full">
              <div className="bg-amber-100 text-amber-700 p-3 rounded-lg w-fit mb-4">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Gap Exploration</h3>
              <p className="text-slate-600 mb-6 flex-grow">Automatically identify potential research gaps and missing links from your retrieved literature.</p>
              <GlassButton variant="secondary" className="w-full" onClick={() => navigate('/app/ideation')}>
                Find Research Gaps →
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full">
              <div className="bg-indigo-100 text-indigo-700 p-3 rounded-lg w-fit mb-4">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Question Generation</h3>
              <p className="text-slate-600 mb-6 flex-grow">Turn evidence and gaps into structured, novel research questions ready for investigation.</p>
              <GlassButton variant="secondary" className="w-full" onClick={() => navigate('/app/ideation')}>
                Generate Questions →
              </GlassButton>
            </GlassCard>

            <GlassCard className="flex flex-col h-full border-l-4 border-l-green-500">
              <div className="bg-green-100 text-green-700 p-3 rounded-lg w-fit mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Citation Verification</h3>
              <p className="text-slate-600 mb-6 flex-grow">Ensure integrity. Check citations and claim support using our neuro-symbolic verification engine.</p>
              <GlassButton variant="secondary" className="w-full text-green-700 border-green-200 hover:bg-green-50" onClick={() => navigate('/app/verification')}>
                Verify Citations →
              </GlassButton>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 bg-white/50 backdrop-blur-sm py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-gray-700">ResearchBrain</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-indigo-600">Documentation</a>
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
