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

// § 4.6 · toda fila exportada declara su procedencia. Es la regla que evita
// que un tercero confunda un histórico con algo verificado por el pipeline.
const R = await server.ssrLoadModule('/src/demo/data/reports.js');
const A = await server.ssrLoadModule('/src/demo/data/actions.js');
const L = await server.ssrLoadModule('/src/demo/data/anchorLinks.js');
for (const t of R.REPORT_TYPES) {
  const rows = R.buildReport({ type: t.id, actions: A.ACTIONS, hasHistory: true }).rows;
  const sinProcedencia = rows.filter(
    (r) => r.record_origin === undefined || r.verification_status === undefined,
  );
  check(rows.length > 0 && sinProcedencia.length === 0,
    `§4.6: reporte "${t.id}" exporta procedencia en sus ${rows.length} filas`,
    rows.length === 0 ? 'dataset vacío' : `${sinProcedencia.length} filas sin campos`);
}

// Las 8 facturas EDESUR salen marcadas como fixture en cualquier exportación.
const acc = R.buildReport({ type: 'acciones', actions: A.ACTIONS, hasHistory: false }).rows;
check(acc.filter((r) => r.tipo === 'energy').every((r) => r.data_mode === 'demo'),
  '§4.6: las 8 facturas EDESUR se exportan marcadas como fixture');

/* ── Universo canónico de acciones (24 ago 2026) ──────────────
   Martín pidió que Mis Acciones, Timeline, Impact, Reportes, Auditoría e
   Identity lean el mismo conjunto. Estas invariantes son las que impiden que
   vuelva a abrirse. */

const N = A.NODE_ACTIONS;
const energia = N.filter((a) => a.kind === 'energy');
const movilidad = N.filter((a) => a.kind === 'mobility');
const plastico = N.filter((a) => a.kind === 'plastic_recovery');

check(N.length === 14, 'universo: las 14 acciones del node_state, todas con paquete',
  `son ${N.length}`);
check(energia.length === 8 && plastico.length === 1 && movilidad.length === 5,
  'universo: 8 energía + 1 plástico + 5 movilidad cubren el total',
  `${energia.length} + ${plastico.length} + ${movilidad.length}`);

// Ya no queda ningún hueco declarado: el paquete de Botella de Amor llegó.
const declaradas = N.length + A.MISSING_ACTION_PACKAGES.reduce((n, m) => n + m.count, 0);
check(declaradas === 14, 'universo: sin huecos pendientes, el total cierra en 14',
  `suman ${declaradas}`);

// La cadena de SES tiene que cerrar en el 35 canónico del node_state.
const porFecha = [...N].sort((a, b) => a.date.localeCompare(b.date));
const sesTotal = porFecha.reduce((s, a) => s + (a.ses.delta ?? 0), 0);
check(sesTotal === 35, 'SES: la suma de los deltas de las 14 acciones da el 35 canónico',
  `da ${sesTotal}`);
check(energia.reduce((s, a) => s + a.ses.delta, 0) === 20,
  'SES: las 8 de energía suman 20');
check(plastico.reduce((s, a) => s + a.ses.delta, 0) === 3,
  'SES: Botella de Amor aporta los 3 que llevan de 20 a 23');
check(movilidad.reduce((s, a) => s + a.ses.delta, 0) === 12,
  'SES: los 5 viajes aportan los 12 que llevan de 23 a 35');
check(N.every((a) => a.ses.delta !== null),
  'SES: ninguna acción queda sin delta cargado');

// Sobre común: sin esto una pantalla vuelve a necesitar código por tipo.
const SOBRE = ['kind', 'metric', 'outcome', 'baseline', 'ses', 'mrv', 'anchor', 'dataRoom', 'detailPath'];
const incompletas = N.filter((a) => SOBRE.some((k) => a[k] === undefined));
check(incompletas.length === 0, 'universo: toda acción trae el sobre común completo',
  incompletas.map((a) => a.id).join(', '));

// La cadena de trazabilidad tiene 10 pasos para cualquier tipo de acción.
const cadenaRota = N.filter((a) => A.buildTraceability(a).length !== 10);
check(cadenaRota.length === 0, 'universo: la cadena de 10 pasos se arma para todo tipo de acción',
  cadenaRota.map((a) => a.id).join(', '));

// Ninguna acción inventa un identificador de anclaje. Es LA regla del producto.
const inventados = N.filter((a) => {
  const okCid = a.anchor.cid === null || a.anchor.cidStatus === 'complete';
  const okTx = a.anchor.tx === null || a.anchor.chainStatus === 'complete';
  return !okCid || !okTx;
});
check(inventados.length === 0, 'anclaje: ningún CID ni tx aparece sin estado que lo respalde',
  inventados.map((a) => a.id).join(', '));

// Movilidad tiene hash real de evidencia; energía sólo una de las ocho.
check(movilidad.every((a) => a.anchor.hash && a.anchor.hashStatus === 'complete'),
  'anclaje: los 5 viajes exponen su SHA-256 verificable');
check(movilidad.every((a) => a.anchor.cid === null && a.anchor.tx === null),
  'anclaje: los 5 viajes siguen sin CID ni transacción, como en la fuente');

// Anclaje real de energía y plástico (28 ago 2026).
const conAncla = [...energia, ...plastico];
check(conAncla.every((a) => a.anchor.cid && a.anchor.tx),
  'anclaje: las 9 acciones con paquete traen CID y transacción',
  conAncla.filter((a) => !a.anchor.cid || !a.anchor.tx).map((a) => a.id).join(', '));
check(conAncla.every((a) => a.anchor.chainId === 56 && a.anchor.contract === '0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B'),
  'anclaje: las 9 apuntan al mismo contrato en BNB Smart Chain (56)');
check(conAncla.every((a) => /^0x[0-9a-f]{64}$/.test(a.anchor.tx)),
  'anclaje: los 9 hashes de transacción tienen forma válida',
  conAncla.filter((a) => !/^0x[0-9a-f]{64}$/.test(a.anchor.tx)).map((a) => a.id).join(', '));
check(new Set(conAncla.map((a) => a.anchor.tx)).size === conAncla.length,
  'anclaje: ninguna transacción está repetida entre acciones');
check(new Set(conAncla.map((a) => a.anchor.cid)).size === conAncla.length,
  'anclaje: ningún CID está repetido entre acciones');
// PARTIAL en las 9: hay TX, falta la confirmación. No es ausencia de prueba.
check(conAncla.every((a) => a.anchor.blockNumber === null && a.anchor.proofValidationStatus === 'PARTIAL'),
  'anclaje: las 9 quedan en PARTIAL, sin bloque ni timestamp reconstruidos');
check(conAncla.every((a) => L.proofState(a.anchor) === 'tx_unconfirmed'),
  'anclaje: las 9 resuelven a "TX registrada", nunca a "pendiente de anclaje"');

// Procedencia: las facturas son fixture, los viajes son dato productivo.
check(energia.every((a) => a.dataMode === 'demo'),
  'procedencia: las 8 facturas EDESUR siguen marcadas como fixture de demo');
check(movilidad.every((a) => a.dataMode === 'production'),
  'procedencia: los 5 viajes son dato productivo del nodo, no fixture');
check(N.every((a) => a.nodeKey === 'usuario'),
  'atribución: todo el universo pertenece al nodo de Martín, no a la escuela');

// El reporte de acciones sobre el universo completo sigue declarando procedencia.
const uni = R.buildReport({ type: 'acciones', actions: N, hasHistory: false }).rows;
check(uni.length === 14 && uni.every((r) => r.record_origin && r.verification_status),
  '§4.6: el reporte de acciones exporta las 14 con procedencia', `${uni.length} filas`);
check(uni.filter((r) => r.data_mode === 'demo').length === 8,
  '§4.6: la exportación distingue las 8 de demo de las 5 productivas');

/* ── Los cuatro estados visibles (24 ago 2026) ────────────────
   Histórico documentado / Sustain Verified / Pendiente de confirmación /
   Fuera de alcance. Lo que se verifica acá es que el estado salga del dato y
   no de una interpretación de la pantalla. */

const registros = M.auditRecords({ viewerLevel: 'institutional' });
const estados = registros.map((r) => M.recordStateOf(r));
const cuenta = (s) => estados.filter((e) => e === s).length;

check(estados.every((s) => Object.values(M.RECORD_STATE).includes(s)),
  'estados: todo registro resuelve a uno de los cuatro estados');
check(cuenta('pending_confirmation') === 14,
  'estados: los 14 needs_review son los que figuran como Pendiente de confirmación',
  `son ${cuenta('pending_confirmation')}`);
check(cuenta('sustain_verified') === 0,
  'estados: ningún registro histórico figura como Sustain Verified',
  `${cuenta('sustain_verified')} marcados`);
/* "Fuera de alcance" sale de PILOT_SCOPE —configuración del piloto—, nunca del
   paquete. Con PILOT_SCOPE vacío no puede haber ninguno: si aparece uno, es
   porque alguien lo está infiriendo del dato, que es justo lo que Martín pidió
   que no hiciéramos. */
const scopeVacio = Object.values(M.PILOT_SCOPE).every((g) => Object.keys(g).length === 0);
check(!scopeVacio || cuenta('out_of_scope') === 0,
  'estados: Fuera de alcance sale de PILOT_SCOPE, nunca de inferir el paquete',
  `${cuenta('out_of_scope')} inferidos con PILOT_SCOPE vacío`);
check(M.outOfScopeReason(registros[0]) === null,
  'estados: un registro sin declaración explícita nunca queda fuera de alcance');
check(cuenta('documented') + cuenta('pending_confirmation') === registros.length,
  'estados: la partición cubre todos los registros del expediente');

await server.close();
console.log(`\n${fail === 0 ? 'todas las invariantes OK' : `${fail} invariantes rotas`}`);
process.exit(fail ? 1 : 0);
