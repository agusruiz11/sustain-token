import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section id="hero" aria-labelledby="hero-heading">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container">
        <motion.div
          className="hero-inner"
          variants={container}
          initial="hidden"
          animate="show"
          /* extra top padding so the pill clears the 64px fixed nav */
          style={{ paddingTop: '48px' }}
        >

          {/* badge */}
          <motion.div className="hero-badge" role="status" variants={fadeUp}>
            <span className="hero-badge-dot" aria-hidden="true" />
            <span>{t('hero.badge')}</span>
          </motion.div>

          {/* ── MAIN TITLE ── */}
          <motion.div variants={fadeUp}>
            <h1
              id="hero-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(44px, 6.8vw, 96px)',
                fontWeight: 800,
                lineHeight: 0.9,
                letterSpacing: '-3px',
                color: 'var(--brand-500)',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              SUSTAIN<br />PROTOCOL
            </h1>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 2.8vw, 40px)',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              marginTop: '18px',
              marginBottom: 0,
            }}>
              {t('hero.headline')}
            </p>
          </motion.div>

          {/* sub */}
          <motion.p className="hero-sub" variants={fadeUp} style={{ marginTop: '14px' }}>
            {t('hero.sub')}
          </motion.p>

          {/* actions */}
          <motion.div className="hero-actions" variants={fadeUp}>
            <a href="#protocol" className="btn btn--primary btn--large">
              {t('hero.btnProtocol')}
            </a>
            <a href="#pilots" className="btn btn--ghost btn--large">
              {t('hero.btnPilot')}
            </a>
            <a
              href="https://ipfs.io/ipfs/bafkreiemzyaj2cmifulavbypzr24dct2hdaxer7mk23gg57vynsoj7yjbq"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost btn--large"
            >
              {t('hero.btnWhitepaper')}
            </a>
          </motion.div>

          {/* trust */}
          <motion.div className="hero-trust" role="list" variants={fadeUp}>
            <div className="trust-item" role="listitem">
              <svg className="trust-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1L10 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H6L8 1Z" fill="currentColor" />
              </svg>
              <span>{t('hero.trustGHG')}</span>
            </div>
            <div className="trust-sep" aria-hidden="true" />
            <div className="trust-item" role="listitem">
              <svg className="trust-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="12" height="12" rx="2" fill="currentColor" opacity="0.6" />
                <path d="M5 8h6M8 5v6" stroke="white" strokeWidth="1.5" />
              </svg>
              <span>{t('hero.trustISSB')}</span>
            </div>
            <div className="trust-sep" aria-hidden="true" />
            <div className="trust-item" role="listitem">
              <svg className="trust-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>{t('hero.trustISO')}</span>
            </div>
            <div className="trust-sep" aria-hidden="true" />
            <div className="trust-item" role="listitem">
              <span>{t('hero.trustAntiGreen')}</span>
            </div>
          </motion.div>

          {/* counters */}
          <motion.div
            className="hero-counters"
            role="region"
            aria-label={t('hero.statsAriaLabel')}
            variants={fadeUp}
          >
            <div className="kpi">
              <div className="kpi-label">{t('hero.kpi1Label')}</div>
              {/* TODO: conectar a API v2 */}
              <div className="kpi-value" id="counter1" aria-live="polite">000080</div>
              <div className="kpi-sub">{t('hero.kpi1Sub')}</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">{t('hero.kpi2Label')}</div>
              {/* TODO: conectar a API v2 */}
              <div className="kpi-value" id="counter2" aria-live="polite">000080</div>
              <div className="kpi-sub">{t('hero.kpi2Sub')}</div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
