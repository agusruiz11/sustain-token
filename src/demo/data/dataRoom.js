/* ============================================================
   DATA ROOM — Fase 3
   ============================================================
   § 3 del brief: "Debe sentirse como el 'Google Drive' de cada acción".

   ------------------------------------------------------------
   DECISIÓN DE DISEÑO — por qué los hashes de acá SÍ son reales
   ------------------------------------------------------------
   El piloto no tiene hashes por archivo: sólo hay uno a nivel de acción, y
   únicamente para la del 22 Jun. Inventar 64 caracteres por archivo en un
   producto que vende integridad verificable estaría mal.

   La salida es que los artefactos JSON del pipeline se GENERAN acá desde los
   datos reales de la acción (consumo, baseline, SES son los del piloto, no
   inventados). Como el contenido es real y determinístico, el SHA-256 que
   calcula el navegador sobre ese contenido es un hash auténtico de un archivo
   auténtico — y la verificación de integridad del Data Room funciona de verdad,
   no simulada.

   Los PDFs (factura y reportes) no se pueden generar: su contenido no está en el
   repo. Se listan con `content: null` y se muestran como no previsualizables,
   sin hash. Es el mismo criterio que en el resto del producto: lo que no está,
   se dice que no está.
   ============================================================ */

import { ACTIONS } from './actions.js';

const stringify = (obj) => JSON.stringify(obj, null, 2);

/* ── Artefactos del pipeline, serializados desde la acción real ── */

function consumptionData(a) {
  return stringify({
    action_id: a.id,
    node_id: a.nodeId,
    category: a.categoryId,
    period: { label: a.title, date: a.date, days: a.consumption.periodDays },
    consumption: {
      value: a.consumption.value,
      unit: a.consumption.unit,
      total: a.consumption.totalKwh,
    },
    source: {
      provider: a.evidence.provider,
      document: a.evidence.kind,
      format: a.evidence.format,
    },
  });
}

function baselineReport(a) {
  return stringify({
    action_id: a.id,
    method: a.baseline.method,
    baseline: { value: a.baseline.value, unit: a.baseline.unit },
    observed: { value: a.consumption.value, unit: a.consumption.unit },
    result: {
      delta_pct: a.result.deltaPct,
      direction: a.result.direction,
      saved_per_day: Number(a.result.savedPerDay.toFixed(2)),
      unit: a.result.unit,
    },
  });
}

function sesScore(a) {
  return stringify({
    action_id: a.id,
    classification: a.ses.band,
    label: a.ses.label,
    delta: a.ses.delta,
    status: a.ses.status,
    computed_at: a.date,
  });
}

function dashboardUpdate(a) {
  return stringify({
    action_id: a.id,
    applied: true,
    fields_updated: ['verified_actions', 'energy_saved', 'ses_score', 'evidence_index'],
    ses_delta: a.ses.delta,
    timestamp: a.date,
  });
}

const ARTIFACT_BUILDERS = {
  'consumption_data.json': consumptionData,
  'baseline_report.json': baselineReport,
  'ses_score.json': sesScore,
  'dashboard_update.json': dashboardUpdate,
};

/* ── Construcción del árbol ─────────────────────────────────── */

const bytes = (s) => new TextEncoder().encode(s).length;

function toFile(a, spec, group) {
  const build = ARTIFACT_BUILDERS[spec.name];
  const content = build ? build(a) : null;
  return {
    id: `${a.id}__${spec.name}`,
    name: spec.name,
    type: spec.type,
    label: spec.label,
    group,
    redacted: Boolean(spec.redacted),
    content,
    previewable: content !== null,
    sizeBytes: content ? bytes(content) : null,
    updatedAt: a.dateLabel,
    // El pipeline versiona cada artefacto. En el piloto sólo existe la v1.
    versions: [{ v: 1, at: a.dateLabel, note: 'Generado por el pipeline de verificación' }],
  };
}

/** Grupos de archivos de una acción, en el orden en que los produce el pipeline. */
export function fileTree(action) {
  const dr = action.dataRoom;
  return [
    {
      group: 'Evidencia original',
      hint: 'Lo que entregó la institución',
      files: dr.evidence.map((f) => toFile(action, f, 'evidence')),
    },
    {
      group: 'Artefactos del pipeline',
      hint: 'Generados durante la verificación',
      files: dr.artifacts.map((f) => toFile(action, f, 'artifacts')),
    },
    {
      group: 'Reportes',
      hint: 'Documentos finales',
      files: dr.reports.map((f) => toFile(action, f, 'reports')),
    },
  ];
}

export function filesOf(action) {
  return fileTree(action).flatMap((g) => g.files);
}

export function getFile(fileId) {
  for (const a of ACTIONS) {
    const found = filesOf(a).find((f) => f.id === fileId);
    if (found) return { file: found, action: a };
  }
  return null;
}

/** Total de archivos del nodo. */
export function fileCount(actions) {
  return actions.reduce((n, a) => n + filesOf(a).length, 0);
}

export function formatBytes(n) {
  if (n === null || n === undefined) return '—';
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} kB`;
}
