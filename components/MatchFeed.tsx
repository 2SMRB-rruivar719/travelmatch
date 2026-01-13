import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { generatePotentialMatches } from '../services/geminiService';
import { Button } from './Button';
import { X, Heart, MessageCircle, MapPin, Calendar, Wallet } from 'lucide-react';

interface MatchFeedProps {
  currentUser: UserProfile;
  onStartChat: (user: UserProfile) => void;
}

export const MatchFeed: React.FC<MatchFeedProps> = ({ currentUser, onStartChat }) => {
  const [candidates, setCandidates] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      const matches = await generatePotentialMatches(currentUser);
      setCandidates(matches);
      setLoading(false);
    };
    fetchMatches();
  }, [currentUser]);

  const handleAction = (action: 'pass' | 'like') => {
    if (action === 'like') {
        // In a real app, this would create a match record
        // Here we just simulate interest
    }
    setCurrentIndex(prev => prev + 1);
  };

  const currentCandidate = candidates[currentIndex];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="w-16 h-16 border-4 border-travel-secondary border-t-travel-primary rounded-full animate-spin mb-4"></div>
        <p className="text-travel-dark font-medium">La IA está buscando a tus compañeros ideales...</p>
      </div>
    );
  }

  if (!currentCandidate) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <div className="bg-travel-secondary/30 p-6 rounded-full mb-4">
          <Heart className="h-12 w-12 text-travel-primary" />
        </div>
        <h3 className="text-xl font-bold text-travel-dark mb-2">¡Has visto todos los perfiles!</h3>
        <p className="text-gray-500 mb-6">Vuelve más tarde para ver nuevos viajeros en {currentUser.destination}.</p>
        <Button onClick={() => setCurrentIndex(0)} variant="outline">Revisar de nuevo</Button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col p-4 max-w-md mx-auto mb-20">
      <div className="flex-1 relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Image Section */}
        <div className="relative h-2/3 bg-gray-200">
          <img 
            src={currentCandidate.avatarUrl} 
            alt={currentCandidate.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6 pt-20">
             <h2 className="text-3xl font-bold text-white mb-1">
               {currentCandidate.name}, {currentCandidate.age}
             </h2>
             <div className="flex items-center text-white/90 text-sm gap-2">
                <MapPin size={14} /> {currentCandidate.country}
             </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex gap-4 mb-4 text-sm text-gray-600">
             <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
               <Calendar size={14} className="text-travel-accent" /> {currentCandidate.dates}
             </span>
             <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
               <Wallet size={14} className="text-travel-accent" /> {currentCandidate.budget}
             </span>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">{currentCandidate.bio}</p>
          
          <div className="flex flex-wrap gap-2">
            {currentCandidate.travelStyle.map(s => (
              <span key={s} className="px-3 py-1 bg-travel-secondary/40 text-travel-dark rounded-full text-xs font-semibold">
                {s}
              </span>
            ))}
            {currentCandidate.interests.map(i => (
              <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button 
          onClick={() => handleAction('pass')}
          className="w-14 h-14 rounded-full bg-white shadow-lg text-gray-400 flex items-center justify-center hover:bg-gray-50 hover:text-red-500 transition-colors border border-gray-100"
        >
          <X size={28} />
        </button>
        
        <button 
          onClick={() => onStartChat(currentCandidate)}
          className="w-12 h-12 rounded-full bg-travel-accent shadow-lg text-white flex items-center justify-center hover:bg-opacity-90 transition-colors mt-2"
          title="Send Message directly"
        >
          <MessageCircle size={22} />
        </button>

        <button 
          onClick={() => handleAction('like')}
          className="w-14 h-14 rounded-full bg-white shadow-lg text-travel-primary flex items-center justify-center hover:bg-travel-primary hover:text-white transition-colors border border-travel-primary"
        >
          <Heart size={28} />
        </button>
      </div>
    </div>
  );
};