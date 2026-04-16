import { useTranslation } from 'react-i18next';

export default function Protocol() {
  const { t } = useTranslation();

  return (
    <section id="protocol" aria-labelledby="protocol-heading">
      <div className="container">
        <div className="protocol-grid">

          <div className="protocol-text">
            <div className="section-label">{t('protocol.sectionLabel')}</div>
            <h2 id="protocol-heading">{t('protocol.heading')}</h2>
            <p>{t('protocol.p1')}</p>
            <p>{t('protocol.p2')}</p>
            <a href="#how-it-works" className="btn btn--ghost">
              {t('protocol.btnHowItWorks')}
            </a>
          </div>

          <div className="protocol-visual" aria-label={t('protocol.stackAriaLabel')}>
            <div className="stack-layer stack-layer--l1" role="listitem">
              <span className="stack-num">L4</span>
              <div className="stack-info">
                <div className="stack-name">{t('protocol.l4Name')}</div>
                <div className="stack-desc">{t('protocol.l4Desc')}</div>
              </div>
              <div className="stack-tags">
                <span className="tag tag--brand">MRV</span>
                <span className="tag tag--brand">SES</span>
              </div>
            </div>
            <div className="stack-layer stack-layer--l2">
              <span className="stack-num">L3</span>
              <div className="stack-info">
                <div className="stack-name">{t('protocol.l3Name')}</div>
                <div className="stack-desc">{t('protocol.l3Desc')}</div>
              </div>
              <div className="stack-tags">
                <span className="tag">BSC</span>
                <span className="tag">EVM</span>
              </div>
            </div>
            <div className="stack-layer stack-layer--l3">
              <span className="stack-num">L2</span>
              <div className="stack-info">
                <div className="stack-name">{t('protocol.l2Name')}</div>
                <div className="stack-desc">{t('protocol.l2Desc')}</div>
              </div>
              <div className="stack-tags">
                <span className="tag">IPFS</span>
                <span className="tag">CID</span>
              </div>
            </div>
            <div className="stack-layer stack-layer--l4">
              <span className="stack-num">L1</span>
              <div className="stack-info">
                <div className="stack-name">{t('protocol.l1Name')}</div>
                <div className="stack-desc">{t('protocol.l1Desc')}</div>
              </div>
              <div className="stack-tags">
                <span className="tag">SHA-256</span>
                <span className="tag">Org Node</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
