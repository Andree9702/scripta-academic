import React, { useState, useMemo, useRef, useEffect } from 'react';
import styles from './PriceCalculator.module.css';

// ─── Service Data ──────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'diagnostico',
    name: 'Diagnóstico de manuscrito',
    base: 19,
    unit: 'por manuscrito',
    pagesIncluded: 30,
    extraPageCost: 0.50,
    badge: 'nuevo',
    tooltip: 'Evaluación experta de tu manuscrito: calidad del texto, riesgo de desk-rejection, verificación de referencias y recomendación de revistas.',
  },
  {
    id: 'correccion',
    name: 'Corrección y edición de estilo',
    base: 3.50,
    unit: 'por página',
    tooltip: 'Corrección ortográfica, gramatical, de estilo académico y coherencia textual por experto + IA.',
  },
  {
    id: 'articulo',
    name: 'Artículo científico (redacción asistida)',
    base: 150,
    unit: 'por artículo',
    pagesIncluded: 25,
    extraPageCost: 5,
    tooltip: 'Redacción asistida con IA + revisión humana. Incluye estructura IMRyD, referencias y formato de revista.',
  },
  {
    id: 'capitulo',
    name: 'Capítulo de libro académico',
    base: 120,
    unit: 'por capítulo',
    pagesIncluded: 30,
    extraPageCost: 3.50,
    tooltip: 'Producción de capítulo académico con rigor científico, citas verificadas y formato editorial.',
  },
  {
    id: 'libro',
    name: 'Libro académico completo (5 caps)',
    base: 500,
    unit: 'por libro',
    tooltip: 'Producción integral de libro académico (5 capítulos). Pipeline EVOLUTION + revisión humana.',
  },
  {
    id: 'revision',
    name: 'Revisión sistemática / metaanálisis',
    base: 250,
    unit: 'por manuscrito',
    pagesIncluded: 40,
    extraPageCost: 5,
    tooltip: 'Revisión de literatura con protocolo PRISMA, búsqueda en bases indexadas, análisis y síntesis.',
  },
  {
    id: 'paquete',
    name: 'Paquete "Paper a Publicación"',
    base: 350,
    unit: 'por manuscrito completo',
    pagesIncluded: 30,
    extraPageCost: 5,
    badge: 'popular',
    tooltip: 'Desde borrador hasta submission: redacción, formatting, cover letter y apoyo con reviewers.',
  },
  {
    id: 'traduccion',
    name: 'Traducción académica español→inglés',
    base: 5,
    unit: 'por página',
    tooltip: 'Traducción académica especializada por disciplina, no genérica. Incluye adaptación de estilo científico.',
  },
];

const URGENCY = [
  { id: 'estandar', name: 'Estándar', time: '10–15 días hábiles', label: 'Sin recargo', mult: 1.0 },
  { id: 'prioritario', name: 'Prioritario', time: '5–7 días hábiles', label: '+25%', mult: 1.25 },
  { id: 'urgente', name: 'Urgente', time: '24–72 horas', label: '+50%', mult: 1.50 },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function isPerPage(service) {
  return service.unit === 'por página';
}

function hasExtraPages(service) {
  return service.pagesIncluded != null;
}

function formatUSD(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── SVG Icons (inline, no deps) ──────────────────────────────────────────────

function IconCalculator() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10.01" />
      <line x1="12" y1="10" x2="12" y2="10.01" />
      <line x1="16" y1="10" x2="16" y2="10.01" />
      <line x1="8" y1="14" x2="8" y2="14.01" />
      <line x1="12" y1="14" x2="12" y2="14.01" />
      <line x1="16" y1="14" x2="16" y2="14.01" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  );
}

function IconInfo({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconShield({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconChevron({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// ─── Tooltip ───────────────────────────────────────────────────────────────────

function Tooltip({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <span
      ref={ref}
      className={styles.tooltipTrigger}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      aria-label="Más información"
    >
      ?
      {open && <span className={styles.tooltipBox}>{text}</span>}
    </span>
  );
}

// ─── Animated Number ───────────────────────────────────────────────────────────

function AnimatedPrice({ value }) {
  const [display, setDisplay] = useState(value);
  const rafRef = useRef(null);
  const startRef = useRef(display);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const from = startRef.current;
    const to = value;
    if (from === to) return;
    const duration = 300;
    startTimeRef.current = null;

    function step(ts) {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const progress = Math.min((ts - startTimeRef.current) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * ease;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        startRef.current = to;
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = to;
    };
  }, [value]);

  return (
    <span className={styles.resultTotalValue}>
      <span className={styles.resultTotalCurrency}>USD</span>
      {formatUSD(display)}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function PriceCalculator() {
  const [serviceIdx, setServiceIdx] = useState(6); // Paquete by default
  const [pages, setPages] = useState(1);
  const [urgency, setUrgency] = useState('estandar');

  const service = SERVICES[serviceIdx];
  const urgencyObj = URGENCY.find((u) => u.id === urgency);

  // Reset pages when service changes
  const prevServiceRef = useRef(serviceIdx);
  useEffect(() => {
    if (prevServiceRef.current !== serviceIdx) {
      prevServiceRef.current = serviceIdx;
      if (isPerPage(SERVICES[serviceIdx])) {
        setPages(1);
      } else if (hasExtraPages(SERVICES[serviceIdx])) {
        setPages(SERVICES[serviceIdx].pagesIncluded);
      }
    }
  }, [serviceIdx]);

  const { subtotal, extraCost, urgencyAmount, total } = useMemo(() => {
    let base = service.base;
    let extra = 0;

    if (isPerPage(service)) {
      base = service.base * pages;
    } else if (hasExtraPages(service)) {
      const overPages = Math.max(0, pages - service.pagesIncluded);
      extra = overPages * service.extraPageCost;
    }

    const sub = base + extra;
    const urgMult = urgencyObj.mult;
    const urgAmt = sub * (urgMult - 1);
    return {
      subtotal: sub,
      extraCost: extra,
      urgencyAmount: urgAmt,
      total: sub + urgAmt,
    };
  }, [service, pages, urgencyObj]);

  // Volume UI logic
  const showSlider = isPerPage(service);
  const showExtraPages = hasExtraPages(service);

  function handlePagesChange(val) {
    const n = Math.max(1, Math.min(300, parseInt(val, 10) || 1));
    setPages(n);
  }

  // mailto CTA
  const subject = encodeURIComponent(`Solicitud: ${service.name}`);
  const body = encodeURIComponent(
    `Hola, me interesa el servicio "${service.name}".\n\n` +
    `Detalles:\n` +
    (showSlider ? `- Páginas: ${pages}\n` : '') +
    (showExtraPages && pages > service.pagesIncluded ? `- Páginas extra: ${pages - service.pagesIncluded}\n` : '') +
    `- Urgencia: ${urgencyObj.name} (${urgencyObj.time})\n` +
    `- Total estimado: USD $${formatUSD(total)}\n\n` +
    `Quedo atento/a a su respuesta.`
  );
  const mailtoHref = `mailto:info@scriptaacademic.com?subject=${subject}&body=${body}`;

  return (
    <div className={styles.calculator}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <IconCalculator />
        </div>
        <div>
          <h2 className={styles.headerTitle}>Calcula tu inversi&oacute;n</h2>
          <p className={styles.headerSubtitle}>Precios transparentes, sin sorpresas</p>
        </div>
      </div>

      <div className={styles.body}>
        {/* Step 1: Service */}
        <div className={styles.section}>
          <label className={styles.label}>
            <span className={styles.stepNumber}>1</span>
            Tipo de servicio
          </label>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={serviceIdx}
              onChange={(e) => setServiceIdx(Number(e.target.value))}
            >
              {SERVICES.map((s, i) => (
                <option key={s.id} value={i}>
                  {s.name}
                  {s.badge === 'popular' ? ' ★ Más popular' : ''}
                  {s.badge === 'nuevo' ? ' ● Nuevo' : ''}
                  {' — $' + s.base + ' ' + s.unit}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>
              <IconChevron />
            </span>
          </div>
          <div className={styles.serviceInfo}>
            <IconInfo size={16} />
            <span>{service.tooltip}</span>
            <Tooltip text={service.tooltip} />
          </div>
        </div>

        {/* Step 2: Volume */}
        <div className={styles.section}>
          <label className={styles.label}>
            <span className={styles.stepNumber}>2</span>
            {showSlider ? 'Cantidad de páginas' : 'Volumen'}
          </label>

          {showSlider && (
            <div className={styles.volumeInput}>
              <input
                type="range"
                className={styles.slider}
                min={1}
                max={300}
                value={pages}
                onChange={(e) => handlePagesChange(e.target.value)}
              />
              <input
                type="number"
                className={styles.numberInput}
                min={1}
                max={300}
                value={pages}
                onChange={(e) => handlePagesChange(e.target.value)}
              />
              <span className={styles.volumeUnit}>págs.</span>
            </div>
          )}

          {!showSlider && !showExtraPages && (
            <div className={styles.fixedPriceNote}>
              <strong>Precio fijo:</strong> ${formatUSD(service.base)} USD {service.unit}
            </div>
          )}

          {!showSlider && showExtraPages && (
            <>
              <div className={styles.fixedPriceNote}>
                <strong>Precio base incluye hasta {service.pagesIncluded} páginas.</strong>
                <br />
                Páginas adicionales: ${service.extraPageCost.toFixed(2)} c/u
              </div>
              <div className={styles.volumeInput}>
                <input
                  type="range"
                  className={styles.slider}
                  min={1}
                  max={300}
                  value={pages}
                  onChange={(e) => handlePagesChange(e.target.value)}
                />
                <input
                  type="number"
                  className={styles.numberInput}
                  min={1}
                  max={300}
                  value={pages}
                  onChange={(e) => handlePagesChange(e.target.value)}
                />
                <span className={styles.volumeUnit}>págs. totales</span>
              </div>
            </>
          )}
        </div>

        {/* Step 3: Urgency */}
        <div className={styles.section}>
          <label className={styles.label}>
            <span className={styles.stepNumber}>3</span>
            Nivel de urgencia
          </label>
          <div className={styles.urgencyGroup}>
            {URGENCY.map((u) => (
              <button
                key={u.id}
                type="button"
                className={`${styles.urgencyPill} ${urgency === u.id ? styles.urgencyPillActive : ''}`}
                onClick={() => setUrgency(u.id)}
              >
                <span className={styles.urgencyName}>{u.name}</span>
                <span className={styles.urgencyTime}>{u.time}</span>
                <span className={styles.urgencyBadge}>{u.label}</span>
              </button>
            ))}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Result */}
        <div className={styles.result}>
          <div className={styles.resultRow}>
            <span className={styles.resultLabel}>Subtotal ({service.name.split('(')[0].trim()})</span>
            <span className={styles.resultValue}>${formatUSD(subtotal - extraCost)}</span>
          </div>

          {extraCost > 0 && (
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>
                Páginas extra ({pages - service.pagesIncluded} × ${service.extraPageCost.toFixed(2)})
              </span>
              <span className={styles.resultValue}>+${formatUSD(extraCost)}</span>
            </div>
          )}

          {urgencyAmount > 0 && (
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Recargo {urgencyObj.name.toLowerCase()} ({urgencyObj.label})</span>
              <span className={styles.resultValue}>+${formatUSD(urgencyAmount)}</span>
            </div>
          )}

          <div className={styles.resultTotal}>
            <span className={styles.resultTotalLabel}>TOTAL</span>
            <AnimatedPrice value={total} />
          </div>

          <div className={styles.paymentInfo}>
            <IconShield size={14} />
            <span>50% al contratar &middot; 50% al entregar</span>
          </div>
        </div>

        {/* CTA */}
        <a href={mailtoHref} className={styles.cta}>
          Solicitar este servicio
        </a>
      </div>
    </div>
  );
}
