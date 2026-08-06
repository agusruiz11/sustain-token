import { Link } from 'react-router-dom';
import { useNode } from '../components/useNode';
import { COMPANIES, COMPANY_LIST } from '../data/companies';
import ChartLine from '../components/ChartLine';
import ChartDonut from '../components/ChartDonut';
import AuditTrail from '../components/AuditTrail';

/**
 * Home de empresa. Cuerpo extraído de EmpresaDashboard.jsx sin cambios de
 * diseño; el shell aporta sidebar, topbar y footer.
 */
export default function HomeEmpresa() {
  const { node } = useNode();
  const co = node.data;
  const otherCos = COMPANY_LIST.filter((c) => c.slug !== node.slug);

  return (
    <>
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

      <div className="dash-tables-grid">
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
                  <td><span className="dash-table-val">{p.units}</span></td>
                  <td><span className="dash-table-val-green">{p.impacto}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      <div className="dash-two-col-grid">
        <div className="dash-card">
          <div className="dash-section-header">
            <span className="dash-section-title">Certificaciones y Alianzas</span>
          </div>
          <div className="dash-certs-grid">
            {co.certifications.map((cert) => (
              <div key={cert.name} className="dash-cert-row">
                <div className="dash-cert-icon" style={{ background: `${cert.color}18` }}>
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

      <AuditTrail audit={co.audit} />
    </>
  );
}
