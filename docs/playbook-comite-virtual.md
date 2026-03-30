# PLAYBOOK: Comite Virtual -- Simulador de Defensa de Tesis
## Scripta Academic -- Manual Operativo v1.0
## Marzo 2026

---

## 1. DESCRIPCION

Servicio de practica de defensa de tesis con tribunal simulado de 5 evaluadores.
Cada miembro hace preguntas especificas al manuscrito del estudiante y evalua sus respuestas.

---

## 2. FLUJO DE SERVICIO

1. Cliente contrata sesion ($25-50 segun nivel)
2. Envia: titulo, abstract, documento completo
3. Andree corre modo inicial: `POST /api/virtual-committee`
4. Recibe 5 preguntas del tribunal simulado
5. Sesion en vivo (WhatsApp/Zoom): cliente responde, Andree envia al modo respuesta
6. Cada respuesta genera evaluacion + pregunta de seguimiento
7. Al final: reporte con calificacion por dimension y recomendaciones

---

## 3. PRICING

| Nivel | Precio/sesion | Duracion |
|-------|--------------|----------|
| Pregrado | $25 | 45 min |
| Maestria | $35 | 60 min |
| Doctorado | $50 | 75 min |
| Pack 3 sesiones | -15% | Variable |

---

## 4. LOS 5 MIEMBROS DEL TRIBUNAL

1. **Presidente** (Dr. Morales) -- Coherencia general, aporte al conocimiento
2. **Metodologo** (Dra. Vasquez) -- Diseno experimental, muestreo, validez
3. **Estadistico** (Dr. Restrepo) -- Pruebas estadisticas, interpretacion
4. **Experto disciplinar** (Dra. Pacheco) -- Profundidad tematica, bibliografia
5. **Evaluador externo** (Dr. Torres) -- Supuestos, generalizabilidad

---

## 5. ENDPOINT

```
POST /api/virtual-committee

Modo inicial (generar preguntas):
Body: { titulo_tesis, abstract, disciplina, nivel }
Response: { preguntas: [{rol, nombre, pregunta, enfoque}] }

Modo respuesta (evaluar respuesta):
Body: { titulo_tesis, abstract, disciplina, nivel, pregunta_estudiante, historial }
Response: { evaluacion: {rol, nombre, calificacion, retroalimentacion, pregunta_seguimiento} }

Rate limit: 10/IP/dia
```

---

## 6. METRICAS

| Metrica | Objetivo |
|---------|----------|
| Satisfaccion | >90% |
| Mejora reportada en defensa real | Tracking cualitativo |
| Sesiones por cliente | 1.5 promedio |
