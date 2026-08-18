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

/**
 * Los 18 indicadores, incluidos los que se quedaron sin total.
 *
 * `indicatorTotals()` filtra los que no tienen ninguna medición aceptada, y eso
 * los hace desaparecer de la pantalla sin explicación. Hoy son dos —consumo de
 * gas (12 mediciones) y energía inyectada (2)— y no están vacíos: están
 * completos pero en `needs_review` por las consultas Q05 y Q04.
 *
 * Un indicador que se esconde solo es peor que uno que dice por qué no tiene
 * número. Esta variante los conserva con `total: null` y el motivo.
 */
export function indicatorsWithStatus() {
  return indicatorDefinitions.map((i) => {
    const total = indicatorTotal(i.indicator_id);
    const all = measurements.filter((m) => m.indicator_id === i.indicator_id);
    const excluded = all.filter((m) => m.quality_status !== 'accepted');
    return {
      indicatorId: i.indicator_id,
      name: i.name,
      category: i.category,
      unit: i.unit,
      aggregation: i.aggregation_method,
      total,
      measured: all.length,
      excluded: excluded.length,
      /* Distingue "no hay mediciones" de "las hay pero ninguna es apta". */
      reason: total ? null
        : all.length === 0 ? 'sin_mediciones'
        : 'todas_en_revision',
    };
  });
}

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
 * Grupos del archivo institucional — Entregable 3 § 4.3.
 *
 * El spec enumera 10 grupos. Se agrega "Movilidad" como 11.º porque existe un
 * documento de movilidad sostenible y ninguno de los 10 le corresponde;
 * meterlo a la fuerza en "Gobernanza y planes" sería peor que agregar el grupo.
 *
 * El mapeo va por `document_id` y no por `document_type` a propósito:
 * `maintenance_plan` aparece dos veces, una de energía y otra de agua.
 */
export const ARCHIVE_GROUPS = [
  { id: 'governance', label: 'Gobernanza y planes', docs: ['doc_sustainability_plan_2025', 'doc_project_followup_2025', 'doc_environmental_diagnosis', 'doc_sustainability_survey', 'doc_ambassador_profile'] },
  { id: 'energy', label: 'Energía', docs: ['doc_energy_maintenance', 'doc_energy_efficiency_inventory'] },
  { id: 'water', label: 'Agua', docs: ['doc_water_maintenance', 'doc_water_management'] },
  { id: 'waste', label: 'Residuos', docs: ['doc_waste_procedure', 'doc_waste_commitment'] },
  { id: 'biodiversity', label: 'Biodiversidad', docs: ['doc_vertical_garden', 'doc_forest_plan'] },
  { id: 'education', label: 'Educación y sensibilización', docs: ['doc_vma_act', 'doc_sensitization_register'] },
  { id: 'procurement', label: 'Compras y proveedores', docs: ['doc_supplier_diagnosis', 'doc_supplier_selection', 'doc_product_selection', 'doc_supplier_register'] },
  { id: 'mobility', label: 'Movilidad', docs: ['doc_mobility_plan'] },
  { id: 'inclusion', label: 'Inclusión', docs: ['doc_inclusion_trajectories', 'doc_diversity_diagnosis'] },
  { id: 'communication', label: 'Comunicación', docs: ['doc_communications_register'] },
  { id: 'certifications', label: 'Certificaciones y reconocimientos', docs: ['doc_commitment_2025'] },
];

const DOC_TYPE_LABEL = {
  institutional_commitment: 'Declaración de compromiso',
  sustainability_plan: 'Plan de sostenibilidad',
  meeting_record: 'Acta de reunión',
  maintenance_plan: 'Plan de mantenimiento',
  asset_inventory: 'Inventario de activos',
  program_plan: 'Plan de programa',
  water_management_plan: 'Plan de gestión hídrica',
  waste_procedure: 'Procedimiento de residuos',
  binding_agreement: 'Acta vinculante',
  project_plan: 'Plan de proyecto',
  forest_plan: 'Plan de forestación',
  committee_act: 'Acta de comité',
  environmental_assessment: 'Diagnóstico ambiental',
  procurement_diagnosis: 'Diagnóstico de compras',
  procurement_procedure: 'Procedimiento de compras',
  supplier_register: 'Registro de proveedores',
  social_sustainability_assessment: 'Relevamiento social',
  diversity_assessment: 'Diagnóstico de diversidad',
  communication_plan: 'Plan de comunicación',
  engagement_register: 'Registro de sensibilización',
  survey_instrument: 'Instrumento de encuesta',
  leadership_profile: 'Perfil de liderazgo',
};

export const docTypeLabel = (t) => DOC_TYPE_LABEL[t] ?? t;

/**
 * Archivo institucional agrupado y listo para pintar.
 * Cada documento llega con su evidencia resuelta: el § 4.3 pide mostrar
 * título, tipo, fecha, procedencia, nivel de acceso, estado y referencia.
 */
export function institutionalArchive({ viewerLevel = 'institutional' } = {}) {
  const byId = new Map(documents.map((d) => [d.document_id, d]));
  const assigned = new Set();

  const groups = ARCHIVE_GROUPS.map((g) => {
    const docs = g.docs
      .map((id) => {
        assigned.add(id);
        const doc = byId.get(id);
        if (!doc) return null;
        const evs = evidenceFor('document', id);
        return {
          ...doc,
          typeLabel: docTypeLabel(doc.document_type),
          accessLabel: accessLabel(doc.access_level),
          evidence: evs,
          /* Cuando la única evidencia es un rango de páginas del expediente
             compilado, no existe archivo suelto que descargar. */
          referenceOnly: evs.length > 0 && evs.every(isFileReferenceOnly),
        };
      })
      .filter(Boolean);
    return { ...g, docs: visibleAt(docs, viewerLevel) };
  }).filter((g) => g.docs.length > 0);

  /* Si el paquete suma un documento nuevo y nadie actualiza ARCHIVE_GROUPS,
     conviene que aparezca en vez de desaparecer sin aviso. */
  const orphans = documents.filter((d) => !assigned.has(d.document_id));
  if (orphans.length) {
    groups.push({
      id: 'unclassified',
      label: 'Sin clasificar',
      docs: visibleAt(orphans.map((d) => ({ ...d, typeLabel: docTypeLabel(d.document_type), accessLabel: accessLabel(d.access_level), evidence: evidenceFor('document', d.document_id), referenceOnly: true })), viewerLevel),
    });
  }
  return groups;
}

/**
 * Filtro por nivel de acceso. `public` es el más restrictivo de mostrar.
 * IR-009: PII, firmas, cuentas y medidores van a acceso restringido, y el
 * § 11 prohíbe exponer nombres o imágenes de menores.
 */
const ACCESS_ORDER = { public: 0, institutional: 1, audit_restricted: 2, restricted: 3 };

/* Un nivel desconocido se trata como el MÁS restrictivo, nunca como público.
   No es teórico: people.json usa `restricted`, que no está en el catálogo de
   config/status_catalogs.json. Con un `?? 0` ese registro —el representante
   legal de la escuela— se habría publicado como dato abierto. Ante un valor
   que no entendemos, la respuesta segura es ocultar. */
const MOST_RESTRICTIVE = Math.max(...Object.values(ACCESS_ORDER));
const levelOf = (v) => ACCESS_ORDER[v] ?? MOST_RESTRICTIVE;

export const visibleAt = (records, viewerLevel = 'institutional') => {
  const max = levelOf(viewerLevel);
  return records.filter((r) => levelOf(r.access_level) <= max);
};

/* ── Personas y roles ─────────────────────────────────────────
   § 11: no exponer nombres sin autorización. Q09 pregunta justamente qué
   responsables se pueden mostrar y sigue sin respuesta, así que la lista se
   filtra por access_level y se informa cuántos quedaron fuera. */

const ROLE_LABEL = {
  legal_representative: 'Representante legal',
  environmental_coordinator: 'Coordinación ambiental',
  program_coordinator: 'Coordinación de programa',
  maintenance_lead: 'Responsable de mantenimiento',
  communication_lead: 'Responsable de comunicación',
  teacher: 'Docente',
};

export const roleLabel = (r) => ROLE_LABEL[r] ?? r;

/** Responsables con sus roles resueltos, respetando el nivel de acceso. */
export function responsibles({ viewerLevel = 'institutional' } = {}) {
  const visiblePeople = visibleAt(people, viewerLevel);
  const list = visiblePeople.map((p) => ({
    ...p,
    roles: roleAssignments
      .filter((r) => r.person_id === p.person_id && r.status === 'active')
      .map((r) => ({
        ...r,
        label: roleLabel(r.role_type),
        scopeName: r.scope_type === 'program'
          ? programs.find((x) => x.program_id === r.scope_id)?.name ?? r.scope_id
          : institution.display_name,
      })),
  }));
  return { list, hidden: people.length - visiblePeople.length };
}

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
