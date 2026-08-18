import { Link } from 'react-router-dom';

/**
 * Tabla de datos reutilizable.
 *
 * El plan la marcó como la pieza faltante: Mis Acciones, Auditoría, Data Room y
 * Reportes necesitan la misma tabla y hoy cada pantalla la escribiría a mano.
 * Se apoya en los estilos `.dash-table` que ya existen para no introducir un
 * look nuevo.
 *
 * columns: [{ key, label, align, width, render(row) }]
 * rowHref:   (row) => string | null  — si devuelve una ruta, la fila navega.
 * rowAction: (row) => void           — si se pasa, la fila dispara la acción.
 *
 * Los dos son excluyentes: `rowHref` para navegar a otra pantalla, `rowAction`
 * para cambiar de vista dentro del mismo módulo (el maestro-detalle de
 * Instituciones, por ejemplo). Ambos usan un elemento interactivo real en la
 * primera celda para no perder navegación por teclado.
 */
export default function DataTable({
  columns,
  rows,
  rowKey = (r) => r.id,
  rowHref,
  rowAction,
  empty = 'Sin registros.',
  caption,
}) {
  if (!rows.length) {
    return <p className="dash-table-empty">{empty}</p>;
  }

  return (
    <div className="dash-table-scroll">
      <table className="dash-table dash-table--data">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align ?? 'left', width: c.width }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const href = rowHref?.(row);
            const clickable = href || rowAction;
            return (
              <tr key={rowKey(row)} className={clickable ? 'dash-table-row--link' : undefined}>
                {columns.map((c, i) => {
                  const content = c.render ? c.render(row) : row[c.key];
                  return (
                    <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                      {/* El link envuelve la primera celda y se estira por toda la
                          fila vía CSS (::after). Así la fila entera es clickeable
                          sin anidar <a> dentro de cada <td>, que sería inválido y
                          rompería la navegación por teclado. */}
                      {clickable && i === 0 ? (
                        href ? (
                          <Link to={href} className="dash-table-rowlink">{content}</Link>
                        ) : (
                          <button
                            type="button"
                            className="dash-table-rowlink dash-table-rowbtn"
                            onClick={() => rowAction(row)}
                          >
                            {content}
                          </button>
                        )
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
