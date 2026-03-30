import React from 'react';

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconClipboard() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
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

// ─── Styles ────────────────────────────────────────────────────────────────────

const S = {
  card: {
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
    background: 'rgba(212,168,83,0.15)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: '#d4a853',
  },
  headerTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.01em',
  },
  headerSubtitle: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.6)',
    margin: '2px 0 0',
  },
  body: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  dimensionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  dimItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    background: '#f9fafb',
    borderRadius: 8,
    border: '1px solid #f3f4f6',
  },
  dimIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: 'rgba(13,148,136,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0d9488',
    flexShrink: 0,
  },
  dimText: {
    fontSize: '0.82rem',
    color: '#374151',
    fontWeight: 500,
  },
  includesSection: {
    padding: '16px 20px',
    background: '#f0fdf4',
    borderRadius: 10,
    borderLeft: '3px solid #0d9488',
  },
  includesTitle: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#0d9488',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 10,
  },
  includesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  includesItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.82rem',
    color: '#374151',
  },
  includesCheck: {
    color: '#0d9488',
    flexShrink: 0,
  },
  priceBlock: {
    textAlign: 'center',
    padding: '16px 0',
  },
  priceAmount: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#1a2332',
    lineHeight: 1,
  },
  priceCurrency: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#6b7280',
  },
  priceNote: {
    fontSize: '0.78rem',
    color: '#9ca3af',
    marginTop: 4,
  },
  ctaPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '14px 28px',
    background: '#d4a853',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background 0.2s',
    boxSizing: 'border-box',
  },
  ctaSecondary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    padding: '11px 18px',
    background: '#fff',
    color: '#1a2332',
    fontSize: '0.85rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'center',
    padding: '5px 12px',
    background: 'rgba(212,168,83,0.1)',
    borderRadius: 6,
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#92400e',
    letterSpacing: '0.02em',
  },
};

const INJECTED_CSS = `
  .scripta-diag-cta-primary:hover { background: #c49a47 !important; }
  .scripta-diag-cta-sec:hover { border-color: #1a2332 !important; }
  @media (max-width: 480px) {
    .scripta-diag-dims { grid-template-columns: 1fr !important; }
  }
`;

const DIMENSIONS = [
  { label: 'Estructura (IMRyD)', icon: '◫' },
  { label: 'Claridad de redacción', icon: '✎' },
  { label: 'Rigor metodológico', icon: '⚙' },
  { label: 'Referencias y citas', icon: '📎' },
  { label: 'Originalidad', icon: '★' },
  { label: 'Formato editorial', icon: '▤' },
];

const INCLUDES = [
  'Evaluación en 6 dimensiones (1-10)',
  'Nivel de riesgo de desk-rejection',
  '4 revistas indexadas sugeridas para tu tema',
  'Fortalezas, debilidades y recomendaciones',
  'Servicio recomendado según tu manuscrito',
  'Resumen ejecutivo del veredicto',
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ManuscriptDiagnostic() {
  const whatsappMsg = encodeURIComponent(
    'Hola, me interesa el Diagnóstico Profesional de Manuscrito ($19 USD). ¿Cómo envío mi archivo?'
  );

  return (
    <div style={S.card}>
      <style>{INJECTED_CSS}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerIcon}>
          <IconClipboard />
        </div>
        <div>
          <h2 style={S.headerTitle}>Diagnóstico Profesional de Manuscrito</h2>
          <p style={S.headerSubtitle}>
            Evaluación experta en 6 dimensiones con recomendación de revistas
          </p>
        </div>
      </div>

      <div style={S.body}>
        {/* 6 dimensions visual */}
        <div className="scripta-diag-dims" style={S.dimensionsGrid}>
          {DIMENSIONS.map((dim) => (
            <div key={dim.label} style={S.dimItem}>
              <div style={S.dimIcon}>
                <span style={{ fontSize: 14 }}>{dim.icon}</span>
              </div>
              <span style={S.dimText}>{dim.label}</span>
            </div>
          ))}
        </div>

        {/* What's included */}
        <div style={S.includesSection}>
          <div style={S.includesTitle}>Qué incluye el diagnóstico</div>
          <ul style={S.includesList}>
            {INCLUDES.map((item) => (
              <li key={item} style={S.includesItem}>
                <span style={S.includesCheck}><IconCheck size={12} /></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Price */}
        <div style={S.priceBlock}>
          <div>
            <span style={S.priceCurrency}>USD </span>
            <span style={S.priceAmount}>$19</span>
          </div>
          <p style={S.priceNote}>Pago único · Sin suscripción</p>
        </div>

        {/* CTAs */}
        <a
          href={`https://wa.me/593991520523?text=${whatsappMsg}`}
          className="scripta-diag-cta-primary"
          style={S.ctaPrimary}
          target="_blank"
          rel="noopener"
        >
          Solicitar diagnóstico — $19 USD
        </a>

        <a
          href="mailto:info@scriptaacademic.com?subject=Solicitud%3A%20Diagn%C3%B3stico%20de%20Manuscrito%20%28%2419%29"
          className="scripta-diag-cta-sec"
          style={S.ctaSecondary}
        >
          Enviar manuscrito por email
        </a>

        {/* Badge */}
        <div style={{ textAlign: 'center' }}>
          <span style={S.badge}>Entrega en 24–48 horas</span>
        </div>
      </div>
    </div>
  );
}
