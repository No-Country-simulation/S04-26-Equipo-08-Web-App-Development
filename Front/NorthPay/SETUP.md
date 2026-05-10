# Instrucciones de Configuración - Frontend NorthPay

## Configuración del Backend

Antes de ejecutar el frontend, asegúrate de que el backend esté corriendo:

1. Navega a la carpeta del servidor:
   ```bash
   cd server
   ```

2. Instala las dependencias (si no lo has hecho):
   ```bash
   npm install
   ```

3. Configura las variables de entorno (crea un archivo `.env` basado en `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Inicia el servidor:
   ```bash
   npm start
   ```
   El backend debería estar corriendo en `http://localhost:3000`

## Configuración del Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd Front/NorthPay
   ```

2. Instala las dependencias (si no lo has hecho):
   ```bash
   npm install
   ```

3. El archivo `.env` ya está configurado con:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Inicia la aplicación frontend:
   ```bash
   npm run dev
   ```

5. Abre tu navegador en la URL que aparece en la consola (generalmente `http://localhost:5173`)

## Navegación

Una vez que la aplicación esté corriendo, podrás navegar usando la barra de navegación:

- **Home**: Página principal (`/`)
- **Test**: Página de pruebas de conexión con el backend (`/test`)
- **Login**: Página de inicio de sesión (`/login`)

## Página de Pruebas (/test)

La página de pruebas incluye un botón "Probar /admin-check" que:
- Se conecta a la ruta `/api/admin-check` del backend
- Muestra la respuesta del servidor o errores de conexión
- Útil para verificar que la comunicación frontend-backend funciona correctamente

## Solución de Problemas

### Error de Conexión con el Backend
Si la página de pruebas muestra errores de conexión:
1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Verifica que el archivo `.env` del frontend tenga la URL correcta
3. Reinicia el servidor frontend después de cambiar el `.env`

### Errores de Base de Datos
Si el backend responde con errores de base de datos:
1. Verifica que la base de datos esté configurada correctamente
2. Revisa el archivo `.env` del backend
3. Asegúrate de que las migraciones se hayan ejecutado