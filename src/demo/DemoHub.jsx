import { Link } from 'react-router-dom';
/* Mismo problema que en la barra lateral: logo.png es opaco y sus esquinas son
   blancas, y esta nav también es oscura. */
import logo from '../assets/sustain-bird-logo-colorcombinado.png';
import { COMPANY_LIST, COMPANIES } from './data/companies';
import { INSTITUTION_LIST, INSTITUTIONS } from './data/institutions';
import { USER } from './data/user';

import './demo.css';

const CARD_ACCENTS = {
  zigzag: { accent: '#E8BEE0', bg: 'rgba(232,190,224,0.08)', tag: 'Textil' },
  sitopia: { accent: '#1E9E72', bg: 'rgba(30,158,114,0.08)', tag: 'Compostaje' },
  biopak: { accent: '#B8860B', bg: 'rgba(184,134,11,0.08)', tag: 'Packaging' },
};

export default function DemoHub() {
  return (
    <div className="demo-hub">
      <nav className="demo-hub-nav">
        <div className="demo-hub-nav-logo">
          <img src={logo} alt="Sustain Protocol" height={28} />
          Sustain Protocol
        </div>
        <a href="/" className="demo-hub-back">← Volver al sitio</a>
      </nav>

      <div className="demo-hub-content">
        <div className="demo-hub-hero">
          <div className="demo-hub-badge">
            <span className="demo-hub-badge-dot" />
            Demo Interactivo · Genesis Pilot
          </div>
          <h1>
            Explorá el <span>Panel Sustain</span>
          </h1>
          <p>
            Maqueta interactiva del sistema de gestión de impacto circular.
            Seleccioná una empresa nodo o la experiencia del usuario final.
          </p>
        </div>

        <div className="demo-hub-section-label">Paneles de Institución · Piloto Genesis</div>
        <div className="demo-hub-grid">
          {INSTITUTION_LIST.map((inst) => {
            const data = INSTITUTIONS[inst.slug];
            return (
              <Link
                key={inst.slug}
                to={`/demo/institucion/${inst.slug}`}
                className="demo-hub-card"
                style={{
                  '--card-accent': inst.accentColor,
                  '--card-accent-bg': data.accentBg,
                }}
              >
                <div className="demo-hub-card-header">
                  <div
                    className="demo-hub-card-avatar"
                    style={data.initialsStyle}
                  >
                    {data.initials}
                  </div>
                  <div
                    className="demo-hub-card-tag"
                    style={{
                      background: data.accentBg,
                      border: `1px solid ${inst.accentColor}44`,
                      color: inst.accentColor,
                    }}
                  >
                    Institución
                  </div>
                </div>
                <div className="demo-hub-card-name">{inst.name}</div>
                <div className="demo-hub-card-tagline">{data.location} · Piloto desde {data.memberSince}</div>
                <div className="demo-hub-card-stats">
                  <div className="demo-hub-card-stat">
                    <div className="demo-hub-card-stat-val">{data.stats[0].value}</div>
                    <div className="demo-hub-card-stat-lbl">{data.stats[0].label}</div>
                  </div>
                  <div className="demo-hub-card-stat">
                    <div className="demo-hub-card-stat-val">{data.stats[1].value}</div>
                    <div className="demo-hub-card-stat-lbl">{data.stats[1].label}</div>
                  </div>
                  <div className="demo-hub-card-stat">
                    <div
                      className="demo-hub-card-stat-val"
                      style={{ color: inst.accentColor }}
                    >
                      {data.stats[2].value}
                    </div>
                    <div className="demo-hub-card-stat-lbl">SES Score</div>
                  </div>
                </div>
                <div className="demo-hub-card-cta">
                  <div className="demo-hub-card-btn">
                    Ver Panel →
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)' }}>
                    Piloto Genesis
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="demo-hub-section-label" style={{ marginTop: '32px' }}>Paneles de Empresa · Nodos Circulares</div>
        <div className="demo-hub-grid">
          {COMPANY_LIST.map((co) => {
            const data = COMPANIES[co.slug];
            const style = CARD_ACCENTS[co.slug];
            return (
              <Link
                key={co.slug}
                to={`/demo/empresa/${co.slug}`}
                className="demo-hub-card"
                style={{
                  '--card-accent': style.accent,
                  '--card-accent-bg': style.bg,
                }}
              >
                <div className="demo-hub-card-header">
                  <div
                    className="demo-hub-card-avatar"
                    style={data.initialsStyle}
                  >
                    {data.initials}
                  </div>
                  <div
                    className="demo-hub-card-tag"
                    style={{
                      background: style.bg,
                      border: `1px solid ${style.accent}44`,
                      color: style.accent,
                    }}
                  >
                    {style.tag}
                  </div>
                </div>
                <div className="demo-hub-card-name">{co.name}</div>
                <div className="demo-hub-card-tagline">{data.location} · {data.memberSince}</div>
                <div className="demo-hub-card-stats">
                  <div className="demo-hub-card-stat">
                    <div className="demo-hub-card-stat-val">{data.stats[0].value}</div>
                    <div className="demo-hub-card-stat-lbl">{data.stats[0].label}</div>
                  </div>
                  <div className="demo-hub-card-stat">
                    <div className="demo-hub-card-stat-val">{data.stats[2].value}</div>
                    <div className="demo-hub-card-stat-lbl">{data.stats[2].label}</div>
                  </div>
                  <div className="demo-hub-card-stat">
                    <div className="demo-hub-card-stat-val">{data.stats[1].value}</div>
                    <div className="demo-hub-card-stat-lbl">{data.stats[1].label}</div>
                  </div>
                  <div className="demo-hub-card-stat">
                    <div
                      className="demo-hub-card-stat-val"
                      style={{ color: style.accent }}
                    >
                      {data.stats[3].value}
                    </div>
                    <div className="demo-hub-card-stat-lbl">SES Score</div>
                  </div>
                </div>
                <div className="demo-hub-card-cta">
                  <div className="demo-hub-card-btn">
                    Ver Panel →
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)' }}>
                    Genesis Pilot
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="demo-hub-section-label" style={{ marginTop: '32px' }}>
          Panel de Usuario Final · Experiencia del Comprador
        </div>
        <Link to="/demo/usuario" className="demo-hub-user-card">
          <div className="demo-hub-user-avatar">{USER.name[0]}</div>
          <div className="demo-hub-user-info">
            <h3>{USER.fullName}</h3>
            <p>
              {USER.handle} · {USER.sesLevel} · Dashboard Personal de Impacto
            </p>
          </div>
          <div className="demo-hub-user-stats">
            <div className="demo-hub-user-stat">
              <span className="demo-hub-user-stat-val">{USER.sesScore}</span>
              <span className="demo-hub-user-stat-lbl">SES Score</span>
            </div>
            <div className="demo-hub-user-stat">
              <span className="demo-hub-user-stat-val">{USER.verifiedActions}</span>
              <span className="demo-hub-user-stat-lbl">Acciones</span>
            </div>
            {/* El saldo $SUS se retiró: el nodo corre con reward_enabled: false
                (modo score_only) y los 178.45 que había eran inventados. */}
            <div className="demo-hub-user-stat">
              <span className="demo-hub-user-stat-val">{USER.sesLevelNum}</span>
              <span className="demo-hub-user-stat-lbl">Nivel</span>
            </div>
            <div
              className="demo-hub-card-btn"
              style={{ alignSelf: 'center' }}
            >
              Ver Panel →
            </div>
          </div>
        </Link>

        <div style={{
          marginTop: '48px',
          padding: '20px 24px',
          background: 'var(--bg-100)',
          border: '1px solid var(--line-200)',
          borderRadius: 'var(--r-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ fontSize: '20px' }}>🔒</div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#C8D8F0', marginBottom: '2px' }}>
              Registro anclado en Sustain Protocol
            </div>
            <div style={{ fontSize: '11px', color: 'var(--ink-300)', fontFamily: 'var(--font-mono)' }}>
              Transparencia · Trazabilidad · Impacto Verificable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
