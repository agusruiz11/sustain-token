import { useTranslation } from 'react-i18next';

const TOKEN_ATTRS = [
  { keyLabel: 'ticker',   value: 'SUST' },
  { keyLabel: 'network',  value: 'BSC Mainnet' },
  { keyLabel: 'standard', value: 'BEP-20' },
  { keyLabel: 'backedBy', value: 'Verified actions · IPFS + TxHash' },
  { keyLabel: 'contract', value: 'Sustain Doc Hub · BSC' },
  { keyLabel: 'wallets',  value: 'Metamask · Trust Wallet · Bitget' },
];

export default function Token() {
  const { t } = useTranslation();

  return (
    <section id="token" aria-labelledby="token-heading">
      <div className="container">
        <div className="token-grid">
          <div className="token-text">
            <div className="section-label">{t('token.sectionLabel')}</div>
            <h2 id="token-heading">{t('token.heading')}</h2>
            <p>{t('token.desc')}</p>
            <a href="#governance" className="btn btn--ghost">
              {t('token.btnGovernance')}
            </a>
          </div>
          <div className="token-attrs" role="list" aria-label={t('token.attrsAriaLabel')}>
            {TOKEN_ATTRS.map(({ keyLabel, value }) => (
              <div className="token-attr" role="listitem" key={keyLabel}>
                <span className="token-attr-key">{t(`token.${keyLabel}`)}</span>
                <span className="token-attr-val">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
