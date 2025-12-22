# LDB (Lairen Deck Builder)


*Descripción organizada con AI*
# 🗺️ Roadmap y Estructura del Proyecto

Este proyecto sigue un **enfoque DDD (Domain-Driven Design)**, organizando el código en capas bien definidas para mantener separación de responsabilidades, escalabilidad y claridad.

---

## 📁 Estructura de Carpetas

### **App/**
Contiene la lógica principal del dominio y las reglas de negocio siguiendo el estilo DDD.

- **Infrastructure/** → Lógica de salida, acceso a datos externos, APIs, etc.
- **Models/** → Entidades y agregados del dominio.
- **Application/** → Coordina la lógica de negocio utilizando la infraestructura. Define casos de uso y servicios.
  > ⚙️ Solo debería interactuar con la capa `App`, nunca directamente con UI.
- **Presenter/** → Puente entre la capa de aplicación y la interfaz de usuario.
  Gestiona cómo se presenta la información proveniente de `Application` hacia la UI. Estos
generalmente son **Servers, Actions, RouteLoaders** esto es debido a que de esta manera el container solo se crea y existe
dentro del servidor.

---

### **Ruta/**
Contiene la lógica específica de cada ruta y sus componentes asociados.

- **Loaders / Actions/** → Actúan como *callers* o controladores.
  Normalmente invocan a los *presenters* para ejecutar la lógica completa de la ruta.

---

### **UI/**
Contiene la gestión del estado y la representación visual de la aplicación (frontend).

- **Models/** → Definición de la estructura de datos del estado de la app.
- **Store/** → Lógica para manejar el estado global o local de la aplicación (inspirado en DDD).

---

### **Features/**
Componentes y módulos funcionales que representan partes concretas de la aplicación.
Se utilizan dentro de las rutas para construir pantallas o secciones específicas.

---

### **Componentes/**
Componentes **compartidos y reutilizables** entre distintas *features*.
Incluye UI genérica, layouts, botones, inputs, etc.

---

## 🧩 Roadmap / TODO

- 🔁 **Refactorizar lógica pesada hacia RPC (STP)** para mejorar rendimiento y agregar atomicidad(transactions).
- 📦 **Estandarizar naming** según el patrón actual usado en `Album`.
- 📦 **Projecciones** Los use case/application service deberian devolver projecciones y no AR/entidades de dominios.
- 📦 **Interfaces** Agregar interfaces de los repositorios
- 🧹 **Eliminar** carpetas o patrones obsoletos:
  `providers/`, `models/`, `actions/`, `services/`, `stores/`.
- 🔍 **Revisar y optimizar** `plugins/`, `lib/`, `hooks/`, `exception/`.

---

## 💡 Notas
El objetivo principal de esta estructura es:
- Mantener **alta cohesión** dentro de cada capa.
- Evitar dependencias cruzadas innecesarias.
- Facilitar la escalabilidad y mantenibilidad del código.

---

## Local Development con supabase

### Inicializar supabase
```shell
pnpm supabase start -x vector
```

### Correr migrations
```shell
pnpm supabase migration up
```

### Generar types de la database
```shell
supabase gen types typescript --local > ./database.types.ts
```

### Correr los seeders
Correr todos los seeders de ``supabase/seeders``
