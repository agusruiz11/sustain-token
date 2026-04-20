import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useClipboard } from '../hooks/useClipboard';

function VerifiedBadge({ label, tooltip }) {
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const ref = useRef(null);

  const visible = hovered || tapped;

  // close on outside tap (mobile)
  useEffect(() => {
    if (!tapped) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setTapped(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [tapped]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <motion.span
        className="energy-badge"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onTap={() => setTapped((v) => !v)}
        animate={{
          scale: [1, 1.07],
          boxShadow: [
            '0 0 3px rgba(30,158,114,0.12), 0 0 6px rgba(30,158,114,0.05), 0 0 0px rgba(30,158,114,0)',
            '0 0 12px rgba(30,158,114,0.75), 0 0 26px rgba(30,158,114,0.42), 0 0 42px rgba(30,158,114,0.18)',
          ],
          borderColor: ['rgba(30,158,114,0.22)', 'rgba(30,158,114,0.75)'],
          backgroundColor: ['rgba(30,158,114,0.07)', 'rgba(30,158,114,0.24)'],
        }}
        transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        whileHover={{
          scale: 1.1,
          y: -2,
          backgroundColor: 'rgba(30,158,114,0.30)',
          borderColor: 'rgba(30,158,114,0.8)',
          boxShadow: '0 0 16px rgba(30,158,114,0.85), 0 0 32px rgba(30,158,114,0.45), 0 4px 14px rgba(0,0,0,0.35)',
          transition: { duration: 0.18, ease: 'easeOut' },
        }}
      >
        {label}
      </motion.span>

      <AnimatePresence>
        {visible && (
          <motion.div
            role="tooltip"
            className="badge-tooltip"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0, exit: { duration: 0.15 } }}
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AuditChip({ label, value, display, tooltip, copyAriaLabel, linkHref, linkAriaLabel }) {
  const { copyChip } = useClipboard();

  return (
    <div className="chip" role="group" aria-label={label}>
      <span className="chip-label">{label.split(' ')[0]}</span>
      <code className="chip-value">{display}</code>
      {linkHref ? (
        <a href={linkHref} target="_blank" rel="noopener noreferrer" className="chip-copy" aria-label={linkAriaLabel} title="Open on IPFS">↗</a>
      ) : (
        <button
          className="chip-copy"
          onClick={(e) => copyChip(e.currentTarget, value)}
          aria-label={copyAriaLabel}
        >
          ⧉
        </button>
      )}
      <div className="chip-tooltip" role="tooltip">{tooltip}</div>
    </div>
  );
}

export default function Pilots() {
  const { t } = useTranslation();

  return (
    <section id="pilots" aria-labelledby="pilots-heading">
      <div className="container">

        <div className="pilots-header">
          <div className="section-label">{t('pilots.sectionLabel')}</div>
          <h2 id="pilots-heading">{t('pilots.heading')}</h2>
          <p>{t('pilots.sub')}</p>
        </div>

        <div className="pilots-cta-band" role="region" aria-labelledby="pilot-cta-title">
          <div className="pilots-cta-text">
            <h3 id="pilot-cta-title">{t('pilots.ctaHeading')}</h3>
            <p>{t('pilots.ctaSub')}</p>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScNIRBEqZO6R-6Y8ZE7UFl2zqu_yuv5Eh9Ba-uI8K5QIQ04KQ/viewform?usp=send_form"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--primary btn--large"
          >
            {t('pilots.ctaBtn')}
          </a>
        </div>

        <div className="pilots-grid" role="list">
          <article className="pilot-card" role="listitem">
            <div className="pilot-sector">{t('pilots.card1Sector')}</div>
            <h4>{t('pilots.card1Title')}</h4>
            <p>{t('pilots.card1Desc')}</p>
          </article>
          <article className="pilot-card" role="listitem">
            <div className="pilot-sector">{t('pilots.card2Sector')}</div>
            <h4>{t('pilots.card2Title')}</h4>
            <p>{t('pilots.card2Desc')}</p>
          </article>
          <article className="pilot-card" role="listitem">
            <div className="pilot-sector">{t('pilots.card3Sector')}</div>
            <h4>{t('pilots.card3Title')}</h4>
            <p>{t('pilots.card3Desc')}</p>
          </article>
        </div>

        {/* Genesis Pilot — Energy Case */}
        <div className="pilot-energy" role="region" aria-labelledby="energy-case-title">
          <div>
            <div className="energy-title">
              <h3 id="energy-case-title">{t('pilots.energyTitle')}</h3>
              <VerifiedBadge
                label={t('pilots.energyBadge')}
                tooltip={t('pilots.energyBadgeTooltip')}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--ink-400)', fontFamily: 'var(--font-mono)', marginBottom: '12px', letterSpacing: '0.3px', whiteSpace: 'pre-wrap' }}>
              {t('pilots.energyGenesisMeta')}
            </p>
            <div>
              <div className="energy-row">
                <span className="energy-label">{t('pilots.energyBaseline')}</span>
                <span className="energy-val">308 kWh / 31 d = 9.9355 kWh/d</span>
              </div>
              <div className="energy-row">
                <span className="energy-label">{t('pilots.energyMeasurement')}</span>
                <span className="energy-val">311 kWh / 35 d = 8.8857 kWh/d</span>
              </div>
              <div className="energy-row">
                <span className="energy-label">{t('pilots.energyReduction')}</span>
                <span className="energy-val--green">−10.57%</span>
              </div>
            </div>
            <p className="energy-note">{t('pilots.energyNote')}</p>
          </div>

          <div>
            <div className="section-label" style={{ marginBottom: '16px' }}>
              {t('pilots.auditTrail')}
            </div>
            <div className="chips-stack">
              <AuditChip
                label={t('pilots.sha256AriaLabel')}
                value="26da15d5d0f3c8a1b4e7f2d9ab5e"
                display="26da15d5d0f3c8a1b4e7f2d9…ab5e"
                tooltip={t('pilots.sha256Tooltip')}
                copyAriaLabel={t('pilots.sha256CopyAriaLabel')}
              />
              <AuditChip
                label={t('pilots.ipfsCidAriaLabel')}
                value="bafybeig3z7qkx4p2r8me9xt"
                display="bafybeig3z7qkx4p2r8m…e9xt"
                tooltip={t('pilots.ipfsCidTooltip')}
                copyAriaLabel={t('pilots.ipfsCidCopyAriaLabel')}
              />
              <AuditChip
                label={t('pilots.txHashAriaLabel')}
                value="0x4a7c3f2e1d8b9f1a"
                display="0x4a7c3f2e1d8b…9f1a"
                tooltip={t('pilots.txHashTooltip')}
                copyAriaLabel={t('pilots.txHashCopyAriaLabel')}
              />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <a
                href="https://bscscan.com/address/0x837C9dFA3342139bc5892c77fc5EadA4D9522CE8#events"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                {t('pilots.btnBscScan')}
              </a>
              <a
                href="https://ipfs.io/ipfs/bafkreiemzyaj2cmifulavbypzr24dct2hdaxer7mk23gg57vynsoj7yjbq"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                {t('pilots.btnWhitepaperIPFS')}
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
