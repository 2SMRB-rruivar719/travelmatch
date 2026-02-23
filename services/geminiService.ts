import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Itinerary, TravelStyle } from "../types";

// Initialize Gemini
// Note: In a real production app, ensure strict server-side validation or proxying.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generatePotentialMatches = async (userProfile: UserProfile): Promise<UserProfile[]> => {
  try {
    const prompt = `
      Generate 8 fictional traveler profiles that would be a good match for someone with the following profile:
      Name: ${userProfile.name}
      Age: ${userProfile.age}
      Budget: ${userProfile.budget}
      Style: ${userProfile.travelStyle.join(', ')}
      Interests: ${userProfile.interests.join(', ')}
      Destination: ${userProfile.destination}
      
      The matches should have diverse backgrounds but compatible travel styles.
      Return the data in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              age: { type: Type.INTEGER },
              country: { type: Type.STRING },
              bio: { type: Type.STRING },
              budget: { type: Type.STRING, enum: ["Bajo", "Medio", "Alto"] },
              travelStyle: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              interests: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              destination: { type: Type.STRING },
              dates: { type: Type.STRING }
            },
            required: ["name", "age", "country", "bio", "budget", "travelStyle", "interests"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    
    // Enrich with avatar URLs (mock images, alta resolución)
    return data.map((profile: any, index: number) => ({
      ...profile,
      id: `match-${index}-${Date.now()}`,
      avatarUrl: `https://picsum.photos/seed/${profile.name.replace(' ', '')}/600/600`
    }));

  } catch (error) {
    console.error("Error generating matches:", error);
    // Return fallback data if API fails (varios usuarios)
    return [
      {
        id: 'fallback-1',
        name: 'Elena Gómez',
        age: 26,
        country: 'Argentina',
        bio: 'Amante de la fotografía y el café. Busco explorar rincones ocultos.',
        budget: 'Medio',
        travelStyle: [TravelStyle.CULTURAL, TravelStyle.BACKPACKER],
        interests: ['Fotografía', 'Historia'],
        avatarUrl: 'https://picsum.photos/seed/elena/600/600',
        destination: userProfile.destination,
        dates: userProfile.dates,
        email: 'elena@example.com',
        role: 'cliente',
        language: 'es',
        theme: 'light',
      },
      {
        id: 'fallback-2',
        name: 'Marco Silva',
        age: 30,
        country: 'Brasil',
        bio: 'Apasionado por la naturaleza y el trekking.',
        budget: 'Bajo',
        travelStyle: [TravelStyle.ADVENTURE, TravelStyle.BACKPACKER],
        interests: ['Senderismo', 'Playas'],
        avatarUrl: 'https://picsum.photos/seed/marco/600/600',
        destination: userProfile.destination,
        dates: userProfile.dates,
        email: 'marco@example.com',
        role: 'cliente',
        language: 'es',
        theme: 'light',
      }
    ];
  }
};

export const generateItinerary = async (destination: string, duration: number, interests: string[], budget: string): Promise<Itinerary> => {
  try {
    const prompt = `
      Create a ${duration}-day itinerary for a trip to ${destination}.
      Focus on these interests: ${interests.join(', ')}.
      Budget level: ${budget}.
      Provide a structured JSON response.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        description: { type: Type.STRING },
                        location: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      id: `trip-${Date.now()}`,
      destination: data.destination || destination,
      days: data.days || []
    };

  } catch (error) {
    console.error("Error generating itinerary:", error);
    return {
      id: 'error-trip',
      destination: destination,
      days: []
    };
  }
};