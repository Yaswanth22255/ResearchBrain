import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, XCircle, FileText, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { GlassCard } from '../components/glass/GlassCard';
import { GlassPanel } from '../components/glass/GlassPanel';
import { GlassButton } from '../components/glass/GlassButton';
import api from '../services/api';

const Verification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { claims, papers } = location.state || { claims: [], papers: [] };
  
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  useEffect(() => {
      if (claims && claims.length > 0 && !verificationData && !verifying) {
          verifyClaims();
      }
  }, [claims]);

  const verifyClaims = async () => {
    if (!claims || claims.length === 0) return;
    setVerifying(true);
    try {
      const { data } = await api.post('/verification', { claims });
      setVerificationData(data);
    } catch (error) {
      console.error(error);
      alert('Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  if (!claims || claims.length === 0) {
    return (
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10">
        <ShieldCheck className="mx-auto h-12 w-12 text-indigo-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Claims to Verify</h2>
        <p className="text-gray-600 mb-6">Generate an analysis in the Ideation workspace first to verify its claims.</p>
        <GlassButton variant="primary" onClick={() => navigate('/app/ideation')}>Go to Ideation</GlassButton>
      </GlassPanel>
    );
  }

  const getStatusColor = (status) => {
      switch(status) {
          case 'VERIFIED': return 'bg-green-100 text-green-800 border-green-200';
          case 'PARTIALLY SUPPORTED': return 'bg-amber-100 text-amber-800 border-amber-200';
          case 'CONFLICTING': return 'bg-orange-100 text-orange-800 border-orange-200';
          case 'UNSUPPORTED': return 'bg-red-100 text-red-800 border-red-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
  };

  const getStatusIcon = (status) => {
      switch(status) {
          case 'VERIFIED': return <CheckCircle className="w-5 h-5 mr-1.5 text-green-600" />;
          case 'PARTIALLY SUPPORTED': return <HelpCircle className="w-5 h-5 mr-1.5 text-amber-600" />;
          case 'CONFLICTING': return <AlertCircle className="w-5 h-5 mr-1.5 text-orange-600" />;
          case 'UNSUPPORTED': return <XCircle className="w-5 h-5 mr-1.5 text-red-600" />;
          default: return <HelpCircle className="w-5 h-5 mr-1.5 text-gray-600" />;
      }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
            <ShieldCheck className="w-6 h-6 mr-2 text-indigo-600" />
            Neuro-Symbolic Verification
        </h1>
        <p className="text-gray-500">Automatically verifying LLM-generated claims against source literature.</p>
      </div>
      
      {verifying ? (
          <GlassPanel className="flex flex-col items-center justify-center py-20">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Running Symbolic Verification Rules...</h3>
              <p className="text-gray-500">Checking citations, retrieving evidence, and validating semantic support.</p>
          </GlassPanel>
      ) : (
          <div className="space-y-6">
            <GlassPanel className="p-6 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-3">Verification Engine Rules Applied</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-indigo-800">
                    <div className="bg-white/60 p-3 rounded-lg flex items-center shadow-sm border border-indigo-100">
                        <CheckCircle className="w-4 h-4 mr-2 text-indigo-500" /> Citation Exists
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg flex items-center shadow-sm border border-indigo-100">
                        <CheckCircle className="w-4 h-4 mr-2 text-indigo-500" /> Metadata Match
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg flex items-center shadow-sm border border-indigo-100">
                        <CheckCircle className="w-4 h-4 mr-2 text-indigo-500" /> Evidence Found
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg flex items-center shadow-sm border border-indigo-100">
                        <CheckCircle className="w-4 h-4 mr-2 text-indigo-500" /> Semantic Support
                    </div>
                </div>
            </GlassPanel>
            
            <div className="space-y-6">
                {claims.map((claim, idx) => {
                    const verification = verificationData ? verificationData[idx] : null;
                    const status = verification ? verification.status : 'PENDING';
                    
                    return (
                        <GlassCard key={idx} className="flex flex-col md:flex-row gap-6 relative overflow-hidden">
                            <div className="flex-1 space-y-4 relative z-10">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">Generated Claim</h4>
                                    <p className="text-lg font-medium text-gray-900 leading-snug">"{claim.claim}"</p>
                                </div>
                                
                                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">Supporting Evidence Passage</h4>
                                    <p className="text-sm text-gray-700 italic">"{claim.evidence || 'Evidence passage extracted from source document.'}"</p>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-1/3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200/60 pt-4 md:pt-0 md:pl-6 relative z-10">
                                {verification ? (
                                    <>
                                    <div className={`px-4 py-3 rounded-xl border flex flex-col ${getStatusColor(status)} mb-4`}>
                                        <div className="flex items-center font-bold text-sm mb-1">
                                            {getStatusIcon(status)} {status}
                                        </div>
                                        <span className="text-xs opacity-80">{verification.message}</span>
                                    </div>
                                    
                                    <div className="space-y-2 mt-auto">
                                        <h4 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Symbolic Checks</h4>
                                        <ul className="text-xs space-y-1.5 text-gray-600">
                                            <li className="flex items-center justify-between">
                                                <span>Citation Exists</span>
                                                <span className={verification.checks.citationExists ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{verification.checks.citationExists ? 'PASS' : 'FAIL'}</span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span>Metadata Match</span>
                                                <span className={verification.checks.metadataMatches ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{verification.checks.metadataMatches ? 'PASS' : 'FAIL'}</span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span>Evidence Found</span>
                                                <span className={verification.checks.evidenceFound ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{verification.checks.evidenceFound ? 'PASS' : 'FAIL'}</span>
                                            </li>
                                            <li className="flex items-center justify-between">
                                                <span>Claim Supported</span>
                                                <span className={verification.checks.evidenceRelevant ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{verification.checks.evidenceRelevant ? 'PASS' : 'FAIL'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                                        Pending Verification...
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    )
                })}
            </div>
            
            {verificationData && (
                <div className="flex justify-end pt-6">
                    <GlassButton variant="primary" onClick={() => navigate('/app/drafting', { state: { claims, papers, verified: true } })}>
                        Proceed to Drafting <ArrowRight className="w-4 h-4 ml-2" />
                    </GlassButton>
                </div>
            )}
          </div>
      )}
    </div>
  );
};

export default Verification;
