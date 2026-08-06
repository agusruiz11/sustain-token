import { useNode } from '../components/useNode';
import ChartLine from '../components/ChartLine';
import ChartDonut from '../components/ChartDonut';
import AuditTrail from '../components/AuditTrail';

const MODULE_STATUS_STYLE = {
  active: { color: '#1E9E72', label: 'Activo' },
  loading: { color: '#29DDF5', label: 'En carga' },
  pending: { color: '#3E5E92', label: 'Próximo' },
  scoping: { color: '#B8860B', label: 'Por definir' },
};

/**
 * Home institucional. Es el cuerpo que antes vivía dentro de
 * InstitucionDashboard.jsx, sin cambios de diseño: el shell ahora aporta
 * sidebar, topbar y footer.
 */
export default function HomeEscuela() {
  const { node } = useNode();
  const inst = node.data;

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

      <div className="dash-charts-grid">
        <div className="dash-card">
          <div className="dash-card-title">{inst.chartLine.title}</div>
          <ChartLine
            series={inst.chartLine.series}
            months={inst.chartLine.months}
            yMax={inst.chartLine.yMax}
            yLabel={inst.chartLine.yLabel}
          />
        </div>
        <div className="dash-card">
          <div className="dash-card-title">{inst.chartDonut.title}</div>
          <ChartDonut
            segments={inst.chartDonut.segments}
            totalLabel={inst.chartDonut.totalLabel}
            totalSub={inst.chartDonut.totalSub}
          />
        </div>
      </div>

      <div className="dash-tables-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Módulos Sustain</span>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {inst.modules.map((m) => {
                const style = MODULE_STATUS_STYLE[m.status];
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
            <span className="dash-section-title">Data Room · Evidencia</span>
            <a href="#" className="dash-section-link">Ver todo →</a>
          </div>
          {inst.evidence.slice(0, 5).map((e, i) => (
            <div key={i} className="dash-buyer-row">
              <div className="dash-buyer-avatar">📄</div>
              <div className="dash-buyer-info">
                <div className="dash-buyer-name">{e.label}</div>
                <div className="dash-buyer-detail">{e.kind}</div>
              </div>
              <div className="dash-buyer-impact">{e.date}</div>
            </div>
          ))}
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Últimas Acciones Verificadas</span>
            <a href="#" className="dash-section-link">Ver todas →</a>
          </div>
          {inst.recentActions.map((a, i) => (
            <div key={i} className="dash-action-row">
              <div className="dash-action-dot" />
              <div className="dash-action-info">
                <div className="dash-action-name">{a.action}</div>
                <div className="dash-action-date">{a.date} · {a.note}</div>
              </div>
              <div
                className="dash-action-delta"
                style={a.delta < 0 ? { color: '#E0637A' } : undefined}
              >
                {a.delta > 0 ? `+${a.delta}` : a.delta} SES
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-two-col-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Badges Obtenidos</span>
          </div>
          <div className="dash-certs-grid">
            {inst.badges.map((b, i) => (
              <div key={i} className="dash-cert-row">
                <div className="dash-cert-icon" style={{ background: `${b.color}18` }}>🏅</div>
                <span className="dash-cert-name">{b.name}</span>
                <span
                  className="dash-cert-status"
                  style={{
                    background: `${b.color}15`,
                    border: `1px solid ${b.color}40`,
                    color: b.color,
                  }}
                >
                  {b.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Roadmap del Piloto · 3 meses</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {inst.roadmap.map((r, i) => (
              <div
                key={i}
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
        </div>
      </div>

      <AuditTrail audit={inst.audit} />
    </>
  );
}
