import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const TAB_ACTION = `action_report.json`;
const TAB_MANIFEST = `manifest.json`;

function CodeAction() {
  return (
    <pre>
      <span className="json-key">{'{'}</span>{'\n'}
      {'  '}<span className="json-key">"schema_version"</span>{': '}<span className="json-str">"1.0.0"</span>{',\n'}
      {'  '}<span className="json-key">"action_id"</span>{': '}<span className="json-str">"ST-2024-001"</span>{',\n'}
      {'  '}<span className="json-key">"org_id"</span>{': '}<span className="json-str">"NODE-0001"</span>{',\n'}
      {'  '}<span className="json-key">"action_type"</span>{': '}<span className="json-str">"energy_reduction"</span>{',\n'}
      {'  '}<span className="json-key">"category"</span>{': '}<span className="json-str">"scope_2"</span>{',\n'}
      {'  '}<span className="json-key">"timestamp"</span>{': '}<span className="json-str">"2024-03-01T00:00:00Z"</span>{',\n'}
      {'  '}<span className="json-key">"metric"</span>{': {'}{'\n'}
      {'    '}<span className="json-key">"unit"</span>{': '}<span className="json-str">"kWh_per_day"</span>{',\n'}
      {'    '}<span className="json-key">"baseline"</span>{': '}<span className="json-num">9.9355</span>{',\n'}
      {'    '}<span className="json-key">"measured"</span>{': '}<span className="json-num">8.8857</span>{',\n'}
      {'    '}<span className="json-key">"reduction_pct"</span>{': '}<span className="json-num">-10.57</span>{',\n'}
      {'    '}<span className="json-key">"methodology"</span>{': '}<span className="json-str">"kWh_day_normalization_v1"</span>{'\n'}
      {'  '}{'}'}{',\n'}
      {'  '}<span className="json-key">"evidence"</span>{': {'}{'\n'}
      {'    '}<span className="json-key">"sha256"</span>{': '}<span className="json-str">"26da15d5d0f3c8a1b4e7f2d9...ab5e"</span>{',\n'}
      {'    '}<span className="json-key">"ipfs_cid"</span>{': '}<span className="json-str">"bafybeig3z7qkx4p2r8m...e9xt"</span>{',\n'}
      {'    '}<span className="json-key">"tx_hash"</span>{': '}<span className="json-str">"0x4a7c3f2e1d8b...9f1a"</span>{',\n'}
      {'    '}<span className="json-key">"chain"</span>{': '}<span className="json-str">"bsc_mainnet"</span>{',\n'}
      {'    '}<span className="json-key">"pii_in_public_layer"</span>{': '}<span className="json-bool">false</span>{'\n'}
      {'  }'}{'}'}{',\n'}
      {'  '}<span className="json-key">"ses_score"</span>{': '}<span className="json-bool">null</span>{',\n'}
      {'  '}<span className="json-key">"ses_note"</span>{': '}<span className="json-str">"pending — genesis actions"</span>{'\n'}
      <span className="json-key">{'}'}</span>
    </pre>
  );
}

function CodeManifest() {
  return (
    <pre>
      <span className="json-key">{'{'}</span>{'\n'}
      {'  '}<span className="json-key">"manifest_version"</span>{': '}<span className="json-str">"1.0.0"</span>{',\n'}
      {'  '}<span className="json-key">"pilot_id"</span>{': '}<span className="json-str">"PILOT-ENERGY-001"</span>{',\n'}
      {'  '}<span className="json-key">"node_id"</span>{': '}<span className="json-str">"NODE-0001"</span>{',\n'}
      {'  '}<span className="json-key">"pilot_type"</span>{': '}<span className="json-str">"energy"</span>{',\n'}
      {'  '}<span className="json-key">"period"</span>{': {'}{'\n'}
      {'    '}<span className="json-key">"start"</span>{': '}<span className="json-str">"2024-01-01"</span>{',\n'}
      {'    '}<span className="json-key">"end"</span>{': '}<span className="json-str">"2024-03-31"</span>{',\n'}
      {'    '}<span className="json-key">"days"</span>{': '}<span className="json-num">90</span>{'\n'}
      {'  }'}{'}'}{',\n'}
      {'  '}<span className="json-key">"baseline"</span>{': {'}{'\n'}
      {'    '}<span className="json-key">"bill_period_days"</span>{': '}<span className="json-num">31</span>{',\n'}
      {'    '}<span className="json-key">"total_kwh"</span>{': '}<span className="json-num">308</span>{',\n'}
      {'    '}<span className="json-key">"kwh_per_day"</span>{': '}<span className="json-num">9.9355</span>{',\n'}
      {'    '}<span className="json-key">"evidence_sha256"</span>{': '}<span className="json-str">"baseline_hash_here"</span>{'\n'}
      {'  }'}{'}'}{',\n'}
      {'  '}<span className="json-key">"measurements"</span>{': ['}{'\n'}
      {'    {'}{'\n'}
      {'      '}<span className="json-key">"bill_id"</span>{': '}<span className="json-str">"BILL-002"</span>{',\n'}
      {'      '}<span className="json-key">"period_days"</span>{': '}<span className="json-num">35</span>{',\n'}
      {'      '}<span className="json-key">"total_kwh"</span>{': '}<span className="json-num">311</span>{',\n'}
      {'      '}<span className="json-key">"kwh_per_day"</span>{': '}<span className="json-num">8.8857</span>{',\n'}
      {'      '}<span className="json-key">"sha256"</span>{': '}<span className="json-str">"26da15d5d0...ab5e"</span>{',\n'}
      {'      '}<span className="json-key">"ipfs_cid"</span>{': '}<span className="json-str">"bafybeig3z7...e9xt"</span>{',\n'}
      {'      '}<span className="json-key">"tx_hash"</span>{': '}<span className="json-str">"0x4a7c3f2e...9f1a"</span>{'\n'}
      {'    }'}{'\n'}
      {'  ],'}{'\n'}
      {'  '}<span className="json-key">"compliance"</span>{': ['}<span className="json-str">"ghg_protocol"</span>{', '}<span className="json-str">"iso_14064"</span>{'],\n'}
      {'  '}<span className="json-key">"pii_in_public_layer"</span>{': '}<span className="json-bool">false</span>{'\n'}
      <span className="json-key">{'}'}</span>
    </pre>
  );
}

export default function Developers() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('action');

  return (
    <section id="developers" aria-labelledby="dev-heading">
      <div className="container">
        <div className="dev-header">
          <div className="section-label">{t('developers.sectionLabel')}</div>
          <h2 id="dev-heading">{t('developers.heading')}</h2>
          <p>{t('developers.sub')}</p>
        </div>

        <div className="dev-tabs" role="tablist">
          <button
            className={`dev-tab${activeTab === 'action' ? ' active' : ''}`}
            onClick={() => setActiveTab('action')}
            role="tab"
            aria-selected={activeTab === 'action'}
            aria-controls="tab-action"
          >
            {t('developers.tab1')}
          </button>
          <button
            className={`dev-tab${activeTab === 'manifest' ? ' active' : ''}`}
            onClick={() => setActiveTab('manifest')}
            role="tab"
            aria-selected={activeTab === 'manifest'}
            aria-controls="tab-manifest"
          >
            {t('developers.tab2')}
          </button>
        </div>

        <div
          id="tab-action"
          className="code-block"
          role="tabpanel"
          style={{ display: activeTab === 'action' ? 'block' : 'none' }}
        >
          <CodeAction />
        </div>

        <div
          id="tab-manifest"
          className="code-block"
          role="tabpanel"
          style={{ display: activeTab === 'manifest' ? 'block' : 'none' }}
        >
          <CodeManifest />
        </div>
      </div>
    </section>
  );
}
