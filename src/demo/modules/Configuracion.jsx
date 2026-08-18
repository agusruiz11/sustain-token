import { useNode } from '../components/useNode';
import { getNodeType, MODULES, MODULE_GROUPS } from '../data/nodeTypes';
import { dashboardKeyOf } from '../data/sustainNodes';
import { CATEGORY_ORDER, CATEGORIES } from '../data/categories';
import { frameworksFor } from '../data/reports';
import DataTable from '../components/DataTable';
import AuditorAccess from './AuditorAccess';
import * as M from '../data/montessori/index.js';

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
 *
 * ── Entregable 3 § 4.11 ──
 * Suma taxonomía ambiental, fuentes de datos, frameworks externos y permisos de
 * publicación. Y el acceso temporal de auditor externo, que Martín marcó como
 * funcionalidad central del producto — ver AuditorAccess.jsx.
 */

/* Fuentes de dato previstas por el § 4.11. `activa` marca las que el nodo ya
   usa realmente; el resto es catálogo, no promesa. */
const SOURCE_TYPES = [
  { id: 'factura', label: 'Factura de proveedor', detail: 'Edesur, AySA, gas' },
  { id: 'sensor', label: 'Sensor / medidor', detail: 'Lectura directa de instrumento' },
  { id: 'manual', label: 'Carga manual', detail: 'Registro cargado por el equipo' },
  { id: 'historico', label: 'Archivo histórico', detail: 'Expediente o planilla previa a Sustain' },
  { id: 'integracion', label: 'Integración', detail: 'Conector con un sistema externo' },
  { id: 'proveedor', label: 'Proveedor', detail: 'Dato reportado por un tercero contratado' },
  { id: 'tercero', label: 'Tercero verificador', detail: 'Consultora, laboratorio, organismo' },
];

/* Los tres niveles de publicación del § 11, con lo que cada uno implica. */
const PUBLISH_LEVELS = [
  { id: 'public', detail: 'Visible en el perfil público del nodo' },
  { id: 'institutional', detail: 'Visible para el equipo de la institución' },
  { id: 'audit_restricted', detail: 'Sólo dentro de una auditoría habilitada' },
];

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
  const hasHistory = dashboardKeyOf(node) === 'montessori';
  const frameworks = frameworksFor(node);

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

      {hasHistory && <AuditorAccess frameworks={frameworks} />}

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Taxonomía ambiental</span>
          <span className="act-count">{type.categories.length} categorías</span>
        </div>
        <p className="inst-trajectory-lead">
          Qué categorías aplica este nodo. El § 4.5 pide que sea configurable y no una
          lista rígida: el mapeo de las categorías canónicas del expediente vive en la capa
          de datos, así que agregar o quitar una no toca ninguna pantalla.
        </p>
        <div className="cfg-chips">
          {CATEGORY_ORDER.map((id) => (
            <span
              key={id}
              className={`cfg-taxchip${type.categories.includes(id) ? ' on' : ''}`}
            >
              {CATEGORIES[id].icon} {CATEGORIES[id].name}
            </span>
          ))}
        </div>
        {hasHistory && (
          <p className="mod-scaffold-note">
            El expediente trae dos categorías sin equivalente Sustain
            (<code>governance</code> y <code>social_sustainability</code>). El § 4.5 prohíbe
            crearles categoría propia por defecto, así que quedan como trayectoria
            institucional hasta que se defina la taxonomía definitiva.
          </p>
        )}
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Fuentes de datos</span>
        </div>
        <DataTable
          columns={[
            { key: 'label', label: 'Fuente' },
            { key: 'detail', label: 'Qué es' },
            {
              key: 'uso', label: 'En este nodo', align: 'right', width: '160px',
              render: (f) => {
                const usada = hasHistory && ['factura', 'sensor', 'manual', 'historico', 'tercero'].includes(f.id);
                return usada
                  ? <span className="inst-origin-badge">En uso</span>
                  : <span className="trace-step-value--pending">Disponible</span>;
              },
            },
          ]}
          rows={SOURCE_TYPES}
          rowKey={(f) => f.id}
          caption="Catálogo de fuentes de datos"
        />
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Frameworks externos</span>
        </div>
        {frameworks.filter((f) => f.external).length === 0 ? (
          <p className="dash-table-empty">Este nodo no tiene frameworks externos asociados.</p>
        ) : (
          frameworks.filter((f) => f.external).map((f) => (
            <dl key={f.id} className="udash-node-facts">
              <div><dt>Nombre</dt><dd>{f.label}</dd></div>
              <div><dt>Versión</dt><dd>{f.version}</dd></div>
              <div><dt>Vínculo</dt><dd>Asociado al nodo, externo al core de Sustain</dd></div>
            </dl>
          ))
        )}
        <p className="mod-scaffold-note">
          Un framework se asocia al nodo con su estado y versión sin modificar la estructura
          interna de Sustain (IR-010). Así el mismo sistema sirve mañana para otra escuela,
          empresa o municipio con otra certificación.
        </p>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Permisos de publicación</span>
        </div>
        <DataTable
          columns={[
            {
              key: 'nivel', label: 'Nivel', width: '210px',
              render: (l) => (
                <span className={`arch-access arch-access--${l.id}`}>{M.accessLabel(l.id)}</span>
              ),
            },
            { key: 'detail', label: 'Alcance' },
            {
              key: 'docs', label: 'Documentos', align: 'right', width: '130px',
              render: (l) => hasHistory
                ? M.documents.filter((d) => d.access_level === l.id).length
                : '—',
            },
          ]}
          rows={PUBLISH_LEVELS}
          rowKey={(l) => l.id}
          caption="Niveles de publicación del nodo"
        />
        {hasHistory && (
          <p className="mod-scaffold-note">
            Ningún documento está marcado como público todavía. Qué se puede mostrar hacia
            afuera —fotografías, nombres de responsables, métricas— es la consulta abierta
            Q09, pendiente de respuesta de la institución.
          </p>
        )}
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
