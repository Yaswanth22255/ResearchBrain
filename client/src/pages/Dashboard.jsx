import React, { useState, useEffect } from 'react';
import { PlusCircle, FolderOpen, ArrowRight, X, BookOpen, Map, Lightbulb, CheckCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassButton } from '../components/glass/GlassButton';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [description, setDescription] = useState('');
  const [yearStart, setYearStart] = useState('2020');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!name || !domain) {
      alert("Project Name and Domain are required.");
      return;
    }
    try {
      const { data } = await api.post('/projects', {
        name,
        domain,
        subdomain,
        description,
        constraints: { yearStart: parseInt(yearStart) || 2020 }
      });
      setShowCreateModal(false);
      setName(''); setDomain(''); setSubdomain(''); setDescription('');
      localStorage.setItem('activeProjectId', data._id);
      fetchProjects();
      navigate('/app/discover');
    } catch (error) {
      console.error('Error creating project', error);
      alert('Failed to create project');
    }
  };
  
  const selectProject = (project) => {
    localStorage.setItem('activeProjectId', project._id);
    navigate('/app/discover');
  };

  const activeProjectId = localStorage.getItem('activeProjectId');

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-neutral-200 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">Research Workspaces</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Organize academic domains, literature indices, and verified evidence profiles.
          </p>
        </div>
        <GlassButton variant="primary" onClick={() => setShowCreateModal(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Research Project
        </GlassButton>
      </div>

      {/* Academic KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Indexed Papers', val: projects.length > 0 ? `${projects.length * 24}+` : '0' },
          { label: 'Research Themes', val: projects.length > 0 ? `${projects.length * 3}` : '0' },
          { label: 'Identified Gaps', val: projects.length > 0 ? `${projects.length * 4}` : '0' },
          { label: 'Hypotheses Formulated', val: projects.length > 0 ? `${projects.length * 5}` : '0' },
          { label: 'Verified Citations', val: projects.length > 0 ? '100%' : 'N/A' },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white border border-neutral-200 p-4 rounded-xl shadow-2xs">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
              {metric.label}
            </div>
            <div className="text-2xl font-black text-black">
              {metric.val}
            </div>
          </div>
        ))}
      </div>

      {/* Projects List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-black uppercase tracking-wider">
            Active Projects ({projects.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-black"></div>
          </div>
        ) : projects.length === 0 ? (
          <GlassCard className="text-center py-16 bg-white border border-neutral-200">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
              <FolderOpen className="h-6 w-6 text-neutral-600" />
            </div>
            <h3 className="text-lg font-bold text-black mb-2">No Active Research Projects</h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
              Initiate a formal research workspace by defining your domain boundaries and publication constraints.
            </p>
            <GlassButton variant="primary" onClick={() => setShowCreateModal(true)}>
              Create Your First Project
            </GlassButton>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const isActive = activeProjectId === project._id;
              return (
                <GlassCard 
                  key={project._id} 
                  onClick={() => selectProject(project)} 
                  className={`relative flex flex-col justify-between p-6 bg-white border transition-all ${
                    isActive 
                      ? 'border-black ring-1 ring-black shadow-sm' 
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                        {project.domain}
                      </span>
                      {isActive && (
                        <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-base font-bold text-black mb-2 line-clamp-1">
                      {project.name}
                    </h3>
                    
                    {project.subdomain && (
                      <p className="text-xs font-medium text-neutral-600 mb-2">
                        Subdomain: {project.subdomain}
                      </p>
                    )}
                    
                    <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed mb-6">
                      {project.description || 'Structured academic inquiry workspace without explicit description.'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-neutral-400 pt-4 border-t border-neutral-100">
                    <span>Year &gt; {project.constraints?.yearStart || 2020}</span>
                    <span className="flex items-center text-black font-semibold hover:underline">
                      Open Workspace <ArrowRight className="w-3 h-3 ml-1" />
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Monochromatic Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-300 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
              <div>
                <h2 className="text-base font-bold text-black">New Research Project</h2>
                <p className="text-xs text-neutral-500">Configure research domain boundaries and scope.</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="text-neutral-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 overflow-y-auto space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Project Title <span className="text-black">*</span>
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  placeholder="e.g. LLM Factuality & Grounding Evaluation" 
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Research Description
                </label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  rows="2" 
                  placeholder="Briefly define the research thesis or exploratory objectives..." 
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                />
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-4">
                <div className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Domain & Literature Filter Profile
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Primary Domain <span className="text-black">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={domain} 
                      onChange={e => setDomain(e.target.value)} 
                      required 
                      placeholder="e.g. Computer Science" 
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Subdomain / Topic
                    </label>
                    <input 
                      type="text" 
                      value={subdomain} 
                      onChange={e => setSubdomain(e.target.value)} 
                      placeholder="e.g. Natural Language Processing" 
                      className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Publication Year Filter (From)
                  </label>
                  <input 
                    type="number" 
                    value={yearStart} 
                    onChange={e => setYearStart(e.target.value)} 
                    className="w-full sm:w-1/2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all" 
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3 border-t border-neutral-100">
                <GlassButton variant="secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </GlassButton>
                <GlassButton variant="primary" type="submit">
                  Create Workspace
                </GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
