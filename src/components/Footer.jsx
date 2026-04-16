import { useTranslation } from 'react-i18next';
import logo from '../assets/sustain-bird-logo-colorcombinado.png';
import posicionarteLogo from '../assets/posicionarteOnline.png';

const FOOTER_LINKS = [
  { href: '#protocol',    key: 'links.protocol' },
  { href: '#pilots',      key: 'links.pilots' },
  { href: '#compliance',  key: 'links.compliance' },
  { href: '#developers',  key: 'links.developers' },
  { href: '#resources',   key: 'links.resources' },
  { href: '#contact',     key: 'links.contact' },
];

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src={logo} alt="SustainToken" style={{ height: 40, width: 'auto', display: 'block' }} />
          </div>
          <ul className="footer-links" role="list">
            {FOOTER_LINKS.map(({ href, key }) => (
              <li key={href}>
                <a href={href}>{t(`footer.${key}`)}</a>
              </li>
            ))}
          </ul>
          <div className="footer-copy">
            © 2026 <a href="https://sustaintoken.org/" style={{ color: 'inherit' }}>SustainToken.org</a> · <span>{t('footer.copy')}</span>
          </div>
          <a
            href="https://www.posicionarte.online/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Sitio web desarrollado por Posicionarte Online"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.7, transition: 'opacity 0.2s', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
              built by
            </span>
            <img
              src={posicionarteLogo}
              alt="Posicionarte Online"
              style={{ height: '18px', width: 'auto', display: 'block' }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
