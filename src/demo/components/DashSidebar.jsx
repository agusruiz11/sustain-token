import logoMark from '../../assets/logo-mark.png';

const EMPRESA_NAV = [
  {
    group: 'GESTIÓN',
    items: [
      { icon: '⊞', label: 'Resumen', id: 'resumen' },
      { icon: '◈', label: 'Productos', id: 'productos' },
      { icon: '✓', label: 'Acciones Verificadas', id: 'acciones' },
      { icon: '◎', label: 'Compradores', id: 'compradores' },
      { icon: '▦', label: 'Inventario', id: 'inventario' },
    ],
  },
  {
    group: 'IMPACTO',
    items: [
      { icon: '◉', label: 'Dashboard de Impacto', id: 'impacto' },
      { icon: '≡', label: 'Reportes ESG', id: 'esg' },
      { icon: '~', label: 'Métricas en Vivo', id: 'metricas' },
    ],
  },
  {
    group: 'COMUNIDAD',
    items: [
      { icon: '◑', label: 'Usuarios Activados', id: 'usuarios' },
      { icon: '❝', label: 'Testimonios', id: 'testimonios' },
      { icon: '⊕', label: 'Alianzas', id: 'alianzas' },
    ],
  },
  {
    group: 'CONFIGURACIÓN',
    items: [
      { icon: '⬡', label: 'Perfil del Negocio', id: 'perfil' },
      { icon: '◎', label: 'Certificaciones', id: 'certs' },
      { icon: '⚙', label: 'Ajustes', id: 'ajustes' },
    ],
  },
];

const INSTITUCION_NAV = [
  {
    group: 'GESTIÓN',
    items: [
      { icon: '⊞', label: 'Resumen', id: 'resumen' },
      { icon: '▤', label: 'Módulos', id: 'modulos' },
      { icon: '✓', label: 'Acciones Verificadas', id: 'acciones' },
      { icon: '↑', label: 'Subir Evidencia', id: 'evidencia' },
      { icon: '🗂', label: 'Data Room', id: 'dataroom' },
    ],
  },
  {
    group: 'IMPACTO',
    items: [
      { icon: '◉', label: 'Dashboard de Impacto', id: 'impacto' },
      { icon: '≡', label: 'Reportes', id: 'reportes' },
      { icon: '★', label: 'Badges', id: 'badges' },
    ],
  },
  {
    group: 'CONFIGURACIÓN',
    items: [
      { icon: '⬡', label: 'Perfil Institucional', id: 'perfil' },
      { icon: '⚙', label: 'Ajustes', id: 'ajustes' },
    ],
  },
];

const USUARIO_NAV = [
  {
    group: 'ACCIONES',
    items: [
      { icon: '⊞', label: 'Resumen', id: 'resumen' },
      { icon: '✓', label: 'Mis Acciones', id: 'acciones' },
      { icon: '↑', label: 'Subir Evidencia', id: 'evidencia' },
      { icon: '⊡', label: 'Escanear QR', id: 'qr' },
      { icon: '◈', label: 'Mis Misiones', id: 'misiones' },
      { icon: '★', label: 'Recompensas', id: 'recompensas' },
    ],
  },
  {
    group: 'COMUNIDAD',
    items: [
      { icon: '◉', label: 'Ranking Global', id: 'ranking' },
      { icon: '◑', label: 'Comunidades', id: 'comunidades' },
      { icon: '⊕', label: 'Referidos', id: 'referidos' },
    ],
  },
  {
    group: 'HERRAMIENTAS',
    items: [
      { icon: '~', label: 'Mi Impacto', id: 'miimpacto' },
      { icon: '▦', label: 'Calendario', id: 'calendario' },
      { icon: '◐', label: 'Alertas', id: 'alertas' },
      { icon: '⚙', label: 'Configuración', id: 'config' },
    ],
  },
];

export default function DashSidebar({ mode = 'empresa', wallet = '0.00', isOpen = false, onClose }) {
  const nav = mode === 'empresa' ? EMPRESA_NAV : mode === 'institucion' ? INSTITUCION_NAV : USUARIO_NAV;

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

        <div className="dash-sidebar-nav">
          {nav.map((section) => (
            <div key={section.group} className="dash-nav-group">
              <div className="dash-nav-group-label">{section.group}</div>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  className={`dash-nav-item${item.id === 'resumen' ? ' active' : ''}`}
                  onClick={onClose}
                  type="button"
                >
                  <span className="dash-nav-item-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {mode === 'institucion' ? (
          <div className="dash-sidebar-wallet">
            <div className="dash-wallet-label">Piloto Genesis</div>
            <div className="dash-wallet-amount" style={{ fontSize: '20px' }}>
              Mes 1 <span className="dash-wallet-currency">/ 3</span>
            </div>
            <div className="dash-wallet-label" style={{ marginTop: '4px', fontSize: '9px' }}>
              Centralización de información histórica
            </div>
          </div>
        ) : (
          <div className="dash-sidebar-wallet">
            <div className="dash-wallet-label">SUS Wallet</div>
            <div className="dash-wallet-amount">
              {wallet}
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
