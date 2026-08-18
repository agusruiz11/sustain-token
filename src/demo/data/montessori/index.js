/* ============================================================
   HISTÓRICO INSTITUCIONAL MONTESSORI — capa de acceso
   ============================================================
   Fase 1 · 18 ago 2026

   Los 21 JSON de esta carpeta son copia literal de
   drive-files/Sustain_Montessori_Implementation_Package_v1.0/canonical/.
   No se editan a mano: si algo está mal, se corrige en origen y se vuelve a
   copiar. Los IDs canónicos son claves estables — el handoff_notes.json pide
   explícitamente "no crear identificadores propios de Montessori en UI".

   Este módulo es la única puerta de entrada a esos datos. Existe para que las
   reglas del Entregable 3 se apliquen en un solo lugar y no haya que
   recordarlas en cada componente:

     IR-004  historical_import ≠ sustain_verified
     IR-006  needs_review no alimenta KPI públicos
     IR-007  toda medición conserva período, unidad y fuente
     IR-009  PII, cuentas y medidores => acceso restringido

   ------------------------------------------------------------
   QUÉ HAY ADENTRO
   ------------------------------------------------------------
   168 mediciones (feb 2020 – jun 2026), 18 indicadores, 13 programas,
   10 proyectos, 13 hitos históricos, 24 documentos, 32 evidencias,
   22 partners, 16 activos, 8 unidades, 5 medidores, 1 framework externo.

   Ninguno de esos registros es `sustain_verified`. Los 13 hitos son 7
   `third_party_supported` y 6 `documented`. Es correcto: son cosas que la
   escuela hizo antes de Sustain.
   ============================================================ */

import institutionRaw from './institution.json';
import sitesRaw from './sites.json';
import organizationalUnits from './organizational_units.json';
import people from './people.json';
import roleAssignments from './role_assignments.json';
import programs from './programs.json';
import projects from './projects.json';
import indicatorDefinitions from './indicator_definitions.json';
import measurements from './measurements.json';
import assets from './assets.json';
import utilityAccounts from './utility_accounts.json';
import meters from './meters.json';
import documents from './documents.json';
import evidence from './evidence.json';
import partners from './partners.json';
import actions from './actions.json';
import certificationFrameworks from './certification_frameworks.json';
import frameworkRequirements from './framework_requirements.json';
import complianceAssessments from './compliance_assessments.json';
import conciliation from './conciliation.json';
import openQueries from './open_queries.json';
import manifestRaw from './manifest.json';
import statusCatalogs from './_status_catalogs.json';

/* Los datasets de una sola fila vienen igual como array, para que el formato
   sea uniforme con el resto. Acá se desenvuelven. */
export const institution = institutionRaw[0];
export const site = sitesRaw[0];
export const manifest = manifestRaw[0];

export {
  organizationalUnits, people, roleAssignments, programs, projects,
  indicatorDefinitions, measurements, assets, utilityAccounts, meters,
  documents, evidence, partners, actions, certificationFrameworks,
  frameworkRequirements, complianceAssessments, conciliation, openQueries,
  statusCatalogs,
};

/* ── Etiquetas ────────────────────────────────────────────────
   El Entregable 3 § 3 pide mostrar el estado "en lenguaje humano". Las
   traducciones salen de config/status_catalogs.json, no se inventan acá. */

export const label = (catalog, key) => statusCatalogs[catalog]?.[key] ?? key;

export const recordOriginLabel = (v) => label('record_origin', v);
export const verificationLabel = (v) => label('verification_status', v);
export const qualityLabel = (v) => label('quality_status', v);
export const accessLabel = (v) => label('access_level', v);

/** Estados que NO significan "verificado por Sustain". Regla IR-004. */
const NON_SUSTAIN_STATUSES = new Set([
  'unreviewed', 'imported_historical', 'documented', 'third_party_supported',
]);

export const isSustainVerified = (record) =>
  record?.verification_status === 'sustain_verified' || record?.verification_status === 'anchored';

export const isHistorical = (record) => NON_SUSTAIN_STATUSES.has(record?.verification_status);

/* ── Mediciones ─────────────────────────────────────────────── */

/**
 * Mediciones aptas para KPI público.
 *
 * Regla IR-006: `needs_review` no alimenta KPI públicos. Son 14 de las 168 —
 * 12 de gas y 2 de energía inyectada — y no es casualidad: corresponden
 * exactamente a las consultas abiertas Q04 (¿los 880/480 kWh son inyectados o
 * generados?) y Q05 (¿junio 2025 fueron 3.732 o 3.733 m³?).
 *
 * Excluirlas no es esconderlas: se muestran aparte, marcadas como pendientes
 * de confirmación institucional.
 */
export const publicMeasurements = measurements.filter((m) => m.quality_status === 'accepted');

export const needsReviewMeasurements = measurements.filter((m) => m.quality_status === 'needs_review');

export const measurementsFor = (indicatorId, { publicOnly = true } = {}) =>
  (publicOnly ? publicMeasurements : measurements)
    .filter((m) => m.indicator_id === indicatorId)
    .sort((a, b) => (a.period_start ?? '').localeCompare(b.period_start ?? ''));

export const getIndicator = (id) => indicatorDefinitions.find((i) => i.indicator_id === id) ?? null;

/**
 * Total de un indicador respetando su `aggregation_method`.
 * Devuelve null si no hay mediciones aptas: mejor "sin dato" que un 0 que
 * parece una medición real de cero.
 */
export function indicatorTotal(indicatorId, opts) {
  const ind = getIndicator(indicatorId);
  const rows = measurementsFor(indicatorId, opts);
  if (!ind || rows.length === 0) return null;

  const values = rows.map((m) => m.value).filter((v) => typeof v === 'number');
  if (values.length === 0) return null;

  const value = ind.aggregation_method === 'latest'
    ? values[values.length - 1]
    : values.reduce((s, v) => s + v, 0);

  return {
    indicatorId,
    name: ind.name,
    category: ind.category,
    unit: ind.unit,
    aggregation: ind.aggregation_method,
    value: Number(value.toFixed(2)),
    count: rows.length,
    periodStart: rows[0].period_start,
    periodEnd: rows[rows.length - 1].period_end,
    excluded: measurements.filter((m) => m.indicator_id === indicatorId && m.quality_status !== 'accepted').length,
  };
}

/** Indicadores que tienen al menos una medición apta. */
export const indicatorTotals = () =>
  indicatorDefinitions
    .map((i) => indicatorTotal(i.indicator_id))
    .filter(Boolean);

/* ── Taxonomía ───────────────────────────────────────────────
   El dataset usa sus propias categorías. Se mapean a las 13 del brief sin
   tocar ninguna de las dos: el Entregable 3 § 4.5 pide taxonomía configurable,
   no reemplazar una por otra.

   `governance` y `social_sustainability` quedan sin equivalente a propósito.
   No son categorías Sustain y el § 4.5 es explícito: "No agregar Mantenimiento
   Sostenible como categoría Sustain autónoma por defecto". Se muestran como
   trayectoria institucional, no como categoría de impacto. */
export const CANONICAL_CATEGORY_TO_APP = {
  energy: 'energia',
  water: 'agua',
  gas: 'gas',
  waste_circularity: 'reciclaje',
  biodiversity: 'reforestacion',
  education_engagement: 'educacionAmbiental',
  mobility: 'movilidad',
  procurement: 'comprasSostenibles',
  governance: null,
  social_sustainability: null,
};

/* Botellas de Amor es categoría propia en el brief pero un indicador más
   dentro de waste_circularity en el dataset. Se desvía por indicador. */
export const INDICATOR_TO_APP_CATEGORY = {
  waste_love_bottles_kg: 'botellasDeAmor',
  waste_e_waste_kg: 'raee',
};

export const appCategoryFor = (indicator) =>
  INDICATOR_TO_APP_CATEGORY[indicator.indicator_id]
  ?? CANONICAL_CATEGORY_TO_APP[indicator.category]
  ?? null;

/* ── Programas y proyectos ───────────────────────────────────── */

export const projectsOf = (programId) => projects.filter((p) => p.program_id === programId);

export const actionsOf = (programId) => actions.filter((a) => a.program_id === programId);

/** Programa con sus proyectos y acciones resueltos. Entregable 3 § 4.8. */
export const programDetail = (programId) => {
  const program = programs.find((p) => p.program_id === programId);
  if (!program) return null;
  return {
    ...program,
    appCategory: CANONICAL_CATEGORY_TO_APP[program.category] ?? null,
    projects: projectsOf(programId),
    actions: actionsOf(programId),
  };
};

/* ── Documentos y evidencia ──────────────────────────────────── */

/**
 * Evidencia asociada a una entidad.
 * Cuando el `evidence_type` es `pdf_page_range` sólo existe la referencia a
 * páginas del expediente compilado, no un archivo suelto. El § 4.3 pide
 * mostrarlo como "Referencia en expediente" y no fingir que el archivo existe.
 */
export const evidenceFor = (entityType, entityId) =>
  evidence.filter((e) => e.linked_entity_type === entityType && e.linked_entity_id === entityId);

export const isFileReferenceOnly = (ev) => ev.evidence_type === 'pdf_page_range';

/**
 * Filtro por nivel de acceso. `public` es el más restrictivo de mostrar.
 * IR-009: PII, firmas, cuentas y medidores van a acceso restringido, y el
 * § 11 prohíbe exponer nombres o imágenes de menores.
 */
const ACCESS_ORDER = { public: 0, institutional: 1, audit_restricted: 2 };

export const visibleAt = (records, viewerLevel = 'institutional') => {
  const max = ACCESS_ORDER[viewerLevel] ?? 0;
  return records.filter((r) => (ACCESS_ORDER[r.access_level] ?? 0) <= max);
};

/* ── Línea de tiempo ─────────────────────────────────────────
   Entregable 3 § 4.4: la cronología une acciones, proyectos, documentos y
   certificaciones, cada uno con su badge de origen. No incluye acciones
   Sustain: esas viven en data/actions.js y el Timeline las mezcla arriba. */
export function historicalTimeline() {
  const events = [
    ...actions.map((a) => ({
      id: a.action_id,
      kind: 'action',
      date: a.occurred_at,
      title: a.summary,
      type: a.action_type,
      verificationStatus: a.verification_status,
      sourceReference: a.source_reference,
      programId: a.program_id,
    })),
    ...projects
      .filter((p) => p.start_date)
      .map((p) => ({
        id: p.project_id,
        kind: 'project',
        date: p.start_date,
        title: p.name,
        type: p.status,
        verificationStatus: 'documented',
        sourceReference: p.source_reference,
        programId: p.program_id,
      })),
  ];
  return events
    .filter((e) => e.date)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/* ── Resumen ─────────────────────────────────────────────────── */

/** Contadores de la trayectoria. Alimenta el Home y Environmental Identity. */
export const trajectorySummary = () => ({
  programs: programs.length,
  projects: projects.length,
  actions: actions.length,
  indicators: indicatorDefinitions.length,
  measurements: measurements.length,
  measurementsPublic: publicMeasurements.length,
  measurementsNeedsReview: needsReviewMeasurements.length,
  documents: documents.length,
  evidence: evidence.length,
  partners: partners.length,
  assets: assets.length,
  organizationalUnits: organizationalUnits.length,
  frameworks: certificationFrameworks.length,
  frameworkRequirements: frameworkRequirements.length,
  complianceAssessments: complianceAssessments.length,
  openQueries: openQueries.length,
  openQueriesHigh: openQueries.filter((q) => q.priority === 'Alta').length,
  /* Cero por definición: importar histórico no genera verificación (IR-004). */
  sustainVerified: [...actions, ...measurements].filter(isSustainVerified).length,
  periodStart: institution.historical_data_start,
});
