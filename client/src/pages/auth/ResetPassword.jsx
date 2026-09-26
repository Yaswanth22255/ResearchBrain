import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PasswordField } from '../../components/auth/PasswordField';
import { PasswordStrength } from '../../components/auth/PasswordStrength';
import { GlassButton } from '../../components/glass/GlassButton';
import { AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      await resetPassword(token, newPassword);
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Establish a new credential for your academic profile."
    >
      {isSuccess ? (
        <div className="space-y-5 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto border border-neutral-200">
            <CheckCircle className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-base font-bold text-black">
              Password Updated Successfully
            </h2>
            <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
              Your academic profile credential has been updated. You can now authenticate with your new password.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/login">
              <GlassButton variant="primary" className="w-full justify-center">
                Sign In with New Password <ArrowRight className="w-4 h-4 ml-1.5" />
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
            <PasswordField
              id="new-password"
              label="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (validationErrors.newPassword) setValidationErrors(prev => ({ ...prev, newPassword: null }));
              }}
              autoComplete="new-password"
              error={validationErrors.newPassword}
            />
            <PasswordStrength password={newPassword} />
          </div>

          <PasswordField
            id="confirm-new-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationErrors.confirmPassword) setValidationErrors(prev => ({ ...prev, confirmPassword: null }));
            }}
            autoComplete="new-password"
            error={validationErrors.confirmPassword}
          />

          <div className="pt-3">
            <GlassButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center py-2.5 text-sm"
            >
              {loading ? 'Updating Password...' : 'Save New Password'}
            </GlassButton>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
            >
              Cancel and Return to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
