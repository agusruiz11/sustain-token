import { useMemo, useState } from 'react';
import { useNode } from '../components/useNode';
import { actionsForNode } from '../data/actions';
import { dashboardKeyOf, DATA_MODE } from '../data/sustainNodes';
import { CATEGORIES } from '../data/categories';
import { moduleHref } from '../data/nodeTypes';
import DataTable from '../components/DataTable';
import StatusChip, { SesDelta, DeltaPct } from '../components/StatusChip';

/**
 * § 2 del brief — listado de acciones.
 *
 * Cada fila abre la ficha con la cadena de 10 pasos. La tabla y la ficha leen el
 * mismo objeto de data/actions.js; no hay una segunda fuente de verdad.
 */
export default function MisAcciones() {
  const { node, routeSegment } = useNode();
  const [categoria, setCategoria] = useState('todas');
  const [resultado, setResultado] = useState('todos');

  const nodeKey = dashboardKeyOf(node);

  const all = useMemo(
    () => actionsForNode(node).sort((a, b) => b.date.localeCompare(a.date)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nodeKey identifica al nodo; `node` se recrea en cada render
    [nodeKey],
  );

  const rows = useMemo(
    () => all.filter((a) =>
      (categoria === 'todas' || a.categoryId === categoria) &&
      (resultado === 'todos' || a.result.direction === resultado),
    ),
    [all, categoria, resultado],
  );

  // Sólo se ofrecen las categorías que este nodo realmente tiene cargadas:
  // un filtro con 13 opciones donde 12 no dan resultados no ayuda a nadie.
  const cats = useMemo(
    () => [...new Set(all.map((a) => a.categoryId))].map((id) => CATEGORIES[id]),
    [all],
  );

  const demoFixtures = useMemo(
    () => all.filter((a) => a.dataMode === DATA_MODE.DEMO).length,
    [all],
  );

  const base = moduleHref(node.nodeTypeId, node.slug, 'acciones', routeSegment);

  const columns = [
    {
      key: 'title',
      label: 'Acción',
      render: (a) => (
        <span className="act-cell-title">
          <span className="act-cell-icon" aria-hidden="true">{CATEGORIES[a.categoryId].icon}</span>
          {a.title}
        </span>
      ),
    },
    { key: 'dateLabel', label: 'Fecha', width: '110px' },
    {
      key: 'category',
      label: 'Categoría',
      width: '110px',
      render: (a) => CATEGORIES[a.categoryId].name,
    },
    {
      key: 'result',
      label: 'vs. línea base',
      align: 'right',
      width: '120px',
      render: (a) => <DeltaPct value={a.result.deltaPct} />,
    },
    {
      key: 'ses',
      label: 'SES',
      align: 'right',
      width: '110px',
      render: (a) => <SesDelta value={a.ses.delta} />,
    },
    {
      key: 'anchor',
      label: 'Anclaje',
      align: 'right',
      width: '130px',
      render: (a) => <StatusChip status={a.anchor.chainStatus} />,
    },
  ];

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Mis Acciones</span>
          <span className="act-count">{rows.length} de {all.length}</span>
        </div>

        <div className="act-filters">
          <label className="act-filter">
            <span>Categoría</span>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="todas">Todas</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="act-filter">
            <span>Resultado</span>
            <select value={resultado} onChange={(e) => setResultado(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="reduction">Reducción</option>
              <option value="increase">Aumento</option>
              <option value="baseline">Línea base</option>
            </select>
          </label>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowHref={(a) => `${base}/${a.id}`}
          caption="Acciones verificadas del nodo"
          // Un nodo sin acciones y un filtro sin resultados son dos cosas
          // distintas. Montessori entra al piloto con histórico documentado y
          // cero acciones verificadas: decir "no coincide con los filtros"
          // sugeriría que hay algo escondido detrás de un filtro.
          empty={
            all.length === 0
              ? 'Este nodo todavía no tiene acciones verificadas por Sustain.'
              : 'Ninguna acción coincide con los filtros.'
          }
        />
      </div>

      {/* La nota depende de qué nodo se está mirando: antes afirmaba en todos
          que "las 8 acciones son las facturas EDESUR reales del piloto", lo
          que era doblemente falso en Montessori — ni son suyas ni son reales
          suyas. */}
      {all.length > 0 && demoFixtures > 0 && (
        <p className="mod-scaffold-note">
          {demoFixtures} de estas acciones son fixtures de demostración cargadas para
          construir y probar el flujo. Los valores marcados como pendientes no están
          cargados todavía y no se completaron con datos inventados.
        </p>
      )}
    </>
  );
}
