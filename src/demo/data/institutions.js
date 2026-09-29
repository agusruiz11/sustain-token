/* ============================================================
   NODOS INSTITUCIONALES
   ============================================================
   ⚠ REESCRITO 18 ago 2026 — corrección de atribución

   Hasta hoy este archivo describía a Montessori con los datos de las 8
   facturas EDESUR: 8 acciones verificadas, 211.2 kWh ahorrados, SES 20, 4
   badges de energía y un chart de consumo vs. línea base.

   Nada de eso es de Montessori. Ese es el nodo personal de Martín
   (spn_01ee6583da858ca1fa19323d) y las facturas son fixtures de demo suyas y
   de familiares. Ver src/demo/data/sustainNodes.js y data/actions.js.

   Lo que Montessori sí tiene es un histórico institucional documentado y
   abundante —13 programas, 10 proyectos, 168 mediciones, 24 documentos, 32
   evidencias, desde 2018— pero CERO acciones que hayan pasado el pipeline de
   verificación Sustain. Esa distinción es la regla central del Entregable 3:

     historical_import ≠ sustain_verified

   Los 21 datasets canónicos viven en src/demo/data/montessori/ y se leen a
   través de su capa de acceso. Acá va sólo el perfil de presentación del nodo;
   los contadores se derivan del dato, no se escriben a mano.
   ============================================================ */

import { trajectorySummary, institution as mont, site as montSite } from './montessori/index.js';
import { institutionalActionsFor } from './institutionalActions.js';

const T = trajectorySummary();

/* ── Entrega 05_INSTITUTIONS · 28 sep 2026 ──
   Montessori deja de tener cero acciones Sustain: llegaron tres reales
   (mensajes de agua y energía, huerta de sala de 5, plantación en Tandil),
   todas RECORD_ONLY. El contador sale del dato importado, no se escribe a
   mano. El histórico documental sigue exactamente donde estaba: separado. */
const MONT_ACTIONS = institutionalActionsFor('montessori');
const POSI_ACTIONS = institutionalActionsFor('posicionarte');

export const INSTITUTIONS = {
  montessori: {
    slug: 'montessori',
    institutionId: mont.institution_id,
    name: mont.display_name,
    legalName: mont.legal_name,
    tagline: 'Institución Educativa · Piloto Genesis',
    type: 'Escuela · Histórico documentado',
    institutionType: 'school',

    /* address_public de sites.json. El domicilio exacto (Segurola 935) tiene
       access_level: institutional — no se expone en la UI pública. */
    location: montSite.address_public,
    country: 'AR',
    memberSince: 'Jul 2026',
    historicalDataStart: mont.historical_data_start,
    status: mont.status,

    /* Procedencia del nodo entero. Ningún KPI de acá alimenta SES. */
    recordOrigin: mont.record_origin,
    verificationStatus: mont.verification_status,
    sourceReference: mont.source_reference,

    accentColor: '#1E9E72',
    accentBg: 'rgba(30,158,114,0.08)',
    accentBorder: 'rgba(30,158,114,0.3)',
    initials: 'MS',
    initialsStyle: { background: 'linear-gradient(135deg, #1E9E72, #29DDF5)', color: '#fff' },

    /** Nodo Sustain canónico (ver sustainNodes.js). */
    nodeId: 'spn_776c056a5d48505e28e48471',

    /* ── Acciones verificadas por Sustain ──
       Tres desde el 28 sep 2026, ancladas en BNB Smart Chain con política
       RECORD_ONLY: se registran, no otorgan SES. El histórico documentado
       sigue sin generar SES ni contar como acción verificada. */
    sustainActions: {
      count: MONT_ACTIONS.length,
      ses: null,
      reason: 'record_only',
      note: 'Las acciones registradas no otorgan SES institucional (RECORD_ONLY). El histórico documentado tampoco.',
    },

    /* Piloto: los tres meses se cumplen a fin de septiembre de 2026 (audio de
       Martín del 28/09). Lo que sigue es la etapa paga. */
    pilot: { value: 'Mes 3', total: '/ 3', note: 'Cierre del piloto · primeras acciones reales cargadas' },

    /* ── Trayectoria institucional (record_counts de canonical/manifest.json) ──
       Estos son los KPI que reemplazan a los de energía. Cuentan historia
       documentada, no verificación. */
    stats: [
      { label: 'Programas Registrados', value: String(T.programs), icon: '▦', delta: `Histórico documentado · desde ${T.periodStart.slice(0, 4)}`, deltaUp: null },
      { label: 'Mediciones Históricas', value: String(T.measurements), icon: '◉', delta: `${T.indicators} indicadores · ${T.measurementsNeedsReview} por revisar`, deltaUp: null },
      { label: 'Evidencias y Documentos', value: String(T.documents + T.evidence), icon: '▤', delta: `${T.documents} documentos · ${T.evidence} evidencias`, deltaUp: null },
      { label: 'Acciones Verificadas Sustain', value: String(MONT_ACTIONS.length), icon: '✓', delta: 'RECORD_ONLY · ancladas en BNB Smart Chain', deltaUp: null },
    ],

    trajectory: T,

    /* COA es un framework EXTERNO asociado al nodo, no taxonomía core de
       Sustain (regla IR-010). El mismo sistema tiene que servir mañana para
       otra escuela con otra certificación. */
    frameworks: [
      {
        id: 'framework_coa_environmental_seal',
        name: 'Sello Ambiental COA',
        type: 'environmental_certification',
        version: 'Expediente 2025',
        status: 'configured_pilot',
        external: true,
        sourceReference: 'PDF completo',
      },
    ],

    /* ── Módulos ──
       Reemplaza al donut de "1/9 módulos activos" que contaba Energía como
       activo con las facturas de Martín. Ahora refleja el estado real: hay
       histórico documental en varias categorías y verificación en ninguna. */
    modules: [
      { name: 'Residuos y circularidad', icon: '♻️', status: 'historical', statusLabel: 'Histórico', metric: '2 programas · Botellas de Amor, Tapitas' },
      { name: 'Energía', icon: '⚡', status: 'historical', statusLabel: 'Histórico', metric: 'Fotovoltaico 30 paneles · PDF p.24-27' },
      { name: 'Agua', icon: '💧', status: 'historical', statusLabel: 'Histórico', metric: 'Gestión hídrica · PDF p.28-50' },
      { name: 'Biodiversidad', icon: '🌳', status: 'active', statusLabel: 'Verificado Sustain', metric: 'Plantación educativa en Tandil (2026) · histórico PDF p.63-69' },
      { name: 'Compostaje', icon: '🌱', status: 'historical', statusLabel: 'Histórico', metric: 'Compostaje institucional · PDF p.53' },
      { name: 'Educación ambiental', icon: '📚', status: 'active', statusLabel: 'Verificado Sustain', metric: 'Mensajes de 6.º grado y huerta de sala de 5 (2026) · histórico: 2 programas' },
      { name: 'Movilidad', icon: '🚲', status: 'historical', statusLabel: 'Histórico', metric: 'Bicicleteada solidaria · PDF p.21-22' },
      { name: 'Compras sostenibles', icon: '🛒', status: 'historical', statusLabel: 'Histórico', metric: 'Proveedores · PDF p.75, p.81-87' },
      { name: 'Gobernanza y mantenimiento', icon: '🔧', status: 'historical', statusLabel: 'Histórico', metric: 'Mantenimiento preventivo · PDF p.13-16' },
      { name: 'Inclusión', icon: '🤝', status: 'historical', statusLabel: 'Histórico', metric: 'Accesibilidad y diversidad · PDF p.88-91' },
    ],

    roadmap: [
      { step: 'Mes 1', label: 'Centralizar información histórica y organizar evidencias' },
      { step: 'Mes 2', label: 'Configurar Dashboard Institucional y definir indicadores' },
      { step: 'Mes 3', label: 'Validar reportes, capacitar al equipo y definir siguiente etapa' },
    ],

    wallet: null,

    /* ── Auditoría ──
       El hash que había acá (39f6dade…) es de una factura de Martín, no de
       Montessori. Desde el 28 sep 2026 la escuela tiene tres acciones con
       hash de manifiesto y anclaje on-chain; se leen del universo de
       acciones, no de acá. El histórico sigue siendo DOCUMENTAL: referencia
       de expediente, no hash (Entregable 3 § 4.7). */
    audit: null,
    auditMode: 'mixed',
    auditNote: 'Dos trazabilidades que no se mezclan: las acciones Sustain tienen hash de manifiesto y anclaje verificado en BNB Smart Chain; el histórico documental se prueba por referencia de expediente.',
  },

  /* ── Posicionarte — nodo organización ──
     Entrega 05_INSTITUTIONS, 28 sep 2026. Una limpieza comunitaria del
     30/05/2026 en Mar del Plata, hecha por dos integrantes de la agencia que
     figuran con seudónimo. Sin histórico documental: todo lo que hay es
     verificado por Sustain. */
  posicionarte: {
    slug: 'posicionarte',
    institutionId: null,
    nodeId: 'spn_394da9811c6ea308b5841147',
    name: 'Posicionarte',
    legalName: 'Posicionarte',
    tagline: 'Organización · Piloto Genesis',
    type: 'Organización · Acción comunitaria',
    institutionType: 'organization',
    location: 'Buenos Aires, Argentina',
    country: 'AR',
    memberSince: 'Sep 2026',
    historicalDataStart: null,
    status: 'active_pilot',
    recordOrigin: 'native_sustain',
    verificationStatus: 'sustain_verified',
    sourceReference: 'drive-files/05_INSTITUTIONS/spn_394da9811c6ea308b5841147_Posicionarte',

    accentColor: '#E8BEE0',
    accentBg: 'rgba(232,190,224,0.08)',
    accentBorder: 'rgba(232,190,224,0.3)',
    initials: 'PO',
    initialsStyle: { background: 'linear-gradient(135deg, #E8BEE0, #29DDF5)', color: '#03151A' },

    sustainActions: {
      count: POSI_ACTIONS.length,
      ses: 8,
      reason: 'full_action_score_reference_non_additive',
      note: 'SES 8 por la acción; 4 a cada participante; 8 al nodo como referencia no aditiva. Nunca 8+4+4.',
    },

    pilot: { value: 'Nodo', total: 'demo', note: 'Arquitectura para grupos de cualquier tamaño' },

    /* Las tres tarjetas que lee el hub. Todo sale del dato importado. */
    stats: [
      { label: 'Acciones Verificadas Sustain', value: String(POSI_ACTIONS.length), icon: '✓', delta: 'Limpieza comunitaria · 30 May 2026', deltaUp: null },
      { label: 'Integrantes con atribución', value: '2', icon: '◉', delta: 'Seudónimos · identidad no pública', deltaUp: null },
      { label: 'SES de referencia', value: '8', icon: '⬡', delta: 'No aditivo · Cleanup_SES_v1.0', deltaUp: null },
    ],

    trajectory: null,
    frameworks: [],
    modules: [
      { name: 'Limpiezas', icon: '🧹', status: 'active', statusLabel: 'Verificado Sustain', metric: '1 limpieza de espacio público · Mar del Plata' },
    ],
    roadmap: [],
    wallet: null,
    audit: null,
    auditMode: 'cryptographic',
    auditNote: 'Hash SHA-256 del manifiesto canónico y anclaje verificado en BNB Smart Chain. Sin CID: almacenamiento hash_only.',
  },
};

export const INSTITUTION_LIST = [
  { slug: 'montessori', name: 'Montessori School', tagline: 'Institución Educativa · Piloto Genesis', accentColor: '#1E9E72', routeSegment: 'institucion' },
  { slug: 'posicionarte', name: 'Posicionarte', tagline: 'Organización · Piloto Genesis', accentColor: '#E8BEE0', routeSegment: 'organizacion' },
];
