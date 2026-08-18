import { useMemo, useState } from 'react';
import { MODULES } from '../data/nodeTypes';
import * as M from '../data/montessori/index.js';

/**
 * Acceso temporal de auditor externo.
 *
 * Adenda de Martín al Entregable 3:
 *
 *   «La institución debería poder generar una invitación/acceso temporal, por
 *    ejemplo por 7, 15 o 30 días, y definir qué información puede consultar ese
 *    auditor... sin posibilidad de cargar, editar o borrar nada. No hace falta
 *    desarrollar toda esta funcionalidad ahora, pero sí quiero que la
 *    arquitectura y el diseño queden preparados.»
 *
 * Está construido como andamiaje, no como maqueta: la invitación se arma de
 * verdad, y el alcance se calcula sobre el dataset real con el mismo
 * `visibleAt()` que ya filtra el Data Room y la Auditoría. Lo único que falta
 * para que sea productivo es persistencia y un backend que emita el token — la
 * lógica de qué ve el auditor ya está y es la misma.
 *
 * Por eso el panel muestra el conteo exacto de lo que el invitado podría
 * consultar antes de emitir: 24 documentos en lugar de 19, porque el alcance
 * de auditoría levanta los `audit_restricted`.
 */

const DURATIONS = [7, 15, 30];

/* Los módulos que un auditor puede necesitar. Configuración queda fuera a
   propósito: el § 11 dice "sin recibir permisos de configuración". */
const GRANTABLE = ['auditoria', 'dataRoom', 'reportes', 'impacto', 'acciones', 'timeline', 'instituciones'];

const DEFAULT_MODULES = ['auditoria', 'dataRoom', 'reportes'];

const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export default function AuditorAccess({ frameworks = [] }) {
  const [dias, setDias] = useState(15);
  const [modulos, setModulos] = useState(DEFAULT_MODULES);
  const [framework, setFramework] = useState('todos');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [emitida, setEmitida] = useState(null);

  const toggle = (id) => setModulos((prev) =>
    prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
  );

  /* Alcance real: se calcula con las mismas funciones que usan las pantallas.
     Si mañana cambia una regla de acceso, este número cambia solo. */
  const alcance = useMemo(() => {
    const docs = M.visibleAt(M.documents, 'audit_restricted');
    const registros = M.auditRecords({ viewerLevel: 'audit_restricted' });
    const enPeriodo = registros.filter((r) => {
      if (!desde && !hasta) return true;
      const f = String(r.period ?? '').slice(0, 10);
      if (!f) return false;
      if (desde && f < desde) return false;
      if (hasta && f > hasta) return false;
      return true;
    });
    return {
      documentos: docs.length,
      documentosRestringidos: docs.filter((d) => d.access_level === 'audit_restricted').length,
      registros: enPeriodo.length,
      registrosTotal: registros.length,
      evidencias: M.evidence.length,
    };
  }, [desde, hasta]);

  const emitir = () => setEmitida({
    id: `inv_${Math.random().toString(36).slice(2, 10)}`,
    creada: new Date().toISOString().slice(0, 10),
    vence: addDays(dias),
    dias,
    modulos,
    framework: framework === 'todos' ? null : framework,
    periodo: desde || hasta ? { desde: desde || null, hasta: hasta || null } : null,
    accessLevel: 'audit_restricted',
    readOnly: true,
    estado: 'active',
  });

  return (
    <div className="dash-card">
      <div className="dash-section-header">
        <span className="dash-section-title">Acceso temporal de auditor externo</span>
        <span className="inst-origin-badge">Sólo lectura</span>
      </div>

      <p className="inst-trajectory-lead">
        La institución habilita a un tercero por un plazo acotado en vez de volver a
        preparar PDFs, Excels y carpetas de evidencia. Terminada la auditoría, el acceso
        vence o se revoca.
      </p>

      <div className="cfg-grant">
        <fieldset className="cfg-fieldset">
          <legend>Vigencia</legend>
          <div className="cfg-chips">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                className={`cfg-chip${dias === d ? ' on' : ''}`}
                onClick={() => setDias(d)}
              >
                {d} días
              </button>
            ))}
          </div>
          <p className="cfg-hint">Vence el {addDays(dias)}. Revocable en cualquier momento.</p>
        </fieldset>

        <fieldset className="cfg-fieldset">
          <legend>Qué puede consultar</legend>
          <div className="cfg-chips">
            {GRANTABLE.map((id) => (
              <button
                key={id}
                type="button"
                className={`cfg-chip${modulos.includes(id) ? ' on' : ''}`}
                onClick={() => toggle(id)}
              >
                {MODULES[id].label}
              </button>
            ))}
          </div>
          <p className="cfg-hint">
            Configuración no es delegable: un auditor consulta, no administra.
          </p>
        </fieldset>

        <fieldset className="cfg-fieldset">
          <legend>Alcance</legend>
          <div className="act-filters" style={{ padding: 0 }}>
            <label className="act-filter">
              <span>Framework</span>
              <select value={framework} onChange={(e) => setFramework(e.target.value)}>
                <option value="todos">Todos</option>
                {frameworks.filter((f) => f.external).map((f) => (
                  <option key={f.id} value={f.id}>{f.label}</option>
                ))}
              </select>
            </label>
            <label className="act-filter">
              <span>Desde</span>
              <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </label>
            <label className="act-filter">
              <span>Hasta</span>
              <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </label>
          </div>
        </fieldset>
      </div>

      {/* El conteo sale del dataset real con visibleAt(), no de un número fijo. */}
      <div className="mod-scaffold-stats" style={{ borderBottom: 0 }}>
        <div className="mod-scaffold-stat">
          <div className="mod-scaffold-stat-value">{modulos.length}</div>
          <div className="mod-scaffold-stat-label">Módulos habilitados</div>
        </div>
        <div className="mod-scaffold-stat">
          <div className="mod-scaffold-stat-value">{alcance.documentos}</div>
          <div className="mod-scaffold-stat-label">
            Documentos · {alcance.documentosRestringidos} de acceso restringido
          </div>
        </div>
        <div className="mod-scaffold-stat">
          <div className="mod-scaffold-stat-value">{alcance.registros}</div>
          <div className="mod-scaffold-stat-label">
            Registros auditables{alcance.registros !== alcance.registrosTotal ? ` de ${alcance.registrosTotal}` : ''}
          </div>
        </div>
        <div className="mod-scaffold-stat">
          <div className="mod-scaffold-stat-value">{alcance.evidencias}</div>
          <div className="mod-scaffold-stat-label">Evidencias</div>
        </div>
      </div>

      <button
        type="button"
        className="cfg-emit"
        onClick={emitir}
        disabled={modulos.length === 0}
      >
        Generar invitación
      </button>

      {emitida && (
        <div className="cfg-invite">
          <div className="dash-nav-group-label">Invitación generada</div>
          <dl className="udash-node-facts">
            <div><dt>ID</dt><dd className="udash-node-mono">{emitida.id}</dd></div>
            <div><dt>Vigencia</dt><dd>{emitida.creada} → {emitida.vence} ({emitida.dias} días)</dd></div>
            <div><dt>Módulos</dt><dd>{emitida.modulos.map((m) => MODULES[m].label).join(', ')}</dd></div>
            <div><dt>Nivel de acceso</dt><dd>{M.accessLabel(emitida.accessLevel)}</dd></div>
            <div><dt>Permisos</dt><dd>Sólo lectura · sin cargar, editar ni borrar</dd></div>
            {emitida.framework && (
              <div>
                <dt>Framework</dt>
                <dd>{frameworks.find((f) => f.id === emitida.framework)?.label}</dd>
              </div>
            )}
            {emitida.periodo && (
              <div>
                <dt>Período</dt>
                <dd>{emitida.periodo.desde ?? 'inicio'} → {emitida.periodo.hasta ?? 'hoy'}</dd>
              </div>
            )}
          </dl>
          <p className="mod-scaffold-note">
            Este objeto es la forma que tendría la invitación real. Todavía no se persiste ni
            se emite un token: falta el backend. Lo que sí es real es el alcance — se calcula
            con las mismas funciones de acceso que ya filtran el Data Room y la Auditoría,
            así que cuando se conecte la autenticación el auditor ve exactamente esto.
          </p>
        </div>
      )}

      <p className="mod-scaffold-note">
        Sustain no reemplaza a la consultora ni a la certificación: es la infraestructura de
        datos, evidencia y trazabilidad sobre la que el auditor trabaja.
      </p>
    </div>
  );
}
