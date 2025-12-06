# Mastercraft Uniforms

Mastercraft Uniforms - Landing page and marketing site for a Colombian industrial uniform supplier. This repository contains a Bootstrap 3-based responsive landing page with product catalog previews, client testimonials, contact form with WhatsApp integration, and visual components tailored for the Colombian market.

---

## 🔧 Tecnologías usadas

- HTML5, CSS3
- Bootstrap 3
- jQuery 3.6
- Owl Carousel, bxSlider (carousels)
- Revolution Slider (slideshow)
- Font Awesome
- JavaScript (custom scripts in `js/main.js` and `js/form-handler.js`)

---

## 🎯 Objetivos del proyecto

- Proveer una landing page profesional y responsiva para Mastercraft Uniforms.
- Enfatizar la experiencia en dotación industrial y productos de seguridad.
- Facilitar contacto inmediato mediante WhatsApp con formulario incorporado.
- Mostrar presencia nacional y empresas clientes.

---

## 🚀 Qué incluye esta versión

- Rediseño de `index.html` con secciones:
  - Cabecera y navegación (con versión móvil optimizada)
  - Hero slider (registro de mensajes, CTA para cotización)
  - Propuestas de valor y secciones corporativas
  - Catálogo de productos con pestañas y tarjetas
  - Sección de clientes y testimonios
  - Sección "Presencia Nacional" con ciudades
  - Formulario de contacto (envía mensaje por WhatsApp con `js/form-handler.js`)
  - Pie de página con información y enlaces
- Integración de librerías JS (carousels, slider). Se corrigieron órdenes de inclusión de scripts y protecciones frente a plugins ausentes.

---

## 📥 Instalación y ejecución local

1. Clona este repositorio en tu máquina local:

```powershell
git clone https://github.com/MaickR/MasterCraft.git
cd MasterCraft
```

2. Abrir `index.html` con un servidor local o extensión de tu editor, por ejemplo VS Code — Live Server.

3. Si ejecutas desde archivos locales, recuerda que algunos plugins pueden necesitar ser servidos desde un servidor local para evitar problemas con file:// URLs.

---

## ⚙️ Desarrollo y uso

- `js/form-handler.js` envía el formulario rellenado por el usuario a WhatsApp con un mensaje pre-formateado mediante `wa.me`.
- Las librerías (Owl, bxSlider, RS) se encuentran en `js/` y requieren referencias correctas en `index.html`.
- `style.css` y `css/responsive.css` contienen los estilos para escritorio y media queries respectivamente.

---

## ✅ Check-list de calidad

- [x] Navegación responsive (desktop / tablet / mobile)
- [x] Formulario de contacto funcional con integración básica a WhatsApp
- [x] Secciones contenido en español y adaptadas al mercado colombiano
- [x] Footer con datos de contacto

---

## 📸 Capturas

(Agregar capturas en `images/` y referenciarlas aquí.)

---

## 📝 Notas finales

- Antes de publicar en producción, confirmar:
  - Credenciales y permisos de GitHub y hosting
  - Verificación de los plugins (URL y la versión) e inclusión correcta
  - Optimizaciones de imagen y minificación (si procede)

---

## 📫 Contacto

- Mastercraft - info@mastercraft.com.co

---

© 2024 Mastercraft Uniforms. Todos los derechos reservados.
