import { useNode } from '../components/useNode';
import { getNodeType, MODULES, MODULE_GROUPS } from '../data/nodeTypes';
import DataTable from '../components/DataTable';

/**
 * § 11 del brief — Configuración.
 *
 * El perfil del nodo sale de datos reales. Usuarios y roles son una VISTA
 * PREVIA: hoy la demo no tiene autenticación, así que no hay sesión ni permisos
 * que aplicar.
 *
 * Lo que sí es real es la estructura: los roles se definen como subconjuntos de
 * `nodeTypes.modules`, que es el mismo mapa que ya usa el sidebar para decidir
 * qué ve cada tipo de nodo. Cuando se agregue auth, el filtrado por rol usa ese
 * mismo mapa — no hay que rehacer el modelo.
 */

/** Roles como subconjuntos del registro de módulos. */
const ROLES = [
  {
    id: 'admin',
    name: 'Administrador',
    detail: 'Sustain — gestiona todas las organizaciones',
    modules: 'all',
  },
  {
    id: 'organizacion',
    name: 'Organización',
    detail: 'La institución: ve y gestiona su propio nodo',
    modules: ['home', 'acciones', 'dataRoom', 'timeline', 'impacto', 'reportes', 'auditoria', 'instituciones', 'identity', 'integraciones', 'configuracion'],
  },
  {
    id: 'miembro',
    name: 'Miembro',
    detail: 'Docente o responsable de área: consulta, no configura',
    modules: ['home', 'acciones', 'dataRoom', 'timeline', 'impacto', 'reportes'],
  },
  {
    id: 'auditor',
    name: 'Auditor externo',
    detail: 'Verifica evidencia e integridad, sin acceso a configuración',
    modules: ['home', 'acciones', 'dataRoom', 'auditoria', 'timeline'],
  },
];

export default function Configuracion() {
  const { node } = useNode();
  const type = getNodeType(node.nodeTypeId);
  const data = node.data;

  const visibleFor = (role) =>
    role.modules === 'all' ? type.modules : role.modules.filter((m) => type.modules.includes(m));

  const columns = [
    {
      key: 'name',
      label: 'Rol',
      render: (r) => (
        <span className="org-name-stack">
          <span className="org-name-text">{r.name}</span>
          <span className="org-detail">{r.detail}</span>
        </span>
      ),
    },
    {
      key: 'count',
      label: 'Módulos visibles',
      align: 'right',
      width: '140px',
      render: (r) => `${visibleFor(r).length} de ${type.modules.length}`,
    },
    {
      key: 'modules',
      label: 'Acceso',
      render: (r) => {
        const v = new Set(visibleFor(r));
        return (
          <span className="cfg-modmap">
            {MODULE_GROUPS.flatMap((g) => g.modules)
              .filter((m) => type.modules.includes(m))
              .map((m) => (
                <span
                  key={m}
                  className={`cfg-modchip${v.has(m) ? ' on' : ''}`}
                  title={MODULES[m].label}
                >
                  {MODULES[m].icon}
                </span>
              ))}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Perfil del nodo</span>
          <span className="act-count">{type.label}</span>
        </div>
        <dl className="dr-meta">
          <div><dt>Nombre</dt><dd>{node.name}</dd></div>
          <div><dt>Descripción</dt><dd>{node.tagline}</dd></div>
          <div><dt>Ubicación</dt><dd>{data?.location ?? '—'}</dd></div>
          <div><dt>Miembro desde</dt><dd>{data?.memberSince ?? '—'}</dd></div>
          <div><dt>Tipo de nodo</dt><dd>{type.label}</dd></div>
          <div>
            <dt>Jerarquía</dt>
            <dd>{type.hierarchy?.join(' · ') ?? 'No aplica'}</dd>
          </div>
        </dl>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Usuarios y roles</span>
          <span className="org-example-chip">Vista previa</span>
        </div>
        <DataTable
          columns={columns}
          rows={ROLES}
          rowKey={(r) => r.id}
          caption="Roles previstos y módulos accesibles"
        />
        <p className="mod-scaffold-note">
          Los íconos encendidos son los módulos que vería cada rol en el sidebar.
        </p>
      </div>

      <div className="dash-card prov-note">
        <div className="dash-nav-group-label">Qué es real y qué no en esta pantalla</div>
        <ul className="mod-scaffold-list">
          <li>
            <strong>Real:</strong> el perfil del nodo y la lista de módulos, que salen de los
            mismos datos que usa el resto del dashboard.
          </li>
          <li>
            <strong>Vista previa:</strong> los roles. La demo no tiene autenticación, así que no
            hay sesión ni permisos que aplicar — nadie inicia sesión todavía.
          </li>
          <li>
            <strong>Por qué igual sirve:</strong> los roles están definidos como subconjuntos del
            mismo registro de módulos que ya usa el sidebar. El día que se agregue login, el
            filtrado por rol se apoya en esa estructura en lugar de rehacerla.
          </li>
        </ul>
      </div>
    </>
  );
}
