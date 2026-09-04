import { NavLink } from 'react-router-dom';
/* logo-mark.png es 100% opaco y sus esquinas son blancas: sobre la barra
   oscura se ve como un recuadro blanco alrededor del pájaro. Martín lo marcó
   el 25 de agosto —"el logo con el recuadro blanco baja el tremendo laburo"—
   y tiene razón. Este asset es el mismo pájaro con fondo transparente. */
import logoMark from '../../assets/sustain-bird-logo-colorcombinado.png';
import { navFor, moduleHref } from '../data/nodeTypes';

/**
 * Sidebar del dashboard.
 *
 * Antes: tres arrays de navegación hardcodeados (EMPRESA_NAV / INSTITUCION_NAV /
 * USUARIO_NAV), botones sin destino y el item activo fijo en 'resumen'. Ahora la
 * navegación sale de nodeTypes.navFor() y cada item es un NavLink real, así que
 * el estado activo lo determina la URL.
 */
export default function DashSidebar({
  nodeTypeId = 'empresa',
  slug,
  routeSegment,
  panel,
  isOpen = false,
  onClose,
}) {
  const groups = navFor(nodeTypeId);

  return (
    <>
      <div
        className={`dash-sidebar-backdrop${isOpen ? ' open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`dash-sidebar${isOpen ? ' open' : ''}`}>
        <div className="dash-sidebar-logo">
          <img src={logoMark} alt="Sustain" width={28} height={28} />
          <div>
            <div className="dash-sidebar-logo-text">Sustain</div>
            <div className="dash-sidebar-logo-sub">Protocol</div>
          </div>
          <button
            className="dash-sidebar-close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <nav className="dash-sidebar-nav" aria-label="Módulos">
          {groups.map((section) => (
            <div key={section.group} className="dash-nav-group">
              <div className="dash-nav-group-label">{section.group}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={moduleHref(nodeTypeId, slug, item.id, routeSegment)}
                  // `end` solo en Home: sin esto su ruta base haría match con
                  // todos los módulos hijos y quedaría siempre activo.
                  end={item.path === ''}
                  className={({ isActive }) => `dash-nav-item${isActive ? ' active' : ''}`}
                  onClick={onClose}
                >
                  <span className="dash-nav-item-icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {panel?.kind === 'pilot' ? (
          <div className="dash-sidebar-wallet">
            <div className="dash-wallet-label">{panel.title}</div>
            <div className="dash-wallet-amount" style={{ fontSize: '20px' }}>
              {panel.value} <span className="dash-wallet-currency">{panel.total}</span>
            </div>
            <div className="dash-wallet-label" style={{ marginTop: '4px', fontSize: '9px' }}>
              {panel.note}
            </div>
          </div>
        ) : (
          <div className="dash-sidebar-wallet">
            <div className="dash-wallet-label">SUS Wallet</div>
            <div className="dash-wallet-amount">
              {panel?.amount ?? '0.00'}
              <span className="dash-wallet-currency">$SUS</span>
            </div>
            <div className="dash-wallet-label" style={{ marginTop: '4px', fontSize: '9px' }}>
              Saldo Disponible
            </div>
            <a className="dash-wallet-link" href="#">Ver Movimientos →</a>
          </div>
        )}
      </aside>
    </>
  );
}
