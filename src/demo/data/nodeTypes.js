/* ============================================================
   TIPOS DE NODO Y MÓDULOS — Dashboard v2.0
   ============================================================
   Materializa el requisito del audio del 22/07:
     "que después sea escalable para cualquier empresa, cualquier escuela,
      cualquier municipio"

   Hoy el tipo de cliente está hardcodeado en tres componentes
   (EmpresaDashboard / InstitucionDashboard / UsuarioFinal) más tres arrays de
   navegación en DashSidebar.jsx. Agregar un municipio significa copiar ~300
   líneas. Este archivo invierte eso: un shell único + configuración por tipo.

   Un tipo de nodo declara:
     · qué MÓDULOS ve (de los 11 del brief)
     · qué CATEGORÍAS de impacto le aplican (de las 13 de categories.js)
     · cómo se llama a sí mismo y a su jerarquía interna

   ICONOS: set geométrico unificado. Resuelve la mezcla emoji/geométrico que
   hoy conviven en DashSidebar (🗂 y ★ junto a ⊞ y ◈) — ver
   docs/dashboard-v2-plan.md § 6.
   ============================================================ */

import { CATEGORY_ORDER } from './categories.js';

/** Los 11 módulos del brief (drive-files/txt.txt). */
export const MODULES = {
  home:           { id: 'home',           label: 'Home',                  icon: '⊞', path: '',              brief: 1 },
  acciones:       { id: 'acciones',       label: 'Mis Acciones',          icon: '✓', path: 'acciones',      brief: 2 },
  dataRoom:       { id: 'dataRoom',       label: 'Data Room',             icon: '▤', path: 'data-room',     brief: 3 },
  impacto:        { id: 'impacto',        label: 'Impact Dashboard',      icon: '◉', path: 'impacto',       brief: 4 },
  timeline:       { id: 'timeline',       label: 'Timeline',              icon: '⋮', path: 'timeline',      brief: 5 },
  /* "Identidad Ambiental" y no "Environmental Identity": es el único módulo que
     quedaba en inglés en una navegación que está toda en español, y Martín lo
     marcó el 25 de agosto. El id interno no cambia. */
  identity:       { id: 'identity',       label: 'Identidad Ambiental', icon: '⬡', path: 'identidad',    brief: 6 },
  integraciones:  { id: 'integraciones',  label: 'Integraciones',         icon: '⊕', path: 'integraciones', brief: 7 },
  instituciones:  { id: 'instituciones',  label: 'Instituciones',         icon: '▦', path: 'organizacion',  brief: 8 },
  reportes:       { id: 'reportes',       label: 'Reportes',              icon: '≡', path: 'reportes',      brief: 9 },
  auditoria:      { id: 'auditoria',      label: 'Auditoría',             icon: '◈', path: 'auditoria',     brief: 10 },
  configuracion:  { id: 'configuracion',  label: 'Configuración',         icon: '⚙', path: 'configuracion', brief: 11 },
  /* Movilidad no es un 12.º módulo del brief: es una vista del módulo de
     acciones para los nodos que tienen actividad de movilidad cargada. Se
     declara acá para que el sidebar lo resuelva como cualquier otro, y sólo
     se habilita en los tipos de nodo que corresponde. */
  movilidad:      { id: 'movilidad',      label: 'Movilidad',             icon: '⚲', path: 'movilidad',     brief: null },
};

/** Agrupación del sidebar. Mantiene el patrón de grupos ya existente. */
export const MODULE_GROUPS = [
  { group: 'ACTIVIDAD',     modules: ['home', 'acciones', 'movilidad', 'dataRoom', 'timeline'] },
  { group: 'ANÁLISIS',      modules: ['impacto', 'reportes', 'auditoria'] },
  { group: 'ORGANIZACIÓN',  modules: ['instituciones', 'identity'] },
  { group: 'SISTEMA',       modules: ['integraciones', 'configuracion'] },
];

const ALL_MODULES = Object.keys(MODULES);

/* Módulos que dependen de tener datos de esa naturaleza. Un nodo institucional
   sin viajes cargados no muestra Movilidad vacía. */
const INSTITUTIONAL_MODULES = ALL_MODULES.filter((m) => m !== 'movilidad');

/**
 * Tipos de nodo. Los cinco institucionales salen del brief § 8
 * (Escuelas, Empresas, Municipios, Universidades, ONGs) más el usuario final,
 * que ya existe como /demo/usuario.
 *
 * `hierarchy` alimenta el módulo 8: cada tipo nombra distinto a sus niveles
 * internos. Una escuela tiene "niveles" y "cursos"; un municipio tiene
 * "secretarías" y "barrios". Es el mismo árbol con distinta nomenclatura.
 */
export const NODE_TYPES = {
  escuela: {
    id: 'escuela',
    label: 'Escuela',
    plural: 'Escuelas',
    routeSegment: 'escuela',
    modules: INSTITUTIONAL_MODULES,
    categories: CATEGORY_ORDER,
    hierarchy: ['Sede', 'Nivel', 'Curso'],
    memberLabel: 'Responsable',
    isInstitutional: true,
  },
  empresa: {
    id: 'empresa',
    label: 'Empresa',
    plural: 'Empresas',
    routeSegment: 'empresa',
    modules: INSTITUTIONAL_MODULES,
    categories: CATEGORY_ORDER,
    hierarchy: ['Sede', 'Área', 'Equipo'],
    memberLabel: 'Responsable',
    isInstitutional: true,
  },
  municipio: {
    id: 'municipio',
    label: 'Municipio',
    plural: 'Municipios',
    routeSegment: 'municipio',
    modules: INSTITUTIONAL_MODULES,
    categories: CATEGORY_ORDER,
    hierarchy: ['Secretaría', 'Dirección', 'Barrio'],
    memberLabel: 'Responsable',
    isInstitutional: true,
  },
  universidad: {
    id: 'universidad',
    label: 'Universidad',
    plural: 'Universidades',
    routeSegment: 'universidad',
    modules: INSTITUTIONAL_MODULES,
    categories: CATEGORY_ORDER,
    hierarchy: ['Campus', 'Facultad', 'Departamento'],
    memberLabel: 'Responsable',
    isInstitutional: true,
  },
  ong: {
    id: 'ong',
    label: 'ONG',
    plural: 'ONGs',
    routeSegment: 'ong',
    modules: INSTITUTIONAL_MODULES,
    categories: CATEGORY_ORDER,
    hierarchy: ['Sede', 'Programa', 'Proyecto'],
    memberLabel: 'Coordinador',
    isInstitutional: true,
  },
  usuario: {
    id: 'usuario',
    label: 'Usuario',
    plural: 'Usuarios',
    routeSegment: 'usuario',
    // Sin módulo institucional: una persona no tiene sedes ni departamentos.
    modules: ALL_MODULES.filter((m) => m !== 'instituciones'),
    categories: CATEGORY_ORDER,
    hierarchy: null,
    memberLabel: null,
    isInstitutional: false,
  },
};

export const NODE_TYPE_LIST = Object.values(NODE_TYPES);

export const getNodeType = (id) => NODE_TYPES[id] ?? null;

/** Módulos visibles de un tipo de nodo, agrupados como los pinta el sidebar. */
export function navFor(nodeTypeId) {
  const type = getNodeType(nodeTypeId);
  if (!type) return [];
  const visible = new Set(type.modules);
  return MODULE_GROUPS
    .map(({ group, modules }) => ({
      group,
      items: modules.filter((m) => visible.has(m)).map((m) => MODULES[m]),
    }))
    .filter((g) => g.items.length > 0);
}

/**
 * Ruta de un módulo: /demo/:tipo/:slug/:modulo
 *
 * El usuario final no tiene slug (es un solo nodo, no una colección), así que
 * su base es /demo/usuario a secas. Pasar `slug` null u omitido lo contempla.
 * `routeSegmentOverride` deja preservar un alias heredado en la URL —
 * ver ROUTE_ALIASES en nodes.js.
 */
export function moduleHref(nodeTypeId, slug, moduleId, routeSegmentOverride) {
  const type = getNodeType(nodeTypeId);
  const mod = MODULES[moduleId];
  if (!type || !mod) return null;
  const segment = routeSegmentOverride ?? type.routeSegment;
  const base = slug ? `/demo/${segment}/${slug}` : `/demo/${segment}`;
  return mod.path ? `${base}/${mod.path}` : base;
}

/** Módulo cuyo `path` coincide con el segmento de URL. `''` → home. */
export const moduleByPath = (path) =>
  Object.values(MODULES).find((m) => m.path === (path ?? '')) ?? null;

/* ============================================================
   ⚠ DISCREPANCIA DETECTADA — resolver con el cliente
   ============================================================
   institutions.js declara 9 módulos para Montessori, y uno de ellos NO está
   entre las 13 categorías del brief:

       "Mantenimiento Sostenible"  (status: 'scoping',
        "Alcance pendiente de reunión con la escuela")

   Y a la inversa, el brief incluye 5 categorías que el piloto todavía no
   contempla: Limpiezas, Textil, RAEE, Movilidad y Educación Ambiental.

   Hay que decidir si "Mantenimiento Sostenible" es una 14ª categoría o si se
   absorbe dentro de Compras Sostenibles. Hasta que se resuelva queda fuera de
   categories.js para no inventar taxonomía.
   ============================================================ */
export const PENDING_CATEGORY_SCOPE = [
  {
    name: 'Mantenimiento Sostenible',
    source: 'institutions.js · piloto Montessori',
    inBrief: false,
    status: 'scoping',
    note: 'Alcance pendiente de reunión con la escuela. ¿14ª categoría o parte de Compras Sostenibles?',
  },
];
