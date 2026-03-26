# Componentes React — Scripta Academic

Componentes interactivos para scriptaacademic.com.

## Archivos

### PriceCalculator
- `PriceCalculator.jsx` — Calculadora de precios en vivo
- `PriceCalculator.module.css` — Estilos

### DiagnosticForm
- `DiagnosticForm.jsx` — Wizard de diagnóstico inteligente (5 pasos)
- `DiagnosticForm.module.css` — Estilos

### SampleGenerator
- `SampleGenerator.jsx` — Generador de muestras académicas en vivo (usa API de Anthropic)
- `SampleGenerator.module.css` — Estilos

## Integración en proyecto React (Vite, Next.js, CRA)

```jsx
import PriceCalculator from './components/PriceCalculator';
import DiagnosticForm from './components/DiagnosticForm';
import SampleGenerator from './components/SampleGenerator';

function App() {
  return (
    <>
      <section id="muestra">
        <SampleGenerator />
      </section>
      <section id="precios">
        <PriceCalculator />
      </section>
      <section id="diagnostico">
        <DiagnosticForm />
      </section>
    </>
  );
}
```

Requisitos: React 17+ y soporte para CSS Modules (incluido por defecto en Vite, Next.js y CRA).

## Integración en sitio estático (sin React existente)

Si el sitio actual es HTML puro, puedes montar el componente con un mini bundle:

### 1. Instalar dependencias

```bash
npm init -y
npm install react react-dom
npm install -D vite @vitejs/plugin-react
```

### 2. Crear punto de entrada `calculator-entry.jsx`

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import PriceCalculator from './components/PriceCalculator';
import DiagnosticForm from './components/DiagnosticForm';
import SampleGenerator from './components/SampleGenerator';

const sampleEl = document.getElementById('sample-generator');
if (sampleEl) createRoot(sampleEl).render(<SampleGenerator />);

const calcEl = document.getElementById('price-calculator');
if (calcEl) createRoot(calcEl).render(<PriceCalculator />);

const diagEl = document.getElementById('diagnostic-form');
if (diagEl) createRoot(diagEl).render(<DiagnosticForm />);
```

### 3. Configurar `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'calculator-entry.jsx',
    },
    outDir: 'dist-calculator',
  },
});
```

### 4. Agregar en `index.html`

```html
<!-- Generador de muestras -->
<div id="sample-generator"></div>

<!-- Calculadora de precios -->
<div id="price-calculator"></div>

<!-- Formulario de diagnóstico -->
<div id="diagnostic-form"></div>

<!-- Antes de </body> -->
<script type="module" src="/dist-calculator/calculator-entry.js"></script>
```

### 5. Build

```bash
npx vite build
```

## Fuentes

El componente usa la familia `Inter`. Si ya la cargas en tu sitio (como en el HTML actual), no necesitas hacer nada extra.

## Personalización

- **Precios**: Array `SERVICES` al inicio de `PriceCalculator.jsx` y en `DiagnosticForm.jsx`
- **WhatsApp**: Constante `WHATSAPP_NUMBER` al inicio de `DiagnosticForm.jsx` (actual: `593991520523`)
- **Disciplinas**: Array `DISCIPLINES` en `DiagnosticForm.jsx`
- **Lógica de recomendación**: Función `recommendService()` en `DiagnosticForm.jsx`
- **API URL**: Constante `API_URL` al inicio de `SampleGenerator.jsx` (cambiar para dev/prod)

## SampleGenerator — API Backend

El generador de muestras requiere un backend separado en Vercel. El repo esta en `C:\tmp\scripta-api\` (o donde lo muevas).

### Setup rapido

1. Crear repo `scripta-api` en GitHub con el contenido de `C:\tmp\scripta-api\`
2. Conectar a Vercel Dashboard
3. Agregar variable de entorno: `ANTHROPIC_API_KEY=sk-ant-...`
4. Deploy automatico

### Testear localmente

```bash
cd scripta-api
npm install -g vercel
vercel dev
```

Luego cambiar `API_URL` en `SampleGenerator.jsx` a `http://localhost:3000/api/generate-sample`.

### CORS para produccion

En `scripta-api/vercel.json`, cambiar `Access-Control-Allow-Origin` de `"*"` a `"https://scriptaacademic.com"`.

### Costos estimados

- ~$0.0075 por muestra generada (Claude Sonnet)
- 100 muestras/dia = ~$22.50/mes
- Vercel free tier: 100K invocaciones/mes
