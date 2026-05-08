### Documentación de Pruebas con Archivos .http

Para realizar pruebas de la API directamente desde Visual Studio Code sin necesidad de herramientas externas como Postman o Insomnia, utilizamos archivos con extensión `.http`.

#### 🔧 Extensión Necesaria

Para que estos archivos funcionen, debes instalar la siguiente extensión en VS Code:

- **Nombre:** REST Client
- **ID:** `humao.rest-client`
- **Enlace:** [REST Client en VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

#### 🚀 Cómo usar los archivos .http

1. Abre el archivo `server/doc/test.http`.
2. Verás un enlace pequeño de color azul llamado **"Send Request"** justo encima de cada método (GET, POST, etc.).
3. Haz clic en **"Send Request"** para ejecutar la petición.
4. El resultado aparecerá en una nueva pestaña a la derecha.

#### 📝 Ventajas

- **Control de Versiones:** Las pruebas se guardan en el repositorio junto con el código.
- **Variables:** Puedes definir variables como `@baseUrl` para cambiar fácilmente entre entornos (local, desarrollo, producción).
- **Simplicidad:** No necesitas configurar colecciones complejas en herramientas externas.
