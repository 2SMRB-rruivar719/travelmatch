import { UserProfile, LanguageCode, ThemeMode } from "../types";

const API_BASE_URL = "http://localhost:4000/api";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "cliente" | "empresa";
  destination: string;
  dates?: string;
  age?: number;
  country?: string;
  bio?: string;
  budget?: UserProfile["budget"];
  travelStyle?: UserProfile["travelStyle"];
  interests?: UserProfile["interests"];
  avatarUrl?: string;
  language?: LanguageCode;
  theme?: ThemeMode;
}

export async function registerUser(
  payload: RegisterPayload
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignoramos error de parseo, usamos texto plano si hace falta
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.error) ||
      "Error al registrar usuario";
    throw new Error(message);
  }

  return data as UserProfile;
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignoramos error de parseo
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.error) ||
      "Error al iniciar sesión";
    throw new Error(message);
  }

  return data as UserProfile;
}

export async function updateUserProfile(
  id: string,
  profile: Partial<UserProfile>
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Error al actualizar usuario");
  }

  return (await res.json()) as UserProfile;
}

