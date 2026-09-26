import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordField } from '../../components/auth/PasswordField';
import { GlassButton } from '../../components/glass/GlassButton';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Target destination after successful login
  const from = location.state?.from?.pathname || '/app';

  // If already authenticated, redirect to destination
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Academic email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid email format (e.g. researcher@university.edu).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for testing/evaluator convenience
  const handleFillDemo = () => {
    setEmail('researcher@university.edu');
    setPassword('Research123!');
    setValidationErrors({});
    setErrorMessage('');
  };

  return (
    <AuthLayout
      title="Researcher Sign In"
      subtitle="Access your academic workspaces, literature indices, and verified hypotheses."
    >
      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-black flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Redirect notice if redirected from protected route */}
      {location.state?.from && (
        <div className="mb-4 p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-[11px] text-neutral-600 flex items-center">
          <span className="font-semibold text-black mr-1.5">Note:</span> 
          Please sign in to access that protected research resource.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label 
            htmlFor="email" 
            className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
          >
            Institutional Email <span className="text-black">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) setValidationErrors(prev => ({ ...prev, email: null }));
            }}
            placeholder="researcher@university.edu"
            autoComplete="email"
            required
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-black placeholder-neutral-400 bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
              validationErrors.email ? 'border-red-400 focus:border-red-500' : 'border-neutral-300 focus:border-black'
            }`}
          />
          {validationErrors.email && (
            <p className="text-xs text-red-600 font-medium mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <PasswordField
          id="login-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: null }));
          }}
          autoComplete="current-password"
          error={validationErrors.password}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center space-x-2 text-xs text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-neutral-300 text-black focus:ring-black h-3.5 w-3.5"
            />
            <span>Remember this device</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-semibold text-neutral-700 hover:text-black hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <GlassButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full justify-center py-2.5 text-sm"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center">
                Sign In to Workspace <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            )}
          </GlassButton>
        </div>

        {/* Demo Fast Fill Button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
          <span className="text-neutral-500">Need a test login?</span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-semibold text-black underline underline-offset-4 hover:text-neutral-700"
          >
            Use Demo Account
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4">
        <span>New to ResearchPro? </span>
        <Link
          to="/register"
          className="font-bold text-black hover:underline"
        >
          Create Academic Account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
