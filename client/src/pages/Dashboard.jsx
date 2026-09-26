import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Map, Lightbulb, PenTool, CheckCircle, FolderOpen, ArrowRight, X } from 'lucide-react';
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
        constraints: { yearStart: parseInt(yearStart) }
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
  }

  const activeProjectId = localStorage.getItem('activeProjectId');

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Research Projects</h1>
          <p className="text-gray-500">Manage your research workspaces and contexts.</p>
        </div>
        <GlassButton variant="primary" onClick={() => setShowCreateModal(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          New Project
        </GlassButton>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : projects.length === 0 ? (
        <GlassCard className="text-center py-16">
          <FolderOpen className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create a research project to define your domain and start discovering literature.</p>
          <GlassButton variant="primary" onClick={() => setShowCreateModal(true)}>
            Start New Project
          </GlassButton>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <GlassCard key={project._id} onClick={() => selectProject(project)} className={`relative ${activeProjectId === project._id ? 'ring-2 ring-indigo-500' : ''}`}>
              {activeProjectId === project._id && (
                  <span className="absolute top-4 right-4 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">Active</span>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2 pr-12">{project.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-3">
                {project.domain} {project.subdomain ? `• ${project.subdomain}` : ''}
              </p>
              <p className="text-sm text-gray-600 mb-6 line-clamp-2">{project.description || 'No description provided.'}</p>
              
              <div className="flex justify-between items-center text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                  Open Workspace <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Create Research Project & Domain Profile</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-6 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Project Name <span className="text-red-500">*</span></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. LLM Hallucination Mitigation" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/50 border p-2.5" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows="2" placeholder="Briefly describe the goal of this research project..." className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white/50 border p-2.5" />
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
                  <h3 className="font-semibold text-indigo-900 text-sm flex items-center"><Map className="w-4 h-4 mr-1"/> Domain Profiler</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Research Domain <span className="text-red-500">*</span></label>
                      <input type="text" value={domain} onChange={e => setDomain(e.target.value)} required placeholder="e.g. Artificial Intelligence" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subdomain</label>
                      <input type="text" value={subdomain} onChange={e => setSubdomain(e.target.value)} placeholder="e.g. Natural Language Processing" className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Publication Year (From)</label>
                     <input type="number" value={yearStart} onChange={e => setYearStart(e.target.value)} className="w-full sm:w-1/2 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white border p-2" />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <GlassButton variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</GlassButton>
                <GlassButton variant="primary" type="submit">Create Project & Start</GlassButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
