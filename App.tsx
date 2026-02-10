import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Onboarding } from './components/Onboarding';
import { MatchFeed } from './components/MatchFeed';
import { ItineraryBuilder } from './components/ItineraryBuilder';
import { ChatInterface } from './components/ChatInterface';
import { ProfileView } from './components/ProfileView';
import { UserProfile } from './types';
import { Logo } from './components/Logo';
import { fetchCurrentUser, saveCurrentUser } from './services/api';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState('match');

  // Cargar usuario desde la API (MongoDB)
  React.useEffect(() => {
    const loadUser = async () => {
      const user = await fetchCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    loadUser();
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setCurrentUser(profile);
    // Persistir en MongoDB a través de la API
    void saveCurrentUser(profile);
  };

  const handleUpdateUser = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    // Actualizar en MongoDB
    void saveCurrentUser(updatedProfile);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('match');
  };

  const renderContent = () => {
    if (!currentUser) {
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
        return <ProfileView currentUser={currentUser} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />;
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