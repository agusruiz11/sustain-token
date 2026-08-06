/* ============================================================
   ESTRUCTURA ORGANIZACIONAL — Fase 4
   ============================================================
   § 8 del brief: acciones por área, departamentos, sedes, responsables, KPIs.

   ------------------------------------------------------------
   ⚠ ESTOS DATOS SON DE EJEMPLO — y hay un motivo de fondo
   ------------------------------------------------------------
   La estructura interna real de Montessori no está en ninguna de las fuentes.
   Los nombres de niveles, cursos y responsables de acá son un ejemplo para
   mostrar cómo se ve el módulo; hay que reemplazarlos con los reales.

   Pero lo importante no es eso, sino esto:

     El piloto mide con LA FACTURA DE LA DISTRIBUIDORA, que es una sola para
     todo el edificio. No hay medición por nivel ni por curso.

   Es decir: los KPIs por unidad organizativa que pide el brief **no se pueden
   calcular** con la instrumentación actual, por más que carguemos la estructura.
   Para tenerlos hace falta submedición (un medidor por sector) o una regla de
   prorrateo acordada con la escuela — por superficie, por matrícula, por horas
   de uso.

   Por eso cada unidad declara `metered`. Las que no tienen medición propia
   muestran su estado real en vez de un número inventado. Es una conversación
   pendiente con la escuela, y el módulo la hace visible en lugar de taparla.
   ============================================================ */

export const ORG_EXAMPLE_NOTICE =
  'Estructura de ejemplo. Los nombres y responsables deben reemplazarse con los ' +
  'reales de la institución.';

export const ORGANIZATIONS = {
  montessori: {
    nodeSlug: 'montessori',
    isExample: true,
    // Nomenclatura tomada de nodeTypes.escuela.hierarchy
    levels: ['Sede', 'Nivel', 'Curso'],
    units: [
      {
        id: 'sede-caba',
        name: 'Sede Central',
        level: 0,
        detail: 'Ciudad Autónoma de Buenos Aires',
        responsable: 'Dirección General',
        metered: true,
        meterSource: 'Factura EDESUR · medidor único del edificio',
        children: [
          {
            id: 'nivel-inicial',
            name: 'Nivel Inicial',
            level: 1,
            detail: 'Salas de 3, 4 y 5',
            responsable: 'Coordinación de Nivel Inicial',
            metered: false,
            children: [
              { id: 'sala-3', name: 'Sala de 3', level: 2, responsable: '—', metered: false, children: [] },
              { id: 'sala-4', name: 'Sala de 4', level: 2, responsable: '—', metered: false, children: [] },
              { id: 'sala-5', name: 'Sala de 5', level: 2, responsable: '—', metered: false, children: [] },
            ],
          },
          {
            id: 'nivel-primario',
            name: 'Nivel Primario',
            level: 1,
            detail: '1º a 6º grado',
            responsable: 'Coordinación de Primaria',
            metered: false,
            children: [
              { id: 'primer-ciclo', name: '1º a 3º grado', level: 2, responsable: '—', metered: false, children: [] },
              { id: 'segundo-ciclo', name: '4º a 6º grado', level: 2, responsable: '—', metered: false, children: [] },
            ],
          },
          {
            id: 'servicios',
            name: 'Servicios Generales',
            level: 1,
            detail: 'Cocina, mantenimiento, administración',
            responsable: 'Mantenimiento',
            metered: false,
            children: [],
          },
        ],
      },
    ],
  },
};

export const getOrganization = (slug) => ORGANIZATIONS[slug] ?? null;

/** Aplana el árbol conservando la profundidad, para pintarlo como tabla. */
export function flattenUnits(units, depth = 0, out = []) {
  for (const u of units) {
    out.push({ ...u, depth });
    if (u.children?.length) flattenUnits(u.children, depth + 1, out);
  }
  return out;
}

export function countUnits(units) {
  return flattenUnits(units).length;
}

/** Unidades con medición propia: las únicas que pueden tener KPIs propios. */
export function meteredUnits(units) {
  return flattenUnits(units).filter((u) => u.metered);
}
