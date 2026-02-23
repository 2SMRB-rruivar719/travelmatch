import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { MatchFeed } from './components/MatchFeed';
import { ItineraryBuilder } from './components/ItineraryBuilder';
import { ChatInterface } from './components/ChatInterface';
import { ProfileView } from './components/ProfileView';
import { Login } from './components/Login';
import { LanguageCode, ThemeMode, UserProfile } from './types';
import { Logo } from './components/Logo';

const AppInner: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState('match');

  // Load user from local storage (mock persistence)
  React.useEffect(() => {
    const savedUser = localStorage.getItem('tm_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    console.log('[FLOW] Registro completado, usuario creado', profile);
    showToast('Cuenta creada correctamente. ¡Bienvenido a TravelMatch! 🌍', 'success');
    setCurrentUser(profile);
    setLanguage(profile.language);
    setTheme(profile.theme || 'light');
    setCurrentView('match');
  };

  const handleUpdateUser = (updatedProfile: UserProfile) => {
    console.log('[FLOW] Guardando cambios de perfil', updatedProfile);
    showToast('Guardando cambios de tu perfil...', 'info');
    setCurrentUser(updatedProfile);
    localStorage.setItem('tm_user', JSON.stringify(updatedProfile));
  };

  const handleLogout = () => {
    localStorage.removeItem('tm_user');
    setCurrentUser(null);
    setCurrentView('match');
  };

  const renderContent = () => {
    if (!currentUser) {
      if (authView === 'login') {
        return (
          <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center">
            <div className="min-h-screen bg-travel-primary/90 backdrop-blur-sm flex flex-col p-4 overflow-y-auto">
              <Login
                onLoginSuccess={handleLoginSuccess}
                onBackToLanding={() => setAuthView('landing')}
              />
            </div>
          </div>
        );
      }

      if (authView === 'register') {
        return (
          <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center">
            <div className="min-h-screen bg-travel-primary/90 backdrop-blur-sm flex flex-col p-4 overflow-y-auto">
              <div className="flex flex-col items-center justify-center gap-6 mt-10 mb-4 animate-fade-in-up">
                <div className="bg-white/90 p-6 rounded-[2.5rem] backdrop-blur-md border border-white/50 shadow-2xl">
                  <Logo className="w-24 h-24" variant="icon" />
                </div>
              </div>
              <Onboarding
                onComplete={handleOnboardingComplete}
                onCancel={() => setAuthView('landing')}
                language={language}
              />
            </div>
          </div>
        );
      }

      // Landing inicial con botones de acceso
      return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center">
          <div className="min-h-screen bg-travel-primary/90 backdrop-blur-sm flex flex-col p-4 overflow-y-auto">
             <div className="flex flex-col items-center justify-center gap-6 mt-16 mb-8 animate-fade-in-up">
                {/* Logo Icon in Glass Bubble */}
                <div className="bg-white/90 p-8 rounded-[2.5rem] backdrop-blur-md border border-white/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <Logo className="w-32 h-32" variant="icon" />
                </div>
                
                {/* Text Logo with Cream Background (#f4e8c1) - Straight (removed rotation) */}
                <div className="bg-[#f4e8c1] p-5 px-8 rounded-2xl shadow-xl border-4 border-white">
                  <Logo className="w-auto" variant="text" />
                </div>
             </div>
             
             <p className="text-white/95 text-center mb-8 max-w-xs mx-auto text-lg font-medium drop-shadow-md tracking-wide">
               Encuentra compañeros de viaje, planifica con IA y explora el mundo.
             </p>
             <Onboarding onComplete={handleOnboardingComplete} />
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'match':
        return <MatchFeed currentUser={currentUser} onStartChat={() => setCurrentView('chat')} />;
      case 'itinerary':
        return <ItineraryBuilder currentUser={currentUser} />;
      case 'chat':
        return <ChatInterface currentUser={currentUser} />;
      case 'profile':
        return (
          <ProfileView
            currentUser={currentUser}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            language={language}
            onChangeLanguage={handleChangeLanguage}
            theme={theme}
            onChangeTheme={handleChangeTheme}
          />
        );
      default:
        return <MatchFeed currentUser={currentUser} onStartChat={() => setCurrentView('chat')} />;
    }
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen font-sans ${
        isDark ? 'bg-slate-900 text-gray-100' : 'bg-gray-50 text-gray-800'
      }`}
    >
      {renderContent()}
      {currentUser && <Navigation currentView={currentView} onChangeView={setCurrentView} />}
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppInner />
  </ToastProvider>
);

export default App;