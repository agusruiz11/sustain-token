import { useState } from 'react';

const ROWS = [
  { key: 'SHA-256', field: 'hash' },
  { key: 'IPFS', field: 'ipfs' },
  { key: 'ANCHOR TX', field: 'tx' },
  { key: 'BLOCKCHAIN', field: 'blockchain' },
  { key: 'TIMESTAMP', field: 'timestamp' },
  { key: 'CONTRATO', field: 'contract' },
];

export default function AuditTrail({ audit = {} }) {
  const [copied, setCopied] = useState(null);

  function handleCopy(val, key) {
    navigator.clipboard.writeText(val).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="dash-audit">
      <div className="dash-audit-header">
        <div className="dash-audit-line" />
        <div className="dash-audit-label">Audit Trail</div>
        <div className="dash-audit-line" style={{ background: 'linear-gradient(90deg, transparent, var(--line-300))' }} />
      </div>
      <div className="dash-audit-grid">
        {ROWS.map(({ key, field }) => {
          const val = audit[field] ?? '—';
          const isLink = field === 'contract';
          return (
            <div key={key} className="dash-audit-row">
              <span className="dash-audit-key">{key}</span>
              <span className={`dash-audit-val${isLink ? ' dash-audit-val--link' : ''}`}>{val}</span>
              <button
                className="dash-audit-copy"
                onClick={() => handleCopy(val, key)}
                title={copied === key ? 'Copiado' : 'Copiar'}
                type="button"
              >
                {copied === key ? '✓' : '⧉'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
