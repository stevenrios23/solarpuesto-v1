# SolarPuesto V1.0 — Cómo abrir la app

Esta carpeta es la **aplicación** (React + Vite). No se abre con doble clic sobre `index.html`. Necesitas ejecutarla con un servidor de desarrollo.

## Requisitos
1. Instala **Node.js LTS** desde https://nodejs.org (18 o superior, se recomienda la versión LTS).
2. Verifica en PowerShell:
   ```
   node -v
   npm -v
   ```

## Pasos
1. Descomprime esta carpeta donde quieras (p. ej. `C:\SolarPuesto\app`).
2. Abre PowerShell en la carpeta del proyecto (donde está el archivo `package.json`):
   ```
   cd C:\SolarPuesto\app
   ```
3. Instala las dependencias:
   ```
   npm install
   ```
   (Este paso descarga React, Vite y Vitest. Solo se hace la primera vez.)
4. Arranca el servidor de desarrollo:
   ```
   npm run dev
   ```
5. Abre en el navegador la dirección que muestra la consola (normalmente):
   ```
   http://localhost:5173
   ```
6. Para detener el servidor: `Ctrl + C` en la ventana de PowerShell.

## Notas
- **No** abras `index.html` directamente: la página saldrá en blanco. Siempre usa `npm run dev`.
- Si el puerto 5173 está ocupado, Vite te propone otro puerto automáticamente.
- Comandos útiles:
  - `npm test` → ejecuta las pruebas (Vitest).
  - `npm run build` → genera la versión de producción en la carpeta `dist`.
  - `npm run preview` → sirve la versión de producción localmente.

Proyecto: SolarPuesto V1.0 — Calculadora de potencia y material para puestos de comercio informal.
Metodología XP · React + Vite · JavaScript · Vitest.