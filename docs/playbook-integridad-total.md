# PLAYBOOK: Suite "Integridad Total"
## Scripta Academic -- Manual Operativo v1.0
## Marzo 2026

---

## 1. DESCRIPCION DEL SERVICIO

Analisis de integridad cientifica que va MAS ALLA del plagio textual.
Detecta: fabricacion de datos, citas fantasma, inconsistencias estadisticas, incoherencias metodologicas.

**Target:** Universidades, comites de etica, directores de tesis, editores de revistas.
**Diferenciador:** Nadie en LATAM ofrece esto. Los servicios existentes solo detectan plagio textual.

---

## 2. USO INTERNO (manuscrito individual)

1. Cliente envia manuscrito (WhatsApp/email)
2. Andree corre: `POST /api/integrity-check` con el texto extraido
3. Revisar el JSON de resultado
4. Si hay alertas_criticas: revisar manualmente antes de entregar
5. Formatear resultado como PDF (usar plantilla)
6. Entregar al cliente

---

## 3. USO INSTITUCIONAL (pack anual)

1. Universidad contrata pack anual (20/50/ilimitado analisis)
2. Envian manuscritos por lote
3. Andree corre cada uno y entrega reportes
4. Reunion trimestral de resultados agregados

---

## 4. PRICING

| Tipo | Precio |
|------|--------|
| Manuscrito individual | $50 USD |
| Tesis completa | $120 USD |
| Pack 20 analisis (institucional) | $500/ano |
| Pack 50 analisis (institucional) | $1,000/ano |
| Pack ilimitado (institucional) | $2,000/ano |

---

## 5. 4 DIMENSIONES DE ANALISIS

1. **Integridad de datos** -- Ley de Benford, patrones imposibles, valores demasiado perfectos
2. **Verificacion de citas** -- Citas fantasma, plausibilidad, antigüedad, autocitas
3. **Coherencia metodologica** -- Metodos vs resultados, diseno vs conclusiones
4. **Consistencia estadistica** -- p-values, IC, grados de libertad, p-hacking

---

## 6. ENDPOINT

```
POST /api/integrity-check
Body: { texto: string, tipo: "articulo"|"tesis"|"capitulo" }
Response: { resultado: { score_global, riesgo_integridad, dimensiones[4], alertas_criticas, recomendaciones, resumen_ejecutivo } }
Rate limit: 3/IP/dia
```

---

## 7. METRICAS DE EXITO

| Metrica | Objetivo |
|---------|----------|
| Precision de alertas criticas | >90% confirmadas manualmente |
| Tiempo de entrega (individual) | <24 horas |
| Clientes institucionales en 6 meses | 3+ |
| Falsos positivos | <15% |
