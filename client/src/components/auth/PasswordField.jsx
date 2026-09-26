import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordField = ({
  id = 'password',
  name = 'password',
  label = 'Password',
  value,
  onChange,
  placeholder = '••••••••••••',
  required = true,
  autoComplete = 'current-password',
  error = null
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex justify-between items-center">
        <label 
          htmlFor={id} 
          className="block text-xs font-bold text-neutral-700 uppercase tracking-wider"
        >
          {label} {required && <span className="text-black">*</span>}
        </label>
      </div>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`block w-full rounded-lg border px-3.5 py-2.5 text-sm text-black placeholder-neutral-400 bg-white focus:outline-none focus:ring-1 focus:ring-black transition-all pr-10 ${
            error 
              ? 'border-red-400 focus:border-red-500' 
              : 'border-neutral-300 focus:border-black'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-black transition-colors"
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
