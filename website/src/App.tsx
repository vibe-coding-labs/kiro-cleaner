import { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import AntNavigationBar from './components/AntNavigationBar';
import AntHeroSection from './components/AntHeroSection';
import AntFeatures from './components/AntFeatures';
import AntHowItWorks from './components/AntHowItWorks';
import AntUseCases from './components/AntUseCases';
import AntInstallation from './components/AntInstallation';
import AntFAQ from './components/AntFAQ';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  const { i18n, t } = useTranslation();

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  // Ant Design theme configuration
  const antdTheme = {
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 4,
      fontSize: 14,
      colorBgContainer: '#ffffff',
      colorBorder: '#d9d9d9',
    },
    components: {
      Button: {
        controlHeight: 40,
        fontSize: 16,
        borderRadius: 4,
      },
      Card: {
        borderRadiusLG: 8,
        boxShadow: 'none',
      },
      Collapse: {
        borderRadiusLG: 4,
      },
      Tabs: {
        cardBg: '#fafafa',
      },
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="app-container">
        {/* Navigation Bar */}
        <AntNavigationBar />

        {/* Hero Section */}
        <AntHeroSection />

        {/* Features Section */}
        <section id="features" className="section-features">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">{t('features.title')}</h2>
              <p className="section-subtitle">
                {t('features.subtitle')}
              </p>
            </div>
            <AntFeatures />
          </div>
        </section>

        {/* How It Works Section */}
        <AntHowItWorks />

        {/* Use Cases Section */}
        <AntUseCases />

        {/* Installation Section */}
        <section id="installation" className="section-installation">
          <div className="section-container">
            <div className="section-header">
              <h2 className="section-title">{t('installation.title')}</h2>
              <p className="section-subtitle">
                {t('installation.subtitle')}
              </p>
            </div>
            <AntInstallation />
          </div>
        </section>

        {/* FAQ Section */}
        <AntFAQ />

        {/* Footer */}
        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-brand">
                <h3 className="footer-title">{t('footer.title')}</h3>
                <p className="footer-description">{t('footer.subtitle')}</p>
              </div>
              <div className="footer-copyright">
                <p>{t('footer.copyright')}</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
}

export default App;