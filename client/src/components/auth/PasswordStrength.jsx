import React from 'react';

export const PasswordStrength = ({ password = '' }) => {
  if (!password) return null;

  const calculateScore = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const score = calculateScore(password);

  let label = 'Weak';
  let activeSegments = 1;

  if (score >= 4) {
    label = 'Strong (Research Grade)';
    activeSegments = 4;
  } else if (score >= 2) {
    label = 'Medium';
    activeSegments = 2;
  }

  return (
    <div className="space-y-1.5 pt-1">
      <div className="flex justify-between items-center text-[11px]">
        <span className="text-neutral-500 font-medium">Password Strength</span>
        <span className="font-bold text-neutral-900">{label}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((seg) => (
          <div
            key={seg}
            className={`h-full rounded-full transition-all duration-200 ${
              seg <= activeSegments ? 'bg-black' : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
