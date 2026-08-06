import { useOutletContext } from 'react-router-dom';

/**
 * Accede al contexto que provee DashShell a sus módulos:
 *   { node, module, routeSegment }
 *
 * Vive en su propio archivo y no dentro de DashShell.jsx porque mezclar
 * componentes y hooks en un mismo módulo rompe Fast Refresh.
 */
export const useNode = () => useOutletContext();
