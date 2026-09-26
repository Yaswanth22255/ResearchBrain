import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordField } from '../../components/auth/PasswordField';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { GlassButton } from '../../components/glass/GlassButton';
import { AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Academic email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please provide a valid institutional email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!agreeTerms) {
      errors.terms = 'You must agree to the academic terms of use.';
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
      await register(name, email, password);
      navigate('/app', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Academic Account"
      subtitle="Join verified researchers building grounded evidence pipelines."
    >
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-neutral-50 border border-neutral-300 text-xs text-black flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label 
            htmlFor="register-name" 
            className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
          >
            Full Name <span className="text-black">*</span>
          </label>
          <input
            id="register-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (validationErrors.name) setValidationErrors(prev => ({ ...prev, name: null }));
            }}
            placeholder="e.g. Dr. Alan Turing"
            autoComplete="name"
            required
            className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-black placeholder-neutral-400 bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all ${
              validationErrors.name ? 'border-red-400 focus:border-red-500' : 'border-neutral-300 focus:border-black'
            }`}
          />
          {validationErrors.name && (
            <p className="text-xs text-red-600 font-medium mt-1">
              {validationErrors.name}
            </p>
          )}
        </div>

        <div>
          <label 
            htmlFor="register-email" 
            className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5"
          >
            Institutional Email <span className="text-black">*</span>
          </label>
          <input
            id="register-email"
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

        <div>
          <PasswordField
            id="register-password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) setValidationErrors(prev => ({ ...prev, password: null }));
            }}
            autoComplete="new-password"
            error={validationErrors.password}
          />
          <PasswordStrength password={password} />
        </div>

        <PasswordField
          id="register-confirm-password"
          label="Confirm Password"
          placeholder="Repeat chosen password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: null }));
          }}
          autoComplete="new-password"
          error={validationErrors.confirmPassword}
        />

        <div className="pt-1">
          <label className="flex items-start space-x-2 text-xs text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (validationErrors.terms) setValidationErrors(prev => ({ ...prev, terms: null }));
              }}
              className="mt-0.5 rounded border-neutral-300 text-black focus:ring-black h-3.5 w-3.5"
            />
            <span>
              I agree to the <a href="#" className="font-semibold text-black underline">Academic Data Integrity Guidelines</a> and Terms of Service.
            </span>
          </label>
          {validationErrors.terms && (
            <p className="text-xs text-red-600 font-medium mt-1">
              {validationErrors.terms}
            </p>
          )}
        </div>

        <div className="pt-3">
          <GlassButton
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full justify-center py-2.5 text-sm"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Creating Academic Account...
              </span>
            ) : (
              <span className="flex items-center">
                Create Account <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            )}
          </GlassButton>
        </div>
      </form>

      <div className="mt-6 text-center text-xs text-neutral-500 border-t border-neutral-100 pt-4">
        <span>Already have an institutional profile? </span>
        <Link
          to="/login"
          className="font-bold text-black hover:underline"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
