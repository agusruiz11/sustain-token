import { useState } from 'react';

const ROWS = [
  { key: 'SHA-256', field: 'hash', statusField: 'hashStatus' },
  { key: 'IPFS', field: 'ipfs', statusField: 'ipfsStatus' },
  { key: 'ANCHOR TX', field: 'tx', statusField: 'chainStatus' },
  { key: 'BLOCKCHAIN', field: 'blockchain' },
  { key: 'TIMESTAMP', field: 'timestamp' },
  { key: 'CONTRATO', field: 'contract' },
];

export default function AuditTrail({ audit }) {
  const [copied, setCopied] = useState(null);

  function handleCopy(val, key) {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  /* Un nodo sin anclaje criptográfico (hoy: Montessori, cuya trazabilidad es
     documental) no tiene audit trail que mostrar. Se omite el bloque entero en
     lugar de pintar seis filas de guiones. */
  if (!audit) return null;

  return (
    <div className="dash-audit">
      <div className="dash-audit-header">
        <div className="dash-audit-line" />
        <div className="dash-audit-label">Audit Trail</div>
        <div className="dash-audit-line" style={{ background: 'linear-gradient(90deg, transparent, var(--line-300))' }} />
      </div>
      <div className="dash-audit-grid">
        {ROWS.map(({ key, field, statusField }) => {
          const raw = audit[field];
          /* Un campo vacío con estado 'pending' no es un dato faltante: es el
             estado real del anclaje. Se nombra así en vez de mostrar '—'. */
          const pending = raw == null && audit[statusField] === 'pending';
          const val = raw ?? (pending ? 'Pendiente de anclaje' : '—');
          const isLink = field === 'contract';
          return (
            <div key={key} className="dash-audit-row">
              <span className="dash-audit-key">{key}</span>
              <span
                className={`dash-audit-val${isLink ? ' dash-audit-val--link' : ''}${pending ? ' dash-audit-val--pending' : ''}`}
              >
                {val}
              </span>
              {/* Sin valor real no hay nada que copiar. */}
              {raw != null && (
                <button
                  className="dash-audit-copy"
                  onClick={() => handleCopy(raw, key)}
                  title={copied === key ? 'Copiado' : 'Copiar'}
                  type="button"
                >
                  {copied === key ? '✓' : '⧉'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
