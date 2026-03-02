import { UserProfile, LanguageCode, ThemeMode } from "../types";

const resolveApiBaseUrl = (): string => {
  const envBase = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  if (envBase && envBase.trim()) {
    return envBase.replace(/\/$/, "");
  }

  if (typeof window === "undefined") {
    return "http://localhost:4000/api";
  }

  const { origin, hostname, port } = window.location;
  const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";
  const localFrontendPorts = new Set(["3000", "4173", "5173"]);

  if (isLocalHost && localFrontendPorts.has(port)) {
    return "http://localhost:4000/api";
  }

  return `${origin.replace(/\/$/, "")}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

if (typeof window !== "undefined") {
  console.log("[API][INIT] API_BASE_URL resuelta", {
    origin: window.location.origin,
    apiBaseUrl: API_BASE_URL,
  });
}

export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
  role?: "cliente" | "empresa";
  destination?: string;
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
  const endpoint = `${API_BASE_URL}/auth/register`;
  const requestStartedAt = Date.now();
  console.log("[API][REGISTER] Preparando request", {
    endpoint,
    payloadPreview: {
      ...payload,
      password: `***hidden***(${payload.password.length})`,
    },
  });

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log("[API][REGISTER] Response recibida", {
    endpoint,
    ok: res.ok,
    status: res.status,
    statusText: res.statusText,
    elapsedMs: Date.now() - requestStartedAt,
  });

  let data: any = null;
  let fallbackText: string | null = null;

  try {
    data = await res.json();
    console.log("[API][REGISTER] Body parseado como JSON", {
      type: typeof data,
      hasId: !!data?.id,
      hasError: !!data?.error,
    });
  } catch {
    console.warn("[API][REGISTER] No se pudo parsear JSON, intentando leer texto");
    // Si no es JSON válido, intentamos leer el cuerpo como texto
    try {
      fallbackText = await res.clone().text();
      console.log("[API][REGISTER] Body fallback en texto", {
        length: fallbackText?.length || 0,
        preview: fallbackText?.slice(0, 200),
      });
    } catch {
      console.error("[API][REGISTER] Tampoco se pudo leer body como texto");
      // ignoramos el error, nos quedamos sin cuerpo legible
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.error || data.message)) ||
      fallbackText ||
      "Error al registrar usuario";
    console.error("[API][REGISTER] Request fallida", {
      endpoint,
      status: res.status,
      statusText: res.statusText,
      message,
    });
    throw new Error(message);
  }

  console.log("[API][REGISTER] Request exitosa", {
    endpoint,
    userId: data?.id,
    userEmail: data?.email,
  });

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
  let fallbackText: string | null = null;

  try {
    data = await res.json();
  } catch {
    // Si no es JSON válido, intentamos leer el cuerpo como texto
    try {
      fallbackText = await res.text();
    } catch {
      // ignoramos el error, nos quedamos sin cuerpo legible
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.error || data.message)) ||
      fallbackText ||
      "Error al iniciar sesión";
    throw new Error(message);
  }

  // El servidor respondió 200 pero el cuerpo no es un JSON de usuario válido
  if (!data || typeof data !== "object") {
    throw new Error(
      fallbackText || "Respuesta inválida del servidor al iniciar sesión"
    );
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

