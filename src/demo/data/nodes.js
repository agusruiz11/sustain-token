/* ============================================================
   RESOLVER DE NODOS — Dashboard v2.0
   ============================================================
   Normaliza los tres orígenes de datos (companies / institutions / user) a una
   sola forma para que DashShell no tenga que saber de qué tipo es el nodo.

   Es la pieza que hace posible el shell único: hoy cada dashboard conoce la
   forma de SU objeto (`co.initialsStyle`, `inst.tagline`, `u.fullName`) y por
   eso hay tres topbars y tres footers copiados. Acá se traduce una vez.

   ALIAS DE RUTA: /demo/institucion/:slug es la URL histórica y sigue viva.
   Montessori es un nodo de tipo 'escuela', pero su link viejo no se rompe.
   ============================================================ */

import { COMPANIES } from './companies.js';
import { INSTITUTIONS } from './institutions.js';
import { USER } from './user.js';
import { getNodeType } from './nodeTypes.js';

/** Segmentos de URL heredados → tipo de nodo real. */
export const ROUTE_ALIASES = {
  institucion: 'escuela',
};

const FOOTER_COMMON = {
  mrv: {
    icon: '🧠',
    title: 'Verificación IA + MRV',
    text: 'Validación automática con IA, OCR y reglas de verificación',
  },
};

const FOOTER_BY_TYPE = {
  institutional_pilot: [
    { icon: '🔒', title: 'Registro Inmutable', text: 'Todas las acciones quedan respaldadas con evidencia verificable' },
    FOOTER_COMMON.mrv,
    { icon: '📦', title: 'Privacidad por Diseño', text: 'Sin exponer datos personales, medidores ni códigos de pago' },
  ],
  standard: [
    /* Decía "Todas las acciones están respaldadas en blockchain", que
       contradice al audit trail de la misma pantalla: ninguna está anclada
       todavía. Se afirma lo que sí es cierto — la integridad SHA-256. */
    { icon: '🔒', title: 'Integridad Verificable', text: 'Cada evidencia tiene su hash SHA-256; el anclaje on-chain queda pendiente' },
    FOOTER_COMMON.mrv,
    { icon: '📦', title: 'Transparencia Total', text: 'Trazabilidad, integridad y evidencia pública' },
  ],
};

const monoMeta = (text, color = 'var(--ink-300)') => ({ text, color });

function fromCompany(slug, co) {
  return {
    nodeTypeId: 'empresa',
    slug,
    name: co.name,
    tagline: co.tagline,
    accentColor: co.accentColor,
    avatar: { kind: 'initials', initials: co.initials, style: co.initialsStyle },
    badge: 'VERIFICADO',
    meta: [monoMeta(`📍 ${co.location}`), monoMeta(`Miembro desde ${co.memberSince}`)],
    sidebarPanel: { kind: 'wallet', amount: co.wallet },
    footer: FOOTER_BY_TYPE.standard,
    audit: co.audit,
    data: co,
  };
}

function fromInstitution(slug, inst) {
  return {
    nodeTypeId: 'escuela',
    slug,
    name: inst.name,
    tagline: inst.tagline,
    accentColor: inst.accentColor,
    avatar: { kind: 'initials', initials: inst.initials, style: inst.initialsStyle },
    badge: 'PILOTO GENESIS',
    meta: [monoMeta(`📍 ${inst.location}`), monoMeta(`Piloto desde ${inst.memberSince}`)],
    sidebarPanel: {
      kind: 'pilot',
      title: 'Piloto Genesis',
      value: 'Mes 1',
      total: '/ 3',
      note: 'Centralización de información histórica',
    },
    footer: FOOTER_BY_TYPE.institutional_pilot,
    audit: inst.audit,
    data: inst,
  };
}

function fromUser(u) {
  return {
    nodeTypeId: 'usuario',
    slug: null,
    name: u.fullName,
    tagline: u.handle,
    accentColor: '#29DDF5',
    avatar: {
      kind: 'gradient',
      initials: u.name[0],
      style: {
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--brand-500), #1E9E72)',
        color: '#03151A',
      },
    },
    badge: 'VERIFICADO',
    /* La racha y el ranking global salieron: no existen en node_state.json y
       con los campos en null la topbar mostraba "Racha: null días · null".
       Se reemplazan por el nivel de identidad ambiental, que sí es canónico. */
    meta: [
      monoMeta(`${u.sesLevel}`, 'var(--brand-300)'),
      monoMeta(`SES ${u.sesScore} / ${u.sesScaleMax}`, 'var(--ink-300)'),
    ],
    /* reward_enabled: false — el nodo está en modo score_only. El panel de
       wallet mostraba "0.00 $SUS · saldo disponible", que sugiere una billetera
       vacía cuando en realidad el token todavía no se emite. */
    sidebarPanel: {
      kind: 'pilot',
      title: 'Sustain Score',
      value: String(u.sesScore),
      total: `/ ${u.sesScaleMax}`,
      note: 'Modo score_only · sin recompensa',
    },
    footer: FOOTER_BY_TYPE.standard,
    audit: u.audit,
    data: u,
  };
}

/**
 * Resuelve un nodo desde los params de la URL.
 * Devuelve null si no existe — quien llama decide si redirige.
 *
 * @param {string} tipo  segmento de URL (acepta alias heredados)
 * @param {string|undefined} slug
 */
export function resolveNode(tipo, slug) {
  const typeId = ROUTE_ALIASES[tipo] ?? tipo;
  if (!getNodeType(typeId)) return null;

  if (typeId === 'usuario') return fromUser(USER);
  if (typeId === 'empresa') {
    const co = COMPANIES[slug];
    return co ? fromCompany(slug, co) : null;
  }
  if (typeId === 'escuela') {
    const inst = INSTITUTIONS[slug];
    return inst ? fromInstitution(slug, inst) : null;
  }
  // municipio / universidad / ong: tipos declarados, sin nodos cargados todavía.
  return null;
}
