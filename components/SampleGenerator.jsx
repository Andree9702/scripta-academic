import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─── Config ────────────────────────────────────────────────────────────────────

const API_URL = 'https://scripta-api1.vercel.app/api/generate-sample';
// During development, change to: 'http://localhost:3000/api/generate-sample'

const MAX_SAMPLES_PER_SESSION = 3;
const TYPEWRITER_DELAY_MS = 18;
const SESSION_KEY = 'scripta_samples_used';

const DISCIPLINES = [
  'Medicina veterinaria',
  'Ciencias de la salud',
  'Ingeniería',
  'Ciencias agropecuarias',
  'Educación',
  'Ciencias sociales',
  'Derecho',
  'Economía y administración',
  'Ciencias ambientales',
  'Humanidades',
  'Otra',
];

const PARAGRAPH_TYPES = [
  'Introducción',
  'Marco teórico',
  'Discusión',
  'Conclusión',
];

// ─── Session storage helpers ───────────────────────────────────────────────────

function getSamplesUsed() {
  try {
    return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

function incrementSamplesUsed() {
  try {
    const n = getSamplesUsed() + 1;
    sessionStorage.setItem(SESSION_KEY, String(n));
    return n;
  } catch {
    return 1;
  }
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function IconPen() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
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

function IconStar({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconRefresh({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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

// ─── Inline Style Constants ─────────────────────────────────────────────────────

const S = {
  generator: {
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
    background: 'rgba(13,148,136,0.15)',
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
    color: 'rgba(255,255,255,0.6)',
    margin: '2px 0 0',
  },
  body: {
    padding: '28px 28px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#6b7280',
    marginBottom: 6,
    display: 'block',
  },
  textarea: {
    width: '100%',
    minHeight: 110,
    padding: '12px 16px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    color: '#1f2937',
    background: '#fff',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    lineHeight: 1.55,
  },
  textareaReadonly: {
    background: '#f9fafb',
    cursor: 'not-allowed',
  },
  charCount: {
    fontSize: '0.7rem',
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: -14,
  },
  charCountWarn: {
    color: '#ef4444',
  },
  optionsRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  optionField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    flex: 1,
  },
  selectWrapper: {
    position: 'relative',
  },
  select: {
    width: '100%',
    padding: '10px 36px 10px 12px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    color: '#1f2937',
    background: '#fff',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  selectArrow: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: '#6b7280',
  },
  pillGroup: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    padding: '7px 14px',
    border: '1.5px solid #e5e7eb',
    borderRadius: 8,
    background: '#fff',
    fontSize: '0.8rem',
    fontFamily: 'inherit',
    fontWeight: 500,
    color: '#1f2937',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  pillActive: {
    borderColor: '#0d9488',
    background: 'rgba(13,148,136,0.06)',
    color: '#0d9488',
    boxShadow: '0 0 0 3px rgba(13,148,136,0.1)',
  },
  generateBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    transition: 'background 0.2s, transform 0.1s',
  },
  generateBtnDisabled: {
    background: '#d1d5db',
    cursor: 'not-allowed',
  },
  spinner: {
    width: 18,
    height: 18,
    border: '2.5px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'scripta-gen-spin 0.7s linear infinite',
  },
  samplesCounter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  samplesCounterDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#e5e7eb',
    transition: 'background 0.3s',
  },
  samplesCounterDotUsed: {
    background: '#0d9488',
  },
  resultArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  resultBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    padding: '4px 10px',
    background: 'rgba(13,148,136,0.08)',
    borderRadius: 6,
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#0d9488',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  resultText: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: '20px 22px',
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: '0.95rem',
    lineHeight: 1.75,
    color: '#1f2937',
    position: 'relative',
  },
  resultCursor: {
    display: 'inline-block',
    width: 2,
    height: '1.1em',
    background: '#0d9488',
    marginLeft: 1,
    verticalAlign: 'text-bottom',
    animation: 'scripta-gen-blink 0.7s step-end infinite',
  },
  postResult: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  postResultMessage: {
    fontSize: '0.82rem',
    color: '#6b7280',
    lineHeight: 1.5,
    textAlign: 'center',
    padding: '0 8px',
  },
  postResultStrong: {
    color: '#1f2937',
  },
  ctaPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: '0.88rem',
    color: '#991b1b',
    lineHeight: 1.4,
  },
  retryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 18px',
    background: '#fff',
    color: '#991b1b',
    fontSize: '0.82rem',
    fontWeight: 500,
    fontFamily: 'inherit',
    border: '1.5px solid #fecaca',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  limitedBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    background: 'rgba(212,168,83,0.08)',
    border: '1px solid rgba(212,168,83,0.3)',
    borderRadius: 10,
    textAlign: 'center',
  },
  limitedText: {
    fontSize: '0.88rem',
    color: '#92400e',
    lineHeight: 1.4,
  },
  limitedCta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    background: '#d4a853',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    fontFamily: 'inherit',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background 0.2s',
  },
};

// ─── Injected CSS for pseudo-classes, animations, and responsive ────────────────

const INJECTED_CSS = `
  @keyframes scripta-gen-spin { to { transform: rotate(360deg); } }
  @keyframes scripta-gen-blink { 50% { opacity: 0; } }
  .scripta-gen-textarea:focus { border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.1) !important; }
  .scripta-gen-select:focus { border-color:#0d9488 !important; box-shadow:0 0 0 3px rgba(13,148,136,0.1) !important; }
  .scripta-gen-btn:hover:not(:disabled) { background:#0b7c72 !important; }
  .scripta-gen-pill:hover { border-color:#0d9488 !important; }
  .scripta-gen-cta-sec:hover { border-color:#1a2332 !important; }
  .scripta-gen-retry:hover { background:#fef2f2 !important; border-color:#991b1b !important; }
  .scripta-gen-limited-cta:hover { background:#c49a47 !important; }
  @media (max-width: 480px) {
    .scripta-gen-options-row { flex-direction: column !important; gap: 16px !important; }
    .scripta-gen-pill-group { gap: 4px !important; }
  }
`;

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SampleGenerator() {
  const [tema, setTema] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [tipo, setTipo] = useState('Introducción');

  // States: idle | loading | typing | done | error | rate-limited
  const [status, setStatus] = useState('idle');
  const [fullText, setFullText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [samplesUsed, setSamplesUsed] = useState(getSamplesUsed);

  const typewriterRef = useRef(null);
  const resultRef = useRef(null);

  const isRateLimited = samplesUsed >= MAX_SAMPLES_PER_SESSION;
  const canGenerate = tema.trim().length >= 10 && !isRateLimited && status !== 'loading' && status !== 'typing';

  // Typewriter effect
  useEffect(() => {
    if (status !== 'typing' || !fullText) return;

    let i = 0;
    setDisplayText('');

    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(typewriterRef.current);
        setStatus('done');
      }
    }, TYPEWRITER_DELAY_MS);

    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, [status, fullText]);

  // Scroll to result when it appears
  useEffect(() => {
    if ((status === 'typing' || status === 'done') && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [status]);

  const generate = useCallback(async () => {
    if (!canGenerate) return;

    setStatus('loading');
    setErrorMsg('');
    setFullText('');
    setDisplayText('');

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tema: tema.trim(),
          disciplina: disciplina || 'General',
          tipo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setStatus('rate-limited');
          return;
        }
        throw new Error(data.error || 'Error del servidor');
      }

      if (!data.texto) {
        throw new Error('No se recibió texto');
      }

      const used = incrementSamplesUsed();
      setSamplesUsed(used);
      setFullText(data.texto);
      setStatus('typing');
    } catch (err) {
      setErrorMsg(err.message || 'No pudimos generar la muestra. Intenta de nuevo.');
      setStatus('error');
    }
  }, [canGenerate, tema, disciplina, tipo]);

  function reset() {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setStatus('idle');
    setFullText('');
    setDisplayText('');
    setErrorMsg('');
    setTema('');
  }

  function retry() {
    setStatus('idle');
    setErrorMsg('');
  }

  // Remaining samples
  const remaining = Math.max(0, MAX_SAMPLES_PER_SESSION - samplesUsed);

  // ── Render ──

  return (
    <div style={S.generator}>
      <style>{INJECTED_CSS}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.headerIcon}>
          <span style={S.headerIconSvg}><IconPen /></span>
        </div>
        <div>
          <h2 style={S.headerTitle}>Prueba la calidad de Scripta</h2>
          <p style={S.headerSubtitle}>
            Escribe tu tema y genera una muestra acad&eacute;mica gratuita en segundos
          </p>
        </div>
      </div>

      <div style={S.body}>
        {/* Input section — hidden after result, show on done with "otra muestra" */}
        {(status === 'idle' || status === 'loading' || status === 'error') && (
          <>
            {/* Textarea */}
            <div>
              <label style={S.label}>Tu tema de investigaci&oacute;n</label>
              <textarea
                className="scripta-gen-textarea"
                style={{
                  ...S.textarea,
                  ...(status === 'loading' ? S.textareaReadonly : {}),
                }}
                placeholder="Ej: Impacto del cambio climático en la producción agrícola del litoral ecuatoriano..."
                value={tema}
                onChange={(e) => setTema(e.target.value.slice(0, 500))}
                readOnly={status === 'loading'}
                maxLength={500}
              />
              <div style={{
                ...S.charCount,
                ...(tema.length > 480 ? S.charCountWarn : {}),
              }}>
                {tema.length}/500
              </div>
            </div>

            {/* Options */}
            <div className="scripta-gen-options-row" style={S.optionsRow}>
              <div style={S.optionField}>
                <label style={S.label}>Disciplina</label>
                <div style={S.selectWrapper}>
                  <select
                    className="scripta-gen-select"
                    style={S.select}
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                  >
                    <option value="">Selecciona (opcional)</option>
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <span style={S.selectArrow}><IconChevron /></span>
                </div>
              </div>
              <div style={S.optionField}>
                <label style={S.label}>Tipo de p&aacute;rrafo</label>
                <div className="scripta-gen-pill-group" style={S.pillGroup}>
                  {PARAGRAPH_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="scripta-gen-pill"
                      style={{
                        ...S.pill,
                        ...(tipo === t ? S.pillActive : {}),
                      }}
                      onClick={() => setTipo(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate button */}
            <button
              type="button"
              className="scripta-gen-btn"
              style={{
                ...S.generateBtn,
                ...(!canGenerate ? S.generateBtnDisabled : {}),
              }}
              disabled={!canGenerate}
              onClick={generate}
            >
              {status === 'loading' ? (
                <>
                  <span style={S.spinner} />
                  Generando muestra...
                </>
              ) : (
                <>
                  <IconStar size={16} />
                  Generar muestra gratuita
                </>
              )}
            </button>

            {/* Samples counter */}
            {!isRateLimited && (
              <div style={S.samplesCounter}>
                <span>Muestras restantes:</span>
                {Array.from({ length: MAX_SAMPLES_PER_SESSION }, (_, i) => (
                  <span
                    key={i}
                    style={{
                      ...S.samplesCounterDot,
                      ...(i < samplesUsed ? S.samplesCounterDotUsed : {}),
                    }}
                  />
                ))}
                <span>{remaining}/{MAX_SAMPLES_PER_SESSION}</span>
              </div>
            )}
          </>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div style={S.errorBox}>
            <span style={S.errorText}>{errorMsg}</span>
            <button type="button" className="scripta-gen-retry" style={S.retryBtn} onClick={retry}>
              <IconRefresh size={14} />
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Rate limited (session) */}
        {(status === 'idle' && isRateLimited) && (
          <div style={S.limitedBox}>
            <span style={S.limitedText}>
              Has usado tus 3 muestras gratuitas de esta sesión.
              ¡Imagina la calidad de un documento completo!
            </span>
            <a
              href="mailto:info@scriptaacademic.com?subject=Quiero%20saber%20más%20sobre%20Scripta%20Academic"
              className="scripta-gen-limited-cta"
              style={S.limitedCta}
            >
              Contáctanos para más
            </a>
          </div>
        )}

        {/* Rate limited (server 429) */}
        {status === 'rate-limited' && (
          <div style={S.limitedBox}>
            <span style={S.limitedText}>
              Has alcanzado el límite de muestras gratuitas. ¡Contáctanos para ver más!
            </span>
            <a
              href="mailto:info@scriptaacademic.com?subject=Quiero%20saber%20más%20sobre%20Scripta%20Academic"
              className="scripta-gen-limited-cta"
              style={S.limitedCta}
            >
              Contáctanos
            </a>
          </div>
        )}

        {/* Result */}
        {(status === 'typing' || status === 'done') && (
          <div style={S.resultArea} ref={resultRef}>
            <div style={S.resultBadge}>
              <IconCheck size={11} />
              Generado por Scripta Academic
            </div>

            <div style={S.resultText}>
              {displayText}
              {status === 'typing' && <span style={S.resultCursor} />}
            </div>

            {status === 'done' && (
              <div style={S.postResult}>
                <p style={S.postResultMessage}>
                  ¿Te gusta lo que ves? Esto es solo una muestra. Tu documento completo incluye{' '}
                  <strong style={S.postResultStrong}>revisión humana experta</strong> + <strong style={S.postResultStrong}>Certificado de Integridad Académica</strong>.
                </p>

                <a
                  href={`mailto:info@scriptaacademic.com?subject=${encodeURIComponent('Solicitud: Servicio completo Scripta Academic')}&body=${encodeURIComponent(`Hola, probé la muestra gratuita y me interesa el servicio completo.\n\nMi tema: ${tema}\nDisciplina: ${disciplina || 'No especificada'}\n\nQuedo atento/a a su respuesta.`)}`}
                  className="scripta-gen-btn"
                  style={S.ctaPrimary}
                >
                  Solicitar servicio completo
                </a>

                {remaining > 0 && (
                  <button type="button" className="scripta-gen-cta-sec" style={S.ctaSecondary} onClick={reset}>
                    <IconRefresh size={14} />
                    Generar otra muestra ({remaining} restante{remaining !== 1 ? 's' : ''})
                  </button>
                )}

                {remaining <= 0 && (
                  <div style={S.limitedBox}>
                    <span style={S.limitedText}>
                      Has usado tus 3 muestras gratuitas. ¡Contáctanos para tu documento completo!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
