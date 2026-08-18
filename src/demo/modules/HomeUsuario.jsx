import { useNode } from '../components/useNode';
import ChartLine from '../components/ChartLine';
import AuditTrail from '../components/AuditTrail';

/**
 * Home del usuario final. Cuerpo extraído de UsuarioFinal.jsx sin cambios de
 * diseño; el shell aporta sidebar, topbar y footer.
 */
export default function HomeUsuario() {
  const { node } = useNode();
  const u = node.data;

  return (
    <>
      <div className="udash-hero">
        <div className="udash-hero-left">
          <div className="udash-hero-greeting">
            Hola <span>{u.name}!</span> 🌱
          </div>
          <div className="udash-hero-sub">
            Cada acción cuenta. Ya generaste un impacto real y verificable.
          </div>
        </div>
        <div className="udash-hero-meta">
          <div className="udash-hero-kpi">
            <div className="udash-hero-kpi-label">SES Actual</div>
            <div className="udash-hero-kpi-val">{u.sesScore}</div>
            <div className="udash-hero-kpi-sub">Puntos</div>
          </div>
          {/* Posición global y racha salieron del hero: no existen en la
              fuente canónica y mostrarlas obligaba a inventarlas. En su lugar
              van dos datos que sí están en node_state.json. */}
          <div className="udash-hero-kpi">
            <div className="udash-hero-kpi-label">Nivel</div>
            <div className="udash-hero-kpi-val" style={{ fontSize: '18px' }}>{u.sesLevelName}</div>
            <div className="udash-hero-kpi-sub">Level {u.sesLevelNum}</div>
          </div>
          <div className="udash-hero-kpi">
            <div className="udash-hero-kpi-label">Acciones Verificadas</div>
            <div className="udash-hero-kpi-val">{u.verifiedActions}</div>
            <div className="udash-hero-kpi-sub">Total</div>
          </div>
          <div className="udash-hero-kpi">
            <div className="udash-hero-kpi-label">Verificado desde</div>
            <div className="udash-hero-kpi-val" style={{ fontSize: '18px' }}>Nov 2025</div>
            <div className="udash-hero-kpi-sub">{u.verifiedSince}</div>
          </div>
        </div>
      </div>

      <div className="udash-main-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="dash-card">
            <div className="dash-section-header">
              <span className="dash-section-title">Mis Acciones Recientes</span>
              <a href="#" className="dash-section-link">Ver todas →</a>
            </div>
            {u.recentActions.map((a, i) => (
              <div key={i} className="udash-action-row">
                <div className="udash-action-icon" style={{ background: `${a.color}15` }}>
                  {a.icon}
                </div>
                <div className="udash-action-info">
                  <div className="udash-action-name">{a.name}</div>
                  <div className="udash-action-detail">{a.detail}</div>
                </div>
                <div className="udash-action-right">
                  <div className="udash-action-value">{a.value}</div>
                  <div className="udash-action-pts">{a.pts > 0 ? '+' : ''}{a.pts} pts</div>
                </div>
                <span className="udash-verified-chip">VERIFICADA</span>
                <span className="udash-action-date">{a.date}</span>
              </div>
            ))}
          </div>

          <div className="dash-card">
            <div className="dash-section-header">
              <span className="dash-section-title">{u.chartLine.title}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)' }}>
                {u.chartLine.subtitle}
              </span>
            </div>
            <ChartLine
              series={u.chartLine.series}
              months={u.chartLine.months}
              yMax={u.chartLine.yMax}
              yLabel="SES"
              height={180}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="udash-ses-card">
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--ink-300)',
              marginBottom: '4px',
            }}>
              Tu Sustain Score
            </div>
            <div className="udash-ses-score">{u.sesScore}</div>
            <div className="udash-ses-level">● {u.sesLevel}</div>
            {/* La barra medía contra un "próximo nivel" de 1000 pts que no
                existe: los umbrales de nivel no están en la fuente canónica.
                Se mide contra la escala real del SES (0-1000 acumulativo) y
                no se promete un salto de nivel que no podemos ubicar. */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--ink-300)',
              marginBottom: '8px',
            }}>
              {u.sesMode === 'score_only' ? 'Modo score_only · sin recompensa' : u.sesMode}
            </div>
            <div className="udash-ses-progress-bar">
              <div
                className="udash-ses-progress-fill"
                style={{ width: `${(u.sesScore / u.sesScaleMax) * 100}%` }}
              />
            </div>
            <div className="udash-ses-progress-meta">
              <span>{u.sesScore} / {u.sesScaleMax}</span>
              <span>{u.sesLastDelta > 0 ? '+' : ''}{u.sesLastDelta} en la última acción</span>
            </div>
            <a
              href="#"
              style={{
                display: 'block',
                marginTop: '12px',
                textAlign: 'center',
                padding: '8px',
                background: 'rgba(41,221,245,0.08)',
                border: '1px solid rgba(41,221,245,0.2)',
                borderRadius: 'var(--r-md)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--brand-300)',
                textDecoration: 'none',
              }}
            >
              Ver detalle del score →
            </a>
          </div>

          <div className="dash-card">
            <div className="dash-card-title">Impacto Total Generado</div>
            <div className="udash-impact-grid">
              {u.impactTotals.map((item) => (
                <div key={item.label} className="udash-impact-row">
                  <span className="udash-impact-icon">{item.icon}</span>
                  <span className="udash-impact-label">{item.label}</span>
                  <span className="udash-impact-value" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#"
              style={{
                display: 'block',
                marginTop: '12px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--brand-500)',
                textDecoration: 'none',
              }}
            >
              Ver historial completo →
            </a>
          </div>
        </div>
      </div>

      <div className="udash-bottom-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Insignias</span>
            <a href="#" className="dash-section-link">Ver todas →</a>
          </div>
          <div className="udash-badges-grid">
            {u.badges.map((b) => (
              <div
                key={b.name}
                className="udash-badge"
                style={{ borderColor: b.earned ? `${b.color}30` : 'var(--line-300)' }}
              >
                <div className="udash-badge-icon">{b.icon}</div>
                <div className="udash-badge-name">{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* La tarjeta "Impacto en la Comunidad" (37 personas inspiradas) y el
            saldo de wallet (178.45 $SUS) se retiraron: ninguna de las dos
            métricas existe en la fuente canónica y el nodo corre en
            reward_enabled: false / mode: score_only — no hay tokens que mostrar.
            Vuelven cuando el protocolo las emita de verdad. */}
        <div className="dash-card">
          <div className="dash-card-title">Identidad del nodo</div>
          <dl className="udash-node-facts">
            <div>
              <dt>Node ID</dt>
              <dd className="udash-node-mono">{u.nodeId}</dd>
            </div>
            <div>
              <dt>Tipo</dt>
              <dd>Individual · nodo personal</dd>
            </div>
            <div>
              <dt>Identidad ambiental</dt>
              <dd>{u.sesLevel}</dd>
            </div>
            <div>
              <dt>Política SES</dt>
              <dd className="udash-node-mono">{u.sesPolicy}</dd>
            </div>
            <div>
              <dt>Recompensa</dt>
              <dd>Deshabilitada · modo score_only</dd>
            </div>
          </dl>
        </div>
      </div>

      <AuditTrail audit={u.audit} />
    </>
  );
}
