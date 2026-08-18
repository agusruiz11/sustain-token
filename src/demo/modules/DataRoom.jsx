import { useMemo, useState } from 'react';
import { useNode } from '../components/useNode';
import { actionsForNode } from '../data/actions';
import { dashboardKeyOf } from '../data/sustainNodes';
import { fileTree, filesOf, fileCount, formatBytes } from '../data/dataRoom';
import { CATEGORIES } from '../data/categories';
import { useSha256 } from '../components/useSha256';
import StatusChip from '../components/StatusChip';

/**
 * § 3 del brief — Data Room.
 *
 * Explorador de dos paneles: acción → archivos → preview. La integridad no está
 * simulada: los artefactos JSON se generan desde los datos reales de la acción y
 * el navegador calcula su SHA-256 con Web Crypto. Ver la nota de diseño en
 * data/dataRoom.js.
 */
export default function DataRoom() {
  const { node } = useNode();
  const actions = useMemo(
    () => actionsForNode(node).sort((a, b) => b.date.localeCompare(a.date)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ver MisAcciones
    [dashboardKeyOf(node)],
  );

  const [actionId, setActionId] = useState(actions[0]?.id ?? null);
  const action = actions.find((a) => a.id === actionId) ?? actions[0];
  const [fileId, setFileId] = useState(null);

  const groups = useMemo(() => (action ? fileTree(action) : []), [action]);

  // Sin selección explícita se abre el primer archivo previsualizable: entrar al
  // Data Room y ver un panel vacío no comunica nada. Se deriva en render en vez
  // de sincronizarlo con un efecto al cambiar de acción.
  const selected = useMemo(() => {
    if (!action) return null;
    const files = filesOf(action);
    return files.find((f) => f.id === fileId)
      ?? files.find((f) => f.previewable)
      ?? null;
  }, [action, fileId]);

  if (!action) {
    return <p className="dash-table-empty">Este nodo todavía no tiene acciones cargadas.</p>;
  }

  const total = fileCount(actions);

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Data Room</span>
          <span className="act-count">{total} archivos en {actions.length} acciones</span>
        </div>

        <div className="dr-actionbar" role="tablist" aria-label="Acciones">
          {actions.map((a) => (
            <button
              key={a.id}
              role="tab"
              type="button"
              aria-selected={a.id === action.id}
              className={`dr-action-tab${a.id === action.id ? ' active' : ''}`}
              onClick={() => { setActionId(a.id); setFileId(null); }}
            >
              <span aria-hidden="true">{CATEGORIES[a.categoryId].icon}</span>
              {a.dateLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="dr-layout">
        <div className="dash-card dr-browser">
          <div className="dash-section-header">
            <span className="dash-section-title">{action.title}</span>
          </div>

          {groups.map((g) => (
            <div key={g.group} className="dr-group">
              <div className="dash-nav-group-label">{g.group}</div>
              <p className="dr-group-hint">{g.hint}</p>
              {g.files.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`dr-file dr-file--btn${f.id === selected?.id ? ' active' : ''}`}
                  onClick={() => setFileId(f.id)}
                >
                  <span className="dr-file-ext" data-ext={f.type}>{f.type}</span>
                  <span className="dr-file-info">
                    <span className="dr-file-name">{f.name}</span>
                    <span className="dr-file-label">
                      {f.label} · {formatBytes(f.sizeBytes)}
                    </span>
                  </span>
                  {f.redacted ? <span className="dr-file-flag">redactado</span> : null}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="dash-card dr-preview">
          {selected
            ? <FilePreview key={selected.id} file={selected} action={action} />
            : (
              <div className="dr-empty">
                <div className="dr-empty-mark" aria-hidden="true">▤</div>
                <p>Esta acción no tiene archivos con vista previa disponible.</p>
              </div>
            )}
        </div>
      </div>
    </>
  );
}

function FilePreview({ file, action }) {
  const { hash, status } = useSha256(file.content);

  return (
    <>
      <div className="dash-section-header">
        <span className="dash-section-title">{file.name}</span>
        <span className="act-count">{formatBytes(file.sizeBytes)}</span>
      </div>

      <dl className="dr-meta">
        <div><dt>Etiqueta</dt><dd>{file.label}</dd></div>
        <div><dt>Actualizado</dt><dd>{file.updatedAt}</dd></div>
        <div><dt>Versiones</dt><dd>{file.versions.map((v) => `v${v.v}`).join(' · ')}</dd></div>
      </dl>

      <div className="dr-integrity">
        <div className="dash-nav-group-label">Integridad</div>
        {file.previewable ? (
          <>
            <div className="dr-hash-row">
              <span className="dr-hash-tag">SHA-256</span>
              {status === 'ready' ? <code className="dr-hash">{hash}</code> : null}
              {status === 'computing' ? <span className="dr-hash-msg">Calculando…</span> : null}
              {status === 'unsupported' ? (
                <span className="dr-hash-msg">
                  Web Crypto no disponible en este contexto (requiere https o localhost).
                </span>
              ) : null}
            </div>
            {status === 'ready' && (
              <p className="dr-verified">
                ✓ Calculado en el navegador sobre el contenido de este archivo.
              </p>
            )}
          </>
        ) : (
          <p className="dr-hash-msg">
            El contenido de este documento no está disponible en la demo, así que no se puede
            calcular su hash. En producción lo genera el pipeline al procesar la evidencia.
          </p>
        )}

        {/* Cada etiqueta va pegada a su chip: si la fila envuelve, el par no se
            parte en dos líneas dejando el estado huérfano de su nombre. */}
        <div className="dr-anchor-row">
          <span className="dr-anchor-pair">
            <span className="dr-hash-tag">CID IPFS</span>
            <StatusChip status={action.anchor.cidStatus} />
          </span>
          <span className="dr-anchor-pair">
            <span className="dr-hash-tag">Blockchain</span>
            <StatusChip status={action.anchor.chainStatus} />
          </span>
        </div>
      </div>

      <div className="dr-content">
        <div className="dash-nav-group-label">Contenido</div>
        {file.previewable ? (
          <pre className="dr-json"><code>{file.content}</code></pre>
        ) : (
          <div className="dr-nopreview">
            <div className="dr-nopreview-mark" aria-hidden="true">{file.type}</div>
            <p>
              Vista previa no disponible.
              {file.redacted && (
                <> Este documento contiene datos personales
                  ({action.dataRoom.redactedFields.join(', ')}) que no se exponen.</>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
