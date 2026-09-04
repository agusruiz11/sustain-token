/* ============================================================
   CONSTRUCTOR DE REPORTES — Entregable 3 § 4.6
   ============================================================
   El spec pide seis tipos de reporte y tres marcos, y una regla que atraviesa
   todos:

     «Cada exportación debe incluir campos de procedencia y estado de
      verificación para evitar que un tercero confunda histórico con MRV.»

   Ese es el punto entero del módulo. Un CSV que sale de acá va a terminar en
   la mano de un auditor o de una consultora que no vio el dashboard: si una
   fila no dice de dónde salió, el destinatario no tiene cómo saber que una
   medición del expediente de 2021 no pasó por ningún pipeline.

   Por eso `record_origin` y `verification_status` no son columnas opcionales
   del reporte — se agregan en la salida de todos los tipos, y hay una
   invariante que lo verifica.

   COA aparece como marco externo seleccionable, nunca como estructura interna
   obligatoria (IR-010).
   ============================================================ */

import { CATEGORIES } from './categories.js';
import { buildTraceability } from './actions.js';
import * as M from './montessori/index.js';

export const REPORT_TYPES = [
  { id: 'impacto', label: 'Impacto ambiental', needsHistory: false },
  { id: 'acciones', label: 'Acciones verificadas', needsHistory: false },
  { id: 'historico', label: 'Histórico institucional', needsHistory: true },
  { id: 'evidencias', label: 'Evidencias', needsHistory: true },
  { id: 'auditoria', label: 'Auditoría', needsHistory: true },
  { id: 'integral', label: 'Integral', needsHistory: false },
];

/**
 * Marcos de reporte. El externo se resuelve desde los frameworks del nodo, no
 * está cableado: mañana otra institución trae otra certificación y el selector
 * la muestra sin tocar este archivo.
 */
export function frameworksFor(node) {
  const external = (node?.data?.frameworks ?? []).map((f) => ({
    id: f.id,
    label: f.name,
    external: true,
    version: f.version,
  }));
  return [
    { id: 'sustain', label: 'Sustain Standard', external: false },
    ...external,
    { id: 'custom', label: 'Personalizado', external: false },
  ];
}

/* Toda fila exportada lleva estos dos campos. Sin excepción. */
const provenanceFields = (recordOrigin, verificationStatus) => ({
  record_origin: recordOrigin,
  verification_status: verificationStatus,
});

/**
 * Acciones Sustain del nodo, con su cadena de trazabilidad resumida.
 *
 * Desde el 24 ago exporta el universo canónico completo —energía y movilidad—
 * y no sólo las facturas. Las columnas salen del sobre común `metric`/`outcome`
 * para que una fila de bici y una de factura convivan en el mismo CSV sin que
 * ninguna invente los campos de la otra: lo que no aplica va en null, que es
 * distinto de cero.
 */
function accionesDataset(actions) {
  return actions.map((a) => ({
    id: a.id,
    fecha: a.date,
    accion: a.title,
    tipo: a.kind,
    categoria: CATEGORIES[a.categoryId].name,
    metrica: a.metric.label,
    valor: a.metric.value,
    unidad: a.metric.unit,
    linea_base: a.baseline.value,
    metodo_baseline: a.baseline.method,
    resultado: a.outcome.label,
    resultado_valor: a.outcome.value,
    resultado_unidad: a.outcome.unit,
    variacion_pct: a.outcome.deltaPct,
    direccion: a.outcome.direction,
    ses_delta: a.ses.delta,
    ses_clasificacion: a.ses.label,
    hash: a.anchor.hash,
    cid: a.anchor.cid,
    anclado_en_cadena: Boolean(a.anchor.tx),
    pasos_completos: buildTraceability(a).filter((s) => s.status === 'complete').length,
    /* Las 8 facturas EDESUR son fixtures de demo; los 5 viajes no. Si alguien
       exporta esto y lo manda afuera, la fila tiene que decirlo. */
    data_mode: a.dataMode ?? 'production',
    ...provenanceFields('native_sustain', 'sustain_verified'),
  }));
}

/** Totales por indicador con su procedencia. */
function impactoDataset(hasHistory) {
  if (!hasHistory) return [];
  return M.indicatorsWithStatus().map((i) => ({
    indicador_id: i.indicatorId,
    indicador: i.name,
    categoria_canonica: i.category,
    unidad: i.unit,
    agregacion: i.aggregation,
    total: i.total?.value ?? null,
    periodo_desde: i.total?.periodStart ?? null,
    periodo_hasta: i.total?.periodEnd ?? null,
    mediciones: i.measured,
    mediciones_excluidas: i.excluded,
    motivo_sin_total: i.reason,
    ...provenanceFields('historical_import', 'imported_historical'),
  }));
}

/** Programas, proyectos e hitos del expediente. */
function historicoDataset(hasHistory) {
  if (!hasHistory) return [];
  return [
    ...M.programs.map((p) => ({
      id: p.program_id,
      tipo: 'programa',
      nombre: p.name,
      categoria_canonica: p.category,
      estado: p.status,
      inicio: p.start_date,
      fuente: p.source_reference,
      ...provenanceFields(p.record_origin, 'documented'),
    })),
    ...M.projects.map((p) => ({
      id: p.project_id,
      tipo: 'proyecto',
      nombre: p.name,
      programa: p.program_id,
      estado: p.status,
      inicio: p.start_date,
      fin: p.end_date,
      fuente: p.source_reference,
      ...provenanceFields('historical_import', 'documented'),
    })),
    ...M.actions.map((a) => ({
      id: a.action_id,
      tipo: 'hito',
      nombre: a.summary,
      programa: a.program_id,
      tipo_accion: a.action_type,
      fecha: a.occurred_at,
      fuente: a.source_reference,
      ...provenanceFields(a.record_origin, a.verification_status),
    })),
  ];
}

/** Documentos y evidencias, respetando el nivel de acceso del destinatario. */
function evidenciasDataset(hasHistory, viewerLevel) {
  if (!hasHistory) return [];
  const docs = M.visibleAt(M.documents, viewerLevel);
  return docs.map((d) => {
    const evs = M.evidenceFor('document', d.document_id);
    return {
      id: d.document_id,
      titulo: d.title,
      tipo: d.document_type,
      fecha: d.effective_date,
      estado: d.status,
      nivel_acceso: d.access_level,
      fuente: d.source_reference,
      evidencias: evs.length,
      solo_referencia: evs.length > 0 && evs.every(M.isFileReferenceOnly),
      ...provenanceFields('historical_import', 'documented'),
    };
  });
}

/** Todo lo auditable del expediente. */
function auditoriaDataset(hasHistory, viewerLevel) {
  if (!hasHistory) return [];
  return M.auditRecords({ viewerLevel }).map((r) => ({
    id: r.id,
    tipo: r.kindLabel,
    registro: r.title,
    periodo: r.period,
    calidad: r.qualityStatus ?? null,
    nivel_acceso: r.accessLevel,
    fuente: r.sourceReference,
    evidencias: r.evidence,
    hash: null,
    mrv: 'no_aplicado',
    ses: 'no_aplica',
    anclaje: 'no_aplica',
    ...provenanceFields(r.recordOrigin, r.verificationStatus),
  }));
}

/**
 * Arma el reporte.
 *
 * `integral` no concatena todo en una tabla —serían filas de formas distintas
 * mezcladas— sino que devuelve las secciones por separado. El CSV de un
 * integral exporta la sección de auditoría, que es la más completa; el JSON
 * lleva todas.
 */
export function buildReport({ type, actions, hasHistory, viewerLevel = 'institutional' }) {
  const sections = {
    acciones: accionesDataset(actions),
    impacto: impactoDataset(hasHistory),
    historico: historicoDataset(hasHistory),
    evidencias: evidenciasDataset(hasHistory, viewerLevel),
    auditoria: auditoriaDataset(hasHistory, viewerLevel),
  };

  if (type === 'integral') {
    return {
      type,
      sections,
      /* La tabla plana del integral es la auditoría: es la única que abarca
         hitos, mediciones, documentos y evaluaciones a la vez. */
      rows: sections.auditoria,
      counts: Object.fromEntries(Object.entries(sections).map(([k, v]) => [k, v.length])),
    };
  }

  const rows = sections[type] ?? [];
  return { type, sections: { [type]: rows }, rows, counts: { [type]: rows.length } };
}

/** Columnas de la vista previa, derivadas del propio dataset. */
export function previewColumns(rows, max = 6) {
  if (!rows.length) return [];
  /* Procedencia y verificación van siempre, aunque queden fuera del corte por
     cantidad de columnas: son lo que el § 4.6 exige mostrar. */
  const keys = Object.keys(rows[0]);
  const pinned = ['record_origin', 'verification_status'].filter((k) => keys.includes(k));
  const rest = keys.filter((k) => !pinned.includes(k)).slice(0, max - pinned.length);
  return [...rest, ...pinned].map((k) => ({
    key: k,
    label: k.replace(/_/g, ' '),
    render: (r) => {
      const v = r[k];
      if (v === null || v === undefined || v === '') return '—';
      if (typeof v === 'boolean') return v ? 'sí' : 'no';
      return String(v);
    },
  }));
}
