import { Link } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { actionsForNode } from '../data/actions';
import { moduleHref } from '../data/nodeTypes';

const MODULE_STATUS_STYLE = {
  active: { color: '#1E9E72' },
  loading: { color: '#29DDF5' },
  pending: { color: '#3E5E92' },
  scoping: { color: '#B8860B' },
  /* Categoría con historia documentada pero sin verificación Sustain.
     Color propio para que no se confunda con 'active' de un vistazo. */
  historical: { color: '#8A7BB8' },
};

/**
 * Home institucional — Entregable 3 § 4.1.
 *
 * Reescrito el 18 ago 2026. Antes mostraba el chart de consumo vs. línea base,
 * 8 facturas EDESUR en el Data Room, 4 "últimas acciones verificadas" y 4
 * badges de energía. Todo eso era del nodo personal de Martín, no de la
 * escuela.
 *
 * La regla del Entregable 3 es que "Trayectoria institucional" y "Acciones
 * verificadas" tienen que estar separadas visualmente y no sumarse entre sí:
 * importar historia no genera SES ni cuenta como verificación.
 */
export default function HomeEscuela() {
  const { node, routeSegment } = useNode();
  const inst = node.data;
  const verified = actionsForNode(node);
  const t = inst.trajectory;

  return (
    <>
      <div className="dash-stats-grid">
        {inst.stats.map((s) => (
          <div key={s.label} className="dash-stat-card">
            <div className="dash-stat-card-top">
              <div className="dash-stat-card-label">{s.label}</div>
              <div className="dash-stat-card-icon">{s.icon}</div>
            </div>
            <div className="dash-stat-card-value">{s.value}</div>
            <div
              className={`dash-stat-card-delta${s.deltaUp === true ? ' dash-stat-card-delta--up' : s.deltaUp === false ? '' : ' dash-stat-card-delta--neutral'}`}
              style={s.deltaUp === false ? { color: '#E0637A' } : undefined}
            >
              {s.deltaUp === true && '↑ '}{s.deltaUp === false && '↓ '}{s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Las dos naturalezas de dato, lado a lado y explícitamente distintas.
          Es el punto central del Entregable 3. */}
      <div className="dash-two-col-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Acciones verificadas Sustain</span>
          </div>
          {verified.length === 0 ? (
            <div className="inst-empty">
              <div className="inst-empty-mark" aria-hidden="true">◌</div>
              <p className="inst-empty-title">Todavía no hay acciones verificadas</p>
              <p className="inst-empty-text">
                La verificación Sustain empieza cuando la institución carga evidencia
                por el pipeline. El histórico documentado que ves abajo no genera SES
                ni cuenta como acción verificada.
              </p>
            </div>
          ) : (
            verified.slice(0, 5).map((a) => (
              <div key={a.id} className="dash-action-row">
                <div className="dash-action-dot" />
                <div className="dash-action-info">
                  <div className="dash-action-name">{a.title}</div>
                  <div className="dash-action-date">{a.dateLabel}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Trayectoria institucional</span>
            <span className="inst-origin-badge">Histórico documentado</span>
          </div>
          <p className="inst-trajectory-lead">
            Información incorporada desde el expediente institucional.
            Desde {inst.historicalDataStart?.slice(0, 4)}.
          </p>
          <dl className="inst-trajectory-grid">
            <div><dt>Programas</dt><dd>{t.programs}</dd></div>
            <div><dt>Proyectos</dt><dd>{t.projects}</dd></div>
            <div><dt>Indicadores</dt><dd>{t.indicators}</dd></div>
            <div><dt>Mediciones</dt><dd>{t.measurements}</dd></div>
            <div><dt>Documentos</dt><dd>{t.documents}</dd></div>
            <div><dt>Evidencias</dt><dd>{t.evidence}</dd></div>
          </dl>
          <p className="inst-trajectory-note">
            No suma al contador de acciones verificadas ni modifica el SES.
          </p>

          {/* § 4.1: acceso al histórico. Timeline entra directamente filtrado
              por origen, así el click no aterriza en una vista mezclada. */}
          <div className="idt-traj-links">
            <Link
              to={`${moduleHref(node.nodeTypeId, node.slug, 'timeline', routeSegment)}`}
              className="idt-traj-link"
            >
              Ver histórico institucional →
            </Link>
            <Link
              to={moduleHref(node.nodeTypeId, node.slug, 'instituciones', routeSegment)}
              className="idt-traj-link"
            >
              Ver perfil institucional →
            </Link>
          </div>
        </div>
      </div>

      <div className="dash-two-col-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Categorías con actividad documentada</span>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {inst.modules.map((m) => {
                const style = MODULE_STATUS_STYLE[m.status] ?? MODULE_STATUS_STYLE.pending;
                return (
                  <tr key={m.name}>
                    <td>
                      <div className="dash-table-product-name">
                        <div className="dash-table-product-icon">{m.icon}</div>
                        {m.name}
                      </div>
                    </td>
                    <td>
                      <span
                        className="dash-cert-status"
                        style={{
                          background: `${style.color}15`,
                          border: `1px solid ${style.color}40`,
                          color: style.color,
                        }}
                      >
                        {m.statusLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--ink-300)' }}>{m.metric}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Roadmap del Piloto · 3 meses</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {inst.roadmap.map((r, i) => (
              <div
                key={r.step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  background: 'var(--bg-200)',
                  border: '1px solid var(--line-300)',
                  borderRadius: 'var(--r-md)',
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#03151A',
                  background: 'linear-gradient(135deg, var(--brand-500), var(--green-600))',
                  fontFamily: 'var(--font-display)', flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-500)', fontFamily: 'var(--font-mono)' }}>{r.step}</div>
                  <div style={{ fontSize: 12, color: '#C8D8F0' }}>{r.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* COA vive acá y no en la taxonomía core: el mismo sistema tiene que
              servir mañana para otra escuela con otra certificación (IR-010). */}
          <div className="dash-section-header" style={{ marginTop: 18 }}>
            <span className="dash-section-title">Frameworks externos</span>
          </div>
          <div className="dash-certs-grid">
            {inst.frameworks.map((f) => (
              <div key={f.id} className="dash-cert-row">
                <div className="dash-cert-icon" style={{ background: 'rgba(138,123,184,0.14)' }}>◇</div>
                <span className="dash-cert-name">{f.name}</span>
                <span className="dash-cert-status inst-framework-chip">{f.version}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* La escuela no tiene anclaje criptográfico porque ninguna acción pasó
          por el pipeline. Su trazabilidad es documental — Entregable 3 § 4.7. */}
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Trazabilidad</span>
          <span className="inst-origin-badge">Documental</span>
        </div>
        <p className="inst-trajectory-note" style={{ marginTop: 0 }}>
          {inst.auditNote}
        </p>
      </div>
    </>
  );
}
