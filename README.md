<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TravelMatch

Aplicación para matching de viajeros + itinerarios con IA + backend Express/MongoDB.

## Requisitos

- Node.js 22+
- MongoDB en `localhost:27017`

## Configuración

Crear `.env.local` en la raíz:

```bash
GEMINI_API_KEY=tu_api_key
# opcional: sobreescribir API base
# VITE_API_BASE_URL=http://localhost:4000/api
# opcional: sobreescribir URI Mongo
# MONGODB_URI=mongodb://127.0.0.1:27017/travelmatch
```

## Instalación

```bash
npm install
cd server && npm install
```

## Scripts principales (raíz)

- `npm run dev`: frontend Vite
- `npm run dev:server`: backend API
- `npm run dev:full`: frontend + backend
- `npm run typecheck`: verificación TypeScript
- `npm run build`: build de producción
- `npm run test:register`: prueba de registro contra API local

## API de diagnóstico

- `GET http://localhost:4000/api/health`
  - devuelve estado de API y conexión de MongoDB (`mongoStateLabel`)
