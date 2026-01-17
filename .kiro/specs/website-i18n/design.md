# Website i18n Support - Design Document

## Architecture Overview

The i18n implementation will use `react-i18next` as the primary library, with a client-side only approach suitable for the static GitHub Pages deployment. The architecture follows a modular design with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Components  │  │   Language   │  │  Translation │     │
│  │              │◄─┤   Context    │◄─┤   Provider   │     │
│  │  (useTransl) │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                    ┌───────▼────────┐                       │
│                    │   i18next      │                       │
│                    │   Instance     │                       │
│                    └───────┬────────┘                       │
│                            │                                │
│         ┌──────────────────┼──────────────────┐            │
│         │                  │                  │            │
│    ┌────▼─────┐     ┌─────▼──────┐    ┌─────▼──────┐     │
│    │ Language │     │ Translation│    │ localStorage│     │
│    │ Detector │     │   Files    │    │  Persistence│     │
│    └──────────┘     └────────────┘    └────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Design

### 1. i18n Configuration (`src/i18n/config.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import zhCNTranslations from './locales/zh-CN.json';

const resources = {
  en: {
    translation: enTranslations
  },
  'zh-CN': {
    translation: zhCNTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh-CN'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'kiro-cleaner-language'
    },
    interpolation: {
      escapeValue: false // React already escapes
    }
  });

export default i18n;
```

### 2. Language Switcher Component (`src/components/LanguageSwitcher.tsx`)

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';
import { Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Update HTML lang attribute
    document.documentElement.lang = lng;
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === 'zh-CN' ? '简体中文' : 'English';
  };

  return (
    <Dropdown menu={{ items: languageOptions }} placement="bottomRight">
      <Button 
        icon={<GlobalOutlined />}
        aria-label="Change language"
      >
        {getCurrentLanguageLabel()}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
```

### 3. Translation File Structure

#### English (`src/i18n/locales/en.json`)
```json
{
  "nav": {
    "features": "Features",
    "useCases": "Use Cases",
    "faq": "FAQ",
    "github": "GitHub"
  },
  "hero": {
    "badge": "🎉 Open Source & Free · Continuously Updated",
    "title1": "Make Kiro IDE",
    "title2": "Run Light",
    "subtitle": "Is Kiro IDE lagging due to large cache? Clean it up with one click and speed it up instantly!",
    "benefit1": "Solve Lag",
    "benefit1Desc": "Clean redundant cache, IDE response speed improved",
    "benefit2": "Free Space",
    "benefit2Desc": "Clean conversation history and temporary files",
    "benefit3": "Safe & Reliable",
    "benefit3Desc": "Auto backup, restore anytime",
    "ctaStart": "Get Started",
    "ctaLearnMore": "Learn More"
  },
  "features": {
    "title": "Powerful Features",
    "subtitle": "Data cleanup tool built specifically for Kiro IDE users",
    "smartScan": "Smart Scan",
    "smartScanDesc": "Automatically discover Kiro data storage locations, analyze databases, caches, and log files",
    "safeClean": "Safe Cleanup",
    "safeCleanDesc": "Rule-based cleanup engine, only deletes cache and temporary files",
    "autoBackup": "Auto Backup",
    "autoBackupDesc": "Automatically creates backups before cleanup, supports compression",
    "detailedReport": "Detailed Reports",
    "detailedReportDesc": "Shows before/after space comparison and file statistics"
  }
  // ... more translations
}
```

#### Simplified Chinese (`src/i18n/locales/zh-CN.json`)
```json
{
  "nav": {
    "features": "特性",
    "useCases": "场景",
    "faq": "FAQ",
    "github": "GitHub"
  },
  "hero": {
    "badge": "🎉 开源免费 · 持续更新",
    "title1": "让 Kiro IDE",
    "title2": "轻装上阵",
    "subtitle": "Kiro IDE 缓存过大导致卡顿？一键清理，立即提速！",
    "benefit1": "解决卡顿",
    "benefit1Desc": "清理冗余缓存，IDE 响应速度提升",
    "benefit2": "释放空间",
    "benefit2Desc": "清理对话历史、临时文件",
    "benefit3": "安全可靠",
    "benefit3Desc": "自动备份，随时恢复",
    "ctaStart": "立即开始",
    "ctaLearnMore": "了解更多"
  },
  "features": {
    "title": "强大特性",
    "subtitle": "专为 Kiro IDE 用户打造的数据清理工具",
    "smartScan": "智能扫描",
    "smartScanDesc": "自动发现 Kiro 数据存储位置，分析数据库、缓存和日志文件",
    "safeClean": "安全清理",
    "safeCleanDesc": "基于规则的清理引擎，只删除缓存和临时文件",
    "autoBackup": "自动备份",
    "autoBackupDesc": "清理前自动创建备份，支持压缩",
    "detailedReport": "详细报告",
    "detailedReportDesc": "显示清理前后的空间对比和文件统计"
  }
  // ... more translations
}
```

### 4. Component Usage Example

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hero-section">
      <div className="hero-badge">
        {t('hero.badge')}
      </div>
      
      <Title level={1}>
        {t('hero.title1')}
      </Title>
      <Title level={1} style={{ color: '#1890ff' }}>
        {t('hero.title2')}
      </Title>
      
      <Paragraph>
        {t('hero.subtitle')}
      </Paragraph>
      
      <Button type="primary" href="#installation">
        {t('hero.ctaStart')}
      </Button>
    </div>
  );
};

export default HeroSection;
```

## Data Flow

### Language Detection Flow
```
1. App Initialization
   ↓
2. Check localStorage for 'kiro-cleaner-language'
   ↓
3. If found → Use stored language
   ↓
4. If not found → Check navigator.language
   ↓
5. If zh/zh-CN/zh-Hans → Use 'zh-CN'
   ↓
6. Otherwise → Use 'en' (default)
   ↓
7. Load translation file
   ↓
8. Set HTML lang attribute
   ↓
9. Render application
```

### Language Switch Flow
```
1. User clicks language option
   ↓
2. Call i18n.changeLanguage(lng)
   ↓
3. Save to localStorage
   ↓
4. Update HTML lang attribute
   ↓
5. Trigger re-render with new translations
   ↓
6. Update all text content
```

## File Organization

```
website/
├── src/
│   ├── i18n/
│   │   ├── config.ts              # i18n configuration
│   │   ├── locales/
│   │   │   ├── en.json            # English translations
│   │   │   └── zh-CN.json         # Chinese translations
│   │   └── index.ts               # Export i18n instance
│   ├── components/
│   │   ├── LanguageSwitcher.tsx   # Language switcher component
│   │   ├── LanguageSwitcher.css   # Styles
│   │   └── LanguageSwitcher.test.tsx  # Tests
│   ├── App.tsx                    # Import i18n config
│   └── main.tsx                   # Initialize i18n
├── package.json                   # Add i18n dependencies
└── vite.config.ts                 # No changes needed
```

## Translation Key Naming Convention

### Pattern
```
{section}.{component}.{element}
```

### Examples
- `nav.features` - Navigation menu item
- `hero.title1` - Hero section first title
- `features.smartScan` - Feature name
- `faq.question1` - FAQ question
- `installation.buildFromSource` - Installation section

### Guidelines
1. Use camelCase for keys
2. Keep keys descriptive but concise
3. Group related keys by section
4. Use consistent naming across languages
5. Avoid deeply nested structures (max 3 levels)

## State Management

### Language State
- Managed by i18next library
- Accessed via `useTranslation()` hook
- No additional state management needed

### Persistence
- localStorage key: `kiro-cleaner-language`
- Values: `'en'` or `'zh-CN'`
- Automatic sync by i18next-browser-languagedetector

## Error Handling

### Missing Translation Keys
```typescript
// Development mode: Show warning
if (process.env.NODE_ENV === 'development') {
  i18n.on('missingKey', (lngs, namespace, key) => {
    console.warn(`Missing translation key: ${key} for languages: ${lngs}`);
  });
}

// Production mode: Fallback to English
fallbackLng: 'en'
```

### Failed Language Detection
```typescript
// If detection fails, use default
detection: {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
  fallbackLng: 'en'
}
```

## Performance Optimization

### 1. Bundle Size
- Use tree-shaking to include only used translations
- Lazy load translation files if needed
- Estimated size: ~30KB (both languages)

### 2. Caching
```typescript
// Browser caches translation files
// localStorage caches language preference
// No network requests after first load
```

### 3. Render Performance
```typescript
// Use React.memo for components with translations
const MemoizedComponent = React.memo(({ text }) => {
  const { t } = useTranslation();
  return <div>{t(text)}</div>;
});
```

## Testing Strategy

### Unit Tests
```typescript
describe('LanguageSwitcher', () => {
  it('should render current language', () => {
    // Test implementation
  });

  it('should switch language on click', () => {
    // Test implementation
  });

  it('should save preference to localStorage', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
describe('i18n Integration', () => {
  it('should detect browser language', () => {
    // Test implementation
  });

  it('should load correct translations', () => {
    // Test implementation
  });

  it('should persist language preference', () => {
    // Test implementation
  });
});
```

### Visual Tests
- Test all components in both languages
- Verify no layout breaks
- Check text overflow handling
- Validate responsive design

## Accessibility

### ARIA Labels
```typescript
<Button 
  icon={<GlobalOutlined />}
  aria-label={t('nav.changeLanguage')}
  aria-haspopup="true"
>
  {getCurrentLanguageLabel()}
</Button>
```

### Keyboard Navigation
- Language switcher accessible via Tab
- Options selectable via Enter/Space
- ESC closes dropdown

### Screen Readers
- Announce language changes
- Proper lang attribute on HTML element
- Descriptive labels for all interactive elements

## Migration Plan

### Phase 1: Setup (1-2 hours)
1. Install dependencies
2. Create i18n configuration
3. Set up translation file structure
4. Initialize i18n in App

### Phase 2: Extract Content (3-4 hours)
1. Identify all translatable text
2. Create translation keys
3. Replace hardcoded text with t() calls
4. Organize keys by section

### Phase 3: Translation (2-3 hours)
1. Translate all content to Chinese
2. Review translations for accuracy
3. Test with native speakers
4. Fix any issues

### Phase 4: UI Implementation (1-2 hours)
1. Create LanguageSwitcher component
2. Add to navigation bar
3. Style to match design
4. Test interactions

### Phase 5: Testing (2-3 hours)
1. Write unit tests
2. Write integration tests
3. Manual testing in both languages
4. Fix bugs and issues

### Phase 6: Documentation (1 hour)
1. Update README with i18n info
2. Document translation process
3. Create contribution guidelines

## Dependencies

```json
{
  "dependencies": {
    "i18next": "^23.7.0",
    "react-i18next": "^14.0.0",
    "i18next-browser-languagedetector": "^7.2.0"
  }
}
```

## Rollback Plan

If issues arise:
1. Remove i18n initialization from App
2. Revert components to hardcoded text
3. Remove LanguageSwitcher from navigation
4. Keep translation files for future use

## Future Enhancements

- Add more languages (Traditional Chinese, Japanese, etc.)
- Implement URL-based language routing
- Add language-specific date/time formatting
- Support for pluralization rules
- Dynamic translation loading from CMS
