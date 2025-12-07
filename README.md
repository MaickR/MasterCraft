# MasterCraft Uniforms - Soluciones Textiles & Dotación Industrial 🏭👕

![MasterCraft Banner](https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop)

> **Plataforma web corporativa para MasterCraft Uniforms**, empresa líder con más de 45 años de experiencia en la fabricación de uniformes personalizados, dotación industrial y seguridad en Colombia.

---

## 📋 Descripción del Proyecto

Este repositorio aloja el código fuente del sitio web oficial de **MasterCraft Uniforms**. La plataforma ha sido diseñada para reflejar la solidez y trayectoria de la compañía, ofreciendo a los clientes corporativos una experiencia de usuario fluida para la consulta de productos y solicitud de cotizaciones.

El sistema integra un **Frontend moderno y responsive** con un **Backend en Node.js** que gestiona la captura de leads y la integración con canales de comunicación directa como WhatsApp.

## ✨ Características Principales

### 🏢 Identidad Corporativa & Contenido
- **Historia y Trayectoria:** Sección detallada sobre los 45 años de experiencia y fundación en 1998.
- **Infraestructura:** Visualización de la capacidad operativa (10 puntos de venta, 3 bodegas, flota propia).
- **Clientes:** Carrusel de aliados estratégicos (Ecopetrol, Cerrejón, Constructora Capital).

### 🛒 Catálogo & Experiencia de Usuario
- **Showcase de Productos:** Categorías claras (Industrial, Seguridad, Bioseguridad).
- **Vista Rápida (Quick View):** Modales interactivos con detalles de producto y botón de cotización directa.
- **Diseño Responsive:** Adaptabilidad total a dispositivos móviles, tablets y escritorio.

### 🔌 Funcionalidades Técnicas
- **Gestión de Contacto:** Formulario validado con almacenamiento de leads en Excel (`.xlsx`).
- **Integración WhatsApp:** Redirección inteligente con mensajes pre-llenados para agilizar la atención.
- **Backend API:** Servidor Express.js robusto con manejo de CORS y validación de datos.
- **Seguridad:** Implementación de Rate Limiting y sanitización de inputs.

---

## 🛠️ Stack Tecnológico

| Área | Tecnologías |
|------|-------------|
| **Frontend** | HTML5, CSS3, Bootstrap 3, jQuery, Revolution Slider, Owl Carousel |
| **Backend** | Node.js, Express.js |
| **Datos** | XLSX (Librería para gestión de hojas de cálculo) |
| **Herramientas** | Git, VS Code, npm |

---

## 🚀 Instalación y Despliegue

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/MaickR/MasterCraft.git
cd MasterCraft
```

### 2. Configurar el Backend
El servidor backend maneja el formulario de contacto y la generación de leads.

```bash
cd server
npm install
```

### 3. Iniciar el Servidor
```bash
node server.js
# El servidor iniciará en http://localhost:3000
```

### 4. Ejecutar el Frontend
Puedes abrir el archivo `index.html` directamente en tu navegador o usar una extensión como **Live Server** en VS Code para servir los archivos estáticos.

---

## 📂 Estructura del Proyecto

```
MasterCraft/
├── css/                 # Estilos y hojas de cascada
├── fonts/               # Tipografías e iconos
├── images/              # Recursos gráficos optimizados
├── js/                  # Lógica frontend y plugins
├── leads/               # Almacenamiento de contactos (generado por backend)
├── server/              # Código fuente del servidor Node.js
│   ├── server.js        # Punto de entrada del API
│   └── package.json     # Dependencias del backend
├── index.html           # Página principal
└── README.md            # Documentación del proyecto
```

---

## 📞 Contacto y Soporte

Para soporte técnico o consultas sobre el desarrollo:

*   **Desarrollador:** [MaickR](https://github.com/MaickR)
*   **Empresa:** MasterCraft Uniforms Diseño Y Fabricación Sas
*   **Ubicación:** Bogotá D.C., Colombia

---
*© 2025 MasterCraft Uniforms. Todos los derechos reservados.*
