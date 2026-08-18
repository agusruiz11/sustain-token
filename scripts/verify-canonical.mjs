/* Invariantes del histórico institucional de Montessori (Fase 1, 18 ago 2026).
   Comprueba que las reglas duras del Implementation Package se sostienen sobre
   el dataset importado y sobre la capa de acceso que lo sirve.
   Correr con `npm run verify:canonical`. */
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const M = await server.ssrLoadModule('/src/demo/data/montessori/index.js');

const T = M.trajectorySummary();
let fail = 0;
const check = (ok, desc, detail = '') => {
  if (!ok) fail++;
  console.log(`${ok ? '✓' : '✗'} ${desc}${ok || !detail ? '' : `  → ${detail}`}`);
};

// Conteos contra el manifest del paquete: detecta una copia incompleta.
const counts = M.manifest.record_counts;
for (const [key, expected] of Object.entries(counts)) {
  const actual = {
    institution: 1, sites: 1,
    organizational_units: M.organizationalUnits.length, people: M.people.length,
    role_assignments: M.roleAssignments.length, programs: M.programs.length,
    projects: M.projects.length, actions: M.actions.length,
    indicator_definitions: M.indicatorDefinitions.length, measurements: M.measurements.length,
    assets: M.assets.length, utility_accounts: M.utilityAccounts.length,
    meters: M.meters.length, documents: M.documents.length,
    evidence: M.evidence.length, partners: M.partners.length,
    certification_frameworks: M.certificationFrameworks.length,
    framework_requirements: M.frameworkRequirements.length,
    compliance_assessments: M.complianceAssessments.length,
    conciliation: M.conciliation.length, open_queries: M.openQueries.length,
  }[key];
  check(actual === expected, `manifest: ${key} = ${expected}`, `importados ${actual}`);
}

// IR-004 · importar histórico no equivale a verificación Sustain.
check(T.sustainVerified === 0, 'IR-004: ningún registro histórico es sustain_verified',
  `${T.sustainVerified} marcados como verificados`);
check(M.actions.every((a) => a.record_origin === 'historical_import'),
  'IR-003: todas las acciones históricas llevan record_origin=historical_import');

// IR-006 · needs_review fuera de los KPI públicos.
check(M.publicMeasurements.every((m) => m.quality_status === 'accepted'),
  'IR-006: las mediciones públicas son todas accepted');
check(M.publicMeasurements.length + M.needsReviewMeasurements.length === M.measurements.length,
  'IR-006: la partición accepted/needs_review cubre las 168 mediciones');
check(M.needsReviewMeasurements.length === 14,
  'IR-006: 14 mediciones quedan fuera de KPI público',
  `son ${M.needsReviewMeasurements.length}`);

// IR-007 · toda medición conserva período, unidad y fuente.
const sinPeriodo = M.measurements.filter((m) => !m.period_start || !m.unit || !m.source_reference);
check(sinPeriodo.length === 0, 'IR-007: toda medición conserva período, unidad y fuente',
  `${sinPeriodo.length} incompletas`);

// Integridad referencial: nada apunta a un id que no existe.
const ids = (arr, k) => new Set(arr.map((x) => x[k]));
const programIds = ids(M.programs, 'program_id');
const indicatorIds = ids(M.indicatorDefinitions, 'indicator_id');
check(M.projects.every((p) => programIds.has(p.program_id)),
  'referencial: todo proyecto apunta a un programa existente');
check(M.measurements.every((m) => indicatorIds.has(m.indicator_id)),
  'referencial: toda medición apunta a un indicador existente');
check(M.actions.every((a) => a.program_id === null || programIds.has(a.program_id)),
  'referencial: toda acción apunta a un programa existente o a ninguno');

// La agregación respeta aggregation_method y no inventa ceros.
const solar = M.indicatorTotal('solar_capacity_kwp');
check(solar?.aggregation === 'latest', "agregación: solar_capacity_kwp usa 'latest'");
const bottles = M.indicatorTotal('waste_love_bottles_kg');
check(bottles?.aggregation === 'sum' && bottles.value > 0,
  'agregación: Botellas de Amor suma un total con dato');

// Privacidad: ningún documento de acceso restringido se cuela en la vista pública.
const publicDocs = M.visibleAt(M.documents, 'public');
check(publicDocs.every((d) => d.access_level === 'public'),
  'IR-009: la vista pública no expone documentos institucionales ni restringidos',
  `${publicDocs.length} documentos visibles como público`);

await server.close();
console.log(`\n${fail === 0 ? 'todas las invariantes OK' : `${fail} invariantes rotas`}`);
process.exit(fail ? 1 : 0);
