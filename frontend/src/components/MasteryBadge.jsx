import React from 'react';

export const MasteryBadge = ({ score = 0, size = 'md', showLabel = true }) => {
  let color = 'bg-brand-rose/10 text-brand-rose border-brand-rose/20';
  let label = 'Critical Gap';
  let dotColor = 'bg-brand-rose';

  if (score >= 80) {
    color = 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20';
    label = 'Mastered';
    dotColor = 'bg-brand-emerald';
  } else if (score >= 60) {
    color = 'bg-brand-blue/10 text-brand-blue border-brand-blue/20';
    label = 'Proficient';
    dotColor = 'bg-brand-blue';
  } else if (score >= 40) {
    color = 'bg-brand-amber/10 text-brand-amber border-brand-amber/20';
    label = 'Developing';
    dotColor = 'bg-brand-amber';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${color} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{score}%</span>
      {showLabel && <span className="opacity-75">· {label}</span>}
    </span>
  );
};

