import { UserProfile } from "../types";

const API_BASE_URL = "http://localhost:4000/api";

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/me`);

    if (res.status === 204) {
      // No hay usuario guardado todavía
      return null;
    }

    if (!res.ok) {
      console.error("Error al obtener el usuario:", await res.text());
      return null;
    }

    const data = (await res.json()) as UserProfile;
    return data;
  } catch (error) {
    console.error("Error de red al obtener usuario:", error);
    return null;
  }
}

export async function saveCurrentUser(
  profile: UserProfile
): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    if (!res.ok) {
      console.error("Error al guardar el usuario:", await res.text());
      return null;
    }

    const data = (await res.json()) as UserProfile;
    return data;
  } catch (error) {
    console.error("Error de red al guardar usuario:", error);
    return null;
  }
}

