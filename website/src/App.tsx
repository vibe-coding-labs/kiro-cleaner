import { ConfigProvider } from 'antd';
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
              <h2 className="section-title">强大特性</h2>
              <p className="section-subtitle">
                专为 Kiro IDE 用户打造的数据清理工具
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
              <h2 className="section-title">快速开始</h2>
              <p className="section-subtitle">
                选择适合你的安装方式，几分钟即可开始使用
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
                <h3 className="footer-title">🧹 Kiro Cleaner</h3>
                <p className="footer-description">让你的 Kiro IDE 轻装上阵</p>
              </div>
              <div className="footer-copyright">
                <p>© {new Date().getFullYear()} Kiro Cleaner. MIT License.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ConfigProvider>
  );
}

export default App;