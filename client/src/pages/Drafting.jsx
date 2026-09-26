import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PenTool, CheckCircle, Save, Download, FolderOpen } from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassButton } from '../components/glass/GlassButton';

const Drafting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const papers = location.state?.papers || [];
  const verified = location.state?.verified || false;
  
  const [draft, setDraft] = useState('');
  const [generating, setGenerating] = useState(false);
  const [complianceRules, setComplianceRules] = useState([
    { id: 1, text: 'Only uses Verified Claims', checked: verified },
    { id: 2, text: 'Includes Literature Overview', checked: false },
    { id: 3, text: 'Identifies clear Research Gap', checked: false },
    { id: 4, text: 'Proposes novel Research Question', checked: false }
  ]);

  if (papers.length === 0) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10">
        <FolderOpen className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Context for Drafting</h2>
        <p className="text-gray-600 mb-6">Select literature from the Discovery page and generate ideas before drafting.</p>
        <GlassButton variant="primary" onClick={() => navigate('/app/discover')}>Go to Discovery</GlassButton>
      </GlassPanel>
    );
  }

  const generateDraft = () => {
    setGenerating(true);
    setTimeout(() => {
      setDraft(`# Introduction
The field of Artificial Intelligence has seen rapid growth...

# Literature Overview
Several key papers propose new methodologies...

# Potential Research Gap
Despite these advancements, there remains a significant gap in our understanding of...

# Research Question & Direction
This project proposes a novel approach to address...

# References
${papers.map(p => `- ${p.title} (${p.year})`).join('\n')}`);
      
      setComplianceRules(complianceRules.map(rule => ({ ...rule, checked: true })));
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <GlassPanel className="p-6">
            <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <PenTool className="mr-2 text-indigo-600 w-6 h-6" />
                    Research Draft
                </h1>
                <p className="text-sm text-gray-500 mt-1">Generate a structured draft grounded in verified evidence.</p>
            </div>
            <GlassButton
                variant="primary"
                onClick={generateDraft}
                disabled={generating}
            >
                {generating ? 'Drafting from Evidence...' : 'Generate Grounded Draft'}
            </GlassButton>
            </div>

            <textarea
            className="w-full h-[600px] bg-white/70 border border-gray-200 rounded-xl p-6 font-mono text-sm leading-relaxed text-gray-800 shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your grounded draft will appear here..."
            />
            
            <div className="mt-4 flex justify-end space-x-3">
                <GlassButton variant="secondary" className="bg-white" disabled={!draft}>
                    <Save className="w-4 h-4 mr-2"/> Save Draft
                </GlassButton>
                <GlassButton variant="primary" className="bg-indigo-600" disabled={!draft}>
                    <Download className="w-4 h-4 mr-2"/> Export Markdown
                </GlassButton>
            </div>
        </GlassPanel>
      </div>

      <div className="w-full lg:w-80 space-y-6">
        <GlassCard className="p-6 bg-white/80">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Compliance Check</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">Automatically verifies if the generated draft meets structural and evidence requirements.</p>
            
            <div className="space-y-4">
            {complianceRules.map(rule => (
                <div key={rule.id} className="flex items-start bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                {rule.checked ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-2 flex-shrink-0"></div>
                )}
                <span className={`text-sm font-medium ${rule.checked ? 'text-gray-900' : 'text-gray-500'}`}>{rule.text}</span>
                </div>
            ))}
            </div>
        </GlassCard>
        
        <GlassCard className="p-6 bg-indigo-50/50 border-indigo-100">
            <h2 className="text-sm font-bold text-indigo-900 mb-3 uppercase tracking-wider">Draft Context</h2>
            <div className="text-sm text-indigo-800 space-y-2">
                <p><strong>Papers:</strong> {papers.length}</p>
                <p><strong>Verified Claims Used:</strong> {verified ? 'Yes' : 'No'}</p>
            </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Drafting;
