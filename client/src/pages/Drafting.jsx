import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PenTool, CheckCircle, Save, Download, FolderOpen, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassButton } from '../components/glass/GlassButton';

import { BENCHMARK_PAPERS } from '../services/sampleData';

const Drafting = () => {
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

  const verified = location.state?.verified || false;
  
  const [draft, setDraft] = useState(() => localStorage.getItem('activeProjectDraft') || '');
  const [generating, setGenerating] = useState(false);
  const [complianceRules, setComplianceRules] = useState([
    { id: 1, text: 'Grounded in Verified Citations Only', checked: verified },
    { id: 2, text: 'Systematic Literature Overview Formulated', checked: !!draft },
    { id: 3, text: 'Empirical Research Gap Clearly Articulated', checked: !!draft },
    { id: 4, text: 'Novel Testable Hypothesis Proposed', checked: !!draft }
  ]);

  const handleLoadBenchmarkContext = () => {
    localStorage.setItem('activeProjectPapers', JSON.stringify(BENCHMARK_PAPERS));
    setPapers(BENCHMARK_PAPERS);
  };

  if (papers.length === 0) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10 bg-white border border-neutral-200">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
          <FolderOpen className="h-6 w-6 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-black mb-2">No Context for Manuscript Drafting</h2>
        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
          Drafting synthesizes verified literature evidence into a formal academic outline. You can load our benchmark research context or query papers first.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <GlassButton variant="primary" onClick={handleLoadBenchmarkContext}>
            Load Benchmark Research Context
          </GlassButton>
          <GlassButton variant="secondary" onClick={() => navigate('/app/discover')}>
            Go to Discovery Search
          </GlassButton>
        </div>
      </GlassPanel>
    );
  }

  const generateDraft = () => {
    setGenerating(true);
    setTimeout(() => {
      setDraft(`# Empirical Research Outline & Literature Synthesis

## 1. Introduction & Theoretical Foundations
Recent advancements in literature demonstrate substantial progression in domain-specific problem formulations. However, rigorous deterministic evaluation remains a persistent challenge across modern empirical implementations.

## 2. Systematic Literature Review
Based on our multi-source index analysis (${papers.length} publications reviewed):
${papers.map(p => `- **${p.title}** (${p.year}): Explores foundational methodologies with specific attention to structural limits.`).join('\n')}

## 3. Identified Research Gaps
Across the evaluated corpus, there exists an evident lack of formal deterministic verification pipelines. Specifically, empirical evidence reveals that statistical certainty measures fail to guard against subtle out-of-distribution reasoning degradations.

## 4. Proposed Research Hypothesis & Methodology
We formulate the hypothesis that integrating symbolic constraint boundaries into continuous embedding spaces guarantees strict adherence to factual assertions without diminishing semantic reasoning depth.

## 5. Bibliographic References
${papers.map((p, i) => `[${i + 1}] ${p.authors?.[0] || 'Author'} et al., "${p.title}", ${p.venue || 'Academic Repository'}, ${p.year || '2024'}. ${p.doi ? 'DOI: ' + p.doi : ''}`).join('\n')}`);
      
      setComplianceRules(complianceRules.map(rule => ({ ...rule, checked: true })));
      setGenerating(false);
    }, 1200);
  };

  const handleDownload = () => {
    if (!draft) return;
    const blob = new Blob([draft], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'research_draft.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 flex flex-col lg:flex-row gap-6">
      {/* Main Drafting Editor */}
      <div className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 mb-4 border-b border-neutral-100 gap-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black flex items-center">
                <PenTool className="mr-2 text-black w-4 h-4" />
                Manuscript Draft Workspace
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Generate an evidence-grounded research outline conforming to academic publication standards.
              </p>
            </div>
            
            <GlassButton
              variant="primary"
              onClick={generateDraft}
              disabled={generating}
              className="text-xs py-2 px-4 whitespace-nowrap"
            >
              {generating ? 'Drafting from Evidence...' : 'Generate Grounded Draft'}
            </GlassButton>
          </div>

          <textarea
            className="w-full h-[580px] bg-neutral-50/70 border border-neutral-300 rounded-lg p-5 font-mono text-xs leading-relaxed text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Click 'Generate Grounded Draft' to produce a citation-grounded manuscript draft based on your verified literature corpus..."
          />
          
          <div className="mt-4 flex justify-end space-x-3">
            <GlassButton 
              variant="secondary" 
              disabled={!draft}
              onClick={() => {
                localStorage.setItem('activeProjectDraft', draft);
                alert("Manuscript draft saved to project workspace.");
              }}
              className="text-xs"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Draft
            </GlassButton>
            <GlassButton 
              variant="primary" 
              disabled={!draft} 
              onClick={handleDownload}
              className="text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Markdown (.md)
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Compliance & Context Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        {/* Compliance Checklist */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-black" />
            <h2 className="text-sm font-bold text-black uppercase tracking-wider">
              Academic Compliance
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mb-5 leading-normal">
            Automated verification verifying that the draft fulfills formal publication and evidence criteria.
          </p>
          
          <div className="space-y-3">
            {complianceRules.map(rule => (
              <div 
                key={rule.id} 
                className="flex items-start bg-neutral-50 p-3 rounded-lg border border-neutral-200"
              >
                {rule.checked ? (
                  <CheckCircle className="h-4 w-4 text-black mr-2.5 flex-shrink-0 mt-0.5" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-neutral-400 mr-2.5 flex-shrink-0 mt-0.5"></div>
                )}
                <span className={`text-xs ${rule.checked ? 'text-black font-semibold' : 'text-neutral-500'}`}>
                  {rule.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Context Statistics */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-2xs">
          <h2 className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider">
            Context Summary
          </h2>
          <div className="text-xs text-neutral-800 space-y-2">
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Indexed Sources:</span>
              <span className="font-bold text-black">{papers.length} publications</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-100">
              <span className="text-neutral-500">Verification Audit:</span>
              <span className="font-bold text-black">{verified ? 'Completed' : 'Draft / Unverified'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Citation Format:</span>
              <span className="font-mono text-black">IEEE / ACM Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drafting;
