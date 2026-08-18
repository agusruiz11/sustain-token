import { useMemo, useState } from 'react';
import { useNode } from '../components/useNode';
import { actionsForNode } from '../data/actions';
import { dashboardKeyOf } from '../data/sustainNodes';
import { CATEGORIES } from '../data/categories';
import { REPORT_TYPES, frameworksFor, buildReport, previewColumns } from '../data/reports';
import DataTable from '../components/DataTable';

/**
 * § 9 del brief + Entregable 3 § 4.6 — Reportes.
 *
 * CSV y JSON se generan de verdad en el navegador y se descargan: son formatos
 * de texto, no hace falta backend ni dependencias. PDF y Excel requieren una
 * librería de render que hoy no está en el proyecto, así que se declaran como
 * no disponibles en lugar de ofrecer un botón que no hace nada.
 *
 * El § 4.6 agrega seis tipos de reporte y tres marcos, más una regla que
 * atraviesa todos: cada exportación lleva `record_origin` y
 * `verification_status`. Un CSV que sale de acá va a terminar en la mano de un
 * auditor que no vio el dashboard; si una fila no dice de dónde salió, no hay
 * forma de que distinga un histórico de algo que pasó por el pipeline. La
 * lógica vive en data/reports.js.
 */

/* La vista previa es una muestra. El archivo exportado lleva el dataset
   completo — decirlo evita que alguien crea que el CSV sale recortado. */
const PREVIEW_ROWS = 25;

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
  /* Arranca en el tipo que tiene datos. Montessori no tiene acciones Sustain,
     así que mandarlo a "Acciones verificadas" —vacío— teniendo cinco tipos
     llenos es el mismo error que tenía el Data Room. */
  const [tipo, setTipo] = useState(
    () => (dashboardKeyOf(node) === 'montessori' ? 'integral' : 'acciones'),
  );
  const [marco, setMarco] = useState('sustain');

  const nodeKey = dashboardKeyOf(node);
  const hasHistory = nodeKey === 'montessori';
  const frameworks = useMemo(() => frameworksFor(node), [node]);

  /* Los tipos que dependen del expediente no se ofrecen en un nodo que no lo
     tiene. Un nodo personal no tiene histórico institucional que reportar. */
  const tiposDisponibles = REPORT_TYPES.filter((t) => hasHistory || !t.needsHistory);

  const all = useMemo(
    () => actionsForNode(node).sort((a, b) => b.date.localeCompare(a.date)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ver MisAcciones
    [dashboardKeyOf(node)],
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

  const report = useMemo(
    () => buildReport({ type: tipo, actions: rows, hasHistory }),
    [tipo, rows, hasHistory],
  );
  const dataset = report.rows;

  const slug = `${nodeKey}_${tipo}_${periodo}`;

  const marcoSel = frameworks.find((f) => f.id === marco);

  const exportJson = () => download(
    `reporte_${slug}.json`,
    JSON.stringify({
      nodo: node.name,
      node_id: node.data?.nodeId ?? node.data?.institutionId ?? nodeKey,
      generado: new Date().toISOString(),
      tipo_reporte: tipo,
      marco: marcoSel
        ? { id: marcoSel.id, nombre: marcoSel.label, externo: marcoSel.external, version: marcoSel.version ?? null }
        : null,
      filtros: { periodo, categoria },
      /* El resumen sólo aplica al reporte de acciones: es el único donde
         "ahorro" y "SES neto" significan algo. */
      resumen: tipo === 'acciones' || tipo === 'integral' ? resumen : null,
      secciones: report.sections,
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

  /* La vista previa se arma sobre el dataset exportable, no sobre las acciones:
     así lo que se ve en pantalla es literalmente lo que sale en el archivo,
     columnas de procedencia incluidas. */
  const columns = useMemo(() => previewColumns(dataset), [dataset]);

  return (
    <>
      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Armar reporte</span>
          <span className="act-count">
            {dataset.length} filas
            {tipo === 'acciones' ? ` · ${rows.length} de ${all.length} acciones` : ''}
          </span>
        </div>

        <div className="act-filters">
          <label className="act-filter">
            <span>Tipo de reporte</span>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {tiposDisponibles.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <label className="act-filter">
            <span>Marco</span>
            <select value={marco} onChange={(e) => setMarco(e.target.value)}>
              {frameworks.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </label>
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

        {(tipo === 'acciones' || tipo === 'integral') && all.length > 0 && (
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
        )}

        {tipo === 'integral' && (
          <p className="inst-trajectory-note">
            El integral exporta las cinco secciones en el JSON
            ({Object.entries(report.counts).map(([k, n]) => `${k}: ${n}`).join(' · ')}).
            El CSV lleva la de auditoría, que es la única que abarca hitos, mediciones,
            documentos y evaluaciones a la vez.
          </p>
        )}

        {marcoSel?.external && (
          <p className="inst-trajectory-note">
            {marcoSel.label} es un marco externo del nodo ({marcoSel.version}). Se declara en
            la exportación como referencia; no altera la taxonomía ni la estructura interna
            de Sustain.
          </p>
        )}
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Vista previa</span>
          {dataset.length > PREVIEW_ROWS && (
            <span className="act-count">
              primeras {PREVIEW_ROWS} de {dataset.length} · la exportación lleva todas
            </span>
          )}
        </div>
        <DataTable
          columns={columns}
          rows={dataset.slice(0, PREVIEW_ROWS)}
          rowKey={(r, i) => r.id ?? r.indicador_id ?? i}
          empty="Este tipo de reporte no tiene datos para el nodo y los filtros elegidos."
        />
      </div>

      <div className="dash-card">
        <div className="dash-section-header">
          <span className="dash-section-title">Exportar</span>
        </div>
        <div className="rep-exports">
          <button type="button" className="rep-export" onClick={exportCsv} disabled={!dataset.length}>
            <span className="dr-file-ext" data-ext="csv">csv</span>
            <span className="rep-export-info">
              <span className="rep-export-name">Descargar CSV</span>
              <span className="rep-export-sub">{dataset.length} filas · se genera en el navegador</span>
            </span>
          </button>
          <button type="button" className="rep-export" onClick={exportJson} disabled={!dataset.length}>
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
          Toda fila exportada incluye <code>record_origin</code> y <code>verification_status</code>:
          quien reciba el archivo tiene que poder distinguir un histórico documentado de una
          acción que pasó el pipeline, sin haber visto el dashboard.
        </p>
      </div>
    </>
  );
}
