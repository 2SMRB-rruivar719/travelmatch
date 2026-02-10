import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { MatchFeed } from './components/MatchFeed';
import { ItineraryBuilder } from './components/ItineraryBuilder';
import { ChatInterface } from './components/ChatInterface';
import { ProfileView } from './components/ProfileView';
import { Login } from './components/Login';
import { LanguageCode, UserProfile } from './types';
import { Logo } from './components/Logo';
import { updateUserProfile } from './services/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState('match');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register'>('landing');
  const [language, setLanguage] = useState<LanguageCode>('es');

  const handleOnboardingComplete = (profile: UserProfile) => {
    setCurrentUser(profile);
    setLanguage(profile.language);
    setCurrentView('match');
  };

  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    void updateUserProfile(updatedProfile.id, updatedProfile);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('match');
    setAuthView('landing');
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setLanguage(user.language);
    setCurrentView('match');
  };

  const handleChangeLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    if (currentUser) {
      const updated = { ...currentUser, language: lang };
      setCurrentUser(updated);
      void updateUserProfile(updated.id, { language: lang });
    }
  };

  const renderContent = () => {
    if (!currentUser) {
      if (authView === 'login') {
        return (
          <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center">
            <div className="min-h-screen bg-travel-primary/90 backdrop-blur-sm flex flex-col p-4 overflow-y-auto">
              <Login onLoginSuccess={handleLoginSuccess} onBackToLanding={() => setAuthView('landing')} />
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
              />
            </div>
          </div>
        );
      }

      // Landing inicial con botones de acceso
      return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center">
          <div className="min-h-screen bg-travel-primary/90 backdrop-blur-sm flex flex-col p-6 overflow-y-auto">
            <div className="flex flex-col items-center justify-center gap-6 mt-20 mb-10 animate-fade-in-up">
              <div className="bg-white/90 p-8 rounded-[2.5rem] backdrop-blur-md border border-white/50 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Logo className="w-32 h-32" variant="icon" />
              </div>
              <div className="bg-[#f4e8c1] p-5 px-8 rounded-2xl shadow-xl border-4 border-white">
                <Logo className="w-auto" variant="text" />
              </div>
            </div>

            <p className="text-white/95 text-center mb-8 max-w-sm mx-auto text-lg font-medium drop-shadow-md tracking-wide">
              Encuentra compañeros de viaje, planifica con IA y explora el mundo.
            </p>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <button
                onClick={() => setAuthView('register')}
                className="w-full py-3 rounded-full bg-white text-travel-primary font-semibold shadow-lg hover:bg-gray-100 transition-colors"
              >
                Registrarse
              </button>
              <button
                onClick={() => setAuthView('login')}
                className="w-full py-3 rounded-full bg-transparent border border-white/80 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Iniciar sesión
              </button>
            </div>
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
          />
        );
      default:
        return <MatchFeed currentUser={currentUser} onStartChat={() => setCurrentView('chat')} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {renderContent()}
      {currentUser && <Navigation currentView={currentView} onChangeView={setCurrentView} />}
    </div>
  );
};

export default App;