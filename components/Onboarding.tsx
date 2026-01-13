import React, { useState } from 'react';
import { UserProfile, TravelStyle } from '../types';
import { Button } from './Button';
import { Compass, Calendar, DollarSign, MapPin, User, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    travelStyle: [],
    interests: [],
    budget: 'Medio'
  });

  const handleNext = () => setStep(p => p + 1);
  
  const handleComplete = () => {
    if (formData.name && formData.destination) {
      onComplete({
        id: 'user-me',
        name: formData.name,
        age: formData.age || 25,
        country: formData.country || 'Global',
        bio: formData.bio || 'Listo para viajar!',
        budget: formData.budget || 'Medio',
        travelStyle: formData.travelStyle || [],
        interests: formData.interests || [],
        avatarUrl: 'https://picsum.photos/seed/me/200/200',
        destination: formData.destination,
        dates: formData.dates || 'Próximamente'
      } as UserProfile);
    }
  };

  const toggleStyle = (style: TravelStyle) => {
    setFormData(prev => ({
      ...prev,
      travelStyle: prev.travelStyle?.includes(style)
        ? prev.travelStyle.filter(s => s !== style)
        : [...(prev.travelStyle || []), style]
    }));
  };

  return (
    <div className="flex flex-col h-full p-6 max-w-md mx-auto animate-fade-in bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl mt-4 mb-20 border border-white">
      <div className="flex-1">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mb-8">
          <div 
            className="bg-travel-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-travel-dark text-center">Cuéntanos sobre ti</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <User size={16} /> Nombre
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
                placeholder="Ej. Ana García"
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <MapPin size={16} /> ¿A dónde quieres ir?
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
                placeholder="Ej. Japón, Perú, Italia..."
                value={formData.destination || ''}
                onChange={e => setFormData({...formData, destination: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar size={16} /> ¿Cuándo?
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
                placeholder="Ej. Mayo 2024"
                value={formData.dates || ''}
                onChange={e => setFormData({...formData, dates: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-travel-dark text-center">Tu estilo de viaje</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Compass size={16} /> ¿Qué tipo de viajero eres?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(TravelStyle).map(style => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      formData.travelStyle?.includes(style)
                        ? 'bg-travel-secondary border-travel-primary text-travel-dark'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {style} {formData.travelStyle?.includes(style) && '✓'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign size={16} /> Presupuesto
              </label>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                {['Bajo', 'Medio', 'Alto'].map(b => (
                  <button
                    key={b}
                    onClick={() => setFormData({...formData, budget: b as any})}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      formData.budget === b
                        ? 'bg-white shadow-sm text-travel-accent'
                        : 'text-gray-500'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-travel-dark text-center">Intereses</h2>
            <p className="text-gray-500 text-center text-sm">Escribe tus intereses separados por comas para mejorar el matching con IA.</p>
            
            <textarea
              className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none resize-none"
              placeholder="Ej. Gastronomía, Museos, Senderismo, Fotografía..."
              value={formData.interests?.join(', ') || ''}
              onChange={e => setFormData({
                ...formData, 
                interests: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        {step < 3 ? (
          <Button 
            fullWidth 
            onClick={handleNext}
            disabled={step === 1 && (!formData.name || !formData.destination)}
          >
            Siguiente
          </Button>
        ) : (
          <Button fullWidth onClick={handleComplete}>
            <Check className="mr-2 h-5 w-5" /> Comenzar Aventura
          </Button>
        )}
      </div>
    </div>
  );
};