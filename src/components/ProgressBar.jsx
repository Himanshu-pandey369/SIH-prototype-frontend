import React from 'react';

const ProgressBar = ({
  progress = 0,
  label,
  showPercentage = true,
  color = 'amber',
  size = 'md',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const sizeHeights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorFills = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-600',
    orange: 'bg-orange-500',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-600">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-slate-800">{clampedProgress}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeHeights[size] || sizeHeights.md}`}>
        <div
          className={`${colorFills[color] || colorFills.amber} ${sizeHeights[size] || sizeHeights.md} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
