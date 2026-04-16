import { useTranslation } from 'react-i18next';

const STEPS = [
  { num: '01', titleKey: 'step1Title', descKey: 'step1Desc' },
  { num: '02', titleKey: 'step2Title', descKey: 'step2Desc' },
  { num: '03', titleKey: 'step3Title', descKey: 'step3Desc' },
  { num: '04', titleKey: 'step4Title', descKey: 'step4Desc' },
  { num: '05', titleKey: 'step5Title', descKey: 'step5Desc' },
  { num: '06', titleKey: 'step6Title', descKey: 'step6Desc' },
  { num: '07', titleKey: 'step7Title', descKey: 'step7Desc' },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" aria-labelledby="hiw-heading">
      <div className="container">
        <div className="steps-header">
          <div className="section-label">{t('howItWorks.sectionLabel')}</div>
          <h2 id="hiw-heading">{t('howItWorks.heading')}</h2>
          <p>{t('howItWorks.sub')}</p>
        </div>

        <div className="steps-grid" role="list" aria-label={t('howItWorks.stepsAriaLabel')}>
          {STEPS.map(({ num, titleKey, descKey }, i) => (
            <div className="step" role="listitem" key={num}>
              <div className="step-node" aria-hidden="true">
                <span className="step-num">{num}</span>
              </div>
              <div className="step-title">{t(`howItWorks.${titleKey}`)}</div>
              <div className="step-desc">{t(`howItWorks.${descKey}`)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
