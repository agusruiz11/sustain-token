import { useParams } from 'react-router-dom';
import { useNode } from '../components/useNode';
import HomeEmpresa from './HomeEmpresa';
import HomeEscuela from './HomeEscuela';
import HomeUsuario from './HomeUsuario';
import MisAcciones from './MisAcciones';
import Timeline from './Timeline';
import Auditoria from './Auditoria';
import ActionDetail from './ActionDetail';
import DataRoom from './DataRoom';
import Instituciones from './Instituciones';
import Reportes from './Reportes';

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

/** Módulos ya construidos. */
const BUILT = {
  acciones: MisAcciones,
  timeline: Timeline,
  auditoria: Auditoria,
  dataRoom: DataRoom,
  instituciones: Instituciones,
  reportes: Reportes,
};

/**
 * Módulos que tienen una vista de detalle sobre un id.
 * La ruta es /demo/:tipo/:slug/:modulo/:actionId.
 */
const DETAIL = {
  acciones: ActionDetail,
};

/**
 * Resuelve qué componente corresponde a la ruta actual.
 * DashShell ya validó que el módulo existe y está habilitado para el nodo.
 */
export default function ModuleRoute() {
  const { node, module } = useNode();
  const { actionId } = useParams();

  if (module.id === 'home') {
    const Home = HOME_BY_TYPE[node.nodeTypeId];
    if (Home) return <Home />;
  } else {
    // El detalle gana sobre el listado cuando la URL trae un id.
    if (actionId) {
      const Detail = DETAIL[module.id];
      if (Detail) return <Detail />;
    }
    const Built = BUILT[module.id];
    if (Built) return <Built />;
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
