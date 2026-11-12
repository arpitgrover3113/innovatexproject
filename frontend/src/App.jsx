import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AchievementsModal } from './components/AchievementsModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { DiagnosticAssessmentPage } from './pages/DiagnosticAssessmentPage';
import { AdaptivePracticePage } from './pages/AdaptivePracticePage';
import { AITutorPage } from './pages/AITutorPage';
import { VisualizerPage } from './pages/VisualizerPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MockInterviewPage } from './pages/MockInterviewPage';

const AppContent = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('landing');
  const [tabParams, setTabParams] = useState({});
  const [showAchievements, setShowAchievements] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  // Navigate to dashboard upon initial login only if explicitly coming from auth
  React.useEffect(() => {
    if (isAuthenticated && activeTab === 'auth') {
      setActiveTab('dashboard');
    }
  }, [isAuthenticated, activeTab]);

  const handleNavigate = (tab, params = {}) => {
    // Clear guest session when returning to landing page
    if (tab === 'landing' && user?.email?.includes('@guest')) {
      logout();
    }
    setIsInterviewActive(false);
    setTabParams(params);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-navy-800">
          <div className="w-4 h-4 rounded-full bg-brand-purple animate-ping" />
          <span className="text-xs font-bold tracking-wider uppercase">Initializing LearnLoop AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-navy-900 selection:bg-brand-purple-light selection:text-brand-purple-dark">
      {!isInterviewActive && (
        <Navbar activeTab={activeTab} onTabChange={handleNavigate} onShowAchievements={() => setShowAchievements(true)} />
      )}

      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        {activeTab === 'auth' && <AuthPage onAuthSuccess={() => handleNavigate('dashboard')} />}
        {activeTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {activeTab === 'diagnostic' && <DiagnosticAssessmentPage onNavigate={handleNavigate} />}
        {activeTab === 'adaptive' && (
          <AdaptivePracticePage 
            initialTopic={tabParams.topic || 'recursion'} 
            onNavigate={handleNavigate} 
          />
        )}
        {activeTab === 'tutor' && (
          <AITutorPage 
            initialTopicContext={tabParams.topicContext || 'Recursion'} 
            onNavigate={handleNavigate} 
          />
        )}
        {activeTab === 'interview' && (
          <MockInterviewPage 
            onNavigate={handleNavigate} 
            onInterviewActiveChange={setIsInterviewActive}
          />
        )}
        {activeTab === 'visualizer' && (
          <VisualizerPage onNavigate={handleNavigate} />
        )}
        {activeTab === 'roadmap' && <RoadmapPage onNavigate={handleNavigate} />}
        {activeTab === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
      </main>

      {!isInterviewActive && <Footer />}

      {/* Achievements modal rendered at root level — escapes header stacking context */}
      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        user={user}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

