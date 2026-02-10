import React, { useState } from 'react';
import { UserProfile, LanguageCode } from '../types';
import { Plane, Save, Camera, Globe2, ChevronLeft } from 'lucide-react';
import { Button } from './Button';

interface ProfileViewProps {
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  language: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateUser,
  onLogout,
  language,
  onChangeLanguage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(currentUser);

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(currentUser);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white min-h-screen pb-24">
        <div className="flex items-center gap-2 mb-6 mt-4">
          <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={22} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-travel-dark">Editar Perfil</h2>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src={formData.avatarUrl} className="w-28 h-28 rounded-full object-cover opacity-80" alt="Profile" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="text-gray-800 bg-white/50 p-2 rounded-full w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Nombre</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Edad</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">País</label>
              <input 
                type="text" 
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Bio</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none h-24 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Próximo Destino</label>
            <input 
              type="text" 
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
            />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-gray-600">Fechas</label>
             <input 
              type="text" 
              value={formData.dates}
              onChange={(e) => setFormData({...formData, dates: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-travel-primary focus:outline-none"
            />
          </div>

          <Button onClick={handleSave} fullWidth className="mt-6">
            <Save size={18} /> Guardar Cambios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white min-h-screen pb-24">
       <div className="text-center mb-8 mt-10">
         <div className="relative inline-block">
           <img src={currentUser.avatarUrl} className="w-28 h-28 rounded-full border-4 border-travel-secondary object-cover" alt="Profile" />
           <button 
            onClick={() => setIsEditing(true)}
            className="absolute bottom-0 right-0 bg-travel-accent text-white p-2 rounded-full border-2 border-white hover:bg-opacity-90 transition"
           >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
           </button>
         </div>
         <h2 className="text-2xl font-bold mt-4 text-travel-dark">{currentUser.name}, {currentUser.age}</h2>
         <p className="text-gray-500">{currentUser.country}</p>
         <p className="text-gray-500 text-sm mt-1">{currentUser.email}</p>
       </div>

       <div className="space-y-4">
         <div className="bg-gray-50 p-4 rounded-xl">
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Ajustes</h3>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2 text-gray-700">
               <Globe2 size={18} className="text-travel-primary" />
               <span className="font-medium text-sm">Idioma</span>
             </div>
             <button
               onClick={() => onChangeLanguage(language === 'es' ? 'en' : 'es')}
               className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 hover:bg-gray-100"
             >
               {language === 'es' ? 'Español' : 'English'}
             </button>
           </div>
         </div>

         <div className="bg-gray-50 p-4 rounded-xl">
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Próximo destino</h3>
           <div className="flex items-center gap-2 text-travel-dark font-semibold">
             <Plane size={18} className="text-travel-primary" />
             {currentUser.destination} ({currentUser.dates})
           </div>
         </div>

         <div className="bg-gray-50 p-4 rounded-xl">
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Presupuesto</h3>
           <p className="font-medium text-travel-dark">{currentUser.budget}</p>
         </div>

         <div className="bg-gray-50 p-4 rounded-xl">
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Bio</h3>
           <p className="text-gray-600 text-sm leading-relaxed">{currentUser.bio}</p>
         </div>

         <div className="bg-gray-50 p-4 rounded-xl">
           <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Intereses</h3>
           <div className="flex flex-wrap gap-2">
             {currentUser.interests.map(i => (
               <span key={i} className="bg-white px-3 py-1 rounded-full text-sm shadow-sm text-gray-600">{i}</span>
             ))}
           </div>
         </div>
         
         <button 
          onClick={onLogout}
          className="w-full py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors mt-8"
         >
           Cerrar Sesión
         </button>
       </div>
    </div>
  );
};