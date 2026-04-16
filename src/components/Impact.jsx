import { useTranslation } from 'react-i18next';

export default function Impact() {
  const { t } = useTranslation();

  return (
    <section id="impact" aria-labelledby="impact-heading">
      <div className="container">
        <div className="impact-header">
          <div className="section-label">{t('impact.sectionLabel')}</div>
          <h2 id="impact-heading">{t('impact.heading')}</h2>
          <p>{t('impact.sub')}</p>
        </div>

        <div className="dashboard-preview" role="region" aria-label={t('impact.dashboardAriaLabel')}>
          <div className="dashboard-topbar" aria-hidden="true">
            <div className="dashboard-topbar-dots">
              <div className="dot dot--red" />
              <div className="dot dot--amber" />
              <div className="dot dot--green" />
            </div>
            <div className="dashboard-topbar-label">{t('impact.topbarLabel')}</div>
            <div className="dashboard-topbar-status">{t('impact.topbarStatus')}</div>
          </div>
          <div className="dashboard-body">
            <div className="dash-kpi">
              <div className="dash-kpi-label">{t('impact.kpi1Label')}</div>
              {/* TODO: conectar a API v2 */}
              <div className="dash-kpi-val">000320</div>
              <div className="dash-kpi-sub">{t('impact.kpi1Sub')}</div>
            </div>
            <div className="dash-kpi">
              <div className="dash-kpi-label">{t('impact.kpi2Label')}</div>
              <div className="dash-kpi-val">001</div>
              <div className="dash-kpi-sub">{t('impact.kpi2Sub')}</div>
            </div>
            <div className="dash-kpi">
              <div className="dash-kpi-label">{t('impact.kpi3Label')}</div>
              <div className="dash-kpi-val">−10.57%</div>
              <div className="dash-kpi-sub">{t('impact.kpi3Sub')}</div>
            </div>
          </div>
          <div className="dashboard-api-note">
            {/* hook login/dashboard — v2 */}
            <span>{t('impact.apiEndpointLabel')}</span>
            <span> GET </span>
            <span>api.sustaintoken.org/v2/impact/summary</span>
            <span> · </span>
            <span>{t('impact.apiAuth')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
