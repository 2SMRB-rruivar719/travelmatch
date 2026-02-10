export enum TravelStyle {
  BACKPACKER = 'Mochilero',
  LUXURY = 'Lujo',
  ADVENTURE = 'Aventura',
  CULTURAL = 'Cultural',
  RELAX = 'Relax',
  PARTY = 'Fiesta'
}

export type UserRole = 'cliente' | 'empresa';
export type LanguageCode = 'es' | 'en';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  country: string;
  bio: string;
  budget: 'Bajo' | 'Medio' | 'Alto';
  travelStyle: TravelStyle[];
  interests: string[];
  avatarUrl: string;
  destination: string;
  dates: string;
  role: UserRole;
  language: LanguageCode;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: {
    time: string;
    description: string;
    location: string;
  }[];
}

export interface Itinerary {
  id: string;
  destination: string;
  days: ItineraryDay[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

export interface ChatThreadType {
  id: string;
  name: string;
  avatarUrl: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  isGroup: boolean;
  messages: Message[];
}
