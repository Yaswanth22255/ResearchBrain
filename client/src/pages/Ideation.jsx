import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Lightbulb, AlertCircle, Quote, FolderOpen, ArrowRight, CheckCircle } from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassButton } from '../components/glass/GlassButton';
import api from '../services/api';

const Ideation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const papers = location.state?.papers || [];
  
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  
  const [ideas, setIdeas] = useState([]);
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  const generateSummary = async () => {
    if (papers.length === 0) return alert('No papers selected.');
    setLoading(true);
    try {
      const { data } = await api.post('/summaries', {
        query: query || 'Identify the main themes and research gaps in this literature.',
        paperIds: papers.map(p => p._id).filter(id => id) // Only use papers saved to DB
      });
      setSummaryData(data);
    } catch (error) {
      console.error(error);
      alert('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  };
  
  const generateIdeas = () => {
      setGeneratingIdeas(true);
      setTimeout(() => {
          setIdeas([
              { title: "Neuro-Symbolic Approaches to Hallucination Mitigation", gap: "Lack of deterministic verification in LLM factual output.", question: "How can symbolic logic rules be effectively integrated with LLM embedding spaces to deterministically verify claims?" },
              { title: "Cross-Domain Knowledge Transfer in Low-Resource Settings", gap: "Models fine-tuned on one domain fail catastrophically on distant domains.", question: "What is the optimal layer freezing strategy for preserving general capabilities while adapting to highly specialized domains?" }
          ]);
          setGeneratingIdeas(false);
      }, 1500);
  }

  if (papers.length === 0) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10">
        <FolderOpen className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ideation Workspace Empty</h2>
        <p className="text-gray-600 mb-6">Select literature from the Discovery or Explorer pages to begin ideation.</p>
        <GlassButton variant="primary" onClick={() => navigate('/app/discover')}>Go to Discovery</GlassButton>
      </GlassPanel>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-amber-500" />
            Ideation Workspace
        </h1>
        <p className="text-gray-500">Analyze literature, extract evidence, identify gaps, and generate novel research ideas.</p>
      </div>
      
      <GlassPanel className="mb-8 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Grounded Literature Analysis</h2>
        <p className="text-sm text-gray-600 mb-4">Ask a question about the {papers.length} selected papers to generate a grounded analysis.</p>
        
        <textarea
          className="w-full border border-gray-200 rounded-xl p-4 mb-4 bg-white/70 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          rows="3"
          placeholder="e.g. What are the main limitations identified across these papers?"
          value={query}
          onChange={e => setQuery(e.target.value)}
        ></textarea>
        
        <div className="flex justify-end">
            <GlassButton 
              variant="primary"
              onClick={generateSummary}
              disabled={loading}
              className="py-2.5 px-6"
            >
              {loading ? (
                  <span className="flex items-center"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Analyzing...</span>
              ) : 'Generate Grounded Analysis'}
            </GlassButton>
        </div>
      </GlassPanel>

      {summaryData && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <GlassPanel className="p-8 border-t-4 border-t-indigo-500">
            <h3 className="text-xl font-bold flex items-center mb-4 text-gray-900">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" />
              Analysis Summary
            </h3>
            <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">{summaryData.summary}</p>
          </GlassPanel>
          
          <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Extracted Claims & Evidence</h3>
                <GlassButton 
                  variant="secondary"
                  onClick={() => navigate('/app/verification', { state: { claims: summaryData.claims, papers } })}
                  className="text-green-700 border-green-200 hover:bg-green-50"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify All Claims
                </GlassButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summaryData.claims?.map((claim, idx) => (
                <GlassCard key={idx} className="flex flex-col h-full bg-white/60">
                    <p className="font-bold text-gray-900 mb-4 text-base leading-snug">"{claim.claim}"</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex items-start text-sm text-gray-600 bg-gray-50/80 p-3 rounded-lg border border-gray-100 mb-3">
                            <Quote className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="italic line-clamp-3">"{claim.evidence || 'Evidence passage extracted from source document.'}"</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center">
                                {claim.citationIds?.length > 0 ? (
                                <span className="text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded">Supported by {claim.citationIds.length} source(s)</span>
                                ) : (
                                <span className="text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Missing Citation</span>
                                )}
                            </div>
                            <button className="text-gray-400 hover:text-indigo-600 font-medium">View Source</button>
                        </div>
                    </div>
                </GlassCard>
                ))}
            </div>
          </div>
          
          <GlassPanel className="p-6 bg-gradient-to-br from-amber-50/50 to-orange-50/50 border-amber-100">
              <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                        Research Ideation
                    </h3>
                    <p className="text-sm text-gray-600">Generate potential research gaps and novel questions based on the evidence above.</p>
                  </div>
                  <GlassButton variant="primary" className="bg-amber-500 hover:bg-amber-600 text-white" onClick={generateIdeas} disabled={generatingIdeas}>
                      {generatingIdeas ? 'Brainstorming...' : 'Generate Ideas'}
                  </GlassButton>
              </div>
              
              {ideas.length > 0 && (
                  <div className="space-y-4 mt-6">
                      {ideas.map((idea, i) => (
                          <div key={i} className="bg-white/80 p-5 rounded-xl border border-amber-200 shadow-sm">
                              <h4 className="font-bold text-gray-900 mb-2">{idea.title}</h4>
                              <div className="space-y-2 text-sm">
                                  <p><span className="font-semibold text-amber-700">Potential Gap:</span> {idea.gap}</p>
                                  <p><span className="font-semibold text-indigo-700">Research Question:</span> {idea.question}</p>
                              </div>
                              <div className="mt-4 flex justify-end space-x-2">
                                  <button className="text-xs font-medium text-gray-500 hover:text-indigo-600 bg-white border border-gray-200 px-3 py-1.5 rounded">Save to Workspace</button>
                              </div>
                          </div>
                      ))}
                      
                      <div className="flex justify-end pt-4 mt-6 border-t border-amber-200/50">
                          <GlassButton variant="primary" onClick={() => navigate('/app/drafting', { state: { papers, ideas, claims: summaryData.claims } })}>
                              Proceed to Drafting <ArrowRight className="w-4 h-4 ml-2" />
                          </GlassButton>
                      </div>
                  </div>
              )}
          </GlassPanel>
        </div>
      )}
    </div>
  );
};

export default Ideation;
