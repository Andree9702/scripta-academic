import React, { useState, useMemo, useRef, useEffect } from 'react';

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

// ─── Inline Styles ─────────────────────────────────────────────────────────────

const S = {
  calculator: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: 680,
    width: '100%',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    color: '#1f2937',
  },
  header: {
    background: 'linear-gradient(135deg, #1a2332 0%, #243044 100%)',
    padding: '24px 28px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    background: 'rgba(13, 148, 136, 0.15)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerIconSvg: {
    width: 22,
    height: 22,
    color: '#0d9488',
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  headerSubtitle: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '2px 0 0',
  },
  body: {
    padding: '28px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7280',
  },
  stepNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#0d9488',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    marginRight: 6,
    verticalAlign: 'middle',
  },
  selectWrapper: {
    position: 'relative',
  },
  select: {
    width: '100%',
    padding: '12px 40px 12px 16px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    color: '#1f2937',
    background: '#fff',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
  },
  selectArrow: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#6b7280',
  },
  serviceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    background: '#f8fafc',
    borderRadius: 8,
    fontSize: '0.82rem',
    color: '#6b7280',
  },
  serviceInfoSvg: {
    flexShrink: 0,
    color: '#0d9488',
  },
  tooltipTrigger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#e5e7eb',
    color: '#6b7280',
    fontSize: '0.65rem',
    fontWeight: 700,
    cursor: 'help',
    border: 'none',
    position: 'relative',
    flexShrink: 0,
    lineHeight: 1,
  },
  tooltipBox: {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#1a2332',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: '0.78rem',
    fontWeight: 400,
    lineHeight: 1.45,
    width: 260,
    zIndex: 50,
    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  volumeInput: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    WebkitAppearance: 'none',
    appearance: 'none',
    height: 6,
    borderRadius: 3,
    background: '#e5e7eb',
    outline: 'none',
    cursor: 'pointer',
  },
  numberInput: {
    width: 72,
    padding: '8px 10px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    textAlign: 'center',
    color: '#1f2937',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  volumeUnit: {
    fontSize: '0.8rem',
    color: '#6b7280',
    whiteSpace: 'nowrap',
  },
  fixedPriceNote: {
    fontSize: '0.8rem',
    color: '#6b7280',
    padding: '10px 12px',
    background: '#f8fafc',
    borderRadius: 8,
    lineHeight: 1.5,
  },
  fixedPriceNoteStrong: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
  urgencyGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  urgencyPill: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '12px 8px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    fontFamily: 'inherit',
  },
  urgencyPillActive: {
    borderColor: '#0d9488',
    background: 'rgba(13, 148, 136, 0.06)',
    boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.1)',
  },
  urgencyName: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  urgencyNameActive: {
    color: '#0d9488',
  },
  urgencyTime: {
    fontSize: '0.7rem',
    color: '#6b7280',
  },
  urgencyBadge: {
    fontSize: '0.65rem',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: 4,
    background: '#e5e7eb',
    color: '#6b7280',
  },
  urgencyBadgeActive: {
    background: '#0d9488',
    color: '#fff',
  },
  divider: {
    height: 1,
    background: '#e5e7eb',
    margin: 0,
    border: 'none',
  },
  result: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  resultLabel: {
    color: '#6b7280',
  },
  resultValue: {
    fontWeight: 500,
    color: '#1f2937',
  },
  resultTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: 16,
    background: 'linear-gradient(135deg, #1a2332 0%, #243044 100%)',
    borderRadius: 12,
  },
  resultTotalLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  resultTotalValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#ffffff',
    transition: 'opacity 0.15s',
  },
  resultTotalCurrency: {
    fontSize: '1rem',
    fontWeight: 500,
    marginRight: 4,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  paymentInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: '0.78rem',
    color: '#6b7280',
    padding: '8px 0 0',
  },
  paymentInfoSvg: {
    color: '#d4a853',
    flexShrink: 0,
  },
  cta: {
    display: 'block',
    width: '100%',
    padding: '14px 28px',
    background: '#0d9488',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background 0.2s, transform 0.1s',
    boxSizing: 'border-box',
  },
};

// ─── Injected CSS for pseudo-elements, hover states, and responsive ────────────

const INJECTED_CSS = `
  .scripta-calc-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #0d9488;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(13, 148, 136, 0.3);
    transition: transform 0.15s;
  }
  .scripta-calc-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  .scripta-calc-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #0d9488;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(13, 148, 136, 0.3);
  }
  .scripta-calc-btn:hover {
    background: #0b7c72 !important;
  }
  .scripta-calc-btn:active {
    transform: scale(0.985) !important;
  }
  .scripta-calc-pill:hover {
    border-color: #0d9488 !important;
    background: rgba(13, 148, 136, 0.03) !important;
  }
  .scripta-calc-select:focus {
    border-color: #0d9488 !important;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1) !important;
  }
  .scripta-calc-number:focus {
    border-color: #0d9488 !important;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1) !important;
  }
  .scripta-calc-tooltip-box::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1a2332;
  }
  @media (max-width: 480px) {
    .scripta-calc-root {
      border-radius: 12px !important;
    }
    .scripta-calc-header {
      padding: 20px 20px !important;
    }
    .scripta-calc-body {
      padding: 20px 20px 20px !important;
    }
    .scripta-calc-header-title {
      font-size: 1.1rem !important;
    }
    .scripta-calc-urgency-group {
      grid-template-columns: 1fr !important;
      gap: 6px !important;
    }
    .scripta-calc-pill {
      flex-direction: row !important;
      justify-content: space-between !important;
      padding: 10px 14px !important;
    }
    .scripta-calc-total-value {
      font-size: 1.5rem !important;
    }
    .scripta-calc-tooltip-box {
      width: 220px !important;
      left: auto !important;
      right: -8px !important;
      transform: none !important;
    }
    .scripta-calc-tooltip-box::after {
      left: auto !important;
      right: 12px !important;
      transform: none !important;
    }
  }
`;

// ─── SVG Icons (inline, no deps) ──────────────────────────────────────────────

function IconCalculator() {
  return (
    <svg style={S.headerIconSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg style={S.serviceInfoSvg} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconShield({ size = 14 }) {
  return (
    <svg style={S.paymentInfoSvg} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      style={S.tooltipTrigger}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      aria-label="Más información"
    >
      ?
      {open && (
        <span className="scripta-calc-tooltip-box" style={S.tooltipBox}>
          {text}
        </span>
      )}
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
    <span className="scripta-calc-total-value" style={S.resultTotalValue}>
      <span style={S.resultTotalCurrency}>USD</span>
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
    <div className="scripta-calc-root" style={S.calculator}>
      <style>{INJECTED_CSS}</style>

      {/* Header */}
      <div className="scripta-calc-header" style={S.header}>
        <div style={S.headerIcon}>
          <IconCalculator />
        </div>
        <div>
          <h2 className="scripta-calc-header-title" style={S.headerTitle}>Calcula tu inversi&oacute;n</h2>
          <p style={S.headerSubtitle}>Precios transparentes, sin sorpresas</p>
        </div>
      </div>

      <div className="scripta-calc-body" style={S.body}>
        {/* Step 1: Service */}
        <div style={S.section}>
          <label style={S.label}>
            <span style={S.stepNumber}>1</span>
            Tipo de servicio
          </label>
          <div style={S.selectWrapper}>
            <select
              className="scripta-calc-select"
              style={S.select}
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
            <span style={S.selectArrow}>
              <IconChevron />
            </span>
          </div>
          <div style={S.serviceInfo}>
            <IconInfo size={16} />
            <span>{service.tooltip}</span>
            <Tooltip text={service.tooltip} />
          </div>
        </div>

        {/* Step 2: Volume */}
        <div style={S.section}>
          <label style={S.label}>
            <span style={S.stepNumber}>2</span>
            {showSlider ? 'Cantidad de páginas' : 'Volumen'}
          </label>

          {showSlider && (
            <div style={S.volumeInput}>
              <input
                type="range"
                className="scripta-calc-slider"
                style={S.slider}
                min={1}
                max={300}
                value={pages}
                onChange={(e) => handlePagesChange(e.target.value)}
              />
              <input
                type="number"
                className="scripta-calc-number"
                style={S.numberInput}
                min={1}
                max={300}
                value={pages}
                onChange={(e) => handlePagesChange(e.target.value)}
              />
              <span style={S.volumeUnit}>págs.</span>
            </div>
          )}

          {!showSlider && !showExtraPages && (
            <div style={S.fixedPriceNote}>
              <span style={S.fixedPriceNoteStrong}>Precio fijo:</span> ${formatUSD(service.base)} USD {service.unit}
            </div>
          )}

          {!showSlider && showExtraPages && (
            <>
              <div style={S.fixedPriceNote}>
                <span style={S.fixedPriceNoteStrong}>Precio base incluye hasta {service.pagesIncluded} páginas.</span>
                <br />
                Páginas adicionales: ${service.extraPageCost.toFixed(2)} c/u
              </div>
              <div style={S.volumeInput}>
                <input
                  type="range"
                  className="scripta-calc-slider"
                  style={S.slider}
                  min={1}
                  max={300}
                  value={pages}
                  onChange={(e) => handlePagesChange(e.target.value)}
                />
                <input
                  type="number"
                  className="scripta-calc-number"
                  style={S.numberInput}
                  min={1}
                  max={300}
                  value={pages}
                  onChange={(e) => handlePagesChange(e.target.value)}
                />
                <span style={S.volumeUnit}>págs. totales</span>
              </div>
            </>
          )}
        </div>

        {/* Step 3: Urgency */}
        <div style={S.section}>
          <label style={S.label}>
            <span style={S.stepNumber}>3</span>
            Nivel de urgencia
          </label>
          <div className="scripta-calc-urgency-group" style={S.urgencyGroup}>
            {URGENCY.map((u) => {
              const isActive = urgency === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  className="scripta-calc-pill"
                  style={{
                    ...S.urgencyPill,
                    ...(isActive ? S.urgencyPillActive : {}),
                  }}
                  onClick={() => setUrgency(u.id)}
                >
                  <span style={{
                    ...S.urgencyName,
                    ...(isActive ? S.urgencyNameActive : {}),
                  }}>{u.name}</span>
                  <span style={S.urgencyTime}>{u.time}</span>
                  <span style={{
                    ...S.urgencyBadge,
                    ...(isActive ? S.urgencyBadgeActive : {}),
                  }}>{u.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <hr style={S.divider} />

        {/* Result */}
        <div style={S.result}>
          <div style={S.resultRow}>
            <span style={S.resultLabel}>Subtotal ({service.name.split('(')[0].trim()})</span>
            <span style={S.resultValue}>${formatUSD(subtotal - extraCost)}</span>
          </div>

          {extraCost > 0 && (
            <div style={S.resultRow}>
              <span style={S.resultLabel}>
                Páginas extra ({pages - service.pagesIncluded} × ${service.extraPageCost.toFixed(2)})
              </span>
              <span style={S.resultValue}>+${formatUSD(extraCost)}</span>
            </div>
          )}

          {urgencyAmount > 0 && (
            <div style={S.resultRow}>
              <span style={S.resultLabel}>Recargo {urgencyObj.name.toLowerCase()} ({urgencyObj.label})</span>
              <span style={S.resultValue}>+${formatUSD(urgencyAmount)}</span>
            </div>
          )}

          <div style={S.resultTotal}>
            <span style={S.resultTotalLabel}>TOTAL</span>
            <AnimatedPrice value={total} />
          </div>

          <div style={S.paymentInfo}>
            <IconShield size={14} />
            <span>50% al contratar &middot; 50% al entregar</span>
          </div>
        </div>

        {/* CTA */}
        <a href={mailtoHref} className="scripta-calc-btn" style={S.cta}>
          Solicitar este servicio
        </a>
      </div>
    </div>
  );
}
