# SCRIPTA ACADEMIC — Sitio Web

Sitio web de una sola pagina para SCRIPTA ACADEMIC.
Dominio: **scriptaacademic.com**

## Estructura

```
website/
├── index.html   — HTML5 semantico con todas las secciones
├── styles.css   — Estilos completos, responsive, animaciones
├── scripts.js   — Navbar, scroll reveal, parallax, mobile menu
└── README.md    — Este archivo
```

## Requisitos

Ninguno. HTML/CSS/JS puro, sin frameworks ni dependencias de build.

Dependencias externas (CDN):
- Google Fonts: Cormorant Garamond + Inter
- Lucide Icons

## Vista previa local

Abrir `index.html` directamente en el navegador, o usar un servidor local:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# VS Code
# Instalar extension "Live Server" y hacer click en "Go Live"
```

## Deploy

### Netlify (recomendado)
1. Ir a [netlify.com](https://netlify.com)
2. Arrastrar la carpeta `website/` al area de deploy
3. Configurar dominio personalizado: `scriptaacademic.com`

### Cloudflare Pages
1. Subir la carpeta a un repo de GitHub
2. Conectar en Cloudflare Pages
3. Build command: (vacio)
4. Output directory: `/`

### GitHub Pages
1. Subir los archivos a un repo
2. Settings > Pages > Source: main branch
3. Configurar CNAME con `scriptaacademic.com`

### Vercel
1. `npx vercel` desde esta carpeta
2. Seguir las instrucciones
3. Configurar dominio en el dashboard

## Personalizacion pendiente

- [ ] Reemplazar `XXXXXXXXXXX` en links de WhatsApp con el numero real
- [ ] Agregar foto profesional en seccion "Sobre Nosotros"
- [ ] Agregar textos reales en testimoniales
- [ ] Agregar imagen OG para compartir en redes sociales
- [ ] Agregar favicon personalizado
