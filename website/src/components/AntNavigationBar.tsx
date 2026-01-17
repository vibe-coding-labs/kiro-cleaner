import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer } from 'antd';
import { GithubOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import './AntNavigationBar.css';

const { Header } = Layout;

const AntNavigationBar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems: MenuProps['items'] = [
    {
      key: 'features',
      label: <a href="#features">特性</a>,
    },
    {
      key: 'use-cases',
      label: <a href="#use-cases">场景</a>,
    },
    {
      key: 'faq',
      label: <a href="#faq">FAQ</a>,
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
            <a href="#features" className="ant-navbar-link">特性</a>
            <a href="#use-cases" className="ant-navbar-link">场景</a>
            <a href="#faq" className="ant-navbar-link">FAQ</a>
          </div>
          <Button
            type="default"
            icon={<GithubOutlined />}
            href="https://github.com/vibe-coding-labs/kiro-cleaner"
            target="_blank"
            className="ant-navbar-github-btn"
          >
            GitHub
          </Button>
        </div>

        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          className="ant-navbar-mobile-btn"
        />

        <Drawer
          title="菜单"
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
          <Button
            type="default"
            icon={<GithubOutlined />}
            href="https://github.com/vibe-coding-labs/kiro-cleaner"
            target="_blank"
            block
            style={{ marginTop: '16px' }}
          >
            GitHub
          </Button>
        </Drawer>
      </div>
    </Header>
  );
};

export default AntNavigationBar;
