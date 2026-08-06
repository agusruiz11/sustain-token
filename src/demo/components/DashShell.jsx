import { useState } from 'react';
import { useParams, Link, Navigate, Outlet } from 'react-router-dom';
import { resolveNode } from '../data/nodes';
import { moduleByPath, moduleHref, getNodeType } from '../data/nodeTypes';
import DashSidebar from './DashSidebar';
import '../demo.css';

/**
 * Shell compartido de los dashboards: sidebar + topbar + footer + <Outlet/>.
 *
 * Reemplaza las tres copias del mismo layout que vivían en EmpresaDashboard,
 * InstitucionDashboard y UsuarioFinal. Los módulos ahora sólo renderizan su
 * contenido; el cromo lo pone este componente.
 *
 * De paso corrige un bug real de los tres dashboards: llamaban useState()
 * DESPUÉS de un `return <Navigate/>` condicional. Eso es una llamada
 * condicional a hooks, y React lanza "Rendered fewer hooks than expected" al
 * pasar de un slug válido a uno inválido. Acá todos los hooks corren antes de
 * cualquier return.
 */
export default function DashShell({ nodeTypeId: fixedType }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useParams();

  const tipo = fixedType ?? params.tipo;
  const node = resolveNode(tipo, params.slug);

  // Todos los hooks ya corrieron: acá el return temprano es seguro.
  if (!node) return <Navigate to="/demo" replace />;

  const type = getNodeType(node.nodeTypeId);
  const activeModule = moduleByPath(params.modulo);

  // Módulo inexistente o no habilitado para este tipo de nodo → al home del nodo.
  if (!activeModule || !type.modules.includes(activeModule.id)) {
    return <Navigate to={moduleHref(node.nodeTypeId, node.slug, 'home', tipo)} replace />;
  }

  const isHome = activeModule.id === 'home';


  return (
    <div className="dash-layout">
      <DashSidebar
        nodeTypeId={node.nodeTypeId}
        slug={node.slug}
        routeSegment={tipo}
        panel={node.sidebarPanel}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="dash-main">
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
              style={node.avatar.style}
            >
              {node.avatar.initials}
            </div>
            <div>
              <div className="dash-topbar-company-name">{node.name}</div>
              <div className="dash-topbar-company-sub dash-topbar-hide-mobile">{node.tagline}</div>
            </div>
          </div>
          <div className="dash-topbar-right">
            <div className="dash-verified-badge">{node.badge}</div>
            {node.meta.map((m) => (
              <span
                key={m.text}
                className="dash-topbar-hide-mobile"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: m.color }}
              >
                {m.text}
              </span>
            ))}
            <div className="dash-topbar-dots">
              <span /><span /><span />
            </div>
          </div>
        </header>

        <main className="dash-content">
          {/* Breadcrumb: el drill-down de la Acción llega a 10 niveles, así que
              saber dónde se está parado deja de ser opcional. En Home sobra. */}
          {isHome ? null : (
            <nav className="dash-breadcrumb" aria-label="Ubicación">
              <Link to={moduleHref(node.nodeTypeId, node.slug, 'home', tipo)}>
                {node.name}
              </Link>
              <span className="dash-breadcrumb-sep" aria-hidden="true">/</span>
              <span aria-current="page">{activeModule.label}</span>
            </nav>
          )}

          <Outlet context={{ node, module: activeModule, routeSegment: tipo }} />
        </main>

        <footer className="dash-footer-strip">
          {node.footer.map((f) => (
            <div key={f.title} className="dash-footer-item">
              <div className="dash-footer-icon">{f.icon}</div>
              <div className="dash-footer-text">
                <strong>{f.title}</strong>
                <span>{f.text}</span>
              </div>
            </div>
          ))}
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)' }}>
            <Link to="/demo" style={{ color: 'var(--brand-500)', textDecoration: 'none' }}>
              ← Volver al Demo Hub
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
