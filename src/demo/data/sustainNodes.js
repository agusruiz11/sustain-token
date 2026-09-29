/* ============================================================
   NODOS SUSTAIN CANÓNICOS — registro de identidad
   ============================================================
   Resuelve el problema que planteó Martín en el audio del 14 ago 2026:

     "Capaz que tendríamos que revisar cómo están recibiendo ustedes los datos
      por nodo para identificar que son mías. Voy a ver si les agrego un nombre
      inicial a cada nodo... por el número SPN no termina de quedar todo
      clarísimo."

   Un `spn_…` por sí solo no dice de quién es. Este archivo le pone nombre,
   tipo y dueño a cada nodo del protocolo, y es la única fuente que define a
   qué dashboard pertenece cada acción.

   ------------------------------------------------------------
   ⚠ CORRECCIÓN DE ATRIBUCIÓN — 18 ago 2026
   ------------------------------------------------------------
   Hasta esta fecha el repo atribuía el nodo spn_01ee6583da858ca1fa19323d a
   Montessori School. Es INCORRECTO. La fuente canónica
   (drive-files/Sustain_Mobility_Agency_Handoff_2026-08-13/
    02_canonical_source/node_state.json) dice:

       "node_type": "individual",
       "owner": "MARTIN PABLO CERON",
       "wallet_status": "founder_wallet"

   Ese nodo es la persona física, no la escuela. Sus 14 acciones verificadas
   son 8 de energía + 1 de recuperación de plástico + 5 de movilidad, y las 8
   facturas EDESUR son fixtures de demo de Martín y familiares — no consumos
   reales de Montessori.

   Montessori NO tiene todavía un nodo Sustain con acciones verificadas. Su
   dashboard se alimenta del histórico institucional documentado, que es
   justamente lo que pide el Entregable 3.
   ============================================================ */

/** Modo de dato. `config/demo_data_policy.json` del Implementation Package. */
export const DATA_MODE = {
  /** Dato productivo de un nodo real. */
  PRODUCTION: 'production',
  /** Fixture de demostración. No alimenta KPI oficiales ni SES institucional. */
  DEMO: 'demo',
};

/**
 * Nodos del protocolo. La clave es el `node_id` canónico (SPN) tal como viene
 * en los paquetes de Martín; nunca se inventa uno nuevo.
 */
export const SUSTAIN_NODES = {
  spn_01ee6583da858ca1fa19323d: {
    nodeId: 'spn_01ee6583da858ca1fa19323d',
    /** Nombre corto para identificarlo sin leer el SPN. */
    displayName: 'Martín Ceron',
    owner: 'MARTIN PABLO CERON',
    nodeType: 'individual',
    country: 'AR',
    wallet: '0xB4E8004E4047838c9fd8d4e2a0ba12791935b758',
    walletStatus: 'founder_wallet',
    verificationStatus: 'verified',
    createdAt: '2025-11-14',

    /** Dashboard donde vive: /demo/usuario. */
    dashboardKey: 'usuario',

    /* ── Estado canónico · node_state.json (13 ago 2026) ──
       No recalcular en frontend. Si cambia, cambia el archivo fuente. */
    ses: {
      current: 35,
      previous: 32,
      lastDelta: 3,
      scale: { min: 0, max: 1000, scope: 'cumulative_node_score' },
      mode: 'score_only',
      rewardEnabled: false,
      policyName: 'Mobility_SES_v1.0',
      policyVersion: '1.0',
      lastUpdate: '2026-08-13T02:27:53-03:00',
    },
    level: { name: 'Verified', ordinal: 1 },
    environmentalIdentityLevel: 'Level 1 — Verified Participant',

    activity: {
      totalActions: 14,
      verifiedActions: 14,
      byModule: { energy: 8, plastic_recovery: 1, mobility: 5 },
    },

    lifetime: {
      electricityKwhSaved: 211.190949,
      co2EstimatedKg: 1.687112,
      mobilityCo2eAvoidedEstimatedKg: 1.687112,
      bikeKm: 44.87,
      loveBottlesPrepared: 1,
      plasticPreparedKg: 0.3,
    },

    badges: [
      { code: 'FIRST_VERIFIED_ENERGY_RECORD', date: '2025-11-14' },
      { code: 'FIRST_VERIFIED_MOBILITY_RECORD', date: '2026-07-14' },
    ],

    source: 'drive-files/Sustain_Mobility_Agency_Handoff_2026-08-13/02_canonical_source/node_state.json',
  },

  /* ── Colegio Ana María Montessori — nodo institucional ──
     Entrega 05_INSTITUTIONS del 28 sep 2026. Hasta esa fecha la escuela no
     tenía nodo Sustain: sólo histórico documental. El registro de Sustain lo
     confirma como nuevo ("confirmed_new_by_operator_2026-09-27; no prior
     Montessori node"), lo que cierra definitivamente la corrección de
     atribución del 18 ago: las 8 facturas EDESUR son de Martín; esto es lo
     primero real de la escuela.

     Sus 3 acciones son RECORD_ONLY: se registran y se anclan, pero no
     otorgan SES institucional. Por eso `ses.current` es null y no 0. */
  spn_776c056a5d48505e28e48471: {
    nodeId: 'spn_776c056a5d48505e28e48471',
    displayName: 'Colegio Ana María Montessori',
    owner: 'Colegio Ana María Montessori',
    nodeType: 'school',
    country: 'AR',
    wallet: null,
    walletStatus: null,
    verificationStatus: 'active_pilot',
    identityBasis: 'operator-confirmed school label; no legal ID supplied',
    createdAt: '2026-09-27',
    dashboardKey: 'montessori',
    ses: {
      current: null,
      previous: null,
      lastDelta: null,
      scale: { min: 0, max: 1000, scope: 'cumulative_node_score' },
      mode: 'score_only',
      rewardEnabled: false,
      policyName: 'Genesis_SES_v1.0',
      policyVersion: '1.0',
      policyApplied: 'RECORD_ONLY',
      lastUpdate: null,
    },
    level: null,
    environmentalIdentityLevel: null,
    activity: {
      totalActions: 3,
      verifiedActions: 3,
      byModule: { environmental_education: 2, reforestation: 1 },
    },
    lifetime: null,
    badges: [],
    source: 'drive-files/05_INSTITUTIONS/spn_776c056a5d48505e28e48471_Montessori/00_NODE/node_registry_current_v1.2.json',
  },

  /* ── Posicionarte — nodo organización ──
     Misma entrega. Una limpieza comunitaria (30 may 2026, Mar del Plata)
     hecha por dos integrantes de la agencia, que en el paquete figuran con
     seudónimo. Martín la quiere para mostrar que la misma arquitectura sirve
     para una ONG de 100 personas o un grupo que se junta una vez.

     SES: 8 por la acción; 4 a cada participante; 8 al nodo como referencia
     NO aditiva. `ses.current` es esa referencia, no una suma. */
  spn_394da9811c6ea308b5841147: {
    nodeId: 'spn_394da9811c6ea308b5841147',
    displayName: 'Posicionarte',
    owner: 'Posicionarte',
    nodeType: 'organization',
    country: 'AR',
    wallet: null,
    walletStatus: null,
    verificationStatus: 'active_pilot',
    createdAt: '2026-09-21',
    dashboardKey: 'posicionarte',
    ses: {
      current: 8,
      previous: null,
      lastDelta: 8,
      scale: { min: 0, max: 1000, scope: 'cumulative_node_score' },
      mode: 'score_only',
      rewardEnabled: false,
      policyName: 'Cleanup_SES_v1.0',
      policyVersion: '1.0.0',
      policyApplied: 'full_action_score_reference_non_additive',
      lastUpdate: '2026-09-21T09:49:24Z',
    },
    level: null,
    environmentalIdentityLevel: null,
    activity: {
      totalActions: 1,
      verifiedActions: 1,
      byModule: { cleanup: 1 },
    },
    members: [
      { nodeId: 'spn_73dc30a5c6ceb119a2fa8eed', publicLabel: 'Posicionarte Volunteer 01', publicIdentity: false, sesAttributed: 4 },
      { nodeId: 'spn_54a721d09e4e61bc0787ab01', publicLabel: 'Posicionarte Volunteer 02', publicIdentity: false, sesAttributed: 4 },
    ],
    lifetime: null,
    badges: [],
    source: 'drive-files/05_INSTITUTIONS/spn_394da9811c6ea308b5841147_Posicionarte/00_NODE/node_context_from_action.json',
  },
};

/**
 * Instituciones sin nodo Sustain propio todavía.
 *
 * Vacío desde el 28 sep 2026: Montessori pasó a SUSTAIN_NODES con sus tres
 * primeras acciones reales. Se mantiene la lista porque es el mecanismo para
 * declarar una institución que entra al piloto sólo con histórico documental
 * (`historical_import` ≠ `sustain_verified`, regla IR-004).
 */
export const NODES_WITHOUT_SUSTAIN_ACTIONS = {};

/* ── Consultas ────────────────────────────────────────────── */

/**
 * Clave de dashboard de un nodo resuelto por nodes.js.
 * El usuario final no tiene slug (es un solo nodo, no una colección), así que
 * cae en su `nodeTypeId`. Una institución usa su slug.
 */
export const dashboardKeyOf = (node) => node?.slug ?? node?.nodeTypeId ?? null;

/** Nodo canónico que corresponde a un dashboard, o null si no tiene. */
export function sustainNodeFor(node) {
  const key = dashboardKeyOf(node);
  if (!key) return null;
  return Object.values(SUSTAIN_NODES).find((n) => n.dashboardKey === key) ?? null;
}

export const getSustainNode = (nodeId) => SUSTAIN_NODES[nodeId] ?? null;

/** Nombre legible de un SPN. Para no mostrar el id pelado en la UI. */
export const nodeDisplayName = (nodeId) => SUSTAIN_NODES[nodeId]?.displayName ?? nodeId;
