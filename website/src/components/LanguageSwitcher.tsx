import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // HTML lang attribute is updated automatically via App.tsx useEffect
  };

  const languageOptions: MenuProps['items'] = [
    {
      key: 'en',
      label: 'English',
      onClick: () => changeLanguage('en')
    },
    {
      key: 'zh-CN',
      label: '简体中文',
      onClick: () => changeLanguage('zh-CN')
    }
  ];

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'zh-CN' ? '简体中文' : 'English';
  };

  return (
    <Dropdown 
      menu={{ items: languageOptions }} 
      placement="bottomRight"
      trigger={['click']}
    >
      <Button 
        icon={<GlobalOutlined />}
        aria-label={t('nav.changeLanguage')}
        aria-haspopup="true"
        className="language-switcher-button"
      >
        {getCurrentLanguageLabel()}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
