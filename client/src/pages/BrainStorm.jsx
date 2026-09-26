import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, ChevronRight, Search, TrendingUp, BookOpen, 
  Lightbulb, CheckCircle, Brain, ArrowLeft, Target, Award,
  Database, Activity, Zap, Beaker
} from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassPanel } from '../components/glass/GlassPanel';
import api from '../services/api';
import { BENCHMARK_PAPERS } from '../services/sampleData';
import { ACADEMIC_FIELDS, SUBDOMAINS, TRENDING_AREAS, getPaperIntelligence } from '../services/brainstormData';

export default function BrainStorm() {
  const navigate = useNavigate();
  
  // State Management
  const [selectedField, setSelectedField] = useState(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [papers, setPapers] = useState([]);
  
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [paperIntel, setPaperIntel] = useState(null);

  // Navigation handlers
  const handleSelectField = (field) => {
    setSelectedField(field);
    setSelectedSubdomain(null);
    setSelectedArea(null);
    setPapers([]);
    setSelectedPaper(null);
  };

  const handleSelectSubdomain = (subdomain) => {
    setSelectedSubdomain(subdomain);
    setSelectedArea(null);
    setPapers([]);
    setSelectedPaper(null);
  };

  const handleSelectArea = async (area) => {
    setSelectedArea(area);
    setSelectedPaper(null);
    setLoadingPapers(true);
    
    // Attempt API search, fallback to benchmark
    try {
      const searchPayload = {
        query: area.name,
        domain: selectedField.name,
        subdomain: selectedSubdomain.name,
        yearStart: 2020,
        projectId: 'demo_ai_workspace'
      };
      const response = await api.post('/search', searchPayload);
      setPapers(response.data.length ? response.data : BENCHMARK_PAPERS.slice(0, 5));
    } catch (err) {
      console.warn("API unavailable, using fallback benchmark data for BrainStorm.");
      setPapers(BENCHMARK_PAPERS.slice(0, 4));
    } finally {
      setLoadingPapers(false);
    }
  };

  const handleSelectPaper = (paper) => {
    setSelectedPaper(paper);
    setPaperIntel(getPaperIntelligence(paper));
  };

  const renderBreadcrumbs = () => (
    <div className="flex flex-wrap items-center text-xs font-semibold text-neutral-500 mb-6 gap-2 bg-white/50 py-2 px-4 rounded-xl border border-neutral-200 w-fit">
      <button onClick={() => handleSelectField(null)} className="hover:text-black transition-colors flex items-center">
        <Compass className="w-3.5 h-3.5 mr-1" /> BrainStorm
      </button>
      {selectedField && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => handleSelectSubdomain(null)} className="hover:text-black transition-colors">
            {selectedField.shortName}
          </button>
        </>
      )}
      {selectedSubdomain && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => handleSelectArea(null)} className="hover:text-black transition-colors">
            {selectedSubdomain.name}
          </button>
        </>
      )}
      {selectedArea && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => setSelectedPaper(null)} className="hover:text-black transition-colors">
            {selectedArea.name}
          </button>
        </>
      )}
      {selectedPaper && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black truncate max-w-[150px] inline-block align-bottom">{selectedPaper.title}</span>
        </>
      )}
    </div>
  );

  const renderLanding = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-black text-white rounded-2xl mb-6 shadow-xl">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-black tracking-tight mb-4">
          Discover what you could research next.
        </h1>
        <p className="text-neutral-500 max-w-lg mx-auto text-sm leading-relaxed mb-8">
          Explore academic fields, trending research areas, relevant papers, and potential research directions. No prior knowledge required.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <GlassButton variant="primary" className="px-8" onClick={() => document.getElementById('fields-section').scrollIntoView({ behavior: 'smooth' })}>
            Start Exploring
          </GlassButton>
          <GlassButton variant="secondary" onClick={() => navigate('/app/discover')}>
            <Search className="w-4 h-4 mr-2" /> Search a Research Topic
          </GlassButton>
        </div>
      </div>

      <div id="fields-section" className="pt-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center">
          <Target className="w-4 h-4 mr-2" /> Choose an Academic Field
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACADEMIC_FIELDS.map(field => (
            <GlassCard 
              key={field.id} 
              className="cursor-pointer group hover:border-black transition-all"
              onClick={() => handleSelectField(field)}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{field.icon}</span>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-black transition-colors" />
              </div>
              <h3 className="font-bold text-black text-base mb-2">{field.name}</h3>
              <p className="text-xs text-neutral-500 mb-4">{field.description}</p>
              <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Explore Domains →
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSubdomains = () => {
    const domains = SUBDOMAINS[selectedField.id] || [];
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">{selectedField.name}</h1>
          <p className="text-sm text-neutral-500">Select a research domain to explore trending areas.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map(domain => (
            <GlassCard 
              key={domain.id} 
              className="cursor-pointer group hover:border-black transition-all p-5"
              onClick={() => handleSelectSubdomain(domain)}
            >
              <h3 className="font-bold text-black text-sm mb-2 group-hover:text-blue-600 transition-colors">{domain.name}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{domain.description}</p>
            </GlassCard>
          ))}
          {domains.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-neutral-500 border border-dashed rounded-xl border-neutral-300">
              More domains are being mapped for this field. Check back later.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTrendingAreas = () => {
    const areas = TRENDING_AREAS[selectedSubdomain.id] || [];
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">{selectedSubdomain.name}</h1>
          <p className="text-sm text-neutral-500">Discover areas with high recent research activity.</p>
        </div>
        
        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" /> Trending Research Areas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {areas.map(area => (
            <GlassCard 
              key={area.id}
              className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-all border-neutral-200 hover:border-black"
              onClick={() => handleSelectArea(area)}
            >
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-black">{area.name}</h3>
                  {area.trend === 'High' && (
                    <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center">
                      <Zap className="w-3 h-3 mr-1" /> Hot
                    </span>
                  )}
                  {area.trend === 'Emerging' && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center">
                      <Lightbulb className="w-3 h-3 mr-1" /> Emerging
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-600 mb-6 leading-relaxed">{area.description}</p>
              </div>
              
              <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-xs">
                <span className="text-neutral-500 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  {area.papers} papers
                </span>
                <span className="font-bold text-black">Explore Area →</span>
              </div>
            </GlassCard>
          ))}
          {areas.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-neutral-500 border border-dashed rounded-xl border-neutral-300">
              Trending areas currently unavailable for this domain.
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPapers = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar Context */}
      <div className="lg:w-1/4 flex-shrink-0">
        <GlassPanel className="sticky top-6">
          <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400 mb-4">Your Exploration</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Field</p>
              <p className="text-sm font-medium text-black">{selectedField.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Domain</p>
              <p className="text-sm font-medium text-black">{selectedSubdomain.name}</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">Trending Area</p>
              <p className="text-sm font-bold text-black">{selectedArea.name}</p>
              <p className="text-xs text-neutral-500 mt-1">{selectedArea.description}</p>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Main Papers List */}
      <div className="lg:w-3/4">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">Relevant Literature</h1>
            <p className="text-sm text-neutral-500">Representative papers defining this research area.</p>
          </div>
          <div className="hidden sm:flex space-x-2">
            <span className="text-xs font-medium text-neutral-500 px-3 py-1.5 bg-white border border-neutral-200 rounded-full">Recency</span>
            <span className="text-xs font-medium text-neutral-500 px-3 py-1.5 bg-white border border-neutral-200 rounded-full">Relevance</span>
          </div>
        </div>

        {loadingPapers ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <GlassCard key={i} className="animate-pulse h-32"></GlassCard>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map((paper, idx) => (
              <GlassCard 
                key={paper._id || idx} 
                className="hover:shadow-md transition-all border-neutral-200 cursor-pointer"
                onClick={() => handleSelectPaper(paper)}
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-black mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-neutral-500 mb-3 line-clamp-2 leading-relaxed">
                      {paper.abstract}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-neutral-400">
                      <span className="text-black">{paper.authors?.[0]} et al.</span>
                      <span>•</span>
                      <span>{paper.year}</span>
                      <span>•</span>
                      <span>{paper.venue || 'ArXiv'}</span>
                    </div>
                  </div>
                  
                  <div className="sm:text-right flex-shrink-0">
                    <GlassButton size="sm" className="w-full sm:w-auto text-xs px-4">
                      Research Intel
                    </GlassButton>
                  </div>
                </div>
              </GlassCard>
            ))}
            {papers.length === 0 && (
              <div className="p-12 text-center text-sm text-neutral-500 border border-dashed rounded-xl border-neutral-300">
                No papers found for this area. Try searching directly.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderPaperIntelligence = () => {
    if (!paperIntel) return null;
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-4">
            {paperIntel.coreDomains.map(d => (
              <span key={d} className="px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded">
                {d}
              </span>
            ))}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-4 leading-tight">{paperIntel.title}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-neutral-500 mb-6 pb-6 border-b border-neutral-100">
            <span className="text-black">{paperIntel.authors?.join(', ')}</span>
            <span>{paperIntel.year}</span>
            <span>{paperIntel.venue || 'ArXiv'}</span>
            {paperIntel.doi && <span className="text-blue-600 cursor-pointer">DOI: {paperIntel.doi}</span>}
          </div>

          {/* AI Assessment / Why this paper */}
          <div className="bg-[#fafafa] rounded-xl p-5 border border-neutral-100 flex gap-4">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg h-fit">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-black mb-1">Why this paper?</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                This paper is highly relevant because it investigates a foundational problem in {selectedArea.name}, introduces novel methodologies ({paperIntel.methods[0]}), and identifies critical limitations that present immediate research opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Entities & Metrics */}
          <div className="space-y-6">
            <GlassPanel className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center">
                <Beaker className="w-3.5 h-3.5 mr-2" /> Methodology
              </h3>
              <ul className="space-y-2">
                {paperIntel.methods.map(m => (
                  <li key={m} className="text-sm text-black font-medium px-3 py-2 bg-neutral-50 rounded border border-neutral-100">{m}</li>
                ))}
              </ul>
            </GlassPanel>

            <GlassPanel className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center">
                <Database className="w-3.5 h-3.5 mr-2" /> Datasets
              </h3>
              <ul className="space-y-2">
                {paperIntel.datasets.map(d => (
                  <li key={d} className="text-sm text-neutral-700 px-3 py-2 bg-neutral-50 rounded border border-neutral-100">{d}</li>
                ))}
              </ul>
            </GlassPanel>

            <GlassPanel className="p-5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-2" /> Performance Metrics
              </h3>
              <div className="space-y-3">
                {Object.entries(paperIntel.metrics).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">{key}</span>
                    <span className="font-bold text-black">{val}</span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>

          {/* Column 2: Extracted Knowledge */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-black mb-6 border-b border-neutral-100 pb-4">Research Opportunities</h2>
              
              <div className="space-y-6">
                {paperIntel.researchOpportunities.map((opp, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-black flex items-center">
                        <Lightbulb className="w-4 h-4 text-amber-500 mr-2" /> {opp.title}
                      </h3>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <div key={star} className={`w-2 h-2 rounded-full ${star <= opp.score ? 'bg-black' : 'bg-neutral-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                      {opp.description}
                    </p>
                    <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-3 text-xs">
                      <span className="font-semibold text-neutral-900 block mb-1">Evidence Grounding:</span>
                      <span className="text-neutral-500 italic">"{opp.evidence}"</span>
                    </div>
                    {idx < paperIntel.researchOpportunities.length - 1 && <div className="h-px w-full bg-neutral-100 mt-6" />}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-[10px] text-neutral-400 text-center uppercase tracking-wider font-semibold">
                AI-Assisted Assessment based on paper limitations and future work
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassPanel className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Author Findings</h3>
                <ul className="space-y-3">
                  {paperIntel.findings.map((f, i) => (
                    <li key={i} className="text-sm text-neutral-700 flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              <GlassPanel className="p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Reported Limitations</h3>
                <ul className="space-y-3">
                  {paperIntel.limitations.map((l, i) => (
                    <li key={i} className="text-sm text-neutral-700 flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-2 flex-shrink-0 mt-1.5" />
                      <span className="leading-relaxed">{l}</span>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 h-full overflow-y-auto custom-scrollbar pb-32">
      {renderBreadcrumbs()}
      
      {!selectedField && renderLanding()}
      {selectedField && !selectedSubdomain && renderSubdomains()}
      {selectedSubdomain && !selectedArea && renderTrendingAreas()}
      {selectedArea && !selectedPaper && renderPapers()}
      {selectedPaper && renderPaperIntelligence()}
    </div>
  );
}
