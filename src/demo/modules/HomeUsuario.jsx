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
          <div className="udash-hero-kpi">
            <div className="udash-hero-kpi-label">Posición Global</div>
            <div className="udash-hero-kpi-val" style={{ fontSize: '18px' }}>{u.globalRank}</div>
            <div className="udash-hero-kpi-sub">{u.globalRankNum}</div>
          </div>
          <div className="udash-hero-kpi">
            <div className="udash-hero-kpi-label">Acciones Verificadas</div>
            <div className="udash-hero-kpi-val">{u.verifiedActions}</div>
            <div className="udash-hero-kpi-sub">Total</div>
          </div>
          <div className="udash-hero-kpi">
            <div className="udash-hero-kpi-label">Racha Activa</div>
            <div className="udash-hero-kpi-val">
              {u.activeStreak}
              <span className="udash-hero-kpi-fire">🔥</span>
            </div>
            <div className="udash-hero-kpi-sub">días</div>
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
                  <div className="udash-action-pts">+{a.pts} pts</div>
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
              yMax={1000}
              yLabel="pts/L/kg"
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
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--ink-300)',
              marginBottom: '8px',
            }}>
              Nivel {u.sesLevelNum} de {u.sesLevelMax}
            </div>
            <div className="udash-ses-progress-bar">
              <div className="udash-ses-progress-fill" style={{ width: `${u.sesProgress}%` }} />
            </div>
            <div className="udash-ses-progress-meta">
              <span>{u.sesProgress}%</span>
              <span>Próximo nivel: {u.sesNextLevel} pts</span>
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

        <div className="dash-card">
          <div className="dash-card-title">Impacto en la Comunidad</div>
          <div className="udash-community-card">
            <div className="udash-community-label">Tu impacto inspira a otros</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ display: 'flex' }}>
                {u.communityAvatars.map((letter, i) => (
                  <div key={i} className="udash-comm-avatar" style={{ zIndex: 5 - i }}>
                    {letter}
                  </div>
                ))}
              </div>
              <span className="udash-community-count">+ {u.communityInspired} personas</span>
            </div>
            <p className="udash-community-text">han sido inspiradas por tus acciones</p>
            <a
              href="#"
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--brand-500)',
                textDecoration: 'none',
              }}
            >
              Ver comunidad →
            </a>
          </div>

          <div style={{
            marginTop: '14px',
            padding: '14px',
            background: 'var(--bg-200)',
            border: '1px solid var(--line-300)',
            borderRadius: 'var(--r-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--ink-300)', marginBottom: '4px' }}>
                SUS Wallet
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 600, color: 'var(--brand-300)' }}>
                {u.wallet} <span style={{ fontSize: '12px', color: 'var(--ink-300)' }}>$SUS</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--ink-300)', marginTop: '2px' }}>
                Disponible
              </div>
            </div>
            <a href="#" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--brand-300)',
              padding: '7px 12px',
              background: 'rgba(41,221,245,0.08)',
              border: '1px solid rgba(41,221,245,0.2)',
              borderRadius: 'var(--r-md)',
              textDecoration: 'none',
            }}>
              Ver →
            </a>
          </div>
        </div>
      </div>

      <AuditTrail audit={u.audit} />
    </>
  );
}
