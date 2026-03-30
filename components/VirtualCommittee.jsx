import React from 'react';

// ─── Icons ─────────────────────────────────────────────────────────────────────

function IconGrad() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
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

const PURPLE = '#6d28d9';
const PURPLE_BG = 'rgba(109,40,217,0.06)';
const PURPLE_LIGHT = '#f5f3ff';

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
    background: 'linear-gradient(135deg, #1a2332 0%, #1e1b4b 100%)',
    padding: '24px 28px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    background: 'rgba(109,40,217,0.2)',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: '#a78bfa',
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
  membersRow: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  member: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: 90,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
  },
  memberName: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  memberRole: {
    fontSize: '0.6rem',
    color: '#9ca3af',
    textAlign: 'center',
  },
  featuresList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: '0.85rem',
    color: '#374151',
  },
  featureCheck: {
    color: PURPLE,
    flexShrink: 0,
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },
  priceCard: {
    textAlign: 'center',
    padding: '14px 10px',
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
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#1a2332',
    lineHeight: 1,
  },
  priceNote: {
    fontSize: '0.65rem',
    color: '#9ca3af',
    marginTop: 3,
  },
  ctaPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '14px 28px',
    background: PURPLE,
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
    background: PURPLE_BG,
    borderRadius: 6,
    fontSize: '0.72rem',
    fontWeight: 600,
    color: PURPLE,
    letterSpacing: '0.02em',
  },
};

const INJECTED_CSS = `
  .scripta-comm-cta:hover { background: #5b21b6 !important; }
  .scripta-comm-sec:hover { border-color: #1a2332 !important; }
  @media (max-width: 480px) {
    .scripta-comm-pricing { grid-template-columns: 1fr !important; }
  }
`;

const MEMBERS = [
  { initials: 'JM', name: 'Dr. Morales', role: 'Presidente', color: '#1e40af' },
  { initials: 'MV', name: 'Dra. Vásquez', role: 'Metodóloga', color: '#0d9488' },
  { initials: 'CR', name: 'Dr. Restrepo', role: 'Estadístico', color: '#b45309' },
  { initials: 'LP', name: 'Dra. Pacheco', role: 'Experta', color: '#7c3aed' },
  { initials: 'RT', name: 'Dr. Torres', role: 'Externo', color: '#dc2626' },
];

const FEATURES = [
  '5 evaluadores especializados por dimensión',
  'Preguntas específicas a TU tesis',
  'Evaluación de tus respuestas en tiempo real',
  'Feedback constructivo por dimensión',
  'Preguntas de seguimiento adaptativas',
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function VirtualCommittee() {
  const whatsappMsg = encodeURIComponent(
    'Hola, me interesa una sesión del Comité Virtual para practicar mi defensa de tesis. ¿Cómo procedo?'
  );

  return (
    <div style={S.card}>
      <style>{INJECTED_CSS}</style>

      <div style={S.header}>
        <div style={S.headerIcon}>
          <IconGrad />
        </div>
        <div>
          <h2 style={S.headerTitle}>Comité Virtual</h2>
          <p style={S.headerSub}>
            Simulador de defensa de tesis con tribunal de 5 evaluadores
          </p>
        </div>
      </div>

      <div style={S.body}>
        {/* 5 members */}
        <div style={S.membersRow}>
          {MEMBERS.map((m) => (
            <div key={m.initials} style={S.member}>
              <div style={{ ...S.memberAvatar, background: m.color }}>{m.initials}</div>
              <div style={S.memberName}>{m.name}</div>
              <div style={S.memberRole}>{m.role}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <ul style={S.featuresList}>
          {FEATURES.map((f) => (
            <li key={f} style={S.featureItem}>
              <span style={S.featureCheck}><IconCheck size={14} /></span>
              {f}
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="scripta-comm-pricing" style={S.pricingGrid}>
          <div style={S.priceCard}>
            <div style={S.priceLabel}>Pregrado</div>
            <div style={S.priceAmount}>$25</div>
            <div style={S.priceNote}>45 min</div>
          </div>
          <div style={S.priceCard}>
            <div style={S.priceLabel}>Maestría</div>
            <div style={S.priceAmount}>$35</div>
            <div style={S.priceNote}>60 min</div>
          </div>
          <div style={{ ...S.priceCard, border: `1.5px solid ${PURPLE}`, background: PURPLE_LIGHT }}>
            <div style={{ ...S.priceLabel, color: PURPLE }}>Doctorado</div>
            <div style={S.priceAmount}>$50</div>
            <div style={S.priceNote}>75 min</div>
          </div>
        </div>

        {/* CTAs */}
        <a
          href={`https://wa.me/593991520523?text=${whatsappMsg}`}
          className="scripta-comm-cta"
          style={S.ctaPrimary}
          target="_blank"
          rel="noopener"
        >
          Solicitar sesión de práctica
        </a>

        <a
          href="mailto:info@scriptaacademic.com?subject=Solicitud%3A%20Comit%C3%A9%20Virtual%20%28Defensa%20de%20Tesis%29"
          className="scripta-comm-sec"
          style={S.ctaSecondary}
        >
          Más información por email
        </a>

        <div style={{ textAlign: 'center' }}>
          <span style={S.badge}>Practica antes de la defensa real</span>
        </div>
      </div>
    </div>
  );
}
