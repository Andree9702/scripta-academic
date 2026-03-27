import React, { useState, useMemo } from 'react';

// ─── Constants ─────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = '593991520523';

const STAGES = [
  { id: 'idea', emoji: '\u{1F331}', title: 'Solo tengo una idea', desc: 'Tengo un tema pero no he escrito nada aún' },
  { id: 'borrador', emoji: '\u{1F4DD}', title: 'Tengo un borrador', desc: 'Ya escribí algo pero necesita mucho trabajo' },
  { id: 'avanzado', emoji: '\u{1F4C4}', title: 'Tengo un manuscrito avanzado', desc: 'Está casi listo pero necesito revisión profesional' },
  { id: 'rechazado', emoji: '\u{1F504}', title: 'Me rechazaron y necesito rehacer', desc: 'Una revista lo rechazó y necesito corregirlo' },
  { id: 'libro', emoji: '\u{1F4DA}', title: 'Quiero escribir un libro', desc: 'Necesito producir un libro académico completo' },
];

const WORK_TYPES = {
  early: [
    { id: 'articulo_original', label: 'Artículo científico original' },
    { id: 'articulo_revision', label: 'Artículo de revisión' },
    { id: 'revision_sistematica', label: 'Revisión sistemática / metaanálisis' },
    { id: 'capitulo', label: 'Capítulo de libro' },
  ],
  advanced: [
    { id: 'correccion', label: 'Solo corrección y edición de estilo' },
    { id: 'correccion_traduccion', label: 'Corrección + traducción al inglés' },
    { id: 'reestructuracion', label: 'Reestructuración completa + corrección' },
    { id: 'paper_publicacion', label: 'Paquete "Paper a Publicación"' },
  ],
  book: [
    { id: 'libro_completo', label: 'Libro académico (5+ capítulos)' },
    { id: 'capitulo_individual', label: 'Capítulo individual para libro colectivo' },
  ],
};

const DISCIPLINES = [
  'Medicina veterinaria', 'Ciencias de la salud', 'Ingeniería',
  'Ciencias agropecuarias', 'Educación', 'Ciencias sociales',
  'Derecho', 'Economía y administración', 'Ciencias ambientales',
  'Humanidades',
];

const REJECTION_REASONS = [
  'Calidad del idioma / inglés',
  'Debilidades metodológicas',
  'Análisis estadístico insuficiente',
  'Falta de originalidad / contribución',
  'Problemas con referencias',
  'No sé exactamente',
  'Otro',
];

const URGENCY = [
  { id: 'estandar', name: 'Estándar', time: '10–15 días hábiles', label: 'Sin recargo', mult: 1.0 },
  { id: 'prioritario', name: 'Prioritario', time: '5–7 días hábiles', label: '+25%', mult: 1.25 },
  { id: 'urgente', name: 'Urgente', time: '24–72 horas', label: '+50%', mult: 1.50 },
];

// Service catalog (mirrors PriceCalculator)
const SERVICES = {
  correccion: { name: 'Corrección y edición de estilo', base: 3.50, perPage: true },
  traduccion: { name: 'Traducción académica español→inglés', base: 5, perPage: true },
  articulo: { name: 'Artículo científico (redacción asistida)', base: 150, pagesIncluded: 25, extraCost: 5 },
  capitulo: { name: 'Capítulo de libro académico', base: 120, pagesIncluded: 30, extraCost: 3.50 },
  libro: { name: 'Libro académico completo (5 caps)', base: 500 },
  revision: { name: 'Revisión sistemática / metaanálisis', base: 250, pagesIncluded: 40, extraCost: 5 },
  paquete: { name: 'Paquete "Paper a Publicación"', base: 350, pagesIncluded: 30, extraCost: 5 },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatUSD(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getWorkTypes(stageId) {
  if (stageId === 'idea' || stageId === 'borrador') return WORK_TYPES.early;
  if (stageId === 'avanzado' || stageId === 'rechazado') return WORK_TYPES.advanced;
  if (stageId === 'libro') return WORK_TYPES.book;
  return [];
}

function recommendService(stageId, workTypeId, pages) {
  // Rejection always → paquete
  if (stageId === 'rechazado') {
    return {
      serviceKey: 'paquete',
      reason: 'Incluye reestructuración, corrección, formatting y apoyo con respuesta a reviewers.',
      note: 'Incluye soporte de 90 días para responder a revisores.',
    };
  }

  // Book
  if (stageId === 'libro') {
    if (workTypeId === 'libro_completo') {
      return { serviceKey: 'libro', reason: 'Producción integral de libro académico con pipeline EVOLUTION + revisión humana.' };
    }
    return { serviceKey: 'capitulo', reason: 'Producción de capítulo académico con rigor científico y formato editorial.' };
  }

  // Early stage (idea / borrador)
  if (stageId === 'idea' || stageId === 'borrador') {
    if (workTypeId === 'revision_sistematica') {
      return { serviceKey: 'revision', reason: 'Incluye protocolo PRISMA, búsqueda en bases indexadas y síntesis de evidencia.' };
    }
    if (workTypeId === 'capitulo') {
      return { serviceKey: 'capitulo', reason: 'Desde estructura hasta texto final con citas verificadas y formato editorial.' };
    }
    return { serviceKey: 'articulo', reason: 'Redacción asistida con estructura IMRyD, referencias y formato de revista objetivo.' };
  }

  // Advanced manuscript
  if (stageId === 'avanzado') {
    if (workTypeId === 'correccion') {
      return { serviceKey: 'correccion', reason: 'Tu manuscrito está avanzado; solo necesita pulido profesional de estilo y gramática.' };
    }
    if (workTypeId === 'correccion_traduccion') {
      return { serviceKey: 'correccion_traduccion', reason: 'Corrección de estilo + traducción académica especializada al inglés.' };
    }
    if (workTypeId === 'reestructuracion') {
      return { serviceKey: 'articulo', reason: 'Reestructuración profunda del manuscrito para cumplir estándares de publicación.' };
    }
    if (workTypeId === 'paper_publicacion') {
      return { serviceKey: 'paquete', reason: 'Desde tu borrador avanzado hasta submission: formatting, cover letter y apoyo editorial.' };
    }
  }

  return { serviceKey: 'articulo', reason: 'Servicio versátil para llevar tu proyecto a publicación.' };
}

function calculatePrice(serviceKey, pages, urgencyMult, needsTranslation) {
  // Special combo: corrección + traducción
  if (serviceKey === 'correccion_traduccion') {
    const sub = (SERVICES.correccion.base + SERVICES.traduccion.base) * pages;
    const urgAmt = sub * (urgencyMult - 1);
    return { subtotal: sub, extra: 0, urgencyAmount: urgAmt, total: sub + urgAmt };
  }

  const svc = SERVICES[serviceKey];
  if (!svc) return { subtotal: 0, extra: 0, urgencyAmount: 0, total: 0 };

  let base = svc.base;
  let extra = 0;

  if (svc.perPage) {
    base = svc.base * pages;
  } else if (svc.pagesIncluded) {
    extra = Math.max(0, pages - svc.pagesIncluded) * svc.extraCost;
  }

  // Add translation if needed and not already a translation/combo service
  let translationCost = 0;
  if (needsTranslation && serviceKey !== 'correccion_traduccion' && !svc.perPage) {
    translationCost = SERVICES.traduccion.base * pages;
  }

  const sub = base + extra + translationCost;
  const urgAmt = sub * (urgencyMult - 1);
  return { subtotal: sub, extra, urgencyAmount: urgAmt, total: sub + urgAmt, translationCost };
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconClipboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22, color: '#0d9488' }}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  );
}

function IconCheck({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowLeft({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function IconArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconMail({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="22,7 12,13 2,7" />
    </svg>
  );
}

function IconWhatsapp({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
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

// ─── Inline Style Constants ─────────────────────────────────────────────────────

const S = {
  wizard: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: 600,
    width: '100%',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(26,35,50,0.10), 0 1px 4px rgba(26,35,50,0.06)',
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
    background: 'rgba(13,148,136,0.15)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
    color: 'rgba(255,255,255,0.6)',
    margin: '2px 0 0',
  },
  progress: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 28px',
    gap: 0,
    background: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  progressStep: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 700,
    border: '2px solid #e5e7eb',
    background: '#fff',
    color: '#6b7280',
    transition: 'all 0.3s',
  },
  progressDotActive: {
    borderColor: '#0d9488',
    background: '#0d9488',
    color: '#fff',
  },
  progressLine: {
    flex: 1,
    height: 2,
    background: '#e5e7eb',
    margin: '0 4px',
    transition: 'background 0.3s',
  },
  progressLineActive: {
    background: '#0d9488',
  },
  body: {
    padding: '24px 28px 28px',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    boxSizing: 'border-box',
  },
  slideContainer: {
    display: 'flex',
    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
  },
  slide: {
    minWidth: '100%',
    flexShrink: 0,
  },
  stepQuestion: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#1a2332',
    margin: '0 0 16px',
    lineHeight: 1.4,
  },
  optionCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  optionCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    fontSize: 'inherit',
  },
  optionCardActive: {
    borderColor: '#0d9488',
    background: 'rgba(13,148,136,0.05)',
    boxShadow: '0 0 0 3px rgba(13,148,136,0.1)',
  },
  optionEmoji: {
    fontSize: '1.3rem',
    lineHeight: 1,
    flexShrink: 0,
    marginTop: 1,
  },
  optionText: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  optionTitle: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  optionTitleActive: {
    color: '#0d9488',
  },
  optionDesc: {
    fontSize: '0.78rem',
    color: '#6b7280',
    lineHeight: 1.4,
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  fieldLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  req: {
    color: '#ef4444',
    marginLeft: 2,
  },
  fieldHint: {
    fontSize: '0.72rem',
    color: '#6b7280',
    fontWeight: 400,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    color: '#1f2937',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorMsg: {
    fontSize: '0.72rem',
    color: '#ef4444',
    marginTop: -2,
  },
  selectWrapper: {
    position: 'relative',
  },
  select: {
    width: '100%',
    padding: '10px 36px 10px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    color: '#1f2937',
    background: '#fff',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  selectArrow: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#6b7280',
  },
  sliderRow: {
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
    width: 64,
    padding: '8px 6px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.88rem',
    fontFamily: 'inherit',
    textAlign: 'center',
    color: '#1f2937',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  sliderUnit: {
    fontSize: '0.78rem',
    color: '#6b7280',
    whiteSpace: 'nowrap',
  },
  radioGroup: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  radioBtn: {
    padding: '8px 16px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    background: '#fff',
    fontSize: '0.82rem',
    fontFamily: 'inherit',
    fontWeight: 500,
    color: '#1f2937',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  radioBtnActive: {
    borderColor: '#0d9488',
    background: 'rgba(13,148,136,0.06)',
    color: '#0d9488',
    boxShadow: '0 0 0 3px rgba(13,148,136,0.1)',
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
    borderRadius: 10,
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'center',
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  urgencyPillActive: {
    borderColor: '#0d9488',
    background: 'rgba(13,148,136,0.06)',
    boxShadow: '0 0 0 3px rgba(13,148,136,0.1)',
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
    border: 'none',
    margin: '4px 0',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  btnBack: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 18px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    background: '#fff',
    color: '#6b7280',
    fontSize: '0.88rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnNext: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 24px',
    border: 'none',
    borderRadius: 10,
    background: '#0d9488',
    color: '#fff',
    fontSize: '0.88rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginLeft: 'auto',
  },
  btnNextDisabled: {
    background: '#d1d5db',
    cursor: 'not-allowed',
  },
  resultPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  resultSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  resultSectionTitle: {
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7280',
    margin: 0,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
  },
  summaryItem: {
    padding: '10px 12px',
    background: '#f9fafb',
    borderRadius: 8,
  },
  summaryItemLabel: {
    fontSize: '0.7rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginBottom: 2,
  },
  summaryItemValue: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  recommendedCard: {
    padding: 16,
    background: 'rgba(13,148,136,0.05)',
    border: '1.5px solid rgba(13,148,136,0.2)',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  recommendedName: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#0d9488',
  },
  recommendedReason: {
    fontSize: '0.82rem',
    color: '#6b7280',
    lineHeight: 1.45,
  },
  recommendedNote: {
    fontSize: '0.78rem',
    color: '#d4a853',
    fontWeight: 500,
    marginTop: 2,
  },
  priceBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
  },
  priceLabel: {
    color: '#6b7280',
  },
  priceValue: {
    fontWeight: 500,
    color: '#1f2937',
  },
  priceTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: 16,
    background: 'linear-gradient(135deg, #1a2332 0%, #243044 100%)',
    borderRadius: 12,
  },
  priceTotalLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
  },
  priceTotalValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#fff',
  },
  priceTotalCurrency: {
    fontSize: '1rem',
    fontWeight: 500,
    marginRight: 4,
    color: 'rgba(255,255,255,0.7)',
  },
  paymentInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: '0.78rem',
    color: '#6b7280',
  },
  paymentInfoIcon: {
    color: '#d4a853',
    flexShrink: 0,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  ctaPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '14px 24px',
    background: '#0d9488',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background 0.2s, transform 0.1s',
    boxSizing: 'border-box',
  },
  ctaRow: {
    display: 'flex',
    gap: 10,
  },
  ctaSecondary: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '11px 16px',
    background: '#fff',
    color: '#1a2332',
    fontSize: '0.85rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  ctaWhatsapp: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '11px 16px',
    background: '#fff',
    color: '#25d366',
    fontSize: '0.85rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    border: '1.5px solid #e5e7eb',
    borderRadius: 10,
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
};

// ─── Injected CSS for pseudo-states and responsive ──────────────────────────────

const INJECTED_CSS = `
  .scripta-diag-slider::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:#0d9488; cursor:pointer; box-shadow:0 2px 6px rgba(13,148,136,0.3); }
  .scripta-diag-slider::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:#0d9488; cursor:pointer; border:none; }
  .scripta-diag-input:focus { border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.1) !important; }
  .scripta-diag-input::placeholder { color:#9ca3af; }
  .scripta-diag-select:focus { border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.1) !important; }
  .scripta-diag-number-input:focus { border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.1) !important; }
  .scripta-diag-input-error:focus { border-color:#ef4444 !important; box-shadow:0 0 0 3px rgba(239,68,68,0.1) !important; }
  .scripta-diag-btn-next:hover:not(:disabled) { background:#0b7c72 !important; }
  .scripta-diag-btn-back:hover { border-color:#1a2332 !important; color:#1a2332 !important; }
  .scripta-diag-option:hover { border-color:#0d9488 !important; background:rgba(13,148,136,0.02) !important; }
  .scripta-diag-radio:hover { border-color:#0d9488 !important; }
  .scripta-diag-pill:hover { border-color:#0d9488 !important; background:rgba(13,148,136,0.03) !important; }
  .scripta-diag-cta:hover { background:#0b7c72 !important; }
  .scripta-diag-cta:active { transform:scale(0.985); }
  .scripta-diag-cta-sec:hover { border-color:#1a2332 !important; }
  .scripta-diag-cta-wa:hover { border-color:#25d366 !important; }
  @keyframes scripta-diag-blink { 50% { opacity:0; } }
  @media (max-width: 480px) {
    .scripta-diag-wizard { border-radius:12px !important; }
    .scripta-diag-header { padding:20px 20px !important; }
    .scripta-diag-progress { padding:12px 20px !important; }
    .scripta-diag-body { padding:20px 20px 24px !important; }
    .scripta-diag-header-title { font-size:1.1rem !important; }
    .scripta-diag-urgency-group { grid-template-columns:1fr !important; gap:6px !important; }
    .scripta-diag-pill { flex-direction:row !important; justify-content:space-between !important; padding:10px 14px !important; }
    .scripta-diag-summary-grid { grid-template-columns:1fr !important; }
    .scripta-diag-price-total-value { font-size:1.5rem !important; }
    .scripta-diag-cta-row { flex-direction:column !important; }
    .scripta-diag-progress-dot { width:24px !important; height:24px !important; font-size:0.6rem !important; }
  }
`;

// ─── Main Component ────────────────────────────────────────────────────────────

export default function DiagnosticForm() {
  const [step, setStep] = useState(0); // 0-4

  // Step 1
  const [stage, setStage] = useState(null);
  // Step 2
  const [workType, setWorkType] = useState(null);
  // Step 3
  const [discipline, setDiscipline] = useState('');
  const [disciplineOther, setDisciplineOther] = useState('');
  const [pages, setPages] = useState(20);
  const [hasData, setHasData] = useState(null);
  const [hasTargetJournal, setHasTargetJournal] = useState(null);
  const [targetJournal, setTargetJournal] = useState('');
  const [needsTranslation, setNeedsTranslation] = useState(null);
  const [chapters, setChapters] = useState(5);
  const [hasPublisher, setHasPublisher] = useState(null);
  const [publisher, setPublisher] = useState('');
  const [hasReviewerComments, setHasReviewerComments] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  // Step 4
  const [urgency, setUrgency] = useState('estandar');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [universidad, setUniversidad] = useState('');
  const [touched, setTouched] = useState({});

  // Derived
  const isArticleOrReview = workType === 'articulo_original' || workType === 'articulo_revision' || workType === 'revision_sistematica';
  const isBook = stage === 'libro';
  const isRejection = stage === 'rechazado';
  const disciplineDisplay = discipline === 'Otra' ? disciplineOther : discipline;

  const urgencyObj = URGENCY.find((u) => u.id === urgency);

  // Recommendation
  const recommendation = useMemo(
    () => recommendService(stage, workType, pages),
    [stage, workType, pages]
  );

  const pricing = useMemo(() => {
    if (!recommendation) return { subtotal: 0, extra: 0, urgencyAmount: 0, total: 0 };
    return calculatePrice(recommendation.serviceKey, pages, urgencyObj.mult, needsTranslation && recommendation.serviceKey !== 'correccion_traduccion');
  }, [recommendation, pages, urgencyObj, needsTranslation]);

  const serviceName = recommendation
    ? recommendation.serviceKey === 'correccion_traduccion'
      ? 'Corrección y edición + Traducción académica'
      : SERVICES[recommendation.serviceKey]?.name || ''
    : '';

  // ── Step validation ──
  function canProceed(s) {
    if (s === 0) return stage !== null;
    if (s === 1) return workType !== null;
    if (s === 2) return discipline !== '' && (discipline !== 'Otra' || disciplineOther.trim() !== '');
    if (s === 3) return nombre.trim() !== '' && EMAIL_REGEX.test(email);
    return true;
  }

  function goNext() {
    if (step < 4 && canProceed(step)) {
      // Reset workType if stage changed to incompatible
      if (step === 0) {
        const types = getWorkTypes(stage);
        if (!types.find((t) => t.id === workType)) setWorkType(null);
      }
      setStep(step + 1);
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function handlePages(val) {
    setPages(Math.max(1, Math.min(300, parseInt(val, 10) || 1)));
  }

  function handleChapters(val) {
    setChapters(Math.max(3, Math.min(20, parseInt(val, 10) || 3)));
  }

  // ── Mailto ──
  const mailtoHref = useMemo(() => {
    const subj = encodeURIComponent(`Solicitud Scripta: ${serviceName}`);
    const lines = [
      `Nombre: ${nombre}`,
      `Email: ${email}`,
      `WhatsApp: ${whatsapp || 'No proporcionado'}`,
      `Universidad: ${universidad || 'No proporcionado'}`,
      '',
      'PROYECTO:',
      `- Etapa: ${STAGES.find((s) => s.id === stage)?.title || ''}`,
      `- Tipo: ${getWorkTypes(stage).find((t) => t.id === workType)?.label || ''}`,
      `- Disciplina: ${disciplineDisplay}`,
      `- Páginas: ${pages}`,
      `- Datos recopilados: ${hasData === null ? 'No especificado' : hasData}`,
    ];
    if (isArticleOrReview) {
      lines.push(`- Revista objetivo: ${hasTargetJournal === 'si' ? targetJournal || 'Sí (no especificada)' : 'No'}`);
      lines.push(`- Traducción al inglés: ${needsTranslation === 'si' ? 'Sí' : 'No'}`);
    }
    if (isBook) {
      lines.push(`- Capítulos: ${chapters}`);
      lines.push(`- Editorial específica: ${hasPublisher === 'si' ? publisher || 'Sí' : 'No'}`);
    }
    if (isRejection) {
      lines.push(`- Comentarios de reviewers: ${hasReviewerComments === 'si' ? 'Sí' : 'No'}`);
      lines.push(`- Motivo de rechazo: ${rejectionReason || 'No especificado'}`);
    }
    lines.push('');
    lines.push(`SERVICIO RECOMENDADO: ${serviceName}`);
    lines.push(`URGENCIA: ${urgencyObj.name} (${urgencyObj.time})`);
    lines.push(`INVERSIÓN ESTIMADA: $${formatUSD(pricing.total)} USD`);
    return `mailto:info@scriptaacademic.com?subject=${subj}&body=${encodeURIComponent(lines.join('\n'))}`;
  }, [nombre, email, whatsapp, universidad, stage, workType, disciplineDisplay, pages, hasData, isArticleOrReview, hasTargetJournal, targetJournal, needsTranslation, isBook, chapters, hasPublisher, publisher, isRejection, hasReviewerComments, rejectionReason, serviceName, urgencyObj, pricing.total]);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola Scripta, quiero consultar sobre ${serviceName} para mi proyecto de ${disciplineDisplay || 'mi disciplina'}.`)}`;

  const emailDiagHref = useMemo(() => {
    const subj = encodeURIComponent(`Mi diagnóstico Scripta Academic`);
    const body = encodeURIComponent(
      `Hola, me gustaría recibir mi diagnóstico completo por email.\n\nServicio recomendado: ${serviceName}\nInversión estimada: $${formatUSD(pricing.total)} USD\n\nGracias.`
    );
    return `mailto:info@scriptaacademic.com?subject=${subj}&body=${body}`;
  }, [serviceName, pricing.total]);

  // ── Render helpers ──

  function renderProgressBar() {
    const labels = ['Etapa', 'Tipo', 'Detalles', 'Contacto', 'Resultado'];
    return (
      <div className="scripta-diag-progress" style={S.progress}>
        {labels.map((label, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{
                ...S.progressLine,
                ...(i <= step ? S.progressLineActive : {}),
              }} />
            )}
            <div style={S.progressStep}>
              <div
                className="scripta-diag-progress-dot"
                style={{
                  ...S.progressDot,
                  ...(i === step || i < step ? S.progressDotActive : {}),
                }}
              >
                {i < step ? <IconCheck size={12} /> : i + 1}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // ── Step 1: Stage ──
  function renderStep1() {
    return (
      <div style={S.slide}>
        <h3 style={S.stepQuestion}>¿En qué etapa está tu proyecto?</h3>
        <div style={S.optionCards}>
          {STAGES.map((s) => {
            const isActive = stage === s.id;
            return (
              <button
                key={s.id}
                type="button"
                className="scripta-diag-option"
                style={{
                  ...S.optionCard,
                  ...(isActive ? S.optionCardActive : {}),
                }}
                onClick={() => setStage(s.id)}
              >
                <span style={S.optionEmoji}>{s.emoji}</span>
                <span style={S.optionText}>
                  <span style={{
                    ...S.optionTitle,
                    ...(isActive ? S.optionTitleActive : {}),
                  }}>{s.title}</span>
                  <span style={S.optionDesc}>{s.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Step 2: Work type ──
  function renderStep2() {
    const types = getWorkTypes(stage);
    return (
      <div style={S.slide}>
        <h3 style={S.stepQuestion}>¿Qué quieres producir?</h3>
        <div style={S.optionCards}>
          {types.map((t) => {
            const isActive = workType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className="scripta-diag-option"
                style={{
                  ...S.optionCard,
                  ...(isActive ? S.optionCardActive : {}),
                }}
                onClick={() => setWorkType(t.id)}
              >
                <span style={S.optionText}>
                  <span style={{
                    ...S.optionTitle,
                    ...(isActive ? S.optionTitleActive : {}),
                  }}>{t.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Step 3: Details ──
  function renderStep3() {
    return (
      <div style={S.slide}>
        <h3 style={S.stepQuestion}>Cuéntanos más sobre tu proyecto</h3>
        <div style={S.formGrid}>
          {/* Discipline */}
          <div style={S.field}>
            <label style={S.fieldLabel}>
              Disciplina / área de conocimiento <span style={S.req}>*</span>
            </label>
            <div style={S.selectWrapper}>
              <select
                className="scripta-diag-select"
                style={S.select}
                value={discipline}
                onChange={(e) => { setDiscipline(e.target.value); if (e.target.value !== 'Otra') setDisciplineOther(''); }}
              >
                <option value="">Selecciona una opción</option>
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="Otra">Otra</option>
              </select>
              <span style={S.selectArrow}><IconChevron /></span>
            </div>
            {discipline === 'Otra' && (
              <input
                type="text"
                className="scripta-diag-input"
                style={S.input}
                placeholder="Especifica tu disciplina"
                value={disciplineOther}
                onChange={(e) => setDisciplineOther(e.target.value)}
              />
            )}
          </div>

          {/* Pages */}
          <div style={S.field}>
            <label style={S.fieldLabel}>Número estimado de páginas</label>
            <div style={S.sliderRow}>
              <input
                type="range"
                className="scripta-diag-slider"
                style={S.slider}
                min={5}
                max={300}
                value={pages}
                onChange={(e) => handlePages(e.target.value)}
              />
              <input
                type="number"
                className="scripta-diag-number-input"
                style={S.numberInput}
                min={5}
                max={300}
                value={pages}
                onChange={(e) => handlePages(e.target.value)}
              />
              <span style={S.sliderUnit}>págs.</span>
            </div>
          </div>

          {/* Data collected */}
          <div style={S.field}>
            <label style={S.fieldLabel}>¿Tienes datos recopilados?</label>
            <div style={S.radioGroup}>
              {['Sí', 'No', 'Parcialmente'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="scripta-diag-radio"
                  style={{
                    ...S.radioBtn,
                    ...(hasData === opt ? S.radioBtnActive : {}),
                  }}
                  onClick={() => setHasData(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Article/review-specific */}
          {isArticleOrReview && (
            <>
              <div style={S.field}>
                <label style={S.fieldLabel}>¿Tienes una revista objetivo?</label>
                <div style={S.radioGroup}>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(hasTargetJournal === 'si' ? S.radioBtnActive : {}) }} onClick={() => setHasTargetJournal('si')}>Sí</button>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(hasTargetJournal === 'no' ? S.radioBtnActive : {}) }} onClick={() => setHasTargetJournal('no')}>No</button>
                </div>
                {hasTargetJournal === 'si' && (
                  <input type="text" className="scripta-diag-input" style={S.input} placeholder="Nombre de la revista" value={targetJournal} onChange={(e) => setTargetJournal(e.target.value)} />
                )}
              </div>
              <div style={S.field}>
                <label style={S.fieldLabel}>¿Necesitas traducción al inglés?</label>
                <div style={S.radioGroup}>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(needsTranslation === 'si' ? S.radioBtnActive : {}) }} onClick={() => setNeedsTranslation('si')}>Sí</button>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(needsTranslation === 'no' ? S.radioBtnActive : {}) }} onClick={() => setNeedsTranslation('no')}>No</button>
                </div>
              </div>
            </>
          )}

          {/* Book-specific */}
          {isBook && (
            <>
              <div style={S.field}>
                <label style={S.fieldLabel}>¿Cuántos capítulos?</label>
                <div style={S.sliderRow}>
                  <input type="range" className="scripta-diag-slider" style={S.slider} min={3} max={20} value={chapters} onChange={(e) => handleChapters(e.target.value)} />
                  <input type="number" className="scripta-diag-number-input" style={S.numberInput} min={3} max={20} value={chapters} onChange={(e) => handleChapters(e.target.value)} />
                  <span style={S.sliderUnit}>caps.</span>
                </div>
              </div>
              <div style={S.field}>
                <label style={S.fieldLabel}>¿Es para una editorial específica?</label>
                <div style={S.radioGroup}>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(hasPublisher === 'si' ? S.radioBtnActive : {}) }} onClick={() => setHasPublisher('si')}>Sí</button>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(hasPublisher === 'no' ? S.radioBtnActive : {}) }} onClick={() => setHasPublisher('no')}>No</button>
                </div>
                {hasPublisher === 'si' && (
                  <input type="text" className="scripta-diag-input" style={S.input} placeholder="Nombre de la editorial" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                )}
              </div>
            </>
          )}

          {/* Rejection-specific */}
          {isRejection && (
            <>
              <div style={S.field}>
                <label style={S.fieldLabel}>¿Tienes los comentarios de los reviewers?</label>
                <div style={S.radioGroup}>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(hasReviewerComments === 'si' ? S.radioBtnActive : {}) }} onClick={() => setHasReviewerComments('si')}>Sí</button>
                  <button type="button" className="scripta-diag-radio" style={{ ...S.radioBtn, ...(hasReviewerComments === 'no' ? S.radioBtnActive : {}) }} onClick={() => setHasReviewerComments('no')}>No</button>
                </div>
              </div>
              <div style={S.field}>
                <label style={S.fieldLabel}>Motivo principal del rechazo</label>
                <div style={S.selectWrapper}>
                  <select className="scripta-diag-select" style={S.select} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}>
                    <option value="">Selecciona una opción</option>
                    {REJECTION_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <span style={S.selectArrow}><IconChevron /></span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Step 4: Urgency + contact ──
  function renderStep4() {
    const emailInvalid = touched.email && !EMAIL_REGEX.test(email);
    const nombreInvalid = touched.nombre && nombre.trim() === '';
    return (
      <div style={S.slide}>
        <h3 style={S.stepQuestion}>Urgencia y datos de contacto</h3>
        <div style={S.formGrid}>
          {/* Urgency */}
          <div style={S.field}>
            <label style={S.fieldLabel}>Nivel de urgencia</label>
            <div className="scripta-diag-urgency-group" style={S.urgencyGroup}>
              {URGENCY.map((u) => {
                const isActive = urgency === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    className="scripta-diag-pill"
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

          {/* Name */}
          <div style={S.field}>
            <label style={S.fieldLabel}>Nombre completo <span style={S.req}>*</span></label>
            <input
              type="text"
              className={`scripta-diag-input${nombreInvalid ? ' scripta-diag-input-error' : ''}`}
              style={{
                ...S.input,
                ...(nombreInvalid ? S.inputError : {}),
              }}
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
            />
            {nombreInvalid && <span style={S.errorMsg}>El nombre es requerido</span>}
          </div>

          {/* Email */}
          <div style={S.field}>
            <label style={S.fieldLabel}>Correo electrónico <span style={S.req}>*</span></label>
            <input
              type="email"
              className={`scripta-diag-input${emailInvalid ? ' scripta-diag-input-error' : ''}`}
              style={{
                ...S.input,
                ...(emailInvalid ? S.inputError : {}),
              }}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            {emailInvalid && <span style={S.errorMsg}>Ingresa un correo válido</span>}
          </div>

          {/* WhatsApp */}
          <div style={S.field}>
            <label style={S.fieldLabel}>WhatsApp <span style={S.fieldHint}>(opcional)</span></label>
            <input
              type="tel"
              className="scripta-diag-input"
              style={S.input}
              placeholder="+593..."
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          {/* University */}
          <div style={S.field}>
            <label style={S.fieldLabel}>Universidad / institución <span style={S.fieldHint}>(opcional)</span></label>
            <input
              type="text"
              className="scripta-diag-input"
              style={S.input}
              placeholder="Nombre de tu institución"
              value={universidad}
              onChange={(e) => setUniversidad(e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Step 5: Result ──
  function renderStep5() {
    const stageLabel = STAGES.find((s) => s.id === stage)?.title || '';
    const typeLabel = getWorkTypes(stage).find((t) => t.id === workType)?.label || '';

    return (
      <div style={S.slide}>
        <div style={S.resultPanel}>
          {/* Summary */}
          <div style={S.resultSection}>
            <h4 style={S.resultSectionTitle}>Tu proyecto</h4>
            <div className="scripta-diag-summary-grid" style={S.summaryGrid}>
              <div style={S.summaryItem}>
                <div style={S.summaryItemLabel}>Etapa</div>
                <div style={S.summaryItemValue}>{stageLabel}</div>
              </div>
              <div style={S.summaryItem}>
                <div style={S.summaryItemLabel}>Tipo</div>
                <div style={S.summaryItemValue}>{typeLabel}</div>
              </div>
              <div style={S.summaryItem}>
                <div style={S.summaryItemLabel}>Área</div>
                <div style={S.summaryItemValue}>{disciplineDisplay || 'No especificada'}</div>
              </div>
              <div style={S.summaryItem}>
                <div style={S.summaryItemLabel}>Volumen</div>
                <div style={S.summaryItemValue}>{pages} páginas</div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div style={S.resultSection}>
            <h4 style={S.resultSectionTitle}>Servicio recomendado</h4>
            <div style={S.recommendedCard}>
              <span style={S.recommendedName}>{serviceName}</span>
              <span style={S.recommendedReason}>{recommendation?.reason}</span>
              {recommendation?.note && (
                <span style={S.recommendedNote}>{recommendation.note}</span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div style={S.resultSection}>
            <h4 style={S.resultSectionTitle}>Inversión estimada</h4>
            <div style={S.priceBreakdown}>
              <div style={S.priceRow}>
                <span style={S.priceLabel}>Subtotal</span>
                <span style={S.priceValue}>${formatUSD(pricing.subtotal)}</span>
              </div>
              {pricing.extra > 0 && (
                <div style={S.priceRow}>
                  <span style={S.priceLabel}>Páginas adicionales</span>
                  <span style={S.priceValue}>+${formatUSD(pricing.extra)}</span>
                </div>
              )}
              {pricing.translationCost > 0 && (
                <div style={S.priceRow}>
                  <span style={S.priceLabel}>Traducción ({pages} págs.)</span>
                  <span style={S.priceValue}>+${formatUSD(pricing.translationCost)}</span>
                </div>
              )}
              {pricing.urgencyAmount > 0 && (
                <div style={S.priceRow}>
                  <span style={S.priceLabel}>Recargo {urgencyObj.name.toLowerCase()} ({urgencyObj.label})</span>
                  <span style={S.priceValue}>+${formatUSD(pricing.urgencyAmount)}</span>
                </div>
              )}
              <div style={S.priceTotal}>
                <span style={S.priceTotalLabel}>TOTAL</span>
                <span className="scripta-diag-price-total-value" style={S.priceTotalValue}>
                  <span style={S.priceTotalCurrency}>USD</span>
                  {formatUSD(pricing.total)}
                </span>
              </div>
              <div style={S.paymentInfo}>
                <span style={S.paymentInfoIcon}><IconShield size={14} /></span>
                <span>50% al contratar &middot; 50% al entregar</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={S.actions}>
            <a href={mailtoHref} className="scripta-diag-cta" style={S.ctaPrimary}>
              <IconMail size={18} />
              Solicitar este servicio
            </a>
            <div className="scripta-diag-cta-row" style={S.ctaRow}>
              <a href={emailDiagHref} className="scripta-diag-cta-sec" style={S.ctaSecondary}>
                Enviar diagnóstico a mi email
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="scripta-diag-cta-wa" style={S.ctaWhatsapp}>
                <IconWhatsapp size={16} />
                Quiero hablar primero
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──
  const steps = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5];

  return (
    <div className="scripta-diag-wizard" style={S.wizard}>
      <style>{INJECTED_CSS}</style>

      {/* Header */}
      <div className="scripta-diag-header" style={S.header}>
        <div style={S.headerIcon}>
          <IconClipboard />
        </div>
        <div>
          <h2 className="scripta-diag-header-title" style={S.headerTitle}>Diagnóstico gratuito de tu proyecto</h2>
          <p style={S.headerSubtitle}>Responde 4 preguntas y recibe una recomendación personalizada</p>
        </div>
      </div>

      {/* Progress */}
      {renderProgressBar()}

      {/* Body with slide */}
      <div className="scripta-diag-body" style={S.body}>
        <div
          style={{
            ...S.slideContainer,
            transform: `translateX(-${step * 100}%)`,
          }}
        >
          {steps.map((renderFn, i) => (
            <React.Fragment key={i}>{renderFn()}</React.Fragment>
          ))}
        </div>

        {/* Nav */}
        {step < 4 && (
          <div style={S.nav}>
            {step > 0 ? (
              <button type="button" className="scripta-diag-btn-back" style={S.btnBack} onClick={goBack}>
                <IconArrowLeft size={14} />
                Anterior
              </button>
            ) : <span />}
            <button
              type="button"
              className="scripta-diag-btn-next"
              style={{
                ...S.btnNext,
                ...(!canProceed(step) ? S.btnNextDisabled : {}),
              }}
              disabled={!canProceed(step)}
              onClick={goNext}
            >
              {step === 3 ? 'Ver diagnóstico' : 'Siguiente'}
              <IconArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 4 && (
          <div style={S.nav}>
            <button type="button" className="scripta-diag-btn-back" style={S.btnBack} onClick={goBack}>
              <IconArrowLeft size={14} />
              Modificar respuestas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
