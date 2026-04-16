import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';

const GENESIS_ACTIONS = [
  { label: 'Beach Cleanup #1',       title: '2026-02-04 · Mar del Plata' },
  { label: 'Beach Cleanup #2',       title: '2026-02-06 · Mar del Plata' },
  { label: 'Beach Cleanup #3',       title: '2026-02-08 · Playa Alfar' },
  { label: 'Household Recycling #1', title: '2026-02-08 · Mar del Plata' },
  { label: 'Household Recycling #2', title: '2026-02-13 · Mar del Plata' },
  { label: 'Sanitary Paper Sep.',    title: '2026-02-11 · Mar del Plata' },
];

export default function Community() {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleNodeForm(e) {
    e.preventDefault();
    setError(false);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY },
      )
      .then(() => {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          formRef.current.reset();
        }, 3000);
      })
      .catch(() => {
        setError(true);
      });
  }

  return (
    <section id="community" aria-labelledby="community-heading">
      <div className="container">
        <div className="community-header">
          <div className="section-label">{t('community.sectionLabel')}</div>
          <h2 id="community-heading">{t('community.heading')}</h2>
          <p>{t('community.sub')}</p>
        </div>

        <div className="community-grid">

          {/* Block A — Pilot Library */}
          <div className="community-block" role="region" aria-labelledby="library-title">
            <div className="block-label">{t('community.blockALabel')}</div>
            <h3 id="library-title">{t('community.blockATitle')}</h3>
            <p>{t('community.blockADesc')}</p>

            <div className="library-node" role="article">
              <div className="library-node-header">
                <span className="node-id">#0001</span>
                <span className="node-title">{t('community.nodeTitle')}</span>
                <span className="genesis-tag">{t('community.nodeTag')}</span>
              </div>

              <div className="node-actions" role="list" aria-label={t('community.genesisActionsAriaLabel')}>
                {GENESIS_ACTIONS.map(({ label, title }) => (
                  <span className="action-chip" key={label} title={title}>{label}</span>
                ))}
              </div>

              {/* Real IPFS + TxHash anchors — Node #0001 Genesis */}
              <div className="chips-stack" style={{ marginTop: '12px' }}>
                <div className="chip" role="group" aria-label={t('community.genesisIPFSAriaLabel')}>
                  <span className="chip-label">IPFS</span>
                  <code className="chip-value">bafybeihgrkfajvq…56iey</code>
                  <a
                    href="https://ipfs.io/ipfs/bafybeihgrkfajvqslygn25igpppcc5yubz3y5gpcvb7kgay2sxrrz56iey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip-copy"
                    aria-label={t('community.genesisIPFSOpenAriaLabel')}
                    title="Open on IPFS"
                  >↗</a>
                  <div className="chip-tooltip">Beach Cleanup · Mar del Plata · 2026-02-04</div>
                </div>
                <div className="chip" role="group" aria-label={t('community.genesisTxAriaLabel')}>
                  <span className="chip-label">TxHash</span>
                  <code className="chip-value">0x4e35e7b8…1a3ef</code>
                  <a
                    href="https://bscscan.com/tx/0x4e35e7b872c36cc2744e6311564c60d338056df0d19612eb7b0a00b2a9e1a3ef"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip-copy"
                    aria-label={t('community.genesisTxViewAriaLabel')}
                    title="View on BscScan"
                  >↗</a>
                  <div className="chip-tooltip">On-chain · BSC Mainnet · Beach Cleanup #1</div>
                </div>
              </div>

              <div className="ses-note">{t('community.sesNote')}</div>
            </div>
          </div>

          {/* Block B — Join Program */}
          <div className="community-block" role="region" aria-labelledby="join-title">
            <div className="block-label">{t('community.blockBLabel')}</div>
            <h3 id="join-title">{t('community.blockBTitle')}</h3>
            <p>{t('community.blockBDesc')}</p>

            <form
              ref={formRef}
              className="pilot-form"
              onSubmit={handleNodeForm}
              aria-label={t('community.formAriaLabel')}
            >
              <div className="form-field">
                <label htmlFor="org-name">{t('community.formOrgLabel')}</label>
                <input
                  type="text"
                  id="org-name"
                  name="from_name"
                  placeholder="Acme Corp or Jane Doe"
                  autoComplete="organization"
                  required
                />
              </div>
              <div className="form-field">
                <label htmlFor="pilot-type">{t('community.formTypeLabel')}</label>
                <select id="pilot-type" name="action_type" required>
                  <option value="">{t('community.formTypeSelect')}</option>
                  <option value="energy">{t('community.formTypeEnergy')}</option>
                  <option value="waste">{t('community.formTypeWaste')}</option>
                  <option value="mobility">{t('community.formTypeMobility')}</option>
                  <option value="water">{t('community.formTypeWater')}</option>
                  <option value="other">{t('community.formTypeOther')}</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="pilot-msg">{t('community.formMsgLabel')}</label>
                <textarea
                  id="pilot-msg"
                  name="message"
                  rows="3"
                  placeholder="Describe your sustainability action…"
                />
              </div>
              <p className="form-note">{t('community.formNote')}</p>
              {error && (
                <p className="form-error">Something went wrong. Please try again.</p>
              )}
              <button
                type="submit"
                className="btn btn--primary"
                style={submitted ? { background: 'var(--green-600)' } : {}}
                disabled={submitted}
              >
                {submitted ? t('community.formSuccess') : t('community.formSubmit')}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
