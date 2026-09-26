import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { GlassButton } from '../../components/glass/GlassButton';
import { AlertCircle, ArrowLeft, CheckCircle, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please provide a valid institutional email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSuccessInfo(res);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch password recovery link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your institutional email to receive secure recovery instructions."
    >
      {successInfo ? (
        <div className="space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto border border-neutral-200">
            <CheckCircle className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-base font-bold text-black">
              Recovery Instructions Dispatched
            </h2>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              If an account exists for <span className="font-semibold text-black">{email}</span>, a secure password reset link has been dispatched.
            </p>
          </div>

          {/* Test Link for Direct Evaluation */}
          {successInfo.demoResetToken && (
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-left">
              <span className="font-bold text-black block mb-1">Developer & Tester Direct Link:</span>
              <Link 
                to={`/reset-password/${successInfo.demoResetToken}`} 
                className="text-black font-semibold underline break-all hover:text-neutral-700"
              >
                /reset-password/{successInfo.demoResetToken}
              </Link>
            </div>
          )}

          <div className="pt-2">
            <Link to="/login">
              <GlassButton variant="primary" className="w-full justify-center">
                Return to Sign In
              </GlassButton>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-black flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <div>
            <label 
              htmlFor="forgot-email" 
              className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
            >
              Institutional Email <span className="text-black">*</span>
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@university.edu"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-neutral-300 px-3.5 py-2.5 text-sm text-black placeholder-neutral-400 bg-white focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <div className="pt-2">
            <GlassButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center py-2.5 text-sm"
            >
              {loading ? 'Dispatching Link...' : 'Send Recovery Link'}
            </GlassButton>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
