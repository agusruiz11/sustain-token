import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveSection } from '../hooks/useActiveSection';
import logoMark from '../assets/sustain-bird-logo-colorcombinado.png';

const SECTION_IDS = ['hero','protocol','how-it-works','architecture','pilots','compliance','impact','community','token','governance','developers','resources','contact'];

const NAV_LINKS = [
  { href: '#protocol',      key: 'links.protocol' },
  { href: '#how-it-works',  key: 'links.howItWorks' },
  { href: '#architecture',  key: 'links.architecture' },
  { href: '#pilots',        key: 'links.pilots' },
  { href: '#compliance',    key: 'links.compliance' },
  { href: '#developers',    key: 'links.developers' },
  { href: '#contact',       key: 'links.contact' },
];

export default function Nav() {
  const { t, i18n } = useTranslation();
  const activeId = useActiveSection(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav role="navigation" aria-label={t('nav.ariaLabel')}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo" aria-label={t('nav.logoAriaLabel')}>
          <img src={logoMark} alt="SustainToken logo mark" style={{ height: 48, width: 'auto', display: 'block' }} />
        </a>
        <ul className="nav-links" role="list">
          {NAV_LINKS.map(({ href, key }) => {
            const sectionId = href.replace('#', '');
            return (
              <li key={href}>
                <a
                  href={href}
                  style={{ color: activeId === sectionId ? 'var(--brand-500)' : '' }}
                >
                  {t(`nav.${key}`)}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="nav-actions">
          <button
            className="lang-switch"
            onClick={toggleLang}
            aria-label={t('nav.langSwitchAriaLabel')}
          >
            {t('nav.langSwitch')}
          </button>
          <a href="#pilots" className="btn btn--primary nav-cta-desktop" style={{ padding: '8px 16px', fontSize: '13px' }}>
            {t('nav.applyPilot')}
          </a>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`hamburger-icon ${menuOpen ? 'hamburger-icon--open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="nav-mobile-menu" role="dialog" aria-modal="false">
          <ul role="list">
            {NAV_LINKS.map(({ href, key }) => {
              const sectionId = href.replace('#', '');
              return (
                <li key={href}>
                  <a
                    href={href}
                    onClick={closeMenu}
                    style={{ color: activeId === sectionId ? 'var(--brand-500)' : '' }}
                  >
                    {t(`nav.${key}`)}
                  </a>
                </li>
              );
            })}
          </ul>
          <a href="#pilots" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }} onClick={closeMenu}>
            {t('nav.applyPilot')}
          </a>
        </div>
      )}
    </nav>
  );
}
