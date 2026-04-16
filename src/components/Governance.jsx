import { useTranslation } from 'react-i18next';

const GOV_CARDS = [
  { icon: '⛓', titleKey: 'card1Title', descKey: 'card1Desc' },
  { icon: '📋', titleKey: 'card2Title', descKey: 'card2Desc' },
  { icon: '🗳',  titleKey: 'card3Title', descKey: 'card3Desc' },
];

export default function Governance() {
  const { t } = useTranslation();

  return (
    <section id="governance" aria-labelledby="gov-heading">
      <div className="container">
        <div className="section-label">{t('governance.sectionLabel')}</div>
        <h2 id="gov-heading" style={{ color: '#fff', marginBottom: 'var(--sp-2)' }}>
          {t('governance.heading')}
        </h2>
        <p style={{ color: 'var(--ink-300)', maxWidth: '600px' }}>
          {t('governance.desc')}
        </p>
        <div className="gov-grid" role="list">
          {GOV_CARDS.map(({ icon, titleKey, descKey }) => (
            <div className="gov-card" role="listitem" key={titleKey}>
              <div className="gov-icon" aria-hidden="true">{icon}</div>
              <h4>{t(`governance.${titleKey}`)}</h4>
              <p>{t(`governance.${descKey}`)}</p>
            </div>
          ))}
        </div>
        <p style={{ color: 'var(--ink-300)', marginTop: 'var(--sp-6)', fontStyle: 'italic', whiteSpace: 'nowrap' }}>
          {t('governance.closing')}
        </p>
      </div>
    </section>
  );
}
