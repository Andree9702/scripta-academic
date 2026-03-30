# PLAYBOOK: Paquete "Paper a Publicacion"
## Scripta Academic -- Manual Operativo Interno
## Version 1.0 -- Marzo 2026

---

## 1. DESCRIPCION DEL SERVICIO

**Nombre comercial:** Paquete "Paper a Publicacion"
**Precio:** $350 USD (hasta 30 paginas, +$5/pag extra)
**Plazo estandar:** 10-15 dias habiles
**Entregables:** Manuscrito listo para submission + cover letter + respuesta a reviewers (90 dias)

**Que incluye:**
- Evaluacion diagnostica inicial (6 dimensiones)
- Reestructuracion o redaccion del manuscrito completo
- Formato segun normas de la revista objetivo
- Verificacion de referencias (CrossRef)
- Tablas y figuras en formato editorial
- Cover letter personalizada para el editor
- Certificado de Integridad Academica
- Soporte 90 dias post-envio para responder reviewers
- Garantia de re-edicion si rechazan por idioma

---

## 2. PIPELINE DE PRODUCCION (7 ETAPAS)

### ETAPA 1: Recepcion y Diagnostico (Dia 1)
**Responsable:** Andree
**Acciones:**
- Recibir manuscrito del cliente (PDF/DOCX via WhatsApp o email)
- Correr diagnostico automatizado: POST /api/diagnose-manuscript
- Evaluar resultado del diagnostico (puntuacion global, riesgo, dimensiones)
- Determinar alcance real del trabajo necesario
- Confirmar al cliente: plazo, precio final, alcance
- Cobrar 50% anticipo

**Output:** Diagnostico JSON + confirmacion al cliente + pago recibido

### ETAPA 2: Analisis y Planificacion (Dia 1-2)
**Responsable:** Andree + Domain Expert EVOLUTION
**Acciones:**
- Identificar revista objetivo (si el cliente no tiene una)
- Descargar Author Guidelines de la revista
- Definir estructura del manuscrito segun la revista
- Identificar gaps: que falta en el manuscrito actual?
- Listar referencias clave a agregar (busqueda CrossRef + Semantic Scholar)
- Crear brief de produccion interno

**Output:** Brief de produccion con estructura, gaps identificados, referencias a agregar

### ETAPA 3: Produccion del Manuscrito (Dias 3-8)
**Responsable:** EVOLUTION ecosystem + Andree
**Acciones:**
- Redactar/reestructurar usando agentes de EVOLUTION:
  - Domain Expert: contenido disciplinar
  - Writer Agent: redaccion academica
  - Citation Agent: verificacion de citas
  - Stats Agent: revision de analisis estadistico (si aplica)
- Formato segun Author Guidelines de la revista
- Insertar tablas y figuras en formato editorial
- Generar bibliografia con natbib/APA7/Vancouver segun revista

**Output:** Manuscrito borrador v1

### ETAPA 4: Revision Interna (Dias 8-10)
**Responsable:** Robinson J. Herrera-Feijoo (revisor experto confidencial)
**Acciones:**
- Enviar manuscrito a Robinson para revision experta
- Robinson evalua: rigor metodologico, coherencia, citas, calidad general
- Robinson entrega comentarios detallados
- Andree incorpora correcciones

**Pago a Robinson:** 60% del fee de revision (acordado por encargo)

**Output:** Manuscrito revisado v2

### ETAPA 5: Control de Calidad Final (Dias 10-12)
**Responsable:** Andree
**Acciones:**
- Correr diagnostico automatizado de nuevo (comparar con diagnostico inicial)
- Verificar que puntuacion global mejoro (objetivo: >7.5/10)
- Verificar todas las referencias con CrossRef (DOIs validos)
- Verificar formato contra Author Guidelines
- Correccion ortografica y de estilo final
- Generar Certificado de Integridad Academica

**Output:** Manuscrito final v3 + certificado

### ETAPA 6: Cover Letter + Entrega (Dias 12-13)
**Responsable:** EVOLUTION Writer Agent + Andree
**Acciones:**
- Redactar cover letter personalizada para el editor:
  - Resumen del articulo (3-4 oraciones)
  - Por que es relevante para esta revista especifica
  - Declaracion de originalidad y no-envio simultaneo
  - Autores sugeridos como reviewers (si la revista lo pide)
- Revisar cover letter
- Empaquetar entrega: manuscrito + cover letter + certificado
- Enviar al cliente
- Cobrar 50% restante

**Output:** Paquete de entrega completo + pago final

### ETAPA 7: Soporte Post-Envio (90 dias)
**Responsable:** Andree
**Acciones (segun necesidad):**
- Cliente envia manuscrito a la revista
- Si reciben comentarios de reviewers -> ayudar a redactar respuestas punto por punto
- Si piden revisiones -> incorporar cambios solicitados
- Si rechazan por idioma -> re-edicion gratuita (Garantia #14)
- Si rechazan por otros motivos -> asesorar sobre siguiente revista

**Output:** Respuestas a reviewers y/o manuscrito revisado

---

## 3. HERRAMIENTAS Y ENDPOINTS

| Herramienta | Uso | Endpoint/Ruta |
|-------------|-----|---------------|
| Diagnostico automatizado | Etapa 1 y 5 | POST /api/diagnose-manuscript |
| Generador de muestras | Demo para captacion | POST /api/generate-sample |
| CrossRef API | Verificacion de citas | https://api.crossref.org/works |
| EVOLUTION ecosystem | Produccion del manuscrito | Claude Code local |
| Calculadora de precios | Cotizacion para el cliente | scriptaacademic.com/#precios |
| Formulario diagnostico | Captacion de leads | scriptaacademic.com/#contacto |

---

## 4. CHECKLIST POR ENTREGA

Antes de enviar al cliente, verificar:

- [ ] Puntuacion diagnostico >= 7.5/10
- [ ] Todas las referencias tienen DOI valido
- [ ] Formato coincide con Author Guidelines de la revista
- [ ] Tablas y figuras numeradas correctamente
- [ ] Abstract dentro del limite de palabras de la revista
- [ ] Keywords segun vocabulario de la revista
- [ ] Cover letter personalizada (no generica)
- [ ] Certificado de Integridad Academica generado
- [ ] 50% final cobrado
- [ ] Cliente informado sobre proceso de submission

---

## 5. PRICING Y SPLIT

| Concepto | Monto |
|----------|-------|
| Precio al cliente (base) | $350 USD |
| Paginas extra (>30) | +$5/pag |
| Urgente (+50%) | $525 USD |
| Prioritario (+25%) | $437.50 USD |

**Split interno por revision experta:**
- Robinson (o revisor asignado): 60% del fee de revision
- Scripta Academic: 40%
- El fee de revision es una porcion del total, NO el 60% de los $350

---

## 6. METRICAS DE EXITO

| Metrica | Objetivo |
|---------|----------|
| Mejora de puntuacion diagnostica | De entrada a salida: +3 puntos minimo |
| Tiempo de entrega | <=15 dias habiles (estandar) |
| Tasa de aceptacion en primera revista | >40% |
| Satisfaccion del cliente | Testimonial positivo |
| Re-ediciones por garantia | <10% de entregas |
