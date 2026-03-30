import React from 'react';

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCheck({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const ACCENT = '#dc2626';
const ACCENT_BG = 'rgba(220,38,38,0.06)';
const ACCENT_LIGHT = '#fef2f2';

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
    background: 'linear-gradient(135deg, #1a2332 0%, #2d1b1b 100%)',
    padding: '24px 28px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    background: 'rgba(220,38,38,0.15)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: '#f87171',
  },
  headerTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
  },
  headerSub: {
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  body: {
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  dimGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  dimCard: {
    padding: '14px',
    background: ACCENT_LIGHT,
    borderRadius: 10,
    borderLeft: `3px solid ${ACCENT}`,
  },
  dimIcon: {
    fontSize: '1.25rem',
    marginBottom: 6,
  },
  dimTitle: {
    fontSize: '0.88rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: 4,
  },
  dimDesc: {
    fontSize: '0.75rem',
    color: '#6b7280',
    lineHeight: 1.5,
  },
  quote: {
    padding: '16px 20px',
    background: '#f9fafb',
    borderRadius: 10,
    borderLeft: '3px solid #9ca3af',
    fontSize: '0.85rem',
    color: '#4b5563',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  priceCard: {
    textAlign: 'center',
    padding: '16px 10px',
    background: '#f9fafb',
    borderRadius: 10,
    border: '1px solid #f3f4f6',
  },
  priceLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: 6,
  },
  priceAmount: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#1a2332',
    lineHeight: 1,
  },
  priceNote: {
    fontSize: '0.68rem',
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
    background: ACCENT,
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
    background: ACCENT_BG,
    borderRadius: 6,
    fontSize: '0.72rem',
    fontWeight: 600,
    color: ACCENT,
    letterSpacing: '0.02em',
  },
};

const INJECTED_CSS = `
  .scripta-integ-cta:hover { background: #b91c1c !important; }
  .scripta-integ-sec:hover { border-color: #1a2332 !important; }
  @media (max-width: 480px) {
    .scripta-integ-dims { grid-template-columns: 1fr !important; }
    .scripta-integ-pricing { grid-template-columns: 1fr !important; }
  }
`;

const DIMENSIONS = [
  {
    icon: '🔢',
    title: 'Integridad de datos',
    desc: 'Ley de Benford, patrones imposibles, valores demasiado perfectos, decimales inverosímiles.',
  },
  {
    icon: '📚',
    title: 'Citas fantasma',
    desc: 'Verifica que las citas respalden lo que afirmas. Detecta referencias inventadas o irrelevantes.',
  },
  {
    icon: '🔬',
    title: 'Coherencia metodológica',
    desc: 'Métodos vs resultados vs conclusiones. Detecta saltos lógicos y diseños inadecuados.',
  },
  {
    icon: '📊',
    title: 'Consistencia estadística',
    desc: 'p-values, intervalos de confianza, grados de libertad, p-hacking, porcentajes que no cuadran.',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function IntegritySuite() {
  const whatsappMsg = encodeURIComponent(
    'Hola, me interesa el análisis de Integridad Total para mi manuscrito. ¿Cómo procedo?'
  );

  return (
    <div style={S.card}>
      <style>{INJECTED_CSS}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerIcon}>
          <IconShield />
        </div>
        <div>
          <h2 style={S.headerTitle}>Suite &ldquo;Integridad Total&rdquo;</h2>
          <p style={S.headerSub}>
            Más allá del plagio: análisis profundo de integridad científica
          </p>
        </div>
      </div>

      <div style={S.body}>
        {/* 4 dimensions */}
        <div className="scripta-integ-dims" style={S.dimGrid}>
          {DIMENSIONS.map((dim) => (
            <div key={dim.title} style={S.dimCard}>
              <div style={S.dimIcon}>{dim.icon}</div>
              <div style={S.dimTitle}>{dim.title}</div>
              <div style={S.dimDesc}>{dim.desc}</div>
            </div>
          ))}
        </div>

        {/* Quote / differentiator */}
        <div style={S.quote}>
          Los servicios de plagio solo detectan texto copiado. Nosotros detectamos
          datos fabricados, citas que no dicen lo que afirmas, y estadísticas que no cuadran.
        </div>

        {/* Pricing */}
        <div className="scripta-integ-pricing" style={S.pricingGrid}>
          <div style={S.priceCard}>
            <div style={S.priceLabel}>Manuscrito</div>
            <div style={S.priceAmount}>$50</div>
            <div style={S.priceNote}>Individual</div>
          </div>
          <div style={S.priceCard}>
            <div style={S.priceLabel}>Tesis completa</div>
            <div style={S.priceAmount}>$120</div>
            <div style={S.priceNote}>Todas las secciones</div>
          </div>
          <div style={{ ...S.priceCard, border: `1.5px solid ${ACCENT}`, background: ACCENT_LIGHT }}>
            <div style={{ ...S.priceLabel, color: ACCENT }}>Institucional</div>
            <div style={S.priceAmount}>$500</div>
            <div style={S.priceNote}>20 análisis / año</div>
          </div>
        </div>

        {/* CTAs */}
        <a
          href={`https://wa.me/593991520523?text=${whatsappMsg}`}
          className="scripta-integ-cta"
          style={S.ctaPrimary}
          target="_blank"
          rel="noopener"
        >
          Solicitar análisis de integridad
        </a>

        <a
          href="mailto:info@scriptaacademic.com?subject=Solicitud%3A%20An%C3%A1lisis%20de%20Integridad%20Total"
          className="scripta-integ-sec"
          style={S.ctaSecondary}
        >
          Enviar manuscrito por email
        </a>

        {/* Badge */}
        <div style={{ textAlign: 'center' }}>
          <span style={S.badge}>Único en Latinoamérica</span>
        </div>
      </div>
    </div>
  );
}
