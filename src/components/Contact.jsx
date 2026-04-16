import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-inner">
          <div className="section-label" style={{ justifyContent: 'center' }}>
            {t('contact.sectionLabel')}
          </div>
          <h2 id="contact-heading">{t('contact.heading')}</h2>
          <p>{t('contact.desc')}</p>
          <div className="contact-actions">
            <a href="mailto:contact@sustaintoken.org" className="btn btn--primary btn--large">
              {t('contact.btnPilot')}
            </a>
            <a href="mailto:contact@sustaintoken.org" className="btn btn--ghost btn--large">
              {t('contact.btnDev')}
            </a>
            <a href="#resources" className="btn btn--ghost btn--large">
              {t('contact.btnWhitepaper')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
