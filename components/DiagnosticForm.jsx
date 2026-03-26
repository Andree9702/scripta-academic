import React, { useState, useMemo } from 'react';
import styles from './DiagnosticForm.module.css';

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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      <div className={styles.progress}>
        {labels.map((label, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className={`${styles.progressLine} ${i <= step ? styles.progressLineActive : ''}`} />
            )}
            <div className={styles.progressStep}>
              <div
                className={`${styles.progressDot} ${i === step ? styles.progressDotActive : ''} ${i < step ? styles.progressDotDone : ''}`}
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
      <div className={styles.slide}>
        <h3 className={styles.stepQuestion}>¿En qué etapa está tu proyecto?</h3>
        <div className={styles.optionCards}>
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.optionCard} ${stage === s.id ? styles.optionCardActive : ''}`}
              onClick={() => setStage(s.id)}
            >
              <span className={styles.optionEmoji}>{s.emoji}</span>
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{s.title}</span>
                <span className={styles.optionDesc}>{s.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2: Work type ──
  function renderStep2() {
    const types = getWorkTypes(stage);
    return (
      <div className={styles.slide}>
        <h3 className={styles.stepQuestion}>¿Qué quieres producir?</h3>
        <div className={styles.optionCards}>
          {types.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.optionCard} ${workType === t.id ? styles.optionCardActive : ''}`}
              onClick={() => setWorkType(t.id)}
            >
              <span className={styles.optionText}>
                <span className={styles.optionTitle}>{t.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 3: Details ──
  function renderStep3() {
    return (
      <div className={styles.slide}>
        <h3 className={styles.stepQuestion}>Cuéntanos más sobre tu proyecto</h3>
        <div className={styles.formGrid}>
          {/* Discipline */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              Disciplina / área de conocimiento <span className="req">*</span>
            </label>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={discipline}
                onChange={(e) => { setDiscipline(e.target.value); if (e.target.value !== 'Otra') setDisciplineOther(''); }}
              >
                <option value="">Selecciona una opción</option>
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="Otra">Otra</option>
              </select>
              <span className={styles.selectArrow}><IconChevron /></span>
            </div>
            {discipline === 'Otra' && (
              <input
                type="text"
                className={styles.input}
                placeholder="Especifica tu disciplina"
                value={disciplineOther}
                onChange={(e) => setDisciplineOther(e.target.value)}
              />
            )}
          </div>

          {/* Pages */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Número estimado de páginas</label>
            <div className={styles.sliderRow}>
              <input
                type="range"
                className={styles.slider}
                min={5}
                max={300}
                value={pages}
                onChange={(e) => handlePages(e.target.value)}
              />
              <input
                type="number"
                className={styles.numberInput}
                min={5}
                max={300}
                value={pages}
                onChange={(e) => handlePages(e.target.value)}
              />
              <span className={styles.sliderUnit}>págs.</span>
            </div>
          </div>

          {/* Data collected */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>¿Tienes datos recopilados?</label>
            <div className={styles.radioGroup}>
              {['Sí', 'No', 'Parcialmente'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`${styles.radioBtn} ${hasData === opt ? styles.radioBtnActive : ''}`}
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
              <div className={styles.field}>
                <label className={styles.fieldLabel}>¿Tienes una revista objetivo?</label>
                <div className={styles.radioGroup}>
                  <button type="button" className={`${styles.radioBtn} ${hasTargetJournal === 'si' ? styles.radioBtnActive : ''}`} onClick={() => setHasTargetJournal('si')}>Sí</button>
                  <button type="button" className={`${styles.radioBtn} ${hasTargetJournal === 'no' ? styles.radioBtnActive : ''}`} onClick={() => setHasTargetJournal('no')}>No</button>
                </div>
                {hasTargetJournal === 'si' && (
                  <input type="text" className={styles.input} placeholder="Nombre de la revista" value={targetJournal} onChange={(e) => setTargetJournal(e.target.value)} />
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>¿Necesitas traducción al inglés?</label>
                <div className={styles.radioGroup}>
                  <button type="button" className={`${styles.radioBtn} ${needsTranslation === 'si' ? styles.radioBtnActive : ''}`} onClick={() => setNeedsTranslation('si')}>Sí</button>
                  <button type="button" className={`${styles.radioBtn} ${needsTranslation === 'no' ? styles.radioBtnActive : ''}`} onClick={() => setNeedsTranslation('no')}>No</button>
                </div>
              </div>
            </>
          )}

          {/* Book-specific */}
          {isBook && (
            <>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>¿Cuántos capítulos?</label>
                <div className={styles.sliderRow}>
                  <input type="range" className={styles.slider} min={3} max={20} value={chapters} onChange={(e) => handleChapters(e.target.value)} />
                  <input type="number" className={styles.numberInput} min={3} max={20} value={chapters} onChange={(e) => handleChapters(e.target.value)} />
                  <span className={styles.sliderUnit}>caps.</span>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>¿Es para una editorial específica?</label>
                <div className={styles.radioGroup}>
                  <button type="button" className={`${styles.radioBtn} ${hasPublisher === 'si' ? styles.radioBtnActive : ''}`} onClick={() => setHasPublisher('si')}>Sí</button>
                  <button type="button" className={`${styles.radioBtn} ${hasPublisher === 'no' ? styles.radioBtnActive : ''}`} onClick={() => setHasPublisher('no')}>No</button>
                </div>
                {hasPublisher === 'si' && (
                  <input type="text" className={styles.input} placeholder="Nombre de la editorial" value={publisher} onChange={(e) => setPublisher(e.target.value)} />
                )}
              </div>
            </>
          )}

          {/* Rejection-specific */}
          {isRejection && (
            <>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>¿Tienes los comentarios de los reviewers?</label>
                <div className={styles.radioGroup}>
                  <button type="button" className={`${styles.radioBtn} ${hasReviewerComments === 'si' ? styles.radioBtnActive : ''}`} onClick={() => setHasReviewerComments('si')}>Sí</button>
                  <button type="button" className={`${styles.radioBtn} ${hasReviewerComments === 'no' ? styles.radioBtnActive : ''}`} onClick={() => setHasReviewerComments('no')}>No</button>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Motivo principal del rechazo</label>
                <div className={styles.selectWrapper}>
                  <select className={styles.select} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}>
                    <option value="">Selecciona una opción</option>
                    {REJECTION_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <span className={styles.selectArrow}><IconChevron /></span>
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
      <div className={styles.slide}>
        <h3 className={styles.stepQuestion}>Urgencia y datos de contacto</h3>
        <div className={styles.formGrid}>
          {/* Urgency */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Nivel de urgencia</label>
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

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Nombre completo <span className="req">*</span></label>
            <input
              type="text"
              className={`${styles.input} ${nombreInvalid ? styles.inputError : ''}`}
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
            />
            {nombreInvalid && <span className={styles.errorMsg}>El nombre es requerido</span>}
          </div>

          {/* Email */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Correo electrónico <span className="req">*</span></label>
            <input
              type="email"
              className={`${styles.input} ${emailInvalid ? styles.inputError : ''}`}
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            {emailInvalid && <span className={styles.errorMsg}>Ingresa un correo válido</span>}
          </div>

          {/* WhatsApp */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>WhatsApp <span className={styles.fieldHint}>(opcional)</span></label>
            <input
              type="tel"
              className={styles.input}
              placeholder="+593..."
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          {/* University */}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Universidad / institución <span className={styles.fieldHint}>(opcional)</span></label>
            <input
              type="text"
              className={styles.input}
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
      <div className={styles.slide}>
        <div className={styles.resultPanel}>
          {/* Summary */}
          <div className={styles.resultSection}>
            <h4 className={styles.resultSectionTitle}>Tu proyecto</h4>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>Etapa</div>
                <div className={styles.summaryItemValue}>{stageLabel}</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>Tipo</div>
                <div className={styles.summaryItemValue}>{typeLabel}</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>Área</div>
                <div className={styles.summaryItemValue}>{disciplineDisplay || 'No especificada'}</div>
              </div>
              <div className={styles.summaryItem}>
                <div className={styles.summaryItemLabel}>Volumen</div>
                <div className={styles.summaryItemValue}>{pages} páginas</div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={styles.resultSection}>
            <h4 className={styles.resultSectionTitle}>Servicio recomendado</h4>
            <div className={styles.recommendedCard}>
              <span className={styles.recommendedName}>{serviceName}</span>
              <span className={styles.recommendedReason}>{recommendation?.reason}</span>
              {recommendation?.note && (
                <span className={styles.recommendedNote}>{recommendation.note}</span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className={styles.resultSection}>
            <h4 className={styles.resultSectionTitle}>Inversión estimada</h4>
            <div className={styles.priceBreakdown}>
              <div className={styles.priceRow}>
                <span className={styles.priceLabel}>Subtotal</span>
                <span className={styles.priceValue}>${formatUSD(pricing.subtotal)}</span>
              </div>
              {pricing.extra > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Páginas adicionales</span>
                  <span className={styles.priceValue}>+${formatUSD(pricing.extra)}</span>
                </div>
              )}
              {pricing.translationCost > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Traducción ({pages} págs.)</span>
                  <span className={styles.priceValue}>+${formatUSD(pricing.translationCost)}</span>
                </div>
              )}
              {pricing.urgencyAmount > 0 && (
                <div className={styles.priceRow}>
                  <span className={styles.priceLabel}>Recargo {urgencyObj.name.toLowerCase()} ({urgencyObj.label})</span>
                  <span className={styles.priceValue}>+${formatUSD(pricing.urgencyAmount)}</span>
                </div>
              )}
              <div className={styles.priceTotal}>
                <span className={styles.priceTotalLabel}>TOTAL</span>
                <span className={styles.priceTotalValue}>
                  <span className={styles.priceTotalCurrency}>USD</span>
                  {formatUSD(pricing.total)}
                </span>
              </div>
              <div className={styles.paymentInfo}>
                <IconShield size={14} />
                <span>50% al contratar &middot; 50% al entregar</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <a href={mailtoHref} className={styles.ctaPrimary}>
              <IconMail size={18} />
              Solicitar este servicio
            </a>
            <div className={styles.ctaRow}>
              <a href={emailDiagHref} className={styles.ctaSecondary}>
                Enviar diagnóstico a mi email
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.ctaWhatsapp}>
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
    <div className={styles.wizard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <IconClipboard />
        </div>
        <div>
          <h2 className={styles.headerTitle}>Diagnóstico gratuito de tu proyecto</h2>
          <p className={styles.headerSubtitle}>Responde 4 preguntas y recibe una recomendación personalizada</p>
        </div>
      </div>

      {/* Progress */}
      {renderProgressBar()}

      {/* Body with slide */}
      <div className={styles.body}>
        <div
          className={styles.slideContainer}
          style={{ transform: `translateX(-${step * 100}%)` }}
        >
          {steps.map((renderFn, i) => (
            <React.Fragment key={i}>{renderFn()}</React.Fragment>
          ))}
        </div>

        {/* Nav */}
        {step < 4 && (
          <div className={styles.nav}>
            {step > 0 ? (
              <button type="button" className={styles.btnBack} onClick={goBack}>
                <IconArrowLeft size={14} />
                Anterior
              </button>
            ) : <span />}
            <button
              type="button"
              className={styles.btnNext}
              disabled={!canProceed(step)}
              onClick={goNext}
            >
              {step === 3 ? 'Ver diagnóstico' : 'Siguiente'}
              <IconArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className={styles.nav}>
            <button type="button" className={styles.btnBack} onClick={goBack}>
              <IconArrowLeft size={14} />
              Modificar respuestas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
