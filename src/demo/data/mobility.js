/* ============================================================
   MÓDULO MOVILIDAD — 5 viajes verificados
   ============================================================
   Fase 7 · 18 ago 2026

   Fuente: drive-files/Sustain_Mobility_Agency_Handoff_2026-08-13/
   Contrato: 01_dashboard/dashboard_sync.json

   ------------------------------------------------------------
   ⚠ NO RECALCULAR NADA DE ESTO EN FRONTEND
   ------------------------------------------------------------
   El brief de la agencia es explícito: los valores canónicos ya vienen
   calculados y el frontend no los recalcula. Todo lo de abajo está copiado
   literal del dashboard_sync y de los cinco paquetes.

     5 acciones de movilidad · 44.87 km · 1.687112 kg CO2e · SES 23 → 35
     MRV-M1_EVIDENCE_BACKED · verification_depth MEDIUM
     Genesis baseline = Trip 01 (por eso su ses_delta es 0)

   ------------------------------------------------------------
   STRAVA NO ES EL PRODUCTO
   ------------------------------------------------------------
   «Strava NO es la solución ni una dependencia del producto. En este piloto es
    solamente la fuente de evidencia. Sustain tiene que quedar agnóstico al
    proveedor.»

   Por eso `sourceProvider` es un campo del dato y no una condición en el
   código: mañana la misma vista sirve para Garmin, Apple Health, un GPX o una
   API institucional sin tocar un componente. El adaptador declara qué campos
   normalizados necesita y ninguno es específico de Strava.

   ------------------------------------------------------------
   ⚠ ANCLAJE: DEMO / SIMULADO
   ------------------------------------------------------------
   Los cinco viajes tienen `ipfs_cid: "pending"` y `chain_anchor_tx: "pending"`.
   No hay CID ni transacción reales. El brief lo prohíbe expresamente:

     «Do NOT invent or hardcode fake CIDs or transaction hashes and present them
      as real.»

   Lo que sí es real es el SHA-256 de cada evidencia. Los cinco se verificaron
   con `sha256sum` contra los JPEG copiados a public/evidence/mobility/ y
   coinciden con lo que declara el action_report de cada paquete, así que la
   integridad que muestra la ficha es comprobable, no decorativa. La red y el contrato también
   son reales; lo que no ocurrió todavía es el anchor.
   ============================================================ */

export const MOBILITY_MODULE = {
  standard: 'SAS-MOBILITY-001',
  version: '1.0',
  nodeId: 'spn_01ee6583da858ca1fa19323d',
  nodeKey: 'usuario',
  genesisBaselineActionId: 'spa_0edd3a757c582d3152a79010',
  sourceProviderCurrentPilot: 'Strava',
};

/** Totales canónicos del dashboard_sync. No se derivan de la lista. */
export const MOBILITY_TOTALS = {
  verifiedDistanceKm: 44.87,
  bikeKm: 44.87,
  ebikeKm: 0,
  electricScooterKm: 0,
  electricVehicleKm: 0,
  publicTransportKm: 0,
  estimatedCo2eAvoidedKg: 1.687112,
  actions: 5,
  mrvClass: 'MRV-M1_EVIDENCE_BACKED',
  verificationDepth: 'MEDIUM',
  sesFrom: 23,
  sesTo: 35,
};

/** Metodología de carbono. Textual del action_report, incluidas sus limitaciones. */
export const CARBON_METHODOLOGY = {
  id: 'SUSTAIN-MOBILITY-CARBON',
  version: '1.0',
  status: 'active_pilot',
  formula: 'distancia verificada × max(factor de referencia − factor del modo, 0)',
  referenceMode: 'Autocar térmico',
  referenceFactor: 0.0376,
  referenceFactorLabel: '0,0376 kg CO₂e/pasajero-km',
  sourceFamily: 'ADEME · Base Empreinte / Impact CO₂',
  resultType: 'Estimación modelada, no una medición directa',
  antiInflationRule: 'El usuario no elige contra qué vehículo se compara',
  /* La tabla completa de factores del deck de La Caja. Sirve para explicar por
     qué un auto eléctrico no genera ahorro contra el baseline. */
  factors: [
    { mode: 'Bicicleta mecánica', factor: '0 g CO₂e/km', note: 'Acción física · factor piloto 0' },
    { mode: 'Bicicleta eléctrica', factor: '11 g CO₂e/km', note: 'Incluye fabricación + uso' },
    { mode: 'Monopatín eléctrico', factor: '24,9 g CO₂e/km', note: 'Incluye fabricación + uso' },
    { mode: 'Autocar térmico · referencia', factor: '37,6 g CO₂e/km', note: 'Baseline conservador uniforme', isBaseline: true },
    { mode: 'Scooter eléctrico', factor: '59,3 g CO₂e/km', note: 'No se considera cero impacto' },
    { mode: 'Auto eléctrico · promedio', factor: '67,4 g CO₂e/km', note: 'No genera ahorro vs. baseline de 37,6' },
  ],
  limitations: [
    'Estimación modelada estandarizada, no una medición ni una afirmación sobre el contrafáctico real del usuario.',
    'Los factores ADEME son referencias de ciclo de vida de base francesa, usadas por comparabilidad; no son un inventario argentino.',
    'Los cálculos institucionales se mantienen separados y versionados.',
  ],
  /* Reservado para La Caja u otra institución. Deshabilitado por contrato:
     una metodología institucional nunca sobrescribe la canónica. */
  institutional: { enabled: false, note: 'Reservado para una metodología institucional documentada. Nunca sobrescribe el resultado canónico de Sustain.' },
};

/** Estado de anclaje. DEMO explícito — ver la nota de la cabecera. */
export const ANCHOR_STATE = {
  mode: 'demo_simulated',
  network: 'BNB Smart Chain Mainnet',
  chainId: 56,
  contract: '0x141cc96351d622fcf26fAA40E0fd2a1ba8D25e1B',
  anchorMethod: 'anchorAction(string,string)',
  realCid: null,
  realTransactionHash: null,
  warning: 'Los cinco paquetes todavía no tienen CID ni transacción reales. El estado se muestra como DEMO/simulado; no se fabrican identificadores.',
};

/** Topes de la política SES de movilidad. */
export const SES_POLICY = {
  name: 'Mobility_SES_v1.0',
  version: '1.0',
  scale: { min: 0, max: 1000, scope: 'cumulative_node_score' },
  mode: 'score_only',
  rewardEnabled: false,
  caps: {
    perTrip: 3,
    perDay: 6,
    rolling30d: 30,
    historicalContribution: 250,
  },
  genesisRule: 'La primera acción verificada de una categoría crea su Genesis Baseline y recibe SES delta 0.',
};

/* Duración legible sin recalcular nada: los segundos son el dato canónico. */
const hms = (s) => {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${String(r).padStart(2, '0')}s`;
};

/**
 * Los 5 viajes.
 *
 * `sha256` es el hash de la evidencia primaria, tomado del action_report de
 * cada paquete — es real y verificable contra el JPEG de public/evidence.
 * `packageHash` es el hash.txt del paquete completo.
 */
export const MOBILITY_ACTIONS = [
  {
    id: 'spa_0edd3a757c582d3152a79010',
    seq: 1,
    date: '2026-07-14',
    startedAt: '2026-07-14T08:54:00-03:00',
    timeLabel: '08:54',
    distanceKm: 6.75,
    durationSeconds: 1512,
    positiveElevationM: 13,
    avgSpeedKmh: 16.071429,
    maxSpeedKmh: null,
    co2eAvoidedKg: 0.2538,
    sesDelta: 0,
    sesBefore: 23,
    sesAfter: 23,
    isGenesis: true,
    evidence: '/evidence/mobility/trip01.jpeg',
    sha256: 'ad5fd7ef1525f7ee3310a297f54abb79687b78be146fd58ab834d9a496ef17d0',
    packageHash: 'cbe66d93ea4602846807e154a678c938f3f2be289f9e83f96d799af777330c2f',
    sourceActivityId: 'strava:share:HtgW0K9BL4b',
    sourceLink: 'https://strava.app.link/HtgW0K9BL4b',
  },
  {
    id: 'spa_35831395935610722fe0a60c',
    seq: 2,
    date: '2026-07-14',
    startedAt: '2026-07-14T17:53:00-03:00',
    timeLabel: '17:53',
    distanceKm: 5.77,
    durationSeconds: 1345,
    positiveElevationM: 17,
    avgSpeedKmh: 15.443866,
    maxSpeedKmh: null,
    co2eAvoidedKg: 0.216952,
    sesDelta: 3,
    sesBefore: 23,
    sesAfter: 26,
    isGenesis: false,
    evidence: '/evidence/mobility/trip02.jpeg',
    sha256: 'f3a3991e399010451fc218a5f52001f6e51d712650936c39c9441daae19e78ee',
    packageHash: '80a95dbe943a8f6e8cf0e4fad7d75620a830b2da9893d94b40f91514c81726c9',
    sourceActivityId: null,
    sourceLink: null,
  },
  {
    id: 'spa_192f38f6fc7dc2ef7126e968',
    seq: 3,
    date: '2026-07-22',
    startedAt: '2026-07-22T14:13:00-03:00',
    timeLabel: '14:13',
    distanceKm: 12.81,
    durationSeconds: 2769,
    positiveElevationM: 37,
    avgSpeedKmh: 16.7,
    maxSpeedKmh: 39.0,
    co2eAvoidedKg: 0.481656,
    sesDelta: 3,
    sesBefore: 26,
    sesAfter: 29,
    isGenesis: false,
    evidence: '/evidence/mobility/trip03.jpeg',
    sha256: 'f204e3b493586a90c71c14ca962f11a83ad9ae53f31a0a6e57f5fd2ea3375fb4',
    packageHash: '814caec170e6b9ea2ebe7faf55075dbe8b89a93d3792d4b588da06142a53cb8d',
    sourceActivityId: null,
    sourceLink: null,
  },
  {
    id: 'spa_03db3349747def3e81f826e0',
    seq: 4,
    date: '2026-07-22',
    startedAt: '2026-07-22T18:26:00-03:00',
    timeLabel: '18:26',
    distanceKm: 12.26,
    durationSeconds: 2917,
    positiveElevationM: 35,
    avgSpeedKmh: 15.1,
    maxSpeedKmh: 31.1,
    co2eAvoidedKg: 0.460976,
    sesDelta: 3,
    sesBefore: 29,
    sesAfter: 32,
    isGenesis: false,
    evidence: '/evidence/mobility/trip04.jpeg',
    sha256: '5175183d37bc0039a316c845dab56d1202313cb414ea0f1c32602a540c74f817',
    packageHash: 'f7bd7db22e6d1ada2adf6739b6b3a347b9bfea2d315c52a40b37552757f703b2',
    sourceActivityId: null,
    sourceLink: null,
  },
  {
    id: 'spa_c03de1ab230a245c73d79796',
    seq: 5,
    date: '2026-07-27',
    startedAt: '2026-07-27T17:38:00-03:00',
    timeLabel: '17:38',
    distanceKm: 7.28,
    durationSeconds: 1693,
    positiveElevationM: 20,
    avgSpeedKmh: 15.480213,
    maxSpeedKmh: null,
    co2eAvoidedKg: 0.273728,
    sesDelta: 3,
    sesBefore: 32,
    sesAfter: 35,
    isGenesis: false,
    evidence: '/evidence/mobility/trip05.jpeg',
    sha256: '09901b0082484e15e9deccc1b565735f5e5e28e3650a36d2f785c364aed26dc8',
    packageHash: '0da50d1bc97ec5972a9d414b66ad976b27853ca7ddf77159381adb6650d266ae',
    sourceActivityId: null,
    sourceLink: null,
  },
].map((t) => ({
  ...t,
  transportMode: 'traditional_bicycle',
  transportModeLabel: 'Bicicleta mecánica',
  sourceProvider: 'Strava',
  sourceType: 'third_party_activity_tracker',
  city: 'Buenos Aires',
  country: 'AR',
  privacyMode: 'LIMITED',
  mrvClass: 'MRV-M1_EVIDENCE_BACKED',
  verificationDepth: 'MEDIUM',
  status: 'verified',
  durationLabel: hms(t.durationSeconds),
  /* pending en la fuente, no un hueco de la demo. */
  ipfsCid: null,
  chainAnchorTx: null,
}));

/**
 * Controles de validación del mrv_report. Los mismos siete para los cinco
 * viajes; el que cambia por viaje es el de velocidad, que cita el valor real.
 */
export const validationChecks = (trip) => [
  { label: 'Integridad SHA-256', pass: true },
  { label: 'Fecha y hora visibles en la evidencia', pass: true },
  { label: 'Distancia y duración visibles', pass: true },
  { label: 'Modo de transporte visible', pass: true },
  { label: 'Mapa de ruta visible', pass: true },
  {
    label: trip.maxSpeedKmh
      ? `Velocidad plausible · media ${trip.avgSpeedKmh.toFixed(1)} km/h, máxima ${trip.maxSpeedKmh} km/h`
      : `Velocidad plausible · media ${trip.avgSpeedKmh.toFixed(1)} km/h`,
    pass: true,
  },
  /* Se declara lo que NO se verificó. Es la diferencia entre MRV-M1 y un nivel
     superior, y ocultarla sería vender más verificación de la que hay. */
  { label: 'Verificación directa contra la API del proveedor', pass: false },
];

export const getTrip = (id) => MOBILITY_ACTIONS.find((t) => t.id === id) ?? null;
