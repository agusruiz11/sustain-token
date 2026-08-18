/* ============================================================
   ESTRUCTURA ORGANIZACIONAL — Fase 4
   ============================================================
   § 8 del brief: acciones por área, departamentos, sedes, responsables, KPIs.

   ------------------------------------------------------------
   ⚠ REEMPLAZADO POR DATO CANÓNICO — 18 ago 2026
   ------------------------------------------------------------
   Hasta hoy este archivo tenía una estructura inventada: "Sede Central ·
   Ciudad Autónoma de Buenos Aires" con salas de 3/4/5, ciclos de primaria y un
   medidor único alimentado por "Factura EDESUR". Tres cosas estaban mal:

     · la sede es Turdera, Lomas de Zamora — no CABA;
     · los cursos y ciclos no existen en ninguna fuente;
     · esa factura EDESUR es de Martín, no de la escuela.

   Ahora la estructura sale de canonical/organizational_units.json (8 unidades)
   y canonical/sites.json (1 sede). El Entregable 3 § 4.8 es explícito:
   "Importar sólo estructura confirmada; lo no confirmado debe quedar
   pendiente". Por eso no hay un tercer nivel: el expediente no lo documenta y
   no se inventa.

   ------------------------------------------------------------
   EL PUNTO DE FONDO SIGUE EN PIE
   ------------------------------------------------------------
   Montessori sí tiene medición propia: tres medidores eléctricos (uno de ellos
   bidireccional, por el fotovoltaico), gas y agua. Pero son medidores de
   EDIFICIO, no por unidad organizativa.

   Los KPIs por nivel o por área que pide el brief **no se pueden calcular** con
   esa instrumentación, por más que carguemos la estructura. Haría falta
   submedición o una regla de prorrateo acordada — y el Entregable 3 § 4.8 lo
   prohíbe explícitamente: "No prorratear consumos sin metodología explícita".

   Encima el consumo eléctrico todavía no llegó: la hoja ENERGÍA del Excel vino
   vacía y es la consulta abierta Q03 del paquete.

   Cada unidad declara `metered`. Las que no tienen medición propia muestran su
   estado real en vez de un número inventado.
   ============================================================ */

export const ORG_EXAMPLE_NOTICE =
  'Estructura importada del expediente institucional (PDF p.1-p.4, p.13, p.31, p.92). ' +
  'Las unidades sin medición propia no pueden tener KPIs de consumo sin una regla ' +
  'de prorrateo acordada con la institución.';

export const ORGANIZATIONS = {
  montessori: {
    nodeKey: 'montessori',
    institutionId: 'inst_montessori_ar',
    isExample: false,
    recordOrigin: 'historical_import',
    /* Nomenclatura de nodeTypes.escuela.hierarchy. El expediente sólo llega a
       nivel de unidad, así que el tercer escalón queda sin poblar. */
    levels: ['Sede', 'Unidad'],
    units: [
      {
        id: 'site_montessori_turdera',
        name: 'Sede Turdera',
        level: 0,
        /* address_public de sites.json. El domicilio exacto (Segurola 935)
           tiene access_level: institutional y no se expone acá. */
        detail: 'Turdera, Lomas de Zamora, Buenos Aires',
        responsable: 'Dirección General',
        metered: true,
        meterSource: '3 medidores eléctricos (1 bidireccional) · gas · agua',
        sourceReference: 'PDF p.1',
        children: [
          { id: 'unit_maternal', name: 'Nivel Maternal', level: 1, unitType: 'education_level', responsable: null, metered: false, sourceReference: 'PDF p.4', children: [] },
          { id: 'unit_inicial', name: 'Nivel Inicial / Jardín', level: 1, unitType: 'education_level', responsable: null, metered: false, sourceReference: 'PDF p.4', children: [] },
          { id: 'unit_primario', name: 'Nivel Primario', level: 1, unitType: 'education_level', responsable: null, metered: false, sourceReference: 'PDF p.1, p.4', children: [] },
          { id: 'unit_secundario', name: 'Nivel Secundario', level: 1, unitType: 'education_level', responsable: null, metered: false, sourceReference: 'PDF p.4', children: [] },
          { id: 'unit_mantenimiento', name: 'Mantenimiento', level: 1, unitType: 'operational_area', responsable: null, metered: false, sourceReference: 'PDF p.13, p.31', children: [] },
          { id: 'unit_maestranza', name: 'Maestranza', level: 1, unitType: 'operational_area', responsable: null, metered: false, sourceReference: 'PDF p.3, p.13', children: [] },
          { id: 'unit_comedor', name: 'Comedor', level: 1, unitType: 'operational_area', responsable: null, metered: false, sourceReference: 'PDF p.3', children: [] },
          { id: 'unit_comunicacion', name: 'Comunicación', level: 1, unitType: 'operational_area', responsable: null, metered: false, sourceReference: 'PDF p.92', children: [] },
        ],
      },
    ],

    /* Cuentas de servicio y medidores reales de la institución.
       external_account_ref viene 'restricted'/'masked' en la fuente: son datos
       con acceso restringido (IR-009) y no se muestran. */
    utilities: [
      { id: 'util_electricity_1', type: 'electricity', provider: 'Edesur', meter: 'Medidor eléctrico 1', meterType: 'electricity_standard', sourceReference: 'PDF p.9-p.12' },
      { id: 'util_electricity_2', type: 'electricity', provider: 'Edesur', meter: 'Medidor eléctrico 2', meterType: 'electricity_standard', sourceReference: 'PDF p.9-p.12' },
      { id: 'util_electricity_bi', type: 'electricity', provider: 'Edesur', meter: 'Medidor eléctrico bidireccional', meterType: 'electricity_bidirectional', sourceReference: 'PDF p.9-p.12' },
      { id: 'util_gas', type: 'gas', provider: 'No identificado en el expediente', meter: 'Medidor de gas', meterType: 'gas_standard', sourceReference: 'PDF p.9-p.14' },
      { id: 'util_water', type: 'water', provider: 'AySA', meter: 'Suministro de agua', meterType: 'water_billing_account', sourceReference: 'PDF p.28-p.29' },
    ],

    /* Consultas abiertas que afectan a este módulo. Se muestran como pendientes
       en vez de rellenarse por inferencia. */
    openQueries: [
      { id: 'Q03', topic: 'Electricidad', question: 'Faltan las facturas o exportaciones de los tres medidores eléctricos 2023-2026. La hoja ENERGÍA vino vacía.' },
      { id: 'Q04', topic: 'Medidor bidireccional', question: '¿Los valores de 880 y 480 kWh son energía inyectada, generada u otro concepto?' },
      { id: 'Q07', topic: 'Estructura', question: '¿Segurola 935 concentra los cuatro niveles o hay otras sedes con nodo propio?' },
      { id: 'Q08', topic: 'Programas', question: 'Validar nombres y fechas de inicio de los programas del dataset.' },
    ],
  },
};

export const getOrganization = (nodeKey) => ORGANIZATIONS[nodeKey] ?? null;

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
