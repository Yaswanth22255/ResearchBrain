import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Map, List, FolderOpen, ArrowRight } from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassButton } from '../components/glass/GlassButton';

import { BENCHMARK_PAPERS } from '../services/sampleData';

const Explorer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [papers, setPapers] = useState(() => {
    if (location.state?.papers && location.state.papers.length > 0) {
      return location.state.papers;
    }
    const cached = localStorage.getItem('activeProjectPapers');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [];
  });
  
  const [themes, setThemes] = useState([]);

  const handleLoadBenchmark = () => {
    localStorage.setItem('activeProjectPapers', JSON.stringify(BENCHMARK_PAPERS));
    setPapers(BENCHMARK_PAPERS);
  };
  
  useEffect(() => {
    if (papers.length > 0) {
      const simulatedThemes = [
        { name: 'Core Methodologies', count: Math.ceil(papers.length * 0.4), keywords: ['Theoretical Framework', 'Algorithmic Bounds', 'Empirical Evaluation'] },
        { name: 'Domain Applications', count: Math.ceil(papers.length * 0.3), keywords: ['Clinical Diagnostics', 'Financial Reasoning', 'Enterprise Systems'] },
        { name: 'Limitations & Integrity', count: Math.ceil(papers.length * 0.3), keywords: ['Hallucination Rates', 'Safety Bounds', 'Symbolic Grounding'] },
      ];
      setThemes(simulatedThemes);
    }
  }, [papers]);

  const timelineData = papers.reduce((acc, p) => {
    const year = p.year || 'Unknown';
    if (!acc[year]) acc[year] = { year, count: 0 };
    acc[year].count += 1;
    return acc;
  }, {});
  
  const timelineArray = Object.values(timelineData).sort((a, b) => a.year - b.year);

  if (papers.length === 0) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10 bg-white border border-neutral-200">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
          <FolderOpen className="h-6 w-6 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-black mb-2">No Literature In Exploration Buffer</h2>
        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
          The Thematic Explorer synthesizes clusters and timelines from retrieved papers. You can load our curated benchmark AI corpus or search live databases.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <GlassButton variant="primary" onClick={handleLoadBenchmark}>
            Load Benchmark Research Corpus
          </GlassButton>
          <GlassButton variant="secondary" onClick={() => navigate('/app/discover')}>
            Go to Discovery Search
          </GlassButton>
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="pb-6 mb-8 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-black text-white">
            <Map className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Thematic Landscape Explorer
          </h1>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          Cluster analysis and temporal distribution for {papers.length} retrieved publications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Clusters + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clusters */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
            <h2 className="text-base font-bold text-black uppercase tracking-wider mb-4">
              Identified Thematic Clusters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme, idx) => (
                <div 
                  key={idx} 
                  className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 hover:border-black transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-black">{theme.name}</h3>
                    <span className="text-[11px] font-bold text-neutral-600 bg-white px-2 py-0.5 rounded border border-neutral-200">
                      {theme.count} papers
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {theme.keywords.map(kw => (
                      <span 
                        key={kw} 
                        className="bg-white border border-neutral-200 text-neutral-700 text-[11px] font-medium px-2 py-0.5 rounded shadow-2xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Timeline Chart */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
            <h2 className="text-base font-bold text-black uppercase tracking-wider mb-4">
              Publication Trajectory
            </h2>
            {timelineArray.length > 0 ? (
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineArray}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis 
                      dataKey="year" 
                      axisLine={{ stroke: '#d4d4d4' }} 
                      tickLine={false} 
                      tick={{ fill: '#737373', fontSize: 12 }} 
                    />
                    <YAxis 
                      allowDecimals={false} 
                      axisLine={{ stroke: '#d4d4d4' }} 
                      tickLine={false} 
                      tick={{ fill: '#737373', fontSize: 12 }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '6px', 
                        border: '1px solid #e5e5e5', 
                        fontSize: '12px',
                        color: '#171717'
                      }} 
                    />
                    <Bar dataKey="count" fill="#171717" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 bg-neutral-50 rounded-lg border border-neutral-200 border-dashed">
                <p className="text-xs text-neutral-500">Insufficient metadata to plot temporal histogram.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column: Selected Literature Sidebar */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-2">
            <List className="w-4 h-4 text-neutral-700" />
            <h2 className="text-base font-bold text-black uppercase tracking-wider">
              Selected Corpus ({papers.length})
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mb-4">
            Publications staged for evidence extraction and research hypothesis generation.
          </p>
          
          <div className="space-y-2.5 mb-6 overflow-y-auto pr-1 max-h-[440px] flex-1">
            {papers.map((p, idx) => (
              <div 
                key={p._id || p.openAlexId || idx} 
                className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 text-left hover:border-neutral-300 transition-colors"
              >
                <h4 className="text-xs font-bold text-black line-clamp-2 leading-snug">
                  {p.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1.5">
                  <span>{p.year || 'N/A'}</span>
                  <span className="font-mono text-[10px]">{p.source || 'OpenAlex'}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-neutral-100 mt-auto">
            <GlassButton 
              variant="primary"
              onClick={() => navigate('/app/ideation', { state: { papers } })}
              className="w-full justify-center py-2.5"
            >
              Proceed to Ideation Workspace <ArrowRight className="w-4 h-4 ml-1.5" />
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer;
