/* ============================================================
   MODELO DE ACCIÓN — Dashboard v2.0
   ============================================================
   Entidad central del producto. Cuatro módulos del brief son cuatro VISTAS
   de este mismo objeto, no cuatro modelos distintos:

     § 2  Mis Acciones  → ficha con la cadena de 10 pasos  (buildTraceability)
     § 3  Data Room     → los archivos y artefactos          (action.dataRoom)
     § 5  Timeline      → los 6 hitos en el tiempo           (buildTimeline)
     § 10 Auditoría     → los pasos criptográficos           (action.anchor)

   Cadena de trazabilidad del brief (§ 2):
     Factura → Consumo → Baseline → Resultado → SES → MRV → Hash → CID →
     Blockchain → Reportes

   ------------------------------------------------------------
   ⚠ ATRIBUCIÓN — CORREGIDO 18 ago 2026
   ------------------------------------------------------------
   Estas 8 acciones NO son de Montessori School. Pertenecen al nodo personal
   de Martín Ceron (spn_01ee6583da858ca1fa19323d, node_type: individual,
   founder_wallet) y son FIXTURES DE DEMO: facturas de él y de familiares que
   pasó para construir y probar el flujo.

   Lo aclaró tres veces —"son para mi dashboard, son mías"— y lo formalizó el
   Implementation Package en config/demo_data_policy.json:

     "Las 8 facturas EDESUR utilizadas en el demo no constituyen consumos
      reales de Montessori."

   Por eso llevan `dataMode: DATA_MODE.DEMO` y viven en /demo/usuario.
   No deben alimentar: mediciones históricas institucionales, SES oficial,
   auditorías oficiales, reportes oficiales, evidencia de certificación ni
   anclajes de producción.

   Ver src/demo/data/sustainNodes.js para la identidad del nodo.

   ------------------------------------------------------------
   PROCEDENCIA DE LOS DATOS — RECONCILIADO 28 AGO 2026
   ------------------------------------------------------------
   Los 9 DASHBOARD_SYNC del nodo llegaron el 28 de agosto desde el Drive que
   Martín compartió con la agencia. Desde entonces **ningún valor de este
   archivo está reconstruido**: consumo, línea base, porcentaje, SES, días del
   período y kWh totales salen literal del paquete de cada acción, y el
   frontend no recalcula nada.

   Lo que la reconstrucción anterior tenía mal, y ahora está corregido:

     18 Dic 2025 → era -11.6% y SES sin dato; es -10.565867% y SES delta 0
     20 Ene 2026 → era +38.8% y SES sin dato; es +37.992455% y SES delta -30

   Las otras seis coincidían dentro del margen declarado. Los `periodDays` y
   `totalKwh`, que figuraban como pendientes, ahora están cargados.

   ------------------------------------------------------------
   EL SES 35 YA CIERRA
   ------------------------------------------------------------
   La pantalla de Identidad mostraba una reconciliación abierta porque los
   valores disponibles no explicaban el 35 del node_state. Con los 9 paquetes
   la cadena cierra exacta:

     energía   0 +0 -30 +40 +40 +30 -30 -30  =  20
     plástico  +3 (Botella de Amor, 25 jul)  =  23
     movilidad +0 +3 +3 +3 +3                =  35

   Los 23 con los que arranca el módulo de movilidad son exactamente el estado
   del nodo después de la Botella de Amor. No hay hueco.

   ------------------------------------------------------------
   ⚠ ANCLAJE: EXISTE, PERO SIN CONFIRMACIÓN EN EL SYNC
   ------------------------------------------------------------
   Las 9 acciones con paquete tienen CID de IPFS (`status: stored`) y hash de
   transacción en BNB Smart Chain Mainnet contra el contrato del registro.

   Lo que NO tienen es `transaction_status`, `block_number` ni
   `block_timestamp` —vienen en null en las 9— y `anchor_method` sólo en 5 de
   las 8 de energía. Por eso `proof_validation_status` es PARTIAL.

   PARTIAL no significa ausencia de prueba. La transacción existe y se abre en
   el explorador. El estado correcto es "TX registrada · confirmación no
   incorporada al Sync", nunca "Pendiente de anclaje". Ver data/anchorLinks.js.

   Esos campos los corrige Martín desde el pipeline/Finalizer. Nosotros no los
   reconstruimos.

   Los 5 viajes de movilidad siguen sin CID ni transacción: su propio sync se
   declara DEMO y así se muestran.
   ============================================================ */

import { DATA_MODE, dashboardKeyOf } from './sustainNodes.js';
import { ACTION_STATUS, STEP_STATUS, ACTION_KIND } from './actionShape.js';
import { MOBILITY_AS_ACTIONS } from './mobilityActions.js';

export { ACTION_STATUS, STEP_STATUS, ACTION_KIND };

/**
 * Bandas de clasificación SES.
 * `confirmed: true` = observada en los datos reales del piloto.
 * `confirmed: false` = banda plausible pero NO verificada; confirmar con el
 * equipo antes de mostrarla como regla del producto.
 */
export const SES_BANDS = [
  { id: 'exceptional_reduction', label: 'Exceptional Reduction', minPct: -Infinity, maxPct: -20, delta: 40, confirmed: true },
  { id: 'outstanding_reduction', label: 'Outstanding Reduction', minPct: -20, maxPct: -15, delta: 30, confirmed: true },
  { id: 'significant_reduction', label: 'Significant Reduction', minPct: -15, maxPct: -5, delta: null, confirmed: false },
  { id: 'stable', label: 'Stable Consumption', minPct: -5, maxPct: 5, delta: null, confirmed: false },
  { id: 'baseline_established', label: 'Baseline Establishment', minPct: null, maxPct: null, delta: 0, confirmed: true },
  { id: 'moderate_increase', label: 'Moderate Consumption Increase', minPct: 5, maxPct: 50, delta: null, confirmed: false },
  { id: 'major_increase', label: 'Major Consumption Increase', minPct: 50, maxPct: Infinity, delta: -30, confirmed: true },
];

const NODE = 'spn_01ee6583da858ca1fa19323d';

/* ============================================================
   ANCLAJES DE LAS ACCIONES DE ENERGÍA — CARGADOS 28 AGO 2026
   ============================================================
   Copiados literal de los 8 `dashboard_sync_energy_*.json` del Drive de Martín,
   bloque `registry_proof`. Un CID y un hash de transacción por acción, todos
   con `ipfs.status: "stored"` y todos en BNB Smart Chain Mainnet contra el
   mismo contrato del registro.

   Los archivos están en la carpeta que Martín compartió con la cuenta de la
   agencia; sus IDs de Drive y los valores extraídos quedaron registrados en
   `docs/anclajes-energia-2026-08-28.md` para poder re-verificar cualquiera.

   ⚠ `transaction_status`, `block_number` y `block_timestamp` vienen en null en
   los 8, y `anchor_method` sólo en 5 de los 8. Por eso
   `proof_validation_status` es PARTIAL. Eso NO significa que no exista el
   anclaje: la transacción está registrada y se puede abrir en el explorador;
   lo que falta es la confirmación enriquecida. Es exactamente la distinción que
   pidió Martín el 24 de agosto y la que implementa `data/anchorLinks.js`.

   ⚠ NUNCA completar un campo null con un valor de ejemplo o de otra acción.
   Los corrige Martín desde el pipeline/Finalizer.
   ============================================================ */

/* Desde el 28 ago 2026 los 9 paquetes están en la mano y ningún valor de este
   archivo se reconstruye: todos salen del DASHBOARD_SYNC correspondiente. */
const SOURCE = { consumption: 'source', baseline: 'source', deltaPct: 'source', ses: 'source' };

const REGISTRY_CONTRACT = '0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B';
const BNB_MAINNET = { chainId: 56, network: 'BNB Smart Chain Mainnet', contract: REGISTRY_CONTRACT };

export const ENERGY_ANCHORS = {
  act_martin_energia_01: {
    ...BNB_MAINNET,
    cid: 'bafybeiaajpctnhl2fhdw53gbfzwzqs4ntn7rbwoeusdiewd3gkfqwnsubm',
    tx: '0xeca4bf3ff138464d7acb48846c85381b910d6381105f875feb49bd62fd1932a7',
    anchorMethod: null,
  },
  act_martin_energia_02: {
    ...BNB_MAINNET,
    cid: 'bafybeieku4utxhpk73xou5m57eqrmcltdddfyvt4qsyv4tjf3smeygcyba',
    tx: '0xaea1c645fd0c7e62d00c092cf40fe4f17bc7bf374f8f14173b2b0c8dc0e6767c',
    anchorMethod: null,
  },
  act_martin_energia_03: {
    ...BNB_MAINNET,
    cid: 'bafybeigoe6bp7aasxpycmym37rxrqiomelwodmminaubu4x7tolyzdgxwy',
    tx: '0xa81c8ee916c170ec580d036453e705c2aca18323731b726eb9976940ea103a18',
    anchorMethod: null,
  },
  act_martin_energia_04: {
    ...BNB_MAINNET,
    cid: 'bafybeifbpdi6tal3fsomlr2myvdccty5ivjjhgjluqlu4h2xfbknmrdbqi',
    tx: '0xbd51255a73ac8d9d7366fb6565642120216f61eaf48793669c1727d8d9e09da0',
    anchorMethod: 'anchorAction(string,string)',
  },
  act_martin_energia_05: {
    ...BNB_MAINNET,
    cid: 'bafybeifurzf6bf52wggwm463av7orvahsgic6qiqxb4zapicaoocqrwzke',
    tx: '0x02741312885cfc1f37555e6ef5d3063f45bb7d218d0a03ef08622707991dfd8a',
    anchorMethod: 'anchorAction(string,string)',
  },
  act_martin_energia_06: {
    ...BNB_MAINNET,
    cid: 'bafybeiepxdkpt3brvdo7fak35gbef2ue2zeu5ehqjxnddlqxuekkw45xgm',
    tx: '0xe166a357bf69e73aee44261d0c53158a92c14bb117161b1eb67b59776fbd5b6a',
    anchorMethod: 'anchorAction(string,string)',
  },
  act_martin_energia_07: {
    ...BNB_MAINNET,
    cid: 'bafybeieyrueem5cy7opaywayzjjyvc3i4fqcf2c5phjkuk4pu3u343vop4',
    tx: '0xe74d024e2ad3a79270e17e68944f2c5157d5790bc1c294f19857037ad96fa580',
    anchorMethod: 'anchorAction(string,string)',
  },
  act_martin_energia_08: {
    ...BNB_MAINNET,
    cid: 'bafybeieatgly6nzhju76dr6oiensrrfllm5q2b3noakkgo7znq36ayo2yu',
    tx: '0xdb299a5a3e4425a57594620ac93c93b5a64f7193f178775fcb668c6097038397',
    anchorMethod: 'anchorAction(string,string)',
  },
};

/** Anclaje de una acción. Sin dato cargado, todo queda pendiente. */
function anchorOf(id, hash) {
  const a = ENERGY_ANCHORS[id] ?? {};
  return {
    hash,
    hashStatus: hash ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
    algorithm: 'SHA-256',
    cid: a.cid ?? null,
    cidStatus: a.cid ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
    tx: a.tx ?? null,
    chainId: a.chainId ?? null,
    network: a.network ?? null,
    contract: a.contract ?? REGISTRY_CONTRACT,
    anchorMethod: a.anchorMethod ?? null,
    chainStatus: a.tx ? STEP_STATUS.COMPLETE : STEP_STATUS.PENDING,
    /* Los tres campos que el Sync todavía no trae. Su ausencia es el dato:
       hay transacción, falta su confirmación. */
    blockNumber: a.blockNumber ?? null,
    timestamp: a.timestamp ?? null,
    proofValidationStatus: a.cid && a.tx ? 'PARTIAL' : null,
  };
}

/* Nombre legible de cada estrategia de baseline. Las tres que aparecen en los
   8 paquetes; la estrategia cambia a medida que el nodo acumula facturas. */
const BASELINE_METHOD = {
  first_invoice_provisional: 'Primera factura · baseline provisional',
  average_first_3: 'Promedio de las 3 primeras facturas',
  rolling_6_invoice_average: 'Promedio móvil de 6 facturas',
};

/** Artefactos que el pipeline produce por acción (brief § 3 Data Room). */
const energyDataRoom = (n, { hash }) => ({
  evidence: [
    { name: `factura_edesur_periodo_${n}.pdf`, type: 'pdf', label: 'Factura original', redacted: true },
  ],
  artifacts: [
    { name: 'consumption_data.json', type: 'json', label: 'Datos de consumo extraídos' },
    { name: 'baseline_report.json', type: 'json', label: 'Baseline Report' },
    { name: 'ses_score.json', type: 'json', label: 'SES Score' },
  ],
  reports: [
    { name: 'mrv_report.pdf', type: 'pdf', label: 'MRV Report', status: STEP_STATUS.COMPLETE },
    { name: 'validation_report.pdf', type: 'pdf', label: 'Validation Report', status: STEP_STATUS.COMPLETE },
    { name: 'action_report.pdf', type: 'pdf', label: 'Action Report', status: STEP_STATUS.COMPLETE },
    { name: 'dashboard_update.json', type: 'json', label: 'Dashboard Update', status: STEP_STATUS.COMPLETE },
  ],
  // Campos que NUNCA se exponen en la UI. institutions.js ya aplica este
  // criterio; el Data Room tiene que respetarlo al mostrar la factura.
  redactedFields: ['nº de cliente', 'nº de medidor', 'domicilio', 'código de pago', 'CUIT'],
  hash,
});

/**
 * Fábrica de acción de energía. Mantiene las 8 entradas legibles y evita
 * repetir la estructura de 10 pasos ocho veces.
 */
function energyAction({
  n, id, platformActionId, date, dateLabel, period, subtitle,
  totalKwh, periodDays, consumption, baseline, baselineStrategy, baselineConfidence,
  reductionPercent, sesDelta, sesAfter, sesBand,
  hash = null, provenance,
}) {
  /* El paquete declara `reduction_percent` con el signo invertido respecto de
     nuestro `deltaPct`: positivo = redujo. Se traduce una vez, acá, en lugar de
     que cada pantalla se acuerde del signo. */
  const deltaPct = Number((-reductionPercent).toFixed(6));

  return {
    id,
    kind: ACTION_KIND.ENERGY,
    nodeId: NODE,
    /** ID canónico de la acción en la plataforma. Es el que manda para
        UPSERT_BY_ACTION_ID y el que necesita un auditor; `id` es sólo la ruta. */
    platformActionId,
    /** Dashboard donde se muestra. El nodo de Martín es /demo/usuario. */
    nodeKey: 'usuario',
    categoryId: 'energia',
    sequence: n,
    title: `Factura EDESUR · Período liquidado ${period}`,
    subtitle,
    date,
    dateLabel,
    status: ACTION_STATUS.VERIFIED,
    verificationDepth: 'HIGH',
    sesAfter,
    provenance,

    /* Fixture de demo, no consumo institucional real.
       config/demo_data_policy.json del Implementation Package. */
    dataMode: DATA_MODE.DEMO,
    owner: 'demo_fixture',
    institutionAttribution: 'simulated',

    /* ── Sobre común a toda acción del nodo ──────────────────
       `metric` es qué se midió y `outcome` qué resultó. Existen para que el
       listado, el timeline, la auditoría y los reportes puedan tratar a una
       factura y a un viaje en bici con el mismo código, sin que ninguna de las
       dos tenga que fingir campos de la otra. */
    metric: {
      label: 'Consumo',
      value: consumption,
      unit: 'kWh/día',
      status: STEP_STATUS.COMPLETE,
    },
    outcome: {
      label: 'vs. línea base',
      value: deltaPct,
      unit: '%',
      deltaPct,
      direction: deltaPct === 0 ? 'baseline' : deltaPct < 0 ? 'reduction' : 'increase',
      status: STEP_STATUS.COMPLETE,
    },

    /** La ficha de una acción de energía vive en el módulo de acciones. */
    detailPath: { module: 'acciones', query: null },

    // ── Paso 1 · Factura (evidencia original)
    evidence: {
      kind: 'Factura de electricidad',
      provider: 'EDESUR',
      format: 'PDF',
      receivedAt: date,
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 2 · Consumo
    consumption: {
      value: consumption,
      unit: 'kWh/día',
      periodDays,
      totalKwh,
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 3 · Baseline
    baseline: {
      value: baseline,
      unit: 'kWh/día',
      method: BASELINE_METHOD[baselineStrategy] ?? baselineStrategy,
      strategy: baselineStrategy,
      confidence: baselineConfidence,
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 4 · Resultado
    result: {
      deltaPct,
      direction: deltaPct === 0 ? 'baseline' : deltaPct < 0 ? 'reduction' : 'increase',
      savedPerDay: baseline - consumption, // >0 ahorro, <0 exceso
      unit: 'kWh/día',
      status: STEP_STATUS.COMPLETE,
    },

    // ── Paso 5 · SES
    ses: {
      delta: sesDelta,
      band: sesBand,
      label: SES_BANDS.find((b) => b.id === sesBand)?.label ?? null,
      status: sesDelta === null ? STEP_STATUS.PENDING : STEP_STATUS.COMPLETE,
    },

    // ── Paso 6 · MRV
    mrv: {
      status: STEP_STATUS.COMPLETE,
      standard: 'Sustain MRV v1',
      verifier: 'Sustain Protocol · Verificación automatizada',
      verifiedAt: date,
    },

    // ── Pasos 7-9 · Hash, CID, Blockchain
    anchor: anchorOf(id, hash),

    // ── Paso 10 · Reportes + Data Room (§ 3)
    dataRoom: energyDataRoom(n, { hash }),
  };
}

export const ACTIONS = [
  energyAction({
    n: 1, id: 'act_martin_energia_01', platformActionId: 'spa_211f1b27ff7d007baa0247b7',
    date: '2025-11-14', dateLabel: '14 Nov 2025', period: 1,
    subtitle: 'Primer baseline provisional',
    totalKwh: 308, periodDays: 31, consumption: 9.935484,
    baseline: 9.935484, baselineStrategy: 'first_invoice_provisional', baselineConfidence: 35,
    reductionPercent: 0.0, sesDelta: 0, sesAfter: 0, sesBand: 'baseline_established',
    provenance: SOURCE,
  }),
  energyAction({
    n: 2, id: 'act_martin_energia_02', platformActionId: 'spa_9ad673fc37f2b922acb05cb9',
    date: '2025-12-18', dateLabel: '18 Dic 2025', period: 2,
    subtitle: '311 kWh en 35 días',
    totalKwh: 311, periodDays: 35, consumption: 8.885714,
    baseline: 9.935484, baselineStrategy: 'first_invoice_provisional', baselineConfidence: 45,
    reductionPercent: 10.565867, sesDelta: 0, sesAfter: 0, sesBand: 'significant_reduction',
    provenance: SOURCE,
  }),
  energyAction({
    n: 3, id: 'act_martin_energia_03', platformActionId: 'spa_b6870fd910f62c082033098d',
    date: '2026-01-20', dateLabel: '20 Ene 2026', period: 3,
    subtitle: '513 kWh en 32 días',
    totalKwh: 513, periodDays: 32, consumption: 16.03125,
    baseline: 11.617483, baselineStrategy: 'average_first_3', baselineConfidence: 65,
    reductionPercent: -37.992455, sesDelta: -30, sesAfter: -30, sesBand: 'moderate_increase',
    provenance: SOURCE,
  }),
  energyAction({
    n: 4, id: 'act_martin_energia_04', platformActionId: 'spa_8f2f331331f1c26535f54f6d',
    date: '2026-02-20', dateLabel: '20 Feb 2026', period: 4,
    subtitle: '277 kWh en 31 días',
    totalKwh: 277, periodDays: 31, consumption: 8.935484,
    baseline: 11.617483, baselineStrategy: 'average_first_3', baselineConfidence: 65,
    reductionPercent: 23.085887, sesDelta: 40, sesAfter: 10, sesBand: 'exceptional_reduction',
    provenance: SOURCE,
  }),
  energyAction({
    n: 5, id: 'act_martin_energia_05', platformActionId: 'spa_8b9bcd5cd034356756aefbe9',
    date: '2026-03-19', dateLabel: '19 Mar 2026', period: 5,
    subtitle: '256 kWh en 28 días',
    totalKwh: 256, periodDays: 28, consumption: 9.142857,
    baseline: 11.617483, baselineStrategy: 'average_first_3', baselineConfidence: 65,
    reductionPercent: 21.300879, sesDelta: 40, sesAfter: 50, sesBand: 'exceptional_reduction',
    provenance: SOURCE,
  }),
  energyAction({
    n: 6, id: 'act_martin_energia_06', platformActionId: 'spa_1d4967a1d22647ba47723787',
    date: '2026-04-21', dateLabel: '21 Abr 2026', period: 6,
    subtitle: '313 kWh en 32 días',
    totalKwh: 313, periodDays: 32, consumption: 9.78125,
    baseline: 11.617483, baselineStrategy: 'rolling_6_invoice_average', baselineConfidence: 82,
    reductionPercent: 15.805773, sesDelta: 30, sesAfter: 80, sesBand: 'outstanding_reduction',
    provenance: SOURCE,
  }),
  energyAction({
    n: 7, id: 'act_martin_energia_07', platformActionId: 'spa_84a2866eb4142b954e00c890',
    date: '2026-05-19', dateLabel: '19 May 2026', period: 7,
    subtitle: '480 kWh en 29 días',
    totalKwh: 480, periodDays: 29, consumption: 16.551724,
    baseline: 10.452007, baselineStrategy: 'rolling_6_invoice_average', baselineConfidence: 84,
    reductionPercent: -58.359289, sesDelta: -30, sesAfter: 50, sesBand: 'major_increase',
    provenance: SOURCE,
  }),
  energyAction({
    n: 8, id: 'act_martin_energia_08', platformActionId: 'spa_c29d7a929bb619785137bcda',
    date: '2026-06-22', dateLabel: '22 Jun 2026', period: 8,
    subtitle: '618 kWh en 31 días',
    totalKwh: 618, periodDays: 31, consumption: 19.935484,
    baseline: 11.554713, baselineStrategy: 'rolling_6_invoice_average', baselineConfidence: 86,
    reductionPercent: -72.531191, sesDelta: -30, sesAfter: 20, sesBand: 'major_increase',
    hash: '39f6dade1763705ec3b59146efb14b1bfc43374372deaa87683511d57d43f47f',
    provenance: { ...SOURCE, hash: 'source' },
  }),

  /* ── Botella de Amor ──────────────────────────────────────
     Llegó el paquete el 25 de julio y con él se cierra el hueco que estaba
     declarado en MISSING_ACTION_PACKAGES. Es la novena acción del nodo y la
     que explica el salto de SES 20 → 23 entre energía y movilidad. */
  plasticRecoveryAction(),
];

/* ============================================================
   RECUPERACIÓN DE PLÁSTICO — Botella de Amor
   ============================================================
   Fuente: dashboard_sync_plastic_recovery_2026-07-25_spa4e06c6fd.json

   No es una factura ni un viaje: se mide en botellas y kilos. Usa el mismo
   sobre común (`metric` / `outcome`) para poder convivir con las otras dos en
   el listado, el timeline, la auditoría y los reportes.
   ============================================================ */
function plasticRecoveryAction() {
  const id = 'act_martin_plastico_01';
  return {
    id,
    kind: ACTION_KIND.PLASTIC,
    nodeId: NODE,
    platformActionId: 'spa_4e06c6fde698bad1dc6c99be',
    nodeKey: 'usuario',
    categoryId: 'botellasDeAmor',
    sequence: 9,
    title: 'Botella de Amor preparada',
    subtitle: '1 botella de 1,5 L, 0,3 kg, con evidencia reforzada',
    date: '2026-07-25',
    dateLabel: '25 Jul 2026',
    status: ACTION_STATUS.VERIFIED,
    verificationDepth: 'HIGH',
    sesAfter: 23,

    /* Dato productivo del nodo, con evidencia. No es fixture. */
    dataMode: DATA_MODE.PRODUCTION,
    owner: NODE,
    institutionAttribution: 'none',
    provenance: SOURCE,

    metric: {
      label: 'Plástico preparado',
      value: 0.3,
      unit: 'kg',
      status: STEP_STATUS.COMPLETE,
    },
    outcome: {
      label: 'Botellas preparadas',
      value: 1,
      unit: 'botella',
      /* Una botella no se compara contra una línea base de consumo propio.
         `null` es el dato correcto, no un hueco. */
      deltaPct: null,
      direction: 'baseline',
      status: STEP_STATUS.COMPLETE,
    },
    baseline: {
      value: null,
      unit: null,
      method: 'Baseline inicial de actividad',
      strategy: 'initial_activity_baseline',
      confidence: null,
      status: STEP_STATUS.COMPLETE,
    },

    detailPath: { module: 'acciones', query: null },

    evidence: {
      kind: 'Evidencia reforzada de preparación',
      provider: 'Sustain Love Bottle',
      format: 'Paquete',
      receivedAt: '2026-07-25',
      status: STEP_STATUS.COMPLETE,
    },

    /* `user_measured_with_evidence`: lo pesó el usuario y lo respaldó con
       evidencia. Se dice así y no como medición instrumental. */
    measurementStatus: 'user_measured_with_evidence',
    capacityLiters: 1.5,

    ses: {
      delta: 3,
      band: null,
      label: 'Preparación verificada',
      status: STEP_STATUS.COMPLETE,
    },

    mrv: {
      status: STEP_STATUS.COMPLETE,
      standard: 'Sustain MRV v1',
      verifier: 'Sustain Protocol · profundidad HIGH',
      verifiedAt: '2026-07-25',
    },

    anchor: {
      hash: null,
      hashStatus: STEP_STATUS.PENDING,
      algorithm: 'SHA-256',
      cid: 'bafybeiac52bn4fiz3l443rkf6qeh67wpmp6sg5biyt6zbsi656mxnle5ue',
      cidStatus: STEP_STATUS.COMPLETE,
      tx: '0xe3725532f78bf2813b7f42fa03442c47a7df01908e4eb850baceb51955c387e4',
      chainId: 56,
      network: 'BNB Smart Chain Mainnet',
      contract: REGISTRY_CONTRACT,
      anchorMethod: 'anchorAction(string,string)',
      chainStatus: STEP_STATUS.COMPLETE,
      blockNumber: null,
      timestamp: null,
      proofValidationStatus: 'PARTIAL',
    },

    dataRoom: {
      evidence: [
        { name: 'evidencia_botella_de_amor.jpg', type: 'jpeg', label: 'Botella preparada', redacted: false },
      ],
      artifacts: [
        { name: 'love_bottle_record.json', type: 'json', label: 'Registro de preparación' },
        { name: 'ses_score.json', type: 'json', label: 'SES Score' },
      ],
      reports: [
        { name: 'action_report.pdf', type: 'pdf', label: 'Action Report', status: STEP_STATUS.COMPLETE },
      ],
      redactedFields: ['domicilio de recolección'],
      hash: null,
    },
  };
}

/* Todos los valores de las 9 acciones salen del DASHBOARD_SYNC correspondiente.
   Ya no queda nada reconstruido ni inferido en este archivo. */

/* ============================================================
   ACCIONES CONOCIDAS SIN PAQUETE — no inventar
   ============================================================
   Vacío desde el 28 ago 2026: llegó el paquete de Botella de Amor y con él se
   cerró el único hueco declarado. Las 14 acciones del node_state son ahora
   8 de energía + 1 de plástico + 5 de movilidad, todas con paquete.

   La lista se mantiene porque es el mecanismo correcto para declarar un hueco:
   si mañana el nodo declara una acción cuyo paquete no llegó, se agrega acá y
   la UI lo dice en vez de mostrar un total que no cierra.

   Martín va a revisar RECYCLING, CLEANUP y COMPOST; si aparecen acciones ahí,
   sólo se incorporan contra su paquete fuente, nunca por existir la carpeta.
   ============================================================ */
export const MISSING_ACTION_PACKAGES = [];

/* ============================================================
   DERIVACIONES — una sola fuente, cuatro vistas
   ============================================================ */

/**
 * § 2 Mis Acciones — la cadena de 10 pasos de la ficha.
 *
 * Los pasos 5 a 10 (SES, MRV, Hash, CID, Blockchain, Reportes) son idénticos
 * para cualquier acción: son el pipeline. Los cuatro primeros dependen de qué
 * se midió, y por eso se arman según el tipo.
 */
export function buildTraceability(action) {
  const { ses, mrv, anchor, dataRoom } = action;
  return [
    ...evidenceChain(action),
    { step: 5, key: 'ses', label: 'SES', value: ses.delta === null ? 'Pendiente' : `${ses.delta > 0 ? '+' : ''}${ses.delta}`, status: ses.status },
    { step: 6, key: 'mrv', label: 'MRV', value: mrv.standard, status: mrv.status },
    { step: 7, key: 'hash', label: 'Hash', value: anchor.hash, status: anchor.hashStatus },
    { step: 8, key: 'cid', label: 'CID', value: anchor.cid, status: anchor.cidStatus },
    { step: 9, key: 'chain', label: 'Blockchain', value: anchor.tx, status: anchor.chainStatus },
    { step: 10, key: 'reports', label: 'Reportes', value: `${dataRoom.reports.length} documentos`, status: STEP_STATUS.COMPLETE },
  ];
}

/** Pasos 1-4. Lo único que cambia entre una factura y un viaje. */
function evidenceChain(action) {
  const { evidence, baseline, metric, outcome } = action;

  if (action.kind === ACTION_KIND.MOBILITY) {
    return [
      { step: 1, key: 'evidence', label: 'Evidencia', value: `${evidence.provider} · ${evidence.format}`, status: evidence.status },
      { step: 2, key: 'metric', label: 'Distancia', value: `${metric.value} ${metric.unit}`, status: metric.status },
      { step: 3, key: 'baseline', label: 'Baseline', value: baseline.method, status: baseline.status },
      { step: 4, key: 'result', label: 'CO₂e evitado', value: `${outcome.value} ${outcome.unit}`, status: outcome.status },
    ];
  }

  return [
    { step: 1, key: 'evidence', label: 'Factura', value: `${evidence.provider} · ${evidence.format}`, status: evidence.status },
    { step: 2, key: 'metric', label: 'Consumo', value: `${metric.value} ${metric.unit}`, status: metric.status },
    { step: 3, key: 'baseline', label: 'Baseline', value: `${baseline.value} ${baseline.unit}`, status: baseline.status },
    { step: 4, key: 'result', label: 'Resultado', value: `${outcome.deltaPct > 0 ? '+' : ''}${outcome.deltaPct}%`, status: outcome.status },
  ];
}

/** § 5 Timeline — los 6 hitos del brief, sobre el mismo objeto. */
export function buildTimeline(action) {
  const { evidence, mrv, anchor, ses, dateLabel } = action;
  return [
    { key: 'action', label: 'Acción registrada', detail: action.title, at: dateLabel, status: evidence.status },
    { key: 'validation', label: 'Validación', detail: mrv.verifier, at: dateLabel, status: mrv.status },
    { key: 'hash', label: 'Hash', detail: anchor.hash ?? 'Pendiente de cálculo', at: null, status: anchor.hashStatus },
    { key: 'ipfs', label: 'IPFS', detail: anchor.cid ?? 'Pendiente de anclaje', at: null, status: anchor.cidStatus },
    { key: 'blockchain', label: 'Blockchain', detail: anchor.tx ?? 'Pendiente de anclaje', at: null, status: anchor.chainStatus },
    { key: 'ses', label: 'Actualización del SES', detail: ses.delta === null ? 'Pendiente' : `${ses.delta > 0 ? '+' : ''}${ses.delta} pts`, at: dateLabel, status: ses.status },
  ];
}

/* ============================================================
   UNIVERSO CANÓNICO DE ACCIONES
   ============================================================
   Una sola lista para todas las pantallas del nodo. Antes cada una armaba la
   suya: Mis Acciones, Timeline, Auditoría, Reportes e Identity leían las 8
   facturas de energía, y Movilidad leía sus 5 viajes por su cuenta. Resultado:
   el dashboard decía "8 acciones" cuando el nodo declara 14 y el módulo de al
   lado mostraba 5 más.

   `NODE_ACTIONS` es la unión. `ACTIONS` sigue siendo sólo energía, porque hay
   agregados —ahorro en kWh, series de consumo— que sólo tienen sentido sobre
   acciones de energía y que romperían si les entrara un viaje en bici.

   Las 14 del node_state.json = 8 energía + 5 movilidad + 1 de recuperación de
   plástico, esta última declarada en MISSING_ACTION_PACKAGES porque no llegó su
   paquete. 13 + 1 hueco explícito, no 14 fabricadas.
   ============================================================ */

export const NODE_ACTIONS = [...ACTIONS, ...MOBILITY_AS_ACTIONS];

/* ── Consultas ────────────────────────────────────────────── */

export const getAction = (id) => NODE_ACTIONS.find((a) => a.id === id) ?? null;

/** Paquetes declarados por el nodo que todavía no llegaron. */
export const missingPackagesForNode = (node) => {
  const key = dashboardKeyOf(node);
  return key ? MISSING_ACTION_PACKAGES.filter((m) => m.nodeKey === key) : [];
};

/**
 * Acciones Sustain de un nodo del dashboard.
 *
 * Recibe el nodo entero y no un slug porque el usuario final no tiene slug
 * (es un solo nodo, no una colección) — `dashboardKeyOf` resuelve ese caso.
 * Antes esto se llamaba `actionsByNode(node.slug)` y devolvía las 8 facturas
 * para Montessori, que era justamente la atribución equivocada.
 *
 * Un nodo sin acciones Sustain devuelve `[]`, que es un estado legítimo y no
 * un error: hoy es el caso de Montessori, que sólo tiene histórico documental.
 */
export const actionsForNode = (node) => {
  const key = dashboardKeyOf(node);
  return key ? NODE_ACTIONS.filter((a) => a.nodeKey === key) : [];
};

/** Acciones de energía de un nodo. Para los agregados que sólo aplican ahí. */
export const energyActionsForNode = (node) =>
  actionsForNode(node).filter((a) => a.kind === ACTION_KIND.ENERGY);

export const actionsByCategory = (categoryId) => ACTIONS.filter((a) => a.categoryId === categoryId);

/** Acciones más recientes primero. No muta el array original. */
export const recentActions = (limit = 4) =>
  [...ACTIONS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

/**
 * Ahorro acumulado en los períodos de reducción, en kWh/día.
 * Devuelve null en kWh totales hasta que se carguen los periodDays reales.
 * Referencia canónica (node_state.json): 211.190949 kWh acumulados.
 *
 * Sólo mira acciones de energía: desde que el nodo tiene movilidad y plástico,
 * `ACTIONS` ya no es homogéneo y `a.result` no existe en todas.
 */
export function totalSavings(actions = ACTIONS) {
  const energy = actions.filter((a) => a.categoryId === 'energia');
  const perDay = energy
    .filter((a) => a.result.direction === 'reduction')
    .reduce((sum, a) => sum + a.result.savedPerDay, 0);
  const hasAllDays = energy.every((a) => a.consumption.periodDays !== null);
  return {
    perDay: Number(perDay.toFixed(2)),
    totalKwh: hasAllDays
      ? energy.reduce((s, a) => s + Math.max(0, a.result.savedPerDay) * a.consumption.periodDays, 0)
      : null,
    declaredTotalKwh: 211.190949,
  };
}
