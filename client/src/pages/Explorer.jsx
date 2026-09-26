import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Map, List, FolderOpen } from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassButton } from '../components/glass/GlassButton';

const Explorer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const papers = location.state?.papers || [];
  
  const [themes, setThemes] = useState([]);
  
  useEffect(() => {
    if (papers.length > 0) {
      const simulatedThemes = [
        { name: 'Core Methodologies', count: Math.ceil(papers.length * 0.4), keywords: ['Framework', 'Algorithm', 'Evaluation'] },
        { name: 'Applications', count: Math.ceil(papers.length * 0.3), keywords: ['Healthcare', 'Finance', 'System'] },
        { name: 'Limitations & Ethics', count: Math.ceil(papers.length * 0.3), keywords: ['Bias', 'Safety', 'Hallucination'] },
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
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10">
        <FolderOpen className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Papers Selected</h2>
        <p className="text-gray-600 mb-6">Explore requires a selection of papers. Go back to Discovery and run a search.</p>
        <GlassButton variant="primary" onClick={() => navigate('/app/discover')}>Go to Discovery</GlassButton>
      </GlassPanel>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Map className="w-6 h-6 mr-2 text-indigo-600" />
            Literature Explorer
        </h1>
        <p className="text-gray-500">Explore themes, methods, and publication trends from your retrieved literature.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassPanel className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Thematic Clusters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((theme, idx) => (
                <div key={idx} className="bg-white/60 p-5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer">
                  <h3 className="text-lg font-bold text-indigo-700 mb-1">{theme.name}</h3>
                  <p className="text-sm font-medium text-gray-500 mb-3">{theme.count} papers</p>
                  <div className="flex flex-wrap gap-2">
                    {theme.keywords.map(kw => (
                      <span key={kw} className="bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-md shadow-sm">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
          
          <GlassPanel className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Publication Timeline</h2>
            {timelineArray.length > 0 ? (
                <div className="bg-white/60 p-4 rounded-xl border border-gray-200 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timelineArray}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'rgba(79, 70, 229, 0.1)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center py-10 bg-white/40 rounded-xl border border-gray-200 border-dashed">
                    <p className="text-gray-500">Not enough literature data to generate a meaningful timeline.</p>
                </div>
            )}
          </GlassPanel>
        </div>
        
        <GlassPanel className="p-6 flex flex-col h-full bg-white/70">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center">
              <List className="w-5 h-5 mr-2 text-indigo-500" />
              Selected Literature
          </h2>
          <p className="text-sm text-gray-500 mb-4 flex-grow">Select a theme to filter, or proceed with current selection.</p>
          
          <div className="space-y-3 mb-6 overflow-y-auto pr-2 max-h-[400px]">
              {papers.map(p => (
                <div key={p._id || p.openAlexId} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">{p.title}</h4>
                  <p className="text-xs text-indigo-600 font-medium mt-1">{p.year}</p>
                </div>
              ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-200/60">
            <GlassButton 
              variant="primary"
              onClick={() => navigate('/app/ideation', { state: { papers } })}
              className="w-full justify-center py-2.5"
            >
              Proceed to Ideation Workspace
            </GlassButton>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default Explorer;
