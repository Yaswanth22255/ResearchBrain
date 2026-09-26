import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, XCircle, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
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
      <GlassPanel className="text-center py-16 max-w-2xl mx-auto mt-10 bg-white border border-neutral-200">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 border border-neutral-200">
          <ShieldCheck className="h-6 w-6 text-neutral-600" />
        </div>
        <h2 className="text-xl font-bold text-black mb-2">No Claims Staged for Verification</h2>
        <p className="text-sm text-neutral-500 mb-6">
          To run a neuro-symbolic evidence audit, synthesize literature and extract claims in the Ideation workspace first.
        </p>
        <GlassButton variant="primary" onClick={() => navigate('/app/ideation')}>
          Go to Ideation Workspace
        </GlassButton>
      </GlassPanel>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded bg-black text-white border border-black">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-white" /> VERIFIED
          </span>
        );
      case 'PARTIALLY SUPPORTED':
        return (
          <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-900 border border-neutral-400">
            <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-neutral-700" /> PARTIALLY SUPPORTED
          </span>
        );
      case 'CONFLICTING':
      case 'UNSUPPORTED':
        return (
          <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-900 border border-neutral-400">
            <XCircle className="w-3.5 h-3.5 mr-1.5 text-neutral-800" /> UNSUPPORTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 border border-neutral-300">
            PENDING
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-16">
      {/* Page Header */}
      <div className="pb-6 mb-8 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-black text-white">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Neuro-Symbolic Citation Verification Audit
          </h1>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          Rigorous deterministic verification of generated claims against primary literature and bibliographic metadata.
        </p>
      </div>
      
      {verifying ? (
        <div className="bg-white p-16 rounded-xl border border-neutral-200 text-center flex flex-col items-center justify-center shadow-2xs">
          <div className="w-10 h-10 border-2 border-neutral-200 border-t-black rounded-full animate-spin mb-4"></div>
          <h3 className="text-base font-bold text-black mb-1">
            Executing Symbolic Evidence Rules...
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Checking citation existence, resolving DOI metadata, matching evidence passages, and calculating semantic entailment.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Rules Applied Header Box */}
          <div className="p-6 bg-white rounded-xl border border-neutral-200 shadow-2xs">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Neuro-Symbolic Audit Rules Applied
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold text-neutral-800">
              <div className="bg-neutral-50 p-3 rounded-lg flex items-center border border-neutral-200">
                <CheckCircle className="w-4 h-4 mr-2 text-black" /> Rule 1: Citation Exists
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg flex items-center border border-neutral-200">
                <CheckCircle className="w-4 h-4 mr-2 text-black" /> Rule 2: Metadata Match
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg flex items-center border border-neutral-200">
                <CheckCircle className="w-4 h-4 mr-2 text-black" /> Rule 3: Evidence Found
              </div>
              <div className="bg-neutral-50 p-3 rounded-lg flex items-center border border-neutral-200">
                <CheckCircle className="w-4 h-4 mr-2 text-black" /> Rule 4: Claim Supported
              </div>
            </div>
          </div>
          
          {/* Claims Audit Cards */}
          <div className="space-y-5">
            {claims.map((claim, idx) => {
              const verification = verificationData ? verificationData[idx] : null;
              const status = verification ? verification.status : 'PENDING';
              
              return (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-xl border border-neutral-200 flex flex-col md:flex-row gap-6 shadow-2xs hover:border-neutral-400 transition-all"
                >
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                        Claim #{idx + 1} Under Audit
                      </div>
                      <p className="text-base font-semibold text-black leading-snug">
                        "{claim.claim}"
                      </p>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs">
                      <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px] mb-1.5">
                        Supporting Evidence Passage
                      </div>
                      <p className="text-neutral-700 italic leading-relaxed">
                        "{claim.evidence || 'Primary literature passage extracted during synthesis.'}"
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6">
                    {verification ? (
                      <>
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Audit Verdict</span>
                            {getStatusBadge(status)}
                          </div>
                          <p className="text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                            {verification.message}
                          </p>
                        </div>
                        
                        <div className="space-y-2 mt-auto">
                          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                            Symbolic Rule Status
                          </div>
                          <div className="text-xs space-y-1.5 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Citation Exists</span>
                              <span className="font-mono font-bold text-black">
                                {verification.checks.citationExists ? 'PASS' : 'FAIL'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Metadata Match</span>
                              <span className="font-mono font-bold text-black">
                                {verification.checks.metadataMatches ? 'PASS' : 'FAIL'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Evidence Found</span>
                              <span className="font-mono font-bold text-black">
                                {verification.checks.evidenceFound ? 'PASS' : 'FAIL'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-600">Claim Entailment</span>
                              <span className="font-mono font-bold text-black">
                                {verification.checks.evidenceRelevant ? 'PASS' : 'FAIL'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-neutral-400 font-mono">
                        Awaiting audit execution...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {verificationData && (
            <div className="flex justify-end pt-4">
              <GlassButton 
                variant="primary" 
                onClick={() => navigate('/app/drafting', { state: { claims, papers, verified: true } })}
                className="px-6 py-2.5"
              >
                Proceed to Drafting with Verified Claims <ArrowRight className="w-4 h-4 ml-2" />
              </GlassButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Verification;
