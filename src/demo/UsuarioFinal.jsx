import { useState } from 'react';
import { Link } from 'react-router-dom';
import { USER } from './data/user';
import DashSidebar from './components/DashSidebar';
import ChartLine from './components/ChartLine';
import AuditTrail from './components/AuditTrail';
import './demo.css';

export default function UsuarioFinal() {
  const u = USER;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dash-layout">
      <DashSidebar
        mode="usuario"
        wallet={u.wallet}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button
              className="dash-hamburger"
              onClick={() => setSidebarOpen(true)}
              type="button"
              aria-label="Abrir menú"
            >
              <span /><span /><span />
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brand-500), #1E9E72)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 800,
              color: '#03151A', flexShrink: 0,
            }}>
              M
            </div>
            <div>
              <div className="dash-topbar-company-name">{u.fullName}</div>
              <div className="dash-topbar-company-sub dash-topbar-hide-mobile">{u.handle}</div>
            </div>
          </div>
          <div className="dash-topbar-right">
            <div className="dash-verified-badge">VERIFICADO</div>
            <span className="dash-topbar-hide-mobile" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--amber-600)' }}>
              🔥 Racha: {u.activeStreak} días
            </span>
            <span className="dash-topbar-hide-mobile" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-300)' }}>
              {u.globalRank} · {u.globalRankNum}
            </span>
            <div className="dash-topbar-dots">
              <span /><span /><span />
            </div>
          </div>
        </header>

        <main className="dash-content">

          {/* Hero welcome */}
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

          {/* Main 2-col layout */}
          <div className="udash-main-grid">

            {/* Left: actions + chart */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Recent actions */}
              <div className="dash-card">
                <div className="dash-section-header">
                  <span className="dash-section-title">Mis Acciones Recientes</span>
                  <a href="#" className="dash-section-link">Ver todas →</a>
                </div>
                {u.recentActions.map((a, i) => (
                  <div key={i} className="udash-action-row">
                    <div
                      className="udash-action-icon"
                      style={{ background: `${a.color}15` }}
                    >
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
                    <span className="udash-action-date">
                      {a.date}
                    </span>
                  </div>
                ))}
              </div>

              {/* Evolution chart */}
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

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* SES Score card */}
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
                  <div
                    className="udash-ses-progress-fill"
                    style={{ width: `${u.sesProgress}%` }}
                  />
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

              {/* Impact totals */}
              <div className="dash-card">
                <div className="dash-card-title">Impacto Total Generado</div>
                <div className="udash-impact-grid">
                  {u.impactTotals.map((item) => (
                    <div key={item.label} className="udash-impact-row">
                      <span className="udash-impact-icon">{item.icon}</span>
                      <span className="udash-impact-label">{item.label}</span>
                      <span
                        className="udash-impact-value"
                        style={{ color: item.color }}
                      >
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

          {/* Badges + Community row */}
          <div className="udash-bottom-grid">

            {/* Badges */}
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

            {/* Community */}
            <div className="dash-card">
              <div className="dash-card-title">Impacto en la Comunidad</div>
              <div className="udash-community-card">
                <div className="udash-community-label">Tu impacto inspira a otros</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex' }}>
                    {u.communityAvatars.map((letter, i) => (
                      <div
                        key={i}
                        className="udash-comm-avatar"
                        style={{ zIndex: 5 - i }}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>
                  <span className="udash-community-count">
                    + {u.communityInspired} personas
                  </span>
                </div>
                <p className="udash-community-text">
                  han sido inspiradas por tus acciones
                </p>
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

              {/* SUS Wallet mini */}
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

          {/* Audit Trail */}
          <AuditTrail audit={u.audit} />
        </main>

        {/* Footer strip */}
        <footer className="dash-footer-strip">
          <div className="dash-footer-item">
            <div className="dash-footer-icon">🔒</div>
            <div className="dash-footer-text">
              <strong>Registro Inmutable</strong>
              <span>Todas las acciones están respaldadas en blockchain</span>
            </div>
          </div>
          <div className="dash-footer-item">
            <div className="dash-footer-icon">🧠</div>
            <div className="dash-footer-text">
              <strong>Verificación IA + MRV</strong>
              <span>Validación automática con IA, OCR y reglas de verificación MRV</span>
            </div>
          </div>
          <div className="dash-footer-item">
            <div className="dash-footer-icon">📦</div>
            <div className="dash-footer-text">
              <strong>Transparencia Total</strong>
              <span>Trazabilidad, integridad y evidencia pública y verificable</span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)' }}>
            <Link to="/demo" style={{ color: 'var(--brand-500)', textDecoration: 'none' }}>← Volver al Demo Hub</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
