import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import './AntNavigationBar.css';

const { Header } = Layout;

const AntNavigationBar: React.FC = () => {
  const { t } = useTranslation();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems: MenuProps['items'] = [
    {
      key: 'features',
      label: <a href="#features">{t('nav.features')}</a>,
    },
    {
      key: 'use-cases',
      label: <a href="#use-cases">{t('nav.useCases')}</a>,
    },
    {
      key: 'faq',
      label: <a href="#faq">{t('nav.faq')}</a>,
    },
  ];

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Header className="ant-navbar">
      <div className="ant-navbar-container">
        <div className="ant-navbar-logo">
          <div className="ant-navbar-logo-icon">🧹</div>
          <span className="ant-navbar-logo-text">Kiro Cleaner</span>
        </div>

        <div className="ant-navbar-desktop">
          <div className="ant-navbar-links">
            <a href="#features" className="ant-navbar-link">{t('nav.features')}</a>
            <a href="#use-cases" className="ant-navbar-link">{t('nav.useCases')}</a>
            <a href="#faq" className="ant-navbar-link">{t('nav.faq')}</a>
          </div>
          <div className="ant-navbar-actions">
            <LanguageSwitcher />
            <Button
              type="default"
              icon={<GithubOutlined />}
              href="https://github.com/vibe-coding-labs/kiro-cleaner"
              target="_blank"
              className="ant-navbar-github-btn"
            >
              {t('nav.github')}
            </Button>
          </div>
        </div>

        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          className="ant-navbar-mobile-btn"
        />

        <Drawer
          title={t('nav.menu')}
          placement="right"
          onClose={closeDrawer}
          open={drawerVisible}
          className="ant-navbar-drawer"
        >
          <Menu
            mode="vertical"
            items={menuItems}
            onClick={closeDrawer}
          />
          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <LanguageSwitcher />
            <Button
              type="default"
              icon={<GithubOutlined />}
              href="https://github.com/vibe-coding-labs/kiro-cleaner"
              target="_blank"
              block
            >
              {t('nav.github')}
            </Button>
          </div>
        </Drawer>
      </div>
    </Header>
  );
};

export default AntNavigationBar;
