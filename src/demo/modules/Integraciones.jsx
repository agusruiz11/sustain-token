import { INTEGRATION_GROUPS, INTEGRATION_STATUS, INTEGRATION_STATUS_STYLE, integrationSummary } from '../data/integrations';

/**
 * § 7 del brief — Integraciones.
 *
 * Vitrina del catálogo completo con el estado real de cada conector
 * (decisión D2). Ver la nota en data/integrations.js: de los 18 ítems del
 * brief, 4 son categorías abiertas y 2 no son viables como están planteados.
 * Mostrarlos todos como "disponibles" sería el mismo error que inventar hashes.
 */
export default function Integraciones() {
  const s = integrationSummary();

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Catálogo de integraciones</span>
          <span className="act-count">{s.total} declaradas en el brief</span>
        </div>
        <div className="mod-scaffold-stats" style={{ borderBottom: 0, paddingTop: 0 }}>
          {[
            [INTEGRATION_STATUS.POC, s.poc],
            [INTEGRATION_STATUS.PLANNED, s.planned],
            [INTEGRATION_STATUS.SCOPE, s.scope],
            [INTEGRATION_STATUS.BLOCKED, s.blocked],
          ].map(([key, n]) => (
            <div key={key} className="mod-scaffold-stat">
              <div className="mod-scaffold-stat-value" style={{ color: INTEGRATION_STATUS_STYLE[key].color }}>
                {n}
              </div>
              <div className="mod-scaffold-stat-label">{INTEGRATION_STATUS_STYLE[key].label}</div>
            </div>
          ))}
        </div>
      </div>

      {INTEGRATION_GROUPS.map((g) => (
        <div key={g.group} className="dash-card int-group">
          <div className="dash-section-header">
            <span className="dash-section-title">{g.group}</span>
            <span className="act-count">{g.hint}</span>
          </div>
          <div className="int-grid">
            {g.items.map((item) => {
              const style = INTEGRATION_STATUS_STYLE[item.status];
              const off = item.status === INTEGRATION_STATUS.BLOCKED
                || item.status === INTEGRATION_STATUS.SCOPE;
              return (
                <div key={item.name} className={`int-card${off ? ' int-card--off' : ''}`}>
                  <div className="int-card-top">
                    <span className="int-card-name">{item.name}</span>
                    <span
                      className="imp-card-status"
                      style={{ background: `${style.color}15`, border: `1px solid ${style.color}40`, color: style.color }}
                    >
                      {style.label}
                    </span>
                  </div>
                  {item.note && <p className="int-card-note">{item.note}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="dash-card prov-note">
        <div className="dash-nav-group-label">Cómo leer este catálogo</div>
        <ul className="mod-scaffold-list">
          <li>
            El brief encabeza la lista con <strong>"Ejemplos:"</strong>, así que hay margen para
            acotar el alcance sin contradecirlo.
          </li>
          <li>
            <strong>{s.scope} de los {s.total}</strong> no son integraciones puntuales sino
            categorías enteras. Cada una puede ser más grande que todas las demás juntas.
          </li>
          <li>
            <strong>{s.blocked}</strong> no son viables como están planteados, por límites de las
            plataformas y no del desarrollo. Conviene resolverlo antes de presupuestar.
          </li>
        </ul>
      </div>
    </>
  );
}
