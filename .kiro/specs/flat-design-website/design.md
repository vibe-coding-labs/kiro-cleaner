# Design Document: Flat Design Website

## Overview

本设计文档描述了如何将 Kiro Cleaner 官网从当前的 Material Design 风格改造为纯粹的扁平化设计风格。扁平化设计将通过移除阴影、渐变和 3D 效果，使用明亮的纯色、简洁的图标和清晰的排版来实现。

设计目标：
- 创建视觉上简洁、现代的用户界面
- 提高内容的可读性和可访问性
- 保持响应式设计，适配各种设备
- 确保品牌一致性和视觉和谐

## Architecture

### Component Structure

```
App.tsx (主应用)
├── Navigation Bar (导航栏)
├── Hero Section (首屏区域)
├── Demo Section (演示区域)
│   └── DemoVideo Component
├── Features Section (特性区域)
│   └── Features Component
│       └── Feature Cards
├── Installation Section (安装区域)
│   └── Installation Component
└── Footer (页脚)
```

### Styling Approach

1. **Theme Configuration**: 自定义 Material-UI 主题，禁用所有阴影和渐变效果
2. **CSS Overrides**: 使用 sx props 和自定义 CSS 覆盖默认样式
3. **Color System**: 定义扁平化配色方案
4. **Typography System**: 配置清晰的字体层级

## Components and Interfaces

### 1. Theme Configuration

```typescript
interface FlatTheme {
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
    };
  };
  typography: {
    fontFamily: string;
    weights: {
      regular: number;
      medium: number;
      bold: number;
    };
  };
  spacing: number;
  shadows: 'none';
}
```

### 2. Navigation Bar Component

```typescript
interface NavigationBarProps {
  transparent?: boolean;
}

// 扁平化特性：
// - 无阴影背景
// - 纯色背景
// - 简单的悬停效果（颜色变化）
// - 清晰的间距
```

### 3. Hero Section Component

```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
}

// 扁平化特性：
// - 使用纯色背景块
// - 无阴影的按钮
// - 简洁的图标或插图
// - 清晰的视觉层次
```

### 4. Feature Card Component

```typescript
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

// 扁平化特性：
// - 无阴影边框
// - 纯色背景
// - 简单的悬停效果（背景色变化或轻微位移）
// - 扁平化图标
```

### 5. Button Component

```typescript
interface FlatButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  children: ReactNode;
  onClick?: () => void;
}

// 扁平化特性：
// - 纯色背景，无渐变
// - 无阴影
// - 悬停时改变颜色或透明度
// - 清晰的边框（outline 变体）
```

## Data Models

### Color Palette

```typescript
const flatColorPalette = {
  // 主色调 - 明亮的蓝色
  primary: '#3498db',
  primaryDark: '#2980b9',
  primaryLight: '#5dade2',
  
  // 次要色 - 绿色
  secondary: '#2ecc71',
  secondaryDark: '#27ae60',
  secondaryLight: '#58d68d',
  
  // 强调色 - 橙色/红色
  accent: '#e74c3c',
  accentDark: '#c0392b',
  accentLight: '#ec7063',
  
  // 中性色
  background: '#ecf0f1',
  surface: '#ffffff',
  border: '#bdc3c7',
  
  // 文本色
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  textLight: '#95a5a6',
  
  // 深色背景
  darkBackground: '#34495e',
  darkSurface: '#2c3e50',
};
```

### Typography Scale

```typescript
const typographyScale = {
  h1: {
    fontSize: '3rem',      // 48px
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2.25rem',   // 36px
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',   // 28px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',    // 24px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  body1: {
    fontSize: '1rem',      // 16px
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',  // 14px
    fontWeight: 400,
    lineHeight: 1.6,
  },
};
```

### Spacing System

```typescript
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  xxl: '4rem',    // 64px
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Navigation bar has no shadows or gradients

*For any* rendered Navigation Bar component, the computed CSS box-shadow should be 'none' and background should not contain gradients
**Validates: Requirements 1.1**

### Property 2: Navigation hover effects use only color changes

*For any* navigation item, when hover state is triggered, only color-related CSS properties should change (not box-shadow)
**Validates: Requirements 1.2**

### Property 3: Navigation maintains flat design on mobile

*For any* viewport width, the Navigation Bar should have no box-shadow in its computed styles
**Validates: Requirements 1.4**

### Property 4: Hero section has no shadows

*For any* element within the Hero Section, the computed box-shadow should be 'none'
**Validates: Requirements 2.1**

### Property 5: Hero section uses palette colors only

*For any* color value in the Hero Section, it should match a color defined in the Color Palette
**Validates: Requirements 2.2**

### Property 6: Call-to-action buttons are flat

*For any* button in the Hero Section, it should have box-shadow of 'none' and a solid background color
**Validates: Requirements 2.3**

### Property 7: Feature cards have no shadows or gradients

*For any* Feature Card component, the computed box-shadow should be 'none' and background should be solid
**Validates: Requirements 3.1**

### Property 8: Feature card hover uses allowed properties only

*For any* Feature Card, when hover state is triggered, only color, opacity, or transform properties should change
**Validates: Requirements 3.2**

### Property 9: Feature cards have consistent spacing

*For any* pair of adjacent Feature Cards, the spacing between them should be equal
**Validates: Requirements 3.4**

### Property 10: No gradients anywhere on the website

*For any* element in the Website, the background CSS property should not contain linear-gradient or radial-gradient
**Validates: Requirements 4.1**

### Property 11: Text contrast meets accessibility standards

*For any* text element, the contrast ratio between text color and background color should be at least 4.5:1 for normal text or 3:1 for large text
**Validates: Requirements 4.2**

### Property 12: Interactive elements use palette colors

*For any* interactive element (button, link, input), all color values should match colors from the defined Color Palette
**Validates: Requirements 4.3**

### Property 13: All text uses sans-serif fonts

*For any* text element, the computed font-family should include a sans-serif font
**Validates: Requirements 5.1**

### Property 14: Headings use bold weights and proper hierarchy

*For any* heading element (h1-h6), the font-weight should be 600 or greater, and font-size should decrease as heading level increases
**Validates: Requirements 5.2**

### Property 15: Body text has readable line height

*For any* body text element, the line-height should be between 1.4 and 1.8
**Validates: Requirements 5.3**

### Property 16: Typography is consistent across components

*For any* text element, the font-family should match one of the fonts defined in the Typography system
**Validates: Requirements 5.4**

### Property 17: Buttons have no shadows or gradients

*For any* button element, the computed box-shadow should be 'none' and background should be solid
**Validates: Requirements 6.1**

### Property 18: Button hover changes color or opacity

*For any* button element, when hover state is triggered, either color or opacity should change
**Validates: Requirements 6.2**

### Property 19: Buttons have sufficient padding

*For any* button element, the padding should be at least 12px vertically and 24px horizontally
**Validates: Requirements 6.3**

### Property 20: All button variants are flat

*For any* button variant (primary, secondary, outline), the box-shadow should be 'none' and background should be solid
**Validates: Requirements 6.4**

### Property 21: Installation tabs are flat

*For any* tab element in the Installation Component, the box-shadow should be 'none' and background should be solid
**Validates: Requirements 7.1**

### Property 22: Code blocks have solid backgrounds with contrast

*For any* code block element, the background should be solid and contrast ratio with text should be at least 4.5:1
**Validates: Requirements 7.2**

### Property 23: Active tab uses simple styling

*For any* active tab, the styling should use only underlines or solid backgrounds (no box-shadow)
**Validates: Requirements 7.3**

### Property 24: Installation component has consistent spacing

*For any* child element in the Installation Component, the spacing should match values from the Spacing system
**Validates: Requirements 7.4**

### Property 25: Demo video has minimal shadows

*For any* element in the Demo Video Component, the box-shadow should be 'none' or have minimal blur radius (≤ 2px)
**Validates: Requirements 8.1**

### Property 26: Video container uses solid colors

*For any* container element in the Demo Video Component, background and border colors should be solid (no gradients)
**Validates: Requirements 8.2**

### Property 27: Footer has no gradients or shadows

*For any* element in the footer, the box-shadow should be 'none' and background should be solid
**Validates: Requirements 9.1**

### Property 28: Footer typography is consistent

*For any* text element in the footer, the font-family should match the Typography system and spacing should match the Spacing system
**Validates: Requirements 9.2**

### Property 29: Material-UI components have no elevation

*For any* Material-UI component (Paper, Card, AppBar), the elevation prop should be 0 or box-shadow should be 'none'
**Validates: Requirements 10.1**

## Error Handling

### Missing Color Definitions

- **Issue**: Component tries to use undefined color
- **Handling**: Fall back to default color from palette with console warning
- **Prevention**: Use TypeScript types to enforce color palette usage

### Responsive Layout Breaks

- **Issue**: Flat design elements don't adapt properly to small screens
- **Handling**: Use CSS media queries and Material-UI breakpoints
- **Prevention**: Test on multiple screen sizes during development

### Icon Loading Failures

- **Issue**: Flat design icons fail to load
- **Handling**: Provide fallback text or simple geometric shapes
- **Prevention**: Bundle icons with application

### Theme Configuration Errors

- **Issue**: Material-UI theme overrides don't apply correctly
- **Handling**: Log warnings and use inline styles as fallback
- **Prevention**: Validate theme configuration at build time

## Testing Strategy

### Unit Testing

我们将使用 **Vitest** 和 **React Testing Library** 进行单元测试。

**测试重点**：
- 组件渲染测试：验证组件正确渲染
- 样式验证：检查关键的扁平化样式属性
- 交互测试：验证悬停和点击行为
- 响应式测试：验证不同屏幕尺寸下的布局

**示例测试**：
```typescript
describe('FlatButton', () => {
  it('should render without box-shadow', () => {
    const { container } = render(<FlatButton>Click me</FlatButton>);
    const button = container.querySelector('button');
    expect(getComputedStyle(button).boxShadow).toBe('none');
  });
});
```

### Property-Based Testing

我们将使用 **fast-check** 库进行属性测试。

**配置要求**：
- 每个属性测试至少运行 100 次迭代
- 每个测试必须标注对应的设计文档属性编号

**测试策略**：
- 生成随机组件配置
- 验证扁平化设计规则
- 检查颜色使用一致性
- 验证无阴影约束

**标注格式**：
```typescript
// Feature: flat-design-website, Property 1: No shadows on any component
```

### Visual Regression Testing

使用截图对比确保扁平化设计的视觉一致性：
- 捕获关键页面和组件的截图
- 对比设计变更前后的视觉差异
- 验证颜色、间距和排版的一致性

### Accessibility Testing

确保扁平化设计不影响可访问性：
- 颜色对比度测试（WCAG AA 标准）
- 键盘导航测试
- 屏幕阅读器兼容性测试

## Implementation Notes

### Material-UI Theme Customization

需要在 `createTheme` 中进行以下配置：

```typescript
const theme = createTheme({
  shadows: Array(25).fill('none') as Shadows, // 禁用所有阴影
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    // ... 其他组件覆盖
  },
});
```

### CSS Reset for Flat Design

创建全局 CSS 重置，确保扁平化风格：

```css
* {
  box-shadow: none !important;
  text-shadow: none !important;
}

button, .MuiButton-root {
  box-shadow: none !important;
  background-image: none !important;
}
```

### Transition Effects

扁平化设计中的过渡效果应该简单快速：

```typescript
const flatTransitions = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
};
```

### Grid and Layout

使用简单的网格系统保持布局清晰：

```typescript
const gridConfig = {
  container: {
    maxWidth: '1200px',
    padding: '0 24px',
  },
  columns: 12,
  gutter: '24px',
};
```

## Migration Strategy

1. **Phase 1**: 更新主题配置，禁用全局阴影
2. **Phase 2**: 重构导航栏和 Hero Section
3. **Phase 3**: 更新 Feature Cards 和按钮样式
4. **Phase 4**: 重构 Installation 和 Demo 组件
5. **Phase 5**: 更新页脚和全局样式
6. **Phase 6**: 测试和优化

每个阶段完成后进行视觉检查和测试，确保扁平化设计的一致性。
