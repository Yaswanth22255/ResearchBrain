import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, FolderOpen, Search, Lightbulb, CheckCircle, PenTool, Map, Settings, ChevronLeft } from 'lucide-react';
import api from '../services/api';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(null);

  // Read active project from local storage
  useEffect(() => {
    const projectId = localStorage.getItem('activeProjectId');
    if (projectId) {
      api.get(`/projects/${projectId}`).then(res => {
        setActiveProject(res.data);
      }).catch(() => {
        localStorage.removeItem('activeProjectId');
      });
    } else {
      setActiveProject(null);
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: FolderOpen },
    { name: 'Discovery', path: '/app/discover', icon: Search },
    { name: 'Explorer', path: '/app/explore', icon: Map },
    { name: 'Ideation', path: '/app/ideation', icon: Lightbulb },
    { name: 'Verification', path: '/app/verification', icon: CheckCircle },
    { name: 'Drafting', path: '/app/drafting', icon: PenTool },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Glass Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col glass-panel !rounded-none !border-t-0 !border-b-0 !border-l-0 z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-16 flex items-center px-6 border-b border-gray-200/50">
          <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
          <Link to="/" className="font-bold text-lg text-gray-900 hover:text-indigo-700 transition-colors">ResearchBrain</Link>
        </div>
        
        {activeProject && (
          <div className="p-4 border-b border-gray-200/50 bg-indigo-50/30">
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Active Project</div>
            <div className="text-sm font-medium text-gray-800 truncate" title={activeProject.name}>
              {activeProject.name}
            </div>
            <button 
              onClick={() => { localStorage.removeItem('activeProjectId'); setActiveProject(null); navigate('/app'); }}
              className="text-xs text-gray-500 hover:text-red-500 mt-2 flex items-center"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> Switch Project
            </button>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-700' 
                    : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-200/50">
          <button className="flex items-center px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-700 hover:bg-white/60 transition-colors">
            <Settings className="h-5 w-5 mr-3 text-gray-400" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        <header className="h-16 flex-shrink-0 glass-nav flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find(i => i.path === location.pathname)?.name || 'Workspace'}
          </h2>
          <div className="flex items-center space-x-4">
             <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer">
               U
             </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
