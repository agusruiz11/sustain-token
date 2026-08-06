import { useNode } from '../components/useNode';
import { getNodeType } from '../data/nodeTypes';
import { getOrganization, flattenUnits, countUnits, meteredUnits, ORG_EXAMPLE_NOTICE } from '../data/organization';
import { actionsByNode, totalSavings } from '../data/actions';
import DataTable from '../components/DataTable';
import StatusChip from '../components/StatusChip';
import { STEP_STATUS } from '../data/actions';

/**
 * § 8 del brief — Instituciones.
 *
 * El árbol de la organización con sus responsables y el estado de medición de
 * cada unidad. La nomenclatura de los niveles sale del tipo de nodo, así que el
 * mismo módulo sirve para una escuela (Sede/Nivel/Curso) y para un municipio
 * (Secretaría/Dirección/Barrio) sin duplicar código.
 *
 * Ver la nota en data/organization.js: los KPIs por unidad no se pueden calcular
 * sin submedición. El módulo lo muestra en vez de inventar números.
 */
export default function Instituciones() {
  const { node } = useNode();
  const type = getNodeType(node.nodeTypeId);
  const org = getOrganization(node.slug);

  if (!org) {
    return (
      <div className="dash-card">
        <p className="dash-table-empty">
          Este nodo todavía no tiene una estructura organizativa cargada.
        </p>
      </div>
    );
  }

  const actions = actionsByNode(node.slug);
  const savings = totalSavings(actions);
  const rows = flattenUnits(org.units);
  const conMedicion = meteredUnits(org.units).length;

  const columns = [
    {
      key: 'name',
      label: type.hierarchy?.join(' / ') ?? 'Unidad',
      // El detalle va debajo del nombre, no al lado: en columna angosta el par
      // en línea se parte a mitad de palabra y queda ilegible.
      render: (u) => (
        <span className="org-name" style={{ paddingLeft: `${u.depth * 18}px` }}>
          {u.depth > 0 && <span className="org-branch" aria-hidden="true">└</span>}
          <span className="org-name-stack">
            <span className="org-name-text">{u.name}</span>
            {u.detail && <span className="org-detail">{u.detail}</span>}
          </span>
        </span>
      ),
    },
    {
      key: 'level',
      label: 'Tipo',
      width: '110px',
      render: (u) => org.levels[u.level] ?? '—',
    },
    {
      key: 'responsable',
      label: type.memberLabel ?? 'Responsable',
      width: '210px',
      render: (u) => u.responsable,
    },
    {
      key: 'metered',
      label: 'Medición',
      align: 'right',
      width: '150px',
      render: (u) => (
        <StatusChip
          status={u.metered ? STEP_STATUS.COMPLETE : STEP_STATUS.UNAVAILABLE}
          label={u.metered ? 'Propia' : 'Sin medidor'}
        />
      ),
    },
  ];

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Indicadores del nodo</span>
          <span className="act-count">{node.name}</span>
        </div>
        <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 0 }}>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{actions.length}</div>
            <div className="mod-scaffold-stat-label">Acciones verificadas</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{savings.declaredTotalKwh} kWh</div>
            <div className="mod-scaffold-stat-label">Energía ahorrada acumulada</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{countUnits(org.units)}</div>
            <div className="mod-scaffold-stat-label">Unidades organizativas</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{conMedicion} / {countUnits(org.units)}</div>
            <div className="mod-scaffold-stat-label">Con medición propia</div>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Estructura</span>
          {org.isExample && <span className="org-example-chip">Datos de ejemplo</span>}
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(u) => u.id}
          caption="Unidades organizativas del nodo"
        />
      </div>

      <div className="dash-card prov-note">
        <div className="dash-nav-group-label">Qué falta para tener KPIs por unidad</div>
        <ul className="mod-scaffold-list">
          <li>
            La medición actual viene de la factura de la distribuidora, que cubre el edificio
            completo con un solo medidor. Por eso {countUnits(org.units) - conMedicion} de{' '}
            {countUnits(org.units)} unidades no tienen consumo propio.
          </li>
          <li>
            Para desagregar hay dos caminos: <strong>submedición</strong> (un medidor por sector)
            o una <strong>regla de prorrateo</strong> acordada con la institución — por superficie,
            por matrícula o por horas de uso.
          </li>
          <li>
            Es una definición de la escuela, no técnica. Hasta que se tome, las unidades sin
            medidor muestran su estado real en lugar de un número estimado.
          </li>
        </ul>
        {org.isExample && <p className="mod-scaffold-note">{ORG_EXAMPLE_NOTICE}</p>}
      </div>
    </>
  );
}
