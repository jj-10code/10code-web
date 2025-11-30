# 10code Web - Proyecto Astro + Strapi con Docker

Proyecto web completo con Astro como frontend y Strapi como CMS headless, completamente dockerizado para facilitar el desarrollo y despliegue.

## Características

- **Frontend**: Astro 5.x para una web rápida y moderna
- **Backend/CMS**: Strapi 5.x como headless CMS
- **Base de Datos**: PostgreSQL 16
- **Node.js**: v20 LTS
- **Containerización**: Docker y Docker Compose v2
- **Desarrollo**: Hot reload en ambos servicios

## Estructura del Proyecto

```
10code-web/
├── frontend/              # Aplicación Astro
│   ├── src/
│   │   ├── pages/        # Páginas del sitio
│   │   ├── layouts/      # Layouts compartidos
│   │   ├── components/   # Componentes reutilizables
│   │   └── lib/          # Utilidades y helpers
│   ├── public/           # Archivos estáticos
│   └── Dockerfile
├── backend/              # API Strapi
│   ├── config/          # Configuración de Strapi
│   ├── src/
│   │   └── api/         # Content types y controladores
│   ├── public/          # Archivos públicos y uploads
│   └── Dockerfile
└── docker-compose.yml   # Orquestación de servicios
```

## Requisitos Previos

- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)
- Git

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd 10code-web
```

### 2. Configurar variables de entorno

**Backend (opcional, ya configurado en docker-compose.yml):**
```bash
cp backend/.env.example backend/.env
```

**Frontend (opcional, ya configurado en docker-compose.yml):**
```bash
cp frontend/.env.example frontend/.env
```

### 3. Iniciar los servicios con Docker

```bash
docker-compose up -d
```

Este comando:
- Descargará las imágenes necesarias
- Creará y configurará la base de datos PostgreSQL
- Instalará las dependencias de Node.js en ambos servicios
- Iniciará Strapi en modo desarrollo (puerto 1337)
- Iniciará Astro en modo desarrollo (puerto 4321)

### 4. Verificar que los servicios están funcionando

- **Frontend (Astro)**: http://localhost:4321
- **Backend (Strapi Admin)**: http://localhost:1337/admin
- **API de Strapi**: http://localhost:1337/api

## Configuración Inicial de Strapi

### Primera vez

1. Accede a http://localhost:1337/admin
2. Crea tu cuenta de administrador
3. Configura los Content Types necesarios

### Content Types Recomendados

#### 1. Post (para el blog)

Campos sugeridos:
- `title` (Text)
- `slug` (UID basado en title)
- `content` (Rich Text)
- `excerpt` (Text - área de texto)
- `featuredImage` (Media - imagen única)
- `readingTime` (Number)
- `publishedAt` (Date)
- Relaciones:
  - `author` (Relation - Many-to-One con Author)
  - `categories` (Relation - Many-to-Many con Category)

#### 2. Author

Campos sugeridos:
- `name` (Text)
- `bio` (Text - área de texto)
- `image` (Media - imagen única)
- `email` (Email)

#### 3. Category

Campos sugeridos:
- `name` (Text)
- `slug` (UID basado en name)

#### 4. Project (para el portfolio)

Campos sugeridos:
- `title` (Text)
- `description` (Rich Text)
- `slug` (UID basado en title)
- `image` (Media - imagen única)
- `url` (Text)
- `technologies` (JSON o Relation con Technology)
- `featured` (Boolean)

### Configurar Permisos Públicos

Para que el frontend pueda acceder a la API:

1. Ve a **Settings → Users & Permissions Plugin → Roles → Public**
2. Habilita permisos `find` y `findOne` para los content types que quieras exponer
3. Guarda los cambios

## Comandos Útiles

### Ver logs de todos los servicios
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f frontend
docker-compose logs -f strapi
docker-compose logs -f postgres
```

### Detener los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ elimina la base de datos)
```bash
docker-compose down -v
```

### Reconstruir las imágenes
```bash
docker-compose up -d --build
```

### Ejecutar comandos dentro de un contenedor

**Strapi:**
```bash
docker-compose exec strapi sh
```

**Frontend:**
```bash
docker-compose exec frontend sh
```

### Instalar nuevas dependencias

**Strapi:**
```bash
docker-compose exec strapi npm install <paquete>
```

**Frontend:**
```bash
docker-compose exec frontend npm install <paquete>
```

## Desarrollo

### Frontend (Astro)

Los archivos en `frontend/src` se recargan automáticamente gracias al hot reload.

**Crear nueva página:**
```bash
# Crea un archivo en frontend/src/pages/
touch frontend/src/pages/nueva-pagina.astro
```

**Consumir API de Strapi:**

Ejemplo en un componente Astro:
```astro
---
import { fetchStrapi } from '../lib/strapi';

const posts = await fetchStrapi({
  endpoint: 'posts',
  query: {
    populate: ['author', 'featuredImage'],
    sort: ['publishedAt:desc'],
  },
});
---

<div>
  {posts.data.map(post => (
    <article>
      <h2>{post.attributes.title}</h2>
      <p>{post.attributes.excerpt}</p>
    </article>
  ))}
</div>
```

### Backend (Strapi)

Los cambios en `backend/src` se recargan automáticamente.

**Crear nuevo Content Type:**
1. Usa el Content-Type Builder en el admin panel
2. Los archivos se generarán en `backend/src/api/`

**Lifecycle Hooks:**

Ejemplo para calcular reading time automáticamente:
```javascript
// backend/src/api/post/content-types/post/lifecycles.js
const readingTime = require('reading-time');

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.content) {
      const stats = readingTime(data.content);
      data.readingTime = Math.ceil(stats.minutes);
    }
  },
  async beforeUpdate(event) {
    const { data } = event.params;
    if (data.content) {
      const stats = readingTime(data.content);
      data.readingTime = Math.ceil(stats.minutes);
    }
  },
};
```

## Páginas Implementadas

- **/** - Landing page
- **/servicios** - Página de servicios
- **/nosotros** - Sobre nosotros
- **/portfolio** - Portfolio de proyectos
- **/blog** - Listado de posts del blog
- **/contacto** - Formulario de contacto
- **/trabaja-con-nosotros** - Formulario de envío de CV

## Próximos Pasos

1. **Configurar Content Types en Strapi** siguiendo las recomendaciones anteriores
2. **Habilitar permisos públicos** para los endpoints necesarios
3. **Crear contenido de ejemplo** para probar el sitio
4. **Descomentar el código** en las páginas que consumen la API (ej: `/blog`)
5. **Personalizar estilos** según la identidad de marca
6. **Implementar formularios** conectados a Strapi
7. **Configurar upload de archivos** para el formulario de CV

## Producción

### Cambiar a modo producción

1. Modifica `docker-compose.yml`:
   - Cambia `NODE_ENV=development` a `NODE_ENV=production`
   - Actualiza las secrets y keys
   - Configura CORS apropiadamente

2. Para Astro, cambia el comando a:
   ```yaml
   command: sh -c "npm install && npm run build && npm run preview -- --host"
   ```

3. Para Strapi, cambia el comando a:
   ```yaml
   command: sh -c "npm install && npm run build && npm run start"
   ```

### Seguridad en Producción

⚠️ **IMPORTANTE**: Antes de desplegar a producción:

1. Cambia todas las secrets en `docker-compose.yml`:
   - `JWT_SECRET`
   - `ADMIN_JWT_SECRET`
   - `APP_KEYS`
   - `API_TOKEN_SALT`

2. Cambia las credenciales de PostgreSQL

3. Configura CORS apropiadamente en `backend/config/middlewares.js`

4. Usa variables de entorno en lugar de hardcodear valores

## Troubleshooting

### Los contenedores no inician
```bash
# Ver logs para identificar el problema
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose up -d --build
```

### Error de conexión a la base de datos
```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Reiniciar solo PostgreSQL
docker-compose restart postgres
```

### Cambios no se reflejan
```bash
# Verificar que los volúmenes están montados correctamente
docker-compose down
docker-compose up -d
```

### Problemas con node_modules
```bash
# Reconstruir las imágenes
docker-compose down
docker-compose up -d --build
```

## Tecnologías Utilizadas

- [Astro 5.x](https://astro.build/) - Framework frontend de última generación
- [Strapi 5.x](https://strapi.io/) - Headless CMS con API REST y GraphQL
- [PostgreSQL 16](https://www.postgresql.org/) - Base de datos relacional
- [Node.js 20 LTS](https://nodejs.org/) - Runtime de JavaScript
- [Docker Compose v2](https://www.docker.com/) - Orquestación de contenedores
- [TypeScript 5.7](https://www.typescriptlang.org/) - Tipado estático para JavaScript

## Licencia

MIT

## Contacto

Para más información, visita [10code.com](https://10code.com)
