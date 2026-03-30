import React, { useState } from 'react';

// ─── Config ────────────────────────────────────────────────────────────────────

const API_URL = 'https://scripta-api1.vercel.app/api/order-status';

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconClipboard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconGear() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconCheck({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const STEP_ICONS = {
  clipboard: IconClipboard,
  gear: IconGear,
  search: IconSearch,
  check: IconCheck,
};

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
  },
  headerTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
  },
  headerSub: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.55)',
    marginTop: 4,
  },
  body: {
    padding: '28px',
  },
  inputRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 6,
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    fontSize: '1rem',
    fontFamily: "'JetBrains Mono', monospace, system-ui",
    fontWeight: 600,
    letterSpacing: '0.08em',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    outline: 'none',
    color: '#1f2937',
    textTransform: 'uppercase',
    transition: 'border-color 0.2s',
  },
  btn: {
    padding: '12px 20px',
    background: '#0d9488',
    color: '#fff',
    fontSize: '0.88rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  hint: {
    fontSize: '0.72rem',
    color: '#9ca3af',
    marginBottom: 0,
  },
  error: {
    marginTop: 16,
    padding: '12px 16px',
    background: '#fef2f2',
    borderRadius: 8,
    borderLeft: '3px solid #ef4444',
    fontSize: '0.85rem',
    color: '#991b1b',
  },
  result: {
    marginTop: 20,
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  resultService: {
    fontSize: '0.78rem',
    color: '#6b7280',
  },
  resultCode: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: '#9ca3af',
    fontFamily: "'JetBrains Mono', monospace, system-ui",
    letterSpacing: '0.05em',
  },
  stepper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    margin: '20px 0',
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 0',
    position: 'relative',
  },
  stepIndicator: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
  },
  stepLine: {
    position: 'absolute',
    left: 17,
    top: 50,
    width: 2,
    bottom: -14,
    zIndex: 0,
  },
  stepLabel: {
    fontSize: '0.88rem',
    fontWeight: 600,
  },
  stepDesc: {
    fontSize: '0.78rem',
    color: '#6b7280',
    marginTop: 2,
    lineHeight: 1.5,
  },
  dates: {
    display: 'flex',
    gap: 20,
    marginTop: 8,
    padding: '10px 0',
    borderTop: '1px solid #f3f4f6',
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  ctaWhatsapp: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    padding: '11px 18px',
    marginTop: 12,
    background: '#fff',
    color: '#1a2332',
    fontSize: '0.82rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    textDecoration: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
};

const INJECTED_CSS = `
  .scripta-portal-btn:hover { background: #0b7c72 !important; }
  .scripta-portal-btn:disabled { background: #9ca3af !important; cursor: not-allowed !important; }
  .scripta-portal-input:focus { border-color: #0d9488 !important; }
  .scripta-portal-wa:hover { border-color: #1a2332 !important; }
`;

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ClientPortal() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`${API_URL}?code=${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Error al consultar el estado.');
      } else {
        setData(json);
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  function getStepStyle(stepIdx, currentStatus) {
    const isCompleted = stepIdx < currentStatus;
    const isCurrent = stepIdx === currentStatus;
    const isPending = stepIdx > currentStatus;

    if (isCompleted) {
      return {
        indicator: { ...S.stepIndicator, background: '#0d9488', color: '#fff' },
        line: { ...S.stepLine, background: '#0d9488' },
        label: { ...S.stepLabel, color: '#0d9488' },
      };
    }
    if (isCurrent) {
      return {
        indicator: { ...S.stepIndicator, background: '#0d9488', color: '#fff', boxShadow: '0 0 0 4px rgba(13,148,136,0.15)' },
        line: { ...S.stepLine, background: '#e5e7eb' },
        label: { ...S.stepLabel, color: '#1f2937' },
      };
    }
    return {
      indicator: { ...S.stepIndicator, background: '#f3f4f6', color: '#9ca3af' },
      line: { ...S.stepLine, background: '#f3f4f6' },
      label: { ...S.stepLabel, color: '#9ca3af' },
    };
  }

  return (
    <div style={S.card}>
      <style>{INJECTED_CSS}</style>

      <div style={S.header}>
        <h2 style={S.headerTitle}>Seguimiento de tu proyecto</h2>
        <p style={S.headerSub}>
          Ingresa tu código de seguimiento para ver el estado de tu encargo
        </p>
      </div>

      <div style={S.body}>
        <form onSubmit={handleSubmit}>
          <div style={S.inputRow}>
            <input
              className="scripta-portal-input"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SC-XXXX"
              maxLength={9}
              style={S.input}
            />
            <button
              type="submit"
              className="scripta-portal-btn"
              style={S.btn}
              disabled={loading || !code.trim()}
            >
              {loading ? 'Consultando...' : 'Consultar'}
              {!loading && <IconArrowRight />}
            </button>
          </div>
          <p style={S.hint}>
            Tu código está en el mensaje de confirmación que recibiste por WhatsApp o email.
          </p>
        </form>

        {/* Error */}
        {error && (
          <div style={S.error}>
            {error}
            <div style={{ marginTop: 8 }}>
              <a
                href="https://wa.me/593991520523?text=Hola%2C%20no%20encuentro%20mi%20c%C3%B3digo%20de%20seguimiento."
                target="_blank"
                rel="noopener"
                style={{ color: '#0d9488', fontWeight: 600, fontSize: '0.82rem' }}
              >
                Contáctanos por WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* Result */}
        {data && (
          <div style={S.result}>
            <div style={S.resultHeader}>
              <div>
                <div style={S.resultName}>{data.client_name}</div>
                <div style={S.resultService}>{data.service}</div>
              </div>
              <div style={S.resultCode}>{data.code}</div>
            </div>

            {/* Stepper */}
            <div style={S.stepper}>
              {data.all_steps.map((step, i) => {
                const styles = getStepStyle(i, data.current_status);
                const StepIcon = STEP_ICONS[step.icon] || IconClipboard;
                const isLast = i === data.all_steps.length - 1;
                const isCurrent = i === data.current_status;

                return (
                  <div key={i} style={S.step}>
                    <div style={{ position: 'relative' }}>
                      <div style={styles.indicator}>
                        {i < data.current_status
                          ? <IconCheck size={16} />
                          : <StepIcon />}
                      </div>
                      {!isLast && <div style={styles.line} />}
                    </div>
                    <div style={{ paddingTop: 2 }}>
                      <div style={styles.label}>{step.label}</div>
                      {isCurrent && (
                        <div style={S.stepDesc}>{step.description}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dates */}
            <div style={S.dates}>
              <span>Inicio: {data.created_at}</span>
              <span>Última actualización: {data.updated_at}</span>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/593991520523?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi proyecto ${data.code}.`)}`}
              className="scripta-portal-wa"
              style={S.ctaWhatsapp}
              target="_blank"
              rel="noopener"
            >
              ¿Tienes preguntas? Escríbenos
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
