import { useTranslation } from 'react-i18next';

export default function Resources() {
  const { t } = useTranslation();

  return (
    <section id="resources" aria-labelledby="resources-heading">
      <div className="container">
        <div className="section-label">{t('resources.sectionLabel')}</div>
        <h2 id="resources-heading" style={{ color: '#fff', marginBottom: 'var(--sp-2)' }}>
          {t('resources.heading')}
        </h2>
        <p style={{ color: 'var(--ink-300)', marginBottom: 'var(--sp-6)' }}>
          {t('resources.sub')}
        </p>
        <div className="resources-grid" role="list">

          <a
            href="https://ipfs.io/ipfs/bafkreiemzyaj2cmifulavbypzr24dct2hdaxer7mk23gg57vynsoj7yjbq"
            target="_blank"
            rel="noopener noreferrer"
            className="resource-card"
            role="listitem"
          >
            <div className="resource-type">{t('resources.card1Type')}</div>
            <h4>{t('resources.card1Title')}</h4>
            <p>{t('resources.card1Desc')}</p>
            <div className="resource-link">
              <span>{t('resources.card1Link')}</span>
              <span>↗</span>
            </div>
          </a>

          <a
            href="https://ipfs.io/ipfs/bafkreies6ojo356gugv6q2kdjkwjmy2zrbyd3dhrvxpy4s4hwmfw7dol4y"
            target="_blank"
            rel="noopener noreferrer"
            className="resource-card"
            role="listitem"
          >
            <div className="resource-type">{t('resources.card2Type')}</div>
            <h4>{t('resources.card2Title')}</h4>
            <p>{t('resources.card2Desc')}</p>
            <div className="resource-link">
              <span>{t('resources.card2Link')}</span>
              <span>↗</span>
            </div>
          </a>

          <a
            href="https://bscscan.com/address/0x837C9dFA3342139bc5892c77fc5EadA4D9522CE8#events"
            target="_blank"
            rel="noopener noreferrer"
            className="resource-card"
            role="listitem"
          >
            <div className="resource-type">ON-CHAIN · BSC</div>
            <h4>{t('resources.card3Title')}</h4>
            <p>{t('resources.card3Desc')}</p>
            <div className="resource-link" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{t('resources.card3Link')}</span>
                <span>↗</span>
              </div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)' }}>
                0x837C9dFA…2CE8
              </code>
            </div>
          </a>

        </div>
      </div>
    </section>
  );
}
