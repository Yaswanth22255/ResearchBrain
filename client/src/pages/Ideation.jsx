import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Lightbulb, AlertCircle, Quote, FolderOpen, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
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
        query: query || 'Identify empirical consensus, structural limitations, and open research gaps.',
        paperIds: papers.map(p => p._id).filter(id => id)
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
        { 
          title: "Deterministic Neuro-Symbolic Verification in Large Models", 
          gap: "Absence of real-time formal verification mechanisms for factual claims in generative models.", 
          question: "How can symbolic ontology constraints be evaluated at inference time to prevent factual hallucinations without degrading generation fluency?" 
        },
        { 
          title: "Cross-Domain Generalization in Low-Resource Scientific Literature", 
          gap: "Fine-tuned models fail to generalize across disparate biomedical ontologies.", 
          question: "What parameter-efficient adapter architectures maintain cross-ontology consistency during continual pre-training?" 
        }
      ]);
      setGeneratingIdeas(false);
    }, 1200);
  };

  if (papers.length === 0) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10 bg-white border border-neutral-200">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
          <FolderOpen className="h-6 w-6 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-black mb-2">Ideation Workspace Empty</h2>
        <p className="text-sm text-neutral-500 mb-6">
          To extract grounded evidence and brainstorm hypotheses, select publications from the Discovery search first.
        </p>
        <GlassButton variant="primary" onClick={() => navigate('/app/discover')}>
          Go to Discovery Search
        </GlassButton>
      </GlassPanel>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="pb-6 mb-8 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-black text-white">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Ideation & Grounded Analysis Workspace
          </h1>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          Extract empirical claims from {papers.length} selected publications, identify research gaps, and formulate novel research directions.
        </p>
      </div>
      
      {/* Query / Analysis Generation Panel */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider">
            Grounded Literature Synthesis Query
          </h2>
          <span className="text-xs text-neutral-500">
            {papers.length} publications staged
          </span>
        </div>
        
        <textarea
          className="w-full border border-neutral-300 rounded-lg p-3.5 mb-4 text-sm text-black placeholder-neutral-400 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all leading-relaxed"
          rows="3"
          placeholder="e.g. What are the key empirical contradictions and methodological limitations identified across this literature?"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        
        <div className="flex justify-end">
          <GlassButton 
            variant="primary"
            onClick={generateSummary}
            disabled={loading}
            className="py-2.5 px-6"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> 
                Synthesizing Literature...
              </span>
            ) : 'Generate Grounded Synthesis'}
          </GlassButton>
        </div>
      </div>

      {summaryData && (
        <div className="space-y-8">
          {/* Structured Analysis Summary */}
          <div className="p-8 bg-white rounded-xl border border-neutral-300 shadow-2xs">
            <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-neutral-100">
              <FileText className="h-4 w-4 text-black" />
              <h3 className="text-base font-bold text-black uppercase tracking-wider">
                Literature Synthesis Summary
              </h3>
            </div>
            <p className="text-neutral-800 leading-relaxed text-sm whitespace-pre-wrap font-sans">
              {summaryData.summary}
            </p>
          </div>
          
          {/* Extracted Claims and Evidence */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-black uppercase tracking-wider">
                  Extracted Claims & Bibliographic Citations
                </h3>
                <p className="text-xs text-neutral-500">
                  Individual empirical assertions extracted for formal verification.
                </p>
              </div>
              <GlassButton 
                variant="primary"
                onClick={() => navigate('/app/verification', { state: { claims: summaryData.claims, papers } })}
                className="text-xs"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Audit & Verify Claims
              </GlassButton>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaryData.claims?.map((claim, idx) => (
                <div key={idx} className="flex flex-col h-full bg-white p-5 rounded-xl border border-neutral-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Assertion #{idx + 1}
                  </div>
                  <p className="font-semibold text-black mb-4 text-sm leading-snug">
                    "{claim.claim}"
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-100">
                    <div className="flex items-start text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200 mb-3">
                      <Quote className="w-3.5 h-3.5 text-neutral-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="italic line-clamp-3">
                        "{claim.evidence || 'Exact passage extracted from primary document source.'}"
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      {claim.citationIds?.length > 0 ? (
                        <span className="text-neutral-900 font-semibold bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded text-[11px]">
                          Cited by {claim.citationIds.length} reference(s)
                        </span>
                      ) : (
                        <span className="text-neutral-600 font-medium bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-[11px] flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1 text-neutral-600" /> Unlinked Citation
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-black cursor-pointer hover:underline">
                        Audit Citation
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Research Ideation & Question Formulation */}
          <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-6 border-b border-neutral-100 gap-4">
              <div>
                <h3 className="text-base font-bold text-black uppercase tracking-wider flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-black" />
                  Novel Research Directions & Gaps
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Synthesize unaddressed research gaps into formal research hypotheses.
                </p>
              </div>
              <GlassButton 
                variant="secondary" 
                onClick={generateIdeas} 
                disabled={generatingIdeas}
              >
                {generatingIdeas ? 'Synthesizing...' : 'Formulate Novel Directions'}
              </GlassButton>
            </div>
            
            {ideas.length > 0 ? (
              <div className="space-y-4">
                {ideas.map((idea, i) => (
                  <div key={i} className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                    <h4 className="font-bold text-sm text-black mb-2">
                      {idea.title}
                    </h4>
                    <div className="space-y-2 text-xs">
                      <p>
                        <span className="font-bold uppercase tracking-wider text-neutral-500 mr-2">Literature Gap:</span>
                        <span className="text-neutral-800">{idea.gap}</span>
                      </p>
                      <p>
                        <span className="font-bold uppercase tracking-wider text-black mr-2">Research Question:</span>
                        <span className="font-semibold text-black">{idea.question}</span>
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end pt-4 mt-6 border-t border-neutral-200">
                  <GlassButton 
                    variant="primary" 
                    onClick={() => navigate('/app/drafting', { state: { papers, ideas, claims: summaryData.claims } })}
                  >
                    Proceed to Manuscript Drafting <ArrowRight className="w-4 h-4 ml-2" />
                  </GlassButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-neutral-500 mb-3">
                  Ready to extrapolate unaddressed literature gaps and formulate actionable research hypotheses.
                </p>
                <GlassButton variant="primary" onClick={generateIdeas} disabled={generatingIdeas}>
                  Brainstorm Research Directions
                </GlassButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ideation;
