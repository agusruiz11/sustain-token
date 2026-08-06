import { useNode } from '../components/useNode';
import HomeEmpresa from './HomeEmpresa';
import HomeEscuela from './HomeEscuela';
import HomeUsuario from './HomeUsuario';

/**
 * Registro de módulos.
 *
 * El Home varía por tipo de nodo (una empresa muestra productos y compradores;
 * una escuela, módulos y roadmap). Los demás son transversales: mismo
 * componente, distinta data.
 */
const HOME_BY_TYPE = {
  empresa: HomeEmpresa,
  escuela: HomeEscuela,
  universidad: HomeEscuela,
  municipio: HomeEscuela,
  ong: HomeEscuela,
  usuario: HomeUsuario,
};

/**
 * Resuelve qué componente corresponde a la ruta actual.
 * DashShell ya validó que el módulo existe y está habilitado para el nodo.
 */
export default function ModuleRoute() {
  const { node, module } = useNode();

  if (module.id === 'home') {
    const Home = HOME_BY_TYPE[node.nodeTypeId];
    if (Home) return <Home />;
  }

  // Un módulo declarado en nodeTypes sin componente todavía cae acá.
  // Mejor un mensaje explícito que una pantalla en blanco.
  return (
    <div className="dash-card">
      <p className="dash-table-empty">
        El módulo «{module.label}» está declarado pero todavía no tiene vista.
      </p>
    </div>
  );
}
