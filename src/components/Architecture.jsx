import { useTranslation } from 'react-i18next';

/* ── ProtocolStack ── */
const PROTOCOL_LAYERS = [
  {
    num: '04',
    titleKey: 'layer4Title',
    descKey: 'layer4Desc',
    tags: [
      { label: 'Dashboard', brand: true },
      { label: 'APIs', brand: true },
      { label: 'Mobile', brand: false },
      { label: 'v2 roadmap', brand: false },
    ],
  },
  {
    num: '03',
    titleKey: 'layer3Title',
    descKey: 'layer3Desc',
    tags: [
      { label: 'SAS', brand: true },
      { label: 'MRV', brand: true },
      { label: 'SES', brand: true },
      { label: 'Anti-Greenwashing', brand: false },
    ],
  },
  {
    num: '02',
    titleKey: 'layer2Title',
    descKey: 'layer2Desc',
    tags: [
      { label: 'BSC', brand: false },
      { label: 'EVM', brand: false },
      { label: 'TxHash', brand: false },
      { label: 'BscScan', brand: false },
    ],
  },
  {
    num: '01',
    titleKey: 'layer1Title',
    descKey: 'layer1Desc',
    tags: [
      { label: 'SHA-256', brand: false },
      { label: 'IPFS CID', brand: false },
      { label: 'No PII', brand: false },
      { label: 'Client-side', brand: false },
    ],
  },
];

function ProtocolStack() {
  const { t } = useTranslation();
  return (
    <div className="arch-stack" role="list">
      {PROTOCOL_LAYERS.map(({ num, titleKey, descKey, tags }) => (
        <div className="arch-layer" role="listitem" key={num}>
          <div className="arch-layer-num">
            <span>{t('architecture.layerLabel')}</span>
            <span>{num}</span>
          </div>
          <div className="arch-layer-body">
            <div className="arch-layer-title">{t(`architecture.${titleKey}`)}</div>
            <div className="arch-layer-desc">{t(`architecture.${descKey}`)}</div>
            <div className="arch-layer-tags">
              {tags.map(({ label, brand }) => (
                <span key={label} className={`tag${brand ? ' tag--brand' : ''}`}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── ClimateStack ── */
function ClimateStack() {
  const { t } = useTranslation();
  return (
    <div className="climate-stack" role="list" aria-label={t('architecture.climateAriaLabel')}>

      <div className="climate-layer climate-layer--muted" role="listitem">
        <span className="climate-layer-title">{t('architecture.climatePolicy')}</span>
        <span className="climate-layer-items">EU Taxonomy · Paris Agreement · ETS</span>
      </div>
      <span className="climate-arrow" aria-hidden="true">↓</span>

      <div className="climate-layer climate-layer--muted" role="listitem">
        <span className="climate-layer-title">{t('architecture.climateAccounting')}</span>
        <span className="climate-layer-items">GHG Protocol · ISSB/IFRS S2 · CSRD</span>
      </div>
      <span className="climate-arrow" aria-hidden="true">↓</span>

      <div
        className="climate-layer climate-layer--sustain"
        role="listitem"
        aria-label={t('architecture.sustainLayerAriaLabel')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="climate-layer-title">
              <span>{t('architecture.climateDataLayer')}</span>
              <span style={{ color: 'var(--brand-500)', marginLeft: '8px' }}>— Sustain Protocol</span>
            </div>
            <div className="climate-layer-items" style={{ color: 'var(--brand-300)', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
              Evidence → Hash → IPFS → On-chain Anchors → MRV → SES
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-500)', display: 'inline-block', boxShadow: '0 0 8px var(--brand-500)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--brand-500)', letterSpacing: '1px' }}>
              {t('architecture.climateYouAreHere')}
            </span>
          </div>
        </div>
      </div>
      <span className="climate-arrow" aria-hidden="true">↓</span>

      <div className="climate-layer climate-layer--muted" role="listitem">
        <span className="climate-layer-title">{t('architecture.climateMarkets')}</span>
        <span className="climate-layer-items">{t('architecture.climateMarketsItems')}</span>
      </div>
      <span className="climate-arrow" aria-hidden="true">↓</span>

      <div className="climate-layer climate-layer--muted" role="listitem">
        <span className="climate-layer-title">{t('architecture.climateApps')}</span>
        <span className="climate-layer-items">{t('architecture.climateAppsItems')}</span>
      </div>

    </div>
  );
}

/* ── Architecture (section) ── */
export default function Architecture() {
  const { t } = useTranslation();

  return (
    <section id="architecture" aria-labelledby="arch-heading">
      <div className="container">
        <div className="arch-header">
          <div className="section-label">{t('architecture.sectionLabel')}</div>
          <h2 id="arch-heading">{t('architecture.heading')}</h2>
          <p>{t('architecture.sub')}</p>
        </div>

        <ProtocolStack />

        <div style={{ marginTop: 'var(--sp-10)' }}>
          <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
            {t('architecture.climateLabel')}
          </div>
          <p style={{ color: 'var(--ink-300)', maxWidth: '600px', marginBottom: 'var(--sp-6)', fontSize: '14px' }}>
            {t('architecture.climateSub')}
          </p>
          <ClimateStack />
        </div>
      </div>
    </section>
  );
}
