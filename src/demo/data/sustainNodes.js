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
};

/**
 * Instituciones sin nodo Sustain propio todavía.
 *
 * Montessori está acá y no en SUSTAIN_NODES a propósito: tiene histórico
 * documental abundante (13 programas, 168 mediciones, 32 evidencias) pero
 * cero acciones que hayan pasado el pipeline de verificación Sustain.
 * `historical_import` ≠ `sustain_verified` — regla IR-004.
 */
export const NODES_WITHOUT_SUSTAIN_ACTIONS = {
  montessori: {
    dashboardKey: 'montessori',
    displayName: 'Montessori School',
    institutionId: 'inst_montessori_ar',
    reason: 'historical_only',
    note: 'Histórico institucional documentado. Sin acciones verificadas por el pipeline Sustain.',
  },
};

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
