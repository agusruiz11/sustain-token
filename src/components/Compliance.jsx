import { useTranslation } from 'react-i18next';

const CARDS = [
  {
    pill: 'GHG PROTOCOL',
    titleKey: 'card1Title',
    descKey: 'card1Desc',
    items: ['card1item1', 'card1item2', 'card1item3'],
  },
  {
    pill: 'CSRD / ESRS',
    titleKey: 'card3Title',
    descKey: 'card3Desc',
    items: ['card3item1', 'card3item2', 'card3item3'],
  },
  {
    pill: 'ISSB / IFRS S2',
    titleKey: 'card2Title',
    descKey: 'card2Desc',
    items: ['card2item1', 'card2item2', 'card2item3'],
  },
  {
    pill: 'ISO 14064',
    titleKey: 'card4Title',
    descKey: 'card4Desc',
    items: ['card4item1', 'card4item2', 'card4item3'],
  },
];

export default function Compliance() {
  const { t } = useTranslation();

  return (
    <section id="compliance" aria-labelledby="compliance-heading">
      <div className="container">
        <div className="compliance-header">
          <div className="section-label">{t('compliance.sectionLabel')}</div>
          <h2 id="compliance-heading">{t('compliance.heading')}</h2>
          <p>{t('compliance.sub')}</p>
          <p className="compliance-disclaimer">{t('compliance.disclaimer')}</p>
        </div>

        <div className="compliance-grid" role="list">
          {CARDS.map(({ pill, titleKey, descKey, items }) => (
            <div className="compliance-card" role="listitem" key={pill}>
              <div className="compliance-pill">{pill}</div>
              <h4>{t(`compliance.${titleKey}`)}</h4>
              <p>{t(`compliance.${descKey}`)}</p>
              <div className="compliance-items">
                {items.map((itemKey) => (
                  <div className="compliance-item" key={itemKey}>
                    {t(`compliance.${itemKey}`)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
