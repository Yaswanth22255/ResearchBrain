import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, FolderOpen, Search, Lightbulb, CheckCircle, PenTool, Map, Settings, ChevronLeft, Menu, X, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
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
    <div className="flex h-screen overflow-hidden bg-[#fafafa]">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Sleek Monochrome Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-white border-r border-neutral-200 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
          <Link to="/" className="flex items-center group">
            <div className="p-1.5 rounded-lg bg-black text-white mr-2.5 group-hover:bg-neutral-800 transition-colors">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-neutral-900 group-hover:text-black transition-colors">
              ResearchPro
            </span>
            <span className="ml-2 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
              Academic
            </span>
          </Link>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-neutral-500 hover:text-black p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {activeProject && (
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/80">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Active Project
            </div>
            <div className="text-sm font-semibold text-neutral-900 truncate" title={activeProject.name}>
              {activeProject.name}
            </div>
            <div className="text-xs text-neutral-500 mt-0.5 truncate">
              {activeProject.domain}
            </div>
            <button 
              onClick={() => { localStorage.removeItem('activeProjectId'); setActiveProject(null); navigate('/app'); }}
              className="text-xs text-neutral-500 hover:text-black mt-2 flex items-center font-medium transition-colors"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> Switch Project
            </button>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.name}
                to={item.path} 
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-black text-white shadow-xs' 
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950'
                }`}
              >
                <item.icon className={`h-4 w-4 mr-3 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-3 border-t border-neutral-200 space-y-1">
          <Link 
            to="/" 
            className="flex items-center px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" />
            Back to Public Home
          </Link>
          <div className="px-3 py-1.5 text-[11px] text-neutral-400 font-medium flex items-center justify-between">
            <span>Audit Pipeline</span>
            <span className="font-semibold text-neutral-700">Formal v2.1</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
        <header className="h-16 flex-shrink-0 glass-nav flex items-center justify-between px-4 md:px-8 z-10 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-base font-bold text-neutral-900">
              {navItems.find(i => i.path === location.pathname)?.name || 'Workspace'}
            </h2>
            <span className="hidden sm:inline text-neutral-300">/</span>
            <span className="hidden sm:inline text-xs font-medium text-neutral-500">
              Evidence-Grounded Intelligence
            </span>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              to="/app/discover" 
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              Literature Search
            </Link>
            <Link 
              to="/" 
              className="text-xs font-medium text-neutral-600 hover:text-black hidden sm:inline transition-colors"
            >
              Home
            </Link>
            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs tracking-wider border border-black shadow-xs">
              RP
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
