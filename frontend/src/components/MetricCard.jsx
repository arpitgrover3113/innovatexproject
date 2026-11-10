import React from 'react';
import { motion } from 'framer-motion';

export const MetricCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'purple'
}) => {
  const colorSchemes = {
    purple: {
      bg: 'bg-brand-purple/5',
      iconBg: 'bg-brand-purple/10 text-brand-purple',
      border: 'border-brand-purple/20'
    },
    blue: {
      bg: 'bg-brand-blue/5',
      iconBg: 'bg-brand-blue/10 text-brand-blue',
      border: 'border-brand-blue/20'
    },
    emerald: {
      bg: 'bg-brand-emerald/5',
      iconBg: 'bg-brand-emerald/10 text-brand-emerald',
      border: 'border-brand-emerald/20'
    },
    amber: {
      bg: 'bg-brand-amber/5',
      iconBg: 'bg-brand-amber/10 text-brand-amber',
      border: 'border-brand-amber/20'
    }
  };

  const currentTheme = colorSchemes[color] || colorSchemes.purple;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-navy-200/80 p-5 shadow-soft-sm hover:shadow-soft-md transition-all relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-navy-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-navy-900 mt-1 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${currentTheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`font-semibold inline-flex items-center px-1.5 py-0.5 rounded ${
              trendPositive ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-rose/10 text-brand-rose'
            }`}>
              {trend}
            </span>
          )}
          {subtext && <span className="text-navy-400">{subtext}</span>}
        </div>
      )}
    </motion.div>
  );
};

