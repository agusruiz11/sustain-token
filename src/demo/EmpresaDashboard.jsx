import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { COMPANIES, COMPANY_LIST } from './data/companies';
import DashSidebar from './components/DashSidebar';
import ChartLine from './components/ChartLine';
import ChartDonut from './components/ChartDonut';
import AuditTrail from './components/AuditTrail';
import './demo.css';

export default function EmpresaDashboard() {
  const { slug } = useParams();
  const co = COMPANIES[slug];

  if (!co) return <Navigate to="/demo" replace />;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const otherCos = COMPANY_LIST.filter((c) => c.slug !== slug);

  return (
    <div className="dash-layout">
      <DashSidebar
        mode="empresa"
        wallet={co.wallet}
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
            <div
              className="dash-topbar-company-avatar"
              style={co.initialsStyle}
            >
              {co.initials}
            </div>
            <div>
              <div className="dash-topbar-company-name">{co.name}</div>
              <div className="dash-topbar-company-sub dash-topbar-hide-mobile">{co.tagline}</div>
            </div>
          </div>
          <div className="dash-topbar-right">
            <div className="dash-verified-badge">VERIFICADO</div>
            <span className="dash-topbar-hide-mobile" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-300)' }}>
              📍 {co.location}
            </span>
            <span className="dash-topbar-hide-mobile" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-300)' }}>
              Miembro desde {co.memberSince}
            </span>
            <div className="dash-topbar-dots">
              <span /><span /><span />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dash-content">

          {/* KPI Stats */}
          <div className="dash-stats-grid">
            {co.stats.map((s) => (
              <div key={s.label} className="dash-stat-card">
                <div className="dash-stat-card-top">
                  <div className="dash-stat-card-label">{s.label}</div>
                  <div className="dash-stat-card-icon">{s.icon}</div>
                </div>
                <div className="dash-stat-card-value">{s.value}</div>
                <div className={`dash-stat-card-delta${s.deltaUp ? ' dash-stat-card-delta--up' : ' dash-stat-card-delta--neutral'}`}>
                  {s.deltaUp && '↑ '}{s.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="dash-charts-grid">
            <div className="dash-card">
              <div className="dash-card-title">{co.chartLine.title}</div>
              <ChartLine
                series={co.chartLine.series}
                months={co.chartLine.months}
                yMax={co.chartLine.yMax}
                yLabel={co.chartLine.yLabel}
              />
            </div>
            <div className="dash-card">
              <div className="dash-card-title">{co.chartDonut.title}</div>
              <ChartDonut
                segments={co.chartDonut.segments}
                totalLabel={co.chartDonut.totalLabel}
                totalSub={co.chartDonut.totalSub}
              />
            </div>
          </div>

          {/* Tables row */}
          <div className="dash-tables-grid">
            {/* Productos más activos */}
            <div className="dash-card">
              <div className="dash-section-header">
                <span className="dash-section-title">Productos Más Activos</span>
                <a href="#" className="dash-section-link">Ver todos →</a>
              </div>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style={{ textAlign: 'right' }}>Uds.</th>
                    <th style={{ textAlign: 'right' }}>Impacto</th>
                  </tr>
                </thead>
                <tbody>
                  {co.products.map((p) => (
                    <tr key={p.name}>
                      <td>
                        <div className="dash-table-product-name">
                          <div className="dash-table-product-icon">{p.img}</div>
                          {p.name}
                        </div>
                      </td>
                      <td>
                        <span className="dash-table-val">{p.units}</span>
                      </td>
                      <td>
                        <span className="dash-table-val-green">{p.impacto}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top compradores */}
            <div className="dash-card">
              <div className="dash-section-header">
                <span className="dash-section-title">Top Compradores por Impacto</span>
                <a href="#" className="dash-section-link">Ver ranking →</a>
              </div>
              {co.topBuyers.map((b) => (
                <div key={b.name} className="dash-buyer-row">
                  <div className="dash-buyer-avatar">{b.name[0]}</div>
                  <div className="dash-buyer-info">
                    <div className="dash-buyer-name">{b.name}</div>
                    <div className="dash-buyer-detail">{b.purchases} compras</div>
                  </div>
                  <div className="dash-buyer-impact">{b.impact}</div>
                </div>
              ))}
            </div>

            {/* Últimas acciones */}
            <div className="dash-card">
              <div className="dash-section-header">
                <span className="dash-section-title">Últimas Acciones Verificadas</span>
                <a href="#" className="dash-section-link">Ver todas →</a>
              </div>
              {co.recentActions.map((a, i) => (
                <div key={i} className="dash-action-row">
                  <div className="dash-action-dot" />
                  <div className="dash-action-info">
                    <div className="dash-action-name">{a.action}</div>
                    <div className="dash-action-date">{a.date}</div>
                  </div>
                  <div className="dash-action-delta">+{a.delta.replace('+', '')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications + Audit side by side */}
          <div className="dash-two-col-grid">
            <div className="dash-card">
              <div className="dash-section-header">
                <span className="dash-section-title">Certificaciones y Alianzas</span>
              </div>
              <div className="dash-certs-grid">
                {co.certifications.map((cert) => (
                  <div key={cert.name} className="dash-cert-row">
                    <div
                      className="dash-cert-icon"
                      style={{ background: `${cert.color}18` }}
                    >
                      {cert.color === '#1E9E72' ? '🛡️' : cert.color === '#29DDF5' ? '🤝' : '⭐'}
                    </div>
                    <span className="dash-cert-name">{cert.name}</span>
                    <span
                      className="dash-cert-status"
                      style={{
                        background: `${cert.color}15`,
                        border: `1px solid ${cert.color}40`,
                        color: cert.color,
                      }}
                    >
                      {cert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Otros nodos */}
            <div className="dash-card">
              <div className="dash-section-header">
                <span className="dash-section-title">Otros Nodos Circulares</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {otherCos.map((other) => {
                  const otherData = COMPANIES[other.slug];
                  return (
                    <Link
                      key={other.slug}
                      to={`/demo/empresa/${other.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        background: 'var(--bg-200)',
                        border: '1px solid var(--line-300)',
                        borderRadius: 'var(--r-md)',
                        textDecoration: 'none',
                        transition: 'border-color 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = otherData.accentColor}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--line-300)'}
                    >
                      <div
                        style={{
                          ...otherData.initialsStyle,
                          width: 32, height: 32,
                          borderRadius: 8,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 800,
                          fontFamily: 'var(--font-display)',
                          flexShrink: 0,
                        }}
                      >
                        {otherData.initials}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#C8D8F0' }}>{other.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--ink-300)', fontFamily: 'var(--font-mono)' }}>
                          {other.tagline}
                        </div>
                      </div>
                      <span style={{ color: otherData.accentColor, fontSize: 12 }}>→</span>
                    </Link>
                  );
                })}
                <Link
                  to="/demo/usuario"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    background: 'rgba(41,221,245,0.05)',
                    border: '1px solid rgba(41,221,245,0.15)',
                    borderRadius: 'var(--r-md)',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-500), var(--green-600))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#03151A',
                    fontFamily: 'var(--font-display)', flexShrink: 0,
                  }}>
                    M
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#C8D8F0' }}>Panel Usuario Final</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-300)', fontFamily: 'var(--font-mono)' }}>
                      Ver experiencia del comprador
                    </div>
                  </div>
                  <span style={{ color: 'var(--brand-500)', fontSize: 12 }}>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <AuditTrail audit={co.audit} />
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
              <span>Validación automática con IA, OCR y reglas de verificación</span>
            </div>
          </div>
          <div className="dash-footer-item">
            <div className="dash-footer-icon">📦</div>
            <div className="dash-footer-text">
              <strong>Transparencia Total</strong>
              <span>Trazabilidad, integridad y evidencia pública</span>
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
