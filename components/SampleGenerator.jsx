import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './SampleGenerator.module.css';

// ─── Config ────────────────────────────────────────────────────────────────────

const API_URL = 'https://scripta-api.vercel.app/api/generate-sample';
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
    <div className={styles.generator}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <IconPen />
        </div>
        <div>
          <h2 className={styles.headerTitle}>Prueba la calidad de Scripta</h2>
          <p className={styles.headerSubtitle}>
            Escribe tu tema y genera una muestra acad&eacute;mica gratuita en segundos
          </p>
        </div>
      </div>

      <div className={styles.body}>
        {/* Input section — hidden after result, show on done with "otra muestra" */}
        {(status === 'idle' || status === 'loading' || status === 'error') && (
          <>
            {/* Textarea */}
            <div>
              <label className={styles.label}>Tu tema de investigaci&oacute;n</label>
              <textarea
                className={styles.textarea}
                placeholder="Ej: Impacto del cambio climático en la producción agrícola del litoral ecuatoriano..."
                value={tema}
                onChange={(e) => setTema(e.target.value.slice(0, 500))}
                readOnly={status === 'loading'}
                maxLength={500}
              />
              <div className={`${styles.charCount} ${tema.length > 480 ? styles.charCountWarn : ''}`}>
                {tema.length}/500
              </div>
            </div>

            {/* Options */}
            <div className={styles.optionsRow}>
              <div className={styles.optionField}>
                <label className={styles.label}>Disciplina</label>
                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                  >
                    <option value="">Selecciona (opcional)</option>
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <span className={styles.selectArrow}><IconChevron /></span>
                </div>
              </div>
              <div className={styles.optionField}>
                <label className={styles.label}>Tipo de p&aacute;rrafo</label>
                <div className={styles.pillGroup}>
                  {PARAGRAPH_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.pill} ${tipo === t ? styles.pillActive : ''}`}
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
              className={styles.generateBtn}
              disabled={!canGenerate}
              onClick={generate}
            >
              {status === 'loading' ? (
                <>
                  <span className={styles.spinner} />
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
              <div className={styles.samplesCounter}>
                <span>Muestras restantes:</span>
                {Array.from({ length: MAX_SAMPLES_PER_SESSION }, (_, i) => (
                  <span
                    key={i}
                    className={`${styles.samplesCounterDot} ${i < samplesUsed ? styles.samplesCounterDotUsed : ''}`}
                  />
                ))}
                <span>{remaining}/{MAX_SAMPLES_PER_SESSION}</span>
              </div>
            )}
          </>
        )}

        {/* Error state */}
        {status === 'error' && (
          <div className={styles.errorBox}>
            <span className={styles.errorText}>{errorMsg}</span>
            <button type="button" className={styles.retryBtn} onClick={retry}>
              <IconRefresh size={14} />
              Intentar de nuevo
            </button>
          </div>
        )}

        {/* Rate limited (session) */}
        {(status === 'idle' && isRateLimited) && (
          <div className={styles.limitedBox}>
            <span className={styles.limitedText}>
              Has usado tus 3 muestras gratuitas de esta sesión.
              ¡Imagina la calidad de un documento completo!
            </span>
            <a
              href="mailto:info@scriptaacademic.com?subject=Quiero%20saber%20más%20sobre%20Scripta%20Academic"
              className={styles.limitedCta}
            >
              Contáctanos para más
            </a>
          </div>
        )}

        {/* Rate limited (server 429) */}
        {status === 'rate-limited' && (
          <div className={styles.limitedBox}>
            <span className={styles.limitedText}>
              Has alcanzado el límite de muestras gratuitas. ¡Contáctanos para ver más!
            </span>
            <a
              href="mailto:info@scriptaacademic.com?subject=Quiero%20saber%20más%20sobre%20Scripta%20Academic"
              className={styles.limitedCta}
            >
              Contáctanos
            </a>
          </div>
        )}

        {/* Result */}
        {(status === 'typing' || status === 'done') && (
          <div className={styles.resultArea} ref={resultRef}>
            <div className={styles.resultBadge}>
              <IconCheck size={11} />
              Generado por Scripta Academic
            </div>

            <div className={styles.resultText}>
              {displayText}
              {status === 'typing' && <span className={styles.resultCursor} />}
            </div>

            {status === 'done' && (
              <div className={styles.postResult}>
                <p className={styles.postResultMessage}>
                  ¿Te gusta lo que ves? Esto es solo una muestra. Tu documento completo incluye{' '}
                  <strong>revisión humana experta</strong> + <strong>Certificado de Integridad Académica</strong>.
                </p>

                <a
                  href={`mailto:info@scriptaacademic.com?subject=${encodeURIComponent('Solicitud: Servicio completo Scripta Academic')}&body=${encodeURIComponent(`Hola, probé la muestra gratuita y me interesa el servicio completo.\n\nMi tema: ${tema}\nDisciplina: ${disciplina || 'No especificada'}\n\nQuedo atento/a a su respuesta.`)}`}
                  className={styles.ctaPrimary}
                >
                  Solicitar servicio completo
                </a>

                {remaining > 0 && (
                  <button type="button" className={styles.ctaSecondary} onClick={reset}>
                    <IconRefresh size={14} />
                    Generar otra muestra ({remaining} restante{remaining !== 1 ? 's' : ''})
                  </button>
                )}

                {remaining <= 0 && (
                  <div className={styles.limitedBox}>
                    <span className={styles.limitedText}>
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
