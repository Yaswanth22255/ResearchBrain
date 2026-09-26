import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, ExternalLink, BookmarkPlus, Map, Check, FolderOpen } from 'lucide-react';
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
      setSavedPaperIds(prev => new Set([...prev, paper._id || paper.openAlexId]));
    } catch (err) {
      console.error(err);
    }
  };

  if (!projectId) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10 bg-white border border-neutral-200">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
          <FolderOpen className="h-6 w-6 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-black mb-2">No Active Research Project</h2>
        <p className="text-sm text-neutral-500 mb-6">
          You must select or create a project workspace before querying academic literature databases.
        </p>
        <GlassButton variant="primary" onClick={() => navigate('/app')}>
          Go to Workspaces Dashboard
        </GlassButton>
      </GlassPanel>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="pb-6 mb-8 border-b border-neutral-200">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          Literature Discovery
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Hybrid retrieval across OpenAlex and PubMed with semantic relevance ranking.
        </p>
      </div>
      
      {/* Professional Academic Search Bar */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg text-sm text-black placeholder-neutral-400 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              placeholder="Search academic literature by topic, keywords, or research question..."
            />
          </div>
          <div className="flex space-x-2">
            <GlassButton 
              variant="secondary" 
              type="button" 
              className="px-3.5" 
              title="Filter by Project Scope"
            >
              <Filter className="h-4 w-4 text-neutral-700" />
            </GlassButton>
            <GlassButton 
              variant="primary" 
              type="submit" 
              disabled={loading} 
              className="px-6"
            >
              {loading ? 'Searching Databases...' : 'Execute Search'}
            </GlassButton>
          </div>
        </form>
        
        {project && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs border-t border-neutral-100 pt-3">
            <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              Active Scope:
            </span>
            <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200 font-medium">
              Domain: {project.domain}
            </span>
            {project.subdomain && (
              <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200 font-medium">
                Topic: {project.subdomain}
              </span>
            )}
            {project.constraints?.yearStart && (
              <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded border border-neutral-200 font-medium">
                Year &ge; {project.constraints.yearStart}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-black uppercase tracking-wider">
              Retrieved Publications
            </h3>
            {results.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-neutral-600">
                {results.length} papers
              </span>
            )}
          </div>
          
          {results.length > 0 && (
            <GlassButton 
              variant="secondary"
              onClick={() => navigate('/app/explore', { state: { papers: results } })}
              className="text-xs"
            >
              <Map className="h-3.5 w-3.5 mr-1.5 text-neutral-700" />
              Thematic Mapping & Timeline
            </GlassButton>
          )}
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 animate-pulse space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
                <div className="h-3 bg-neutral-100 rounded w-1/3"></div>
                <div className="h-14 bg-neutral-50 rounded w-full mt-2"></div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((paper) => {
              const paperId = paper._id || paper.openAlexId;
              const isSaved = savedPaperIds.has(paperId);
              
              return (
                <div 
                  key={paperId} 
                  className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col shadow-2xs"
                >
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h4 className="text-base font-bold text-black leading-snug">
                      {paper.title}
                    </h4>
                    {paper.relevanceScore !== undefined && (
                      <span className="bg-neutral-100 text-black text-xs font-mono font-bold px-2 py-0.5 rounded border border-neutral-300 whitespace-nowrap">
                        {Math.round((paper.relevanceScore || 0) * 100)}% Match
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs font-medium text-neutral-600 mb-3">
                    <span>{paper.authors?.slice(0, 3).join(', ')}{paper.authors?.length > 3 ? ' et al.' : ''}</span>
                    <span className="mx-1.5">•</span>
                    <span>{paper.year || 'N/A'}</span>
                    <span className="mx-1.5">•</span>
                    <span className="italic">{paper.venue || 'Academic Repository'}</span>
                  </div>
                  
                  <p className="text-xs text-neutral-600 mb-5 line-clamp-3 leading-relaxed">
                    {paper.abstract || "Abstract unavailable for this indexed publication."}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs pt-4 border-t border-neutral-100 gap-3">
                    <div className="flex items-center space-x-3 text-neutral-500">
                      {paper.doi && (
                        <a 
                          href={`https://doi.org/${paper.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center text-black font-semibold hover:underline"
                        >
                          <ExternalLink className="h-3 w-3 mr-1 text-neutral-500" />
                          DOI: {paper.doi}
                        </a>
                      )}
                      <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-600 border border-neutral-200">
                        {paper.source || 'OpenAlex'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                      <button 
                        onClick={() => handleSavePaper(paper)}
                        disabled={isSaved}
                        className={`flex items-center px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSaved 
                            ? 'bg-neutral-100 text-black border-neutral-300 cursor-default' 
                            : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400'
                        }`}
                      >
                        {isSaved ? <Check className="h-3.5 w-3.5 mr-1" /> : <BookmarkPlus className="h-3.5 w-3.5 mr-1 text-neutral-500" />}
                        {isSaved ? 'Saved to Project' : 'Save Reference'}
                      </button>
                      
                      <button 
                        onClick={() => navigate('/app/ideation', { state: { papers: [paper] }})}
                        className="flex items-center px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Use for Ideation →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-neutral-200 border-dashed">
            <Search className="mx-auto h-8 w-8 text-neutral-300 mb-3" />
            <h4 className="text-sm font-bold text-black mb-1">Search the Academic Corpus</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Execute a query above to retrieve and rank peer-reviewed literature for your active project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discovery;
