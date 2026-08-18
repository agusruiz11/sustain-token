import { useMemo, useState } from 'react';
import {
  institutionalArchive, ARCHIVE_GROUPS, documents, isFileReferenceOnly,
  verificationLabel,
} from '../data/montessori/index.js';

/**
 * Data Room · Archivo institucional — Entregable 3 § 4.3.
 *
 * La otra mitad del Data Room. Mientras el panel de "Acciones Sustain" muestra
 * artefactos del pipeline con hash e integridad criptográfica, acá se muestra
 * documentación institucional previa a Sustain: sin hash, sin CID, sin MRV.
 *
 * Dos reglas del spec que definen esta vista:
 *
 *   · Cuando la única evidencia es un rango de páginas del expediente
 *     compilado, se muestra como "Referencia en expediente". No se finge que
 *     existe un archivo suelto descargable (Q10 pide justamente esos originales).
 *
 *   · El nivel de acceso se respeta de verdad. El selector "Ver como" no es
 *     decorativo: filtra el contenido igual que lo hará el acceso temporal de
 *     auditor externo que pidió Martín. Es el andamiaje de esa funcionalidad.
 */

const VIEWER_LEVELS = [
  { id: 'institutional', label: 'Institución', hint: 'Lo que ve el equipo de la escuela' },
  { id: 'audit_restricted', label: 'Auditor externo', hint: 'Alcance ampliado para una auditoría' },
  { id: 'public', label: 'Perfil público', hint: 'Lo que se publicaría hacia afuera' },
];

export default function DataRoomArchive() {
  const [viewerLevel, setViewerLevel] = useState('institutional');
  const [grupo, setGrupo] = useState('todos');

  const groups = useMemo(() => institutionalArchive({ viewerLevel }), [viewerLevel]);

  const visible = grupo === 'todos' ? groups : groups.filter((g) => g.id === grupo);
  const shown = groups.reduce((n, g) => n + g.docs.length, 0);
  const hidden = documents.length - shown;

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Archivo institucional</span>
          <span className="act-count">
            {shown} de {documents.length} documentos
          </span>
        </div>

        <div className="act-filters">
          <label className="act-filter">
            <span>Ver como</span>
            <select value={viewerLevel} onChange={(e) => setViewerLevel(e.target.value)}>
              {VIEWER_LEVELS.map((v) => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </label>
          <label className="act-filter">
            <span>Categoría</span>
            <select value={grupo} onChange={(e) => setGrupo(e.target.value)}>
              <option value="todos">Todas</option>
              {ARCHIVE_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="inst-trajectory-note" style={{ marginTop: 4 }}>
          {VIEWER_LEVELS.find((v) => v.id === viewerLevel)?.hint}.
          {hidden > 0 && ` ${hidden} documento${hidden === 1 ? '' : 's'} fuera de este alcance.`}
        </p>
      </div>

      {shown === 0 ? (
        <div className="dash-card">
          <div className="inst-empty">
            <div className="inst-empty-mark" aria-hidden="true">◌</div>
            <p className="inst-empty-title">Nada publicado a este nivel</p>
            <p className="inst-empty-text">
              Ningún documento del expediente está marcado como público. Qué se puede
              mostrar hacia afuera es la consulta abierta Q09, pendiente de respuesta de
              la institución.
            </p>
          </div>
        </div>
      ) : (
        visible.map((g) => (
          <div key={g.id} className="dash-card">
            <div className="dash-section-header">
              <span className="dash-section-title">{g.label}</span>
              <span className="act-count">{g.docs.length}</span>
            </div>
            <ul className="arch-list">
              {g.docs.map((d) => (
                <li key={d.document_id} className="arch-item">
                  <div className="arch-item-main">
                    <span className="arch-item-title">{d.title}</span>
                    <span className="arch-item-meta">
                      {d.typeLabel}
                      {d.effective_date ? ` · ${d.effective_date}` : ' · sin fecha en el expediente'}
                    </span>
                  </div>
                  <div className="arch-item-tags">
                    <span className="inst-origin-badge">{verificationLabel('documented')}</span>
                    <span className={`arch-access arch-access--${d.access_level}`}>
                      {d.accessLabel}
                    </span>
                  </div>
                  <div className="arch-item-source">
                    {d.referenceOnly
                      ? <span className="arch-ref">Referencia en expediente · {d.source_reference}</span>
                      : <span className="arch-ref">{d.source_reference}</span>}
                    {d.evidence.length > 0 && (
                      <span className="arch-ev">
                        {d.evidence.length} evidencia{d.evidence.length === 1 ? '' : 's'}
                        {d.evidence.every(isFileReferenceOnly) ? ' · sin archivo original' : ''}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <p className="mod-scaffold-note">
        Documentación previa a Sustain: no tiene hash, CID ni MRV porque no pasó por el
        pipeline. Su trazabilidad es la referencia al expediente. Los archivos originales
        sueltos están pedidos en la consulta Q10; cuando lleguen se puede calcular hash y
        versionado sin alterar estos registros.
      </p>
    </>
  );
}
