import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, ExternalLink, BookmarkPlus, Map, Check } from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import { GlassPanel } from '../components/glass/GlassPanel';
import api from '../services/api';

const Discovery = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedPaperIds, setSavedPaperIds] = useState(new Set());
  
  const projectId = localStorage.getItem('activeProjectId');

  useEffect(() => {
    if (projectId) {
      api.get(`/projects/${projectId}`).then(res => {
        setProject(res.data);
        setQuery(res.data.name || '');
      }).catch(err => {
         console.error(err);
      });
      // Optionally fetch already saved papers for this project to update `savedPaperIds`
    }
  }, [projectId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    
    const searchPayload = {
      query,
      domain: project?.domain || '',
      subdomain: project?.subdomain || '',
      yearStart: project?.constraints?.yearStart || '2019',
      projectId
    };

    try {
      const response = await api.post('/search', searchPayload);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching papers', error);
      alert('Failed to fetch papers.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaper = async (paper) => {
    if (!projectId) {
      alert("Please select a project first.");
      return;
    }
    try {
      // In a full implementation, you'd have a specific /api/papers/:id/save endpoint
      // Here we assume search already upserted them, but we want to associate it or mark it saved explicitly.
      setSavedPaperIds(prev => new Set([...prev, paper._id || paper.openAlexId]));
    } catch (err) {
      console.error(err);
    }
  };

  if (!projectId) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10">
        <FolderOpen className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Project</h2>
        <p className="text-gray-600 mb-6">You must select or create a project before discovering literature.</p>
        <GlassButton variant="primary" onClick={() => navigate('/app')}>Go to Dashboard</GlassButton>
      </GlassPanel>
    )
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Academic Literature Discovery</h1>
      <p className="text-gray-500 mb-6">Search across PubMed, OpenAlex, and Semantic Scholar (Hybrid Retrieval)</p>
      
      <GlassPanel className="mb-8 p-6 bg-white/50">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              placeholder="Enter your research query..."
            />
          </div>
          <div className="flex space-x-2">
            <GlassButton variant="secondary" type="button" className="px-4 border-gray-200 bg-white/80" title="Filters based on Domain Profile">
              <Filter className="h-5 w-5 text-gray-600" />
            </GlassButton>
            <GlassButton variant="primary" type="submit" disabled={loading} className="px-6">
              {loading ? 'Searching...' : 'Search'}
            </GlassButton>
          </div>
        </form>
        
        {project && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="text-gray-500 font-medium mr-2 flex items-center">Active Filters:</span>
            <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200">Domain: {project.domain}</span>
            {project.subdomain && <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200">Sub: {project.subdomain}</span>}
            {project.constraints?.yearStart && <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md border border-indigo-200">Year &gt; {project.constraints.yearStart}</span>}
          </div>
        )}
      </GlassPanel>

      {/* Results Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Retrieved Literature {results.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">({results.length} results)</span>}</h3>
          {results.length > 0 && (
            <GlassButton 
              variant="secondary"
              onClick={() => navigate('/app/explore', { state: { papers: results } })}
              className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            >
              <Map className="h-4 w-4 mr-2" />
              Explore Themes
            </GlassButton>
          )}
        </div>
        
        {loading ? (
            <div className="space-y-4">
                {[1,2,3].map(i => (
                    <GlassCard key={i} className="animate-pulse flex flex-col space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-16 bg-gray-200 rounded w-full mt-2"></div>
                    </GlassCard>
                ))}
            </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((paper) => {
              const paperId = paper._id || paper.openAlexId;
              const isSaved = savedPaperIds.has(paperId);
              
              return (
              <GlassCard key={paperId} className="flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-lg font-bold text-slate-900 leading-snug pr-20">{paper.title}</h4>
                  {paper.relevanceScore && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md border border-emerald-200 whitespace-nowrap">
                        {Math.round((paper.relevanceScore || 0) * 100)}% Match
                    </span>
                  )}
                </div>
                <p className="text-sm text-indigo-700 font-medium mb-3">
                  {paper.authors?.slice(0, 3).join(', ')}{paper.authors?.length > 3 ? ' et al.' : ''} • {paper.year} • {paper.venue || 'Unknown Venue'}
                </p>
                <p className="text-sm text-gray-600 mb-5 line-clamp-3 leading-relaxed">
                  {paper.abstract || "No abstract available for this paper."}
                </p>
                
                <div className="flex justify-between items-center text-sm mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    {paper.doi && (
                      <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        DOI
                      </a>
                    )}
                    <span className="text-gray-500 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Source: {paper.source || 'OpenAlex'}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                        onClick={() => handleSavePaper(paper)}
                        disabled={isSaved}
                        className={`flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isSaved ? 'bg-green-50 text-green-700 border-green-200 cursor-default' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-indigo-600'}`}
                    >
                      {isSaved ? <Check className="h-4 w-4 mr-1.5" /> : <BookmarkPlus className="h-4 w-4 mr-1.5" />}
                      {isSaved ? 'Saved to Project' : 'Save Paper'}
                    </button>
                    <button 
                        onClick={() => navigate('/app/ideation', { state: { papers: [paper] }})}
                        className="flex items-center px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                    >
                      Use for Ideation
                    </button>
                  </div>
                </div>
              </GlassCard>
            )})}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/40 rounded-xl border border-gray-200 border-dashed">
            <Search className="mx-auto h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Enter a query to discover academic literature.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
