import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, CheckCircle } from 'lucide-react';
import { tutorApi } from '../services/api';

export const AIStatusBadge = () => {
  const [status, setStatus] = useState({
    isConfigured: false,
    mode: 'Checking AI engine...',
    modelName: '...'
  });

  useEffect(() => {
    tutorApi.getStatus()
      .then(data => setStatus(data))
      .catch(() => {
        setStatus({
          isConfigured: false,
          mode: 'Resilient Local Heuristic Engine',
          modelName: 'LearnLoop-Local-Heuristic-V1'
        });
      });
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-purple/10 text-brand-purple-dark border border-brand-purple/20 shadow-soft-xs">
      {status.isConfigured ? (
        <>
          <Sparkles className="w-3.5 h-3.5 text-brand-purple animate-pulse" />
          <span className="font-semibold">Gemini 1.5 Flash</span>
          <span className="text-[10px] bg-brand-purple/20 text-brand-purple-dark px-1.5 py-0.2 rounded font-mono">ACTIVE</span>
        </>
      ) : (
        <>
          <Cpu className="w-3.5 h-3.5 text-brand-blue" />
          <span className="font-semibold">Adaptive Pedagogical AI</span>
          <span className="text-[10px] bg-brand-blue/20 text-brand-blue-dark px-1.5 py-0.2 rounded font-mono">RESILIENT</span>
        </>
      )}
    </div>
  );
};

