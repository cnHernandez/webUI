# Sistema de Gestión de Flota de Colectivos — Frontend

Aplicación web para la gestión integral de la flota de colectivos de la empresa. Permite llevar el control de cubiertas (gomería), cambios de aceite y vencimientos de VTV por unidad, con un sistema de autenticación por roles.

---

## Módulos principales

### Gomería (Cubiertas)
Gestión completa del ciclo de vida de los neumáticos:

| Pestaña | Descripción |
|---|---|
| **Ingreso** | Alta de cubiertas nuevas al sistema con número de serie y datos técnicos |
| **Rotación** | Registro de montaje y desmontaje de cubiertas en los colectivos |
| **Stock** | Visualización del inventario actual de cubiertas disponibles |
| **Historial** | Historial completo de movimientos de cada cubierta |

### Aceite
Control de cambios de aceite por colectivo:

| Pestaña | Descripción |
|---|---|
| **Listado** | Lista de colectivos con estado del último cambio de aceite y kilometraje |
| **Historial** | Historial de todos los cambios de aceite registrados |

### Colectivos VTV
Seguimiento de la Verificación Técnica Vehicular (VTV) por unidad:

| Pestaña | Descripción |
|---|---|
| **Listado** | Lista de colectivos con fecha de vencimiento de VTV |
| **Historial VTV** | Historial de inspecciones técnicas por unidad |
| **Ingreso** | Registro de nuevos colectivos en el sistema |

### Configuración de Usuarios *(solo Administrador)*
Gestión de cuentas de usuario con dos roles disponibles:

- **Administrador** — acceso completo a todos los módulos y configuración de usuarios.
- **Gomeria** — acceso restringido a las pestañas de ingreso, rotación y stock de cubiertas.

---

## Stack tecnológico

| Tecnología | Versión |
|---|---|
| React | 19 |
| TypeScript | ~5.8 |
| Vite | 7 |
| Tailwind CSS | 4 |
| React Router DOM | 7 |
| React Icons | 5 |

---

## Inicio rápido

### Desarrollo local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Crear un archivo `.env` en la raíz con las variables necesarias:

```env
VITE_API_BASE_URL=http://localhost:PUERTO_DE_TU_API
```

### Build de producción

```bash
npm run build
```

### Docker

```bash
docker compose up --build
```

La aplicación queda disponible en `http://localhost:8080`.

---

## Seguridad

Todas las peticiones a la API incluyen la cabecera `X-API-KEY` para autenticación.  
La clave se define en `.env` como `VITE_API_KEY`.

> **Nunca subas el archivo `.env` al repositorio.** Usa `.env.example` como plantilla para documentar las variables requeridas.

---

## Estructura del proyecto

```
src/
├── Aceite/          # Módulo de cambio de aceite
├── Colectivos/      # Módulo de VTV y gestión de colectivos
├── Cubiertas/       # Módulo de gomería (cubiertas)
├── Layout/          # Sidebar, menú y header
├── models/          # Tipos e interfaces TypeScript
├── serviceCambioAceite/
├── serviceColectivo/
├── serviceCubierta/
├── serviceKilometraje/
├── serviceUsuario/
├── Usuarios/        # Login y configuración de usuarios
└── utils/           # Servicio HTTP con autenticación
```
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
