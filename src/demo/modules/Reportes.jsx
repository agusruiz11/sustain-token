import { useMemo, useState } from 'react';
import { useNode } from '../components/useNode';
import { actionsByNode, buildTraceability } from '../data/actions';
import { CATEGORIES } from '../data/categories';
import DataTable from '../components/DataTable';
import { DeltaPct, SesDelta } from '../components/StatusChip';

/**
 * § 9 del brief — Reportes.
 *
 * CSV y JSON se generan de verdad en el navegador y se descargan: son formatos
 * de texto, no hace falta backend ni dependencias. PDF y Excel requieren una
 * librería de render que hoy no está en el proyecto, así que se declaran como
 * no disponibles en lugar de ofrecer un botón que no hace nada.
 */

const PERIODS = [
  { id: 'todo', label: 'Todo el histórico', from: null },
  { id: '2026', label: 'Año 2026', from: '2026-01-01' },
  { id: 'ult3', label: 'Últimos 3 períodos', from: null, take: 3 },
];

function download(filename, text, mime) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  // El objeto se libera recién después del click; si se revoca antes, algunos
  // navegadores cancelan la descarga.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default function Reportes() {
  const { node } = useNode();
  const [periodo, setPeriodo] = useState('todo');
  const [categoria, setCategoria] = useState('todas');

  const all = useMemo(
    () => actionsByNode(node.slug).sort((a, b) => b.date.localeCompare(a.date)),
    [node.slug],
  );

  const rows = useMemo(() => {
    const p = PERIODS.find((x) => x.id === periodo);
    let r = all;
    if (p?.from) r = r.filter((a) => a.date >= p.from);
    if (p?.take) r = r.slice(0, p.take);
    if (categoria !== 'todas') r = r.filter((a) => a.categoryId === categoria);
    return r;
  }, [all, periodo, categoria]);

  const cats = useMemo(
    () => [...new Set(all.map((a) => a.categoryId))].map((id) => CATEGORIES[id]),
    [all],
  );

  const resumen = useMemo(() => {
    const reducciones = rows.filter((a) => a.result.direction === 'reduction');
    const ahorro = reducciones.reduce((s, a) => s + a.result.savedPerDay, 0);
    const sesConocido = rows.filter((a) => a.ses.delta !== null);
    return {
      acciones: rows.length,
      reducciones: reducciones.length,
      ahorroDia: Number(ahorro.toFixed(2)),
      sesNeto: sesConocido.reduce((s, a) => s + a.ses.delta, 0),
      sesPendientes: rows.length - sesConocido.length,
    };
  }, [rows]);

  const dataset = useMemo(() => rows.map((a) => ({
    id: a.id,
    fecha: a.date,
    accion: a.title,
    categoria: CATEGORIES[a.categoryId].name,
    consumo: a.consumption.value,
    unidad: a.consumption.unit,
    linea_base: a.baseline.value,
    metodo_baseline: a.baseline.method,
    variacion_pct: a.result.deltaPct,
    direccion: a.result.direction,
    ses_delta: a.ses.delta,
    ses_clasificacion: a.ses.label,
    hash: a.anchor.hash,
    anclado_en_cadena: Boolean(a.anchor.tx),
    pasos_completos: buildTraceability(a).filter((s) => s.status === 'complete').length,
  })), [rows]);

  const slug = `${node.slug ?? node.nodeTypeId}_${periodo}`;

  const exportJson = () => download(
    `reporte_${slug}.json`,
    JSON.stringify({
      nodo: node.name,
      generado: new Date().toISOString(),
      filtros: { periodo, categoria },
      resumen,
      acciones: dataset,
    }, null, 2),
    'application/json',
  );

  const exportCsv = () => {
    const cols = Object.keys(dataset[0] ?? { id: '' });
    const body = [
      cols.join(','),
      ...dataset.map((r) => cols.map((c) => csvCell(r[c])).join(',')),
    ].join('\n');
    download(`reporte_${slug}.csv`, body, 'text/csv;charset=utf-8');
  };

  const columns = [
    { key: 'title', label: 'Acción', render: (a) => a.title },
    { key: 'dateLabel', label: 'Fecha', width: '110px' },
    {
      key: 'result',
      label: 'vs. línea base',
      align: 'right',
      width: '120px',
      render: (a) => <DeltaPct value={a.result.deltaPct} />,
    },
    {
      key: 'ses',
      label: 'SES',
      align: 'right',
      width: '110px',
      render: (a) => <SesDelta value={a.ses.delta} />,
    },
  ];

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Armar reporte</span>
          <span className="act-count">{rows.length} de {all.length} acciones</span>
        </div>

        <div className="act-filters">
          <label className="act-filter">
            <span>Período</span>
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              {PERIODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </label>
          <label className="act-filter">
            <span>Categoría</span>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="todas">Todas</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <div className="mod-scaffold-stats" style={{ borderBottom: 0 }}>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{resumen.acciones}</div>
            <div className="mod-scaffold-stat-label">Acciones incluidas</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{resumen.reducciones}</div>
            <div className="mod-scaffold-stat-label">Con reducción</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">{resumen.ahorroDia}</div>
            <div className="mod-scaffold-stat-label">kWh/día ahorrados</div>
          </div>
          <div className="mod-scaffold-stat">
            <div className="mod-scaffold-stat-value">
              {resumen.sesNeto > 0 ? `+${resumen.sesNeto}` : resumen.sesNeto}
            </div>
            <div className="mod-scaffold-stat-label">
              SES neto{resumen.sesPendientes > 0 ? ` · ${resumen.sesPendientes} sin dato` : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Vista previa</span>
        </div>
        <DataTable columns={columns} rows={rows} empty="Ninguna acción en este período." />
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Exportar</span>
        </div>
        <div className="rep-exports">
          <button type="button" className="rep-export" onClick={exportCsv} disabled={!rows.length}>
            <span className="dr-file-ext" data-ext="csv">csv</span>
            <span className="rep-export-info">
              <span className="rep-export-name">Descargar CSV</span>
              <span className="rep-export-sub">{rows.length} filas · se genera en el navegador</span>
            </span>
          </button>
          <button type="button" className="rep-export" onClick={exportJson} disabled={!rows.length}>
            <span className="dr-file-ext" data-ext="json">json</span>
            <span className="rep-export-info">
              <span className="rep-export-name">Descargar JSON</span>
              <span className="rep-export-sub">Resumen + detalle completo</span>
            </span>
          </button>
          <div className="rep-export rep-export--off">
            <span className="dr-file-ext" data-ext="pdf">pdf</span>
            <span className="rep-export-info">
              <span className="rep-export-name">PDF</span>
              <span className="rep-export-sub">Requiere librería de render — no incluido</span>
            </span>
          </div>
          <div className="rep-export rep-export--off">
            <span className="dr-file-ext" data-ext="xlsx">xlsx</span>
            <span className="rep-export-info">
              <span className="rep-export-name">Excel</span>
              <span className="rep-export-sub">Requiere librería — no incluido</span>
            </span>
          </div>
        </div>
        <p className="mod-scaffold-note">
          CSV y JSON se arman con los datos reales del nodo y se descargan de verdad. PDF y Excel
          se declaran como no disponibles en lugar de ofrecer un botón que no hace nada.
        </p>
      </div>
    </>
  );
}
