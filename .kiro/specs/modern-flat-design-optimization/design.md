# Design Document: Modern Flat Design Optimization

## Overview

本设计文档描述了 Kiro Cleaner 官网的现代扁平化设计优化方案。当前网站采用基础的扁平化设计，但在配色、间距、字体和整体视觉精致度方面存在不足。本设计将参考 Stripe、Vercel、Linear 等现代网站的设计理念，创建一个真正现代、专业、视觉吸引力强的扁平化设计系统。

设计核心原则：
- **简洁而不简单**：扁平化设计不意味着缺乏细节，而是通过精心设计的细节创造精致感
- **层次清晰**：通过颜色、大小、间距建立清晰的视觉层次
- **一致性**：所有组件遵循统一的设计语言和规范
- **可访问性**：确保足够的对比度和可读性
- **现代感**：使用当代流行的设计趋势和技术

## Architecture

### Design System Structure

设计系统采用分层架构：

```
Design System
├── Foundation Layer (基础层)
│   ├── Color Palette (配色系统)
│   ├── Typography System (字体系统)
│   ├── Spacing System (间距系统)
│   └── Animation System (动画系统)
├── Component Layer (组件层)
│   ├── Navigation Bar
│   ├── Hero Section
│   ├── Feature Cards
│   ├── Buttons
│   └── Footer
└── Layout Layer (布局层)
    ├── Grid System
    ├── Container Widths
    └── Responsive Breakpoints
```

### Technology Stack

- **React**: UI 组件框架
- **Material-UI (MUI)**: 基础组件库，将通过主题系统进行深度定制
- **CSS-in-JS**: 使用 MUI 的 `sx` prop 和 styled components
- **TypeScript**: 类型安全的设计 tokens

## Components and Interfaces

### 1. Color System

#### Color Palette Structure

基于现代设计趋势和研究，采用以下配色方案：

**Primary Colors (主色系)**
- 使用深邃的蓝紫色调，传达专业和科技感
- Primary: `#6366f1` (Indigo 500) - 主要品牌色
- Primary Dark: `#4f46e5` (Indigo 600) - 深色变体
- Primary Light: `#818cf8` (Indigo 400) - 浅色变体
- Primary Subtle: `#eef2ff` (Indigo 50) - 极浅背景色

**Secondary Colors (辅助色系)**
- 使用现代的青色调，提供视觉对比
- Secondary: `#06b6d4` (Cyan 500)
- Secondary Dark: `#0891b2` (Cyan 600)
- Secondary Light: `#22d3ee` (Cyan 400)

**Accent Colors (强调色系)**
- 使用温暖的紫色调作为强调
- Accent: `#a855f7` (Purple 500)
- Accent Dark: `#9333ea` (Purple 600)
- Accent Light: `#c084fc` (Purple 400)

**Neutral Colors (中性色系)**
- 使用现代的灰色调，提供丰富的层次
- Gray 50: `#f9fafb` - 最浅背景
- Gray 100: `#f3f4f6` - 浅背景
- Gray 200: `#e5e7eb` - 边框
- Gray 300: `#d1d5db` - 分隔线
- Gray 400: `#9ca3af` - 禁用状态
- Gray 500: `#6b7280` - 辅助文本
- Gray 600: `#4b5563` - 次要文本
- Gray 700: `#374151` - 主要文本
- Gray 800: `#1f2937` - 深色文本
- Gray 900: `#111827` - 最深文本

**Semantic Colors (语义色)**
- Success: `#10b981` (Green 500)
- Warning: `#f59e0b` (Amber 500)
- Error: `#ef4444` (Red 500)
- Info: `#3b82f6` (Blue 500)

**Gradient Colors (渐变色)**
- Hero Gradient: `linear-gradient(135deg, #6366f1 0%, #a855f7 100%)`
- Card Gradient: `linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)`
- Subtle Gradient: `linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)`

#### Color Usage Guidelines

```typescript
interface ColorTokens {
  // Brand colors
  brand: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    primarySubtle: string;
  };
  
  // Background colors
  background: {
    default: string;      // Gray 50
    paper: string;        // White
    elevated: string;     // White with shadow
    subtle: string;       // Gray 100
  };
  
  // Text colors
  text: {
    primary: string;      // Gray 900
    secondary: string;    // Gray 600
    disabled: string;     // Gray 400
    inverse: string;      // White
  };
  
  // Border colors
  border: {
    default: string;      // Gray 200
    strong: string;       // Gray 300
    subtle: string;       // Gray 100
  };
}
```

### 2. Typography System

#### Font Stack

**Primary Font (主字体)**
- 使用 Inter 字体，现代、清晰、易读
- Fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif`

**Monospace Font (等宽字体)**
- 用于代码展示
- Font: `'Fira Code', 'Consolas', 'Monaco', monospace`

#### Type Scale

基于 1.25 (Major Third) 比例尺度：

```typescript
interface TypographyScale {
  h1: {
    fontSize: '3.052rem';    // ~48.8px
    lineHeight: 1.2;
    fontWeight: 700;
    letterSpacing: '-0.02em';
  };
  h2: {
    fontSize: '2.441rem';    // ~39px
    lineHeight: 1.3;
    fontWeight: 700;
    letterSpacing: '-0.01em';
  };
  h3: {
    fontSize: '1.953rem';    // ~31.2px
    lineHeight: 1.3;
    fontWeight: 600;
    letterSpacing: '-0.01em';
  };
  h4: {
    fontSize: '1.563rem';    // ~25px
    lineHeight: 1.4;
    fontWeight: 600;
    letterSpacing: '0';
  };
  h5: {
    fontSize: '1.25rem';     // ~20px
    lineHeight: 1.5;
    fontWeight: 600;
    letterSpacing: '0';
  };
  h6: {
    fontSize: '1rem';        // 16px
    lineHeight: 1.5;
    fontWeight: 600;
    letterSpacing: '0';
  };
  body1: {
    fontSize: '1rem';        // 16px
    lineHeight: 1.6;
    fontWeight: 400;
    letterSpacing: '0';
  };
  body2: {
    fontSize: '0.875rem';    // 14px
    lineHeight: 1.6;
    fontWeight: 400;
    letterSpacing: '0';
  };
  caption: {
    fontSize: '0.75rem';     // 12px
    lineHeight: 1.5;
    fontWeight: 400;
    letterSpacing: '0.01em';
  };
}
```

#### Responsive Typography

字体大小在不同屏幕尺寸下的调整：

- **Mobile (< 600px)**: 基础字号 14px，标题缩小 15%
- **Tablet (600px - 960px)**: 基础字号 15px，标题缩小 10%
- **Desktop (> 960px)**: 基础字号 16px，标题正常大小

### 3. Spacing System

#### Base Unit

采用 8px 基础单位的间距系统，这是现代设计系统的标准做法（参考 Atlassian、GitLab 等）。

#### Spacing Scale

```typescript
const spacing = {
  0: '0px',
  1: '4px',      // 0.5 * base
  2: '8px',      // 1 * base
  3: '12px',     // 1.5 * base
  4: '16px',     // 2 * base
  5: '20px',     // 2.5 * base
  6: '24px',     // 3 * base
  8: '32px',     // 4 * base
  10: '40px',    // 5 * base
  12: '48px',    // 6 * base
  16: '64px',    // 8 * base
  20: '80px',    // 10 * base
  24: '96px',    // 12 * base
  32: '128px',   // 16 * base
};
```

#### Spacing Usage Guidelines

- **Component Internal Padding**: 16px - 24px (spacing[4] - spacing[6])
- **Between Related Elements**: 8px - 16px (spacing[2] - spacing[4])
- **Between Sections**: 64px - 96px (spacing[16] - spacing[24])
- **Container Padding**: 24px - 48px (spacing[6] - spacing[12])

### 4. Animation System

#### Timing Functions

```typescript
const easing = {
  // Standard easing for most transitions
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  
  // Deceleration curve for entering elements
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  // Acceleration curve for exiting elements
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // Sharp curve for elements that may return to the screen
  sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
};
```

#### Duration Scale

```typescript
const duration = {
  shortest: 150,   // Micro-interactions
  shorter: 200,    // Small elements
  short: 250,      // Medium elements
  standard: 300,   // Standard transitions
  complex: 375,    // Complex animations
  enteringScreen: 225,
  leavingScreen: 195,
};
```

#### Animation Patterns

**Hover Effects**
- Duration: 200ms
- Easing: standard
- Properties: transform, background-color, border-color, box-shadow

**Focus States**
- Duration: 150ms
- Easing: sharp
- Properties: outline, box-shadow

**Page Transitions**
- Duration: 300ms
- Easing: decelerate (entering), accelerate (leaving)

### 5. Component Specifications

#### Navigation Bar

**Design Specifications:**
- Height: 64px (spacing[16])
- Background: White with subtle shadow
- Padding: 0 24px (spacing[6])
- Logo size: 32px height
- Link spacing: 32px (spacing[8])
- Sticky positioning on scroll

**Hover States:**
- Links: Underline with primary color, 200ms transition
- Logo: Slight scale (1.05), 200ms transition

#### Hero Section

**Design Specifications:**
- Padding: 96px 0 (spacing[24])
- Background: Gradient from primary to accent
- Content max-width: 1200px
- Text color: White
- Headline: h1 typography scale
- Subheadline: h4 typography scale
- CTA button spacing: 16px gap (spacing[4])

**Visual Elements:**
- Subtle background pattern or mesh gradient
- Floating elements with parallax effect (optional)
- Illustration or product screenshot with rounded corners (16px radius)

#### Feature Cards

**Design Specifications:**
- Card padding: 32px (spacing[8])
- Border radius: 12px
- Border: 1px solid gray-200
- Background: White
- Gap between cards: 24px (spacing[6])
- Icon size: 48px
- Icon color: Primary or accent colors

**Hover States:**
- Transform: translateY(-4px)
- Shadow: Elevated shadow (0 12px 24px rgba(0,0,0,0.1))
- Border color: Primary color
- Duration: 250ms
- Easing: standard

**Layout:**
- Grid: 4 columns on desktop, 2 on tablet, 1 on mobile
- Aspect ratio: Flexible height based on content

#### Buttons

**Primary Button:**
- Background: Primary color
- Text: White
- Padding: 12px 24px (spacing[3] spacing[6])
- Border radius: 8px
- Font weight: 600
- Hover: Darken 10%, lift 2px
- Active: Darken 15%, no lift

**Secondary Button:**
- Background: Secondary color
- Text: White
- Same dimensions as primary

**Outline Button:**
- Background: Transparent
- Border: 2px solid current color
- Text: Primary color
- Hover: Background with 10% opacity of border color

#### Footer

**Design Specifications:**
- Background: Gray 900
- Text color: Gray 300
- Padding: 48px 0 (spacing[12])
- Border top: 3px solid primary color
- Link hover: Primary color, 200ms transition

## Data Models

### Design Tokens

设计 tokens 是设计系统的核心，定义了所有可重用的设计值。

```typescript
// colors.ts
export const colorTokens = {
  brand: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    primarySubtle: '#eef2ff',
    secondary: '#06b6d4',
    secondaryDark: '#0891b2',
    secondaryLight: '#22d3ee',
    accent: '#a855f7',
    accentDark: '#9333ea',
    accentLight: '#c084fc',
  },
  
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  gradients: {
    hero: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    card: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
    subtle: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
  },
} as const;

// typography.ts
export const typographyTokens = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Fira Code', 'Consolas', 'Monaco', monospace",
  },
  
  fontSize: {
    h1: '3.052rem',
    h2: '2.441rem',
    h3: '1.953rem',
    h4: '1.563rem',
    h5: '1.25rem',
    h6: '1rem',
    body1: '1rem',
    body2: '0.875rem',
    caption: '0.75rem',
  },
  
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

// spacing.ts
export const spacingTokens = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

// animation.ts
export const animationTokens = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
  },
  
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
  },
} as const;
```

### Theme Configuration

MUI 主题配置整合所有 design tokens：

```typescript
import { createTheme } from '@mui/material/styles';
import { colorTokens, typographyTokens, spacingTokens, animationTokens } from './tokens';

export const modernTheme = createTheme({
  palette: {
    primary: {
      main: colorTokens.brand.primary,
      dark: colorTokens.brand.primaryDark,
      light: colorTokens.brand.primaryLight,
    },
    secondary: {
      main: colorTokens.brand.secondary,
      dark: colorTokens.brand.secondaryDark,
      light: colorTokens.brand.secondaryLight,
    },
    error: {
      main: colorTokens.semantic.error,
    },
    warning: {
      main: colorTokens.semantic.warning,
    },
    info: {
      main: colorTokens.semantic.info,
    },
    success: {
      main: colorTokens.semantic.success,
    },
    grey: colorTokens.neutral,
    background: {
      default: colorTokens.neutral[50],
      paper: '#ffffff',
    },
    text: {
      primary: colorTokens.neutral[900],
      secondary: colorTokens.neutral[600],
      disabled: colorTokens.neutral[400],
    },
  },
  
  typography: {
    fontFamily: typographyTokens.fontFamily.primary,
    h1: {
      fontSize: typographyTokens.fontSize.h1,
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.tight,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: typographyTokens.fontSize.h2,
      fontWeight: typographyTokens.fontWeight.bold,
      lineHeight: typographyTokens.lineHeight.snug,
      letterSpacing: '-0.01em',
    },
    // ... other typography variants
  },
  
  spacing: 8, // Base unit
  
  shape: {
    borderRadius: 8,
  },
  
  transitions: {
    duration: animationTokens.duration,
    easing: animationTokens.easing,
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: typographyTokens.fontWeight.semibold,
          borderRadius: '8px',
          padding: `${spacingTokens[3]} ${spacingTokens[6]}`,
          transition: `all ${animationTokens.duration.short}ms ${animationTokens.easing.standard}`,
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: `1px solid ${colorTokens.neutral[200]}`,
          transition: `all ${animationTokens.duration.short}ms ${animationTokens.easing.standard}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            borderColor: colorTokens.brand.primary,
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    // ... other component overrides
  },
});
```

## Error Handling

### Accessibility Errors

**Color Contrast Issues:**
- 使用自动化工具检查所有文本和背景的对比度
- 确保至少达到 WCAG AA 标准（4.5:1 for normal text, 3:1 for large text）
- 如果对比度不足，调整颜色或添加背景

**Focus States:**
- 所有交互元素必须有清晰的 focus 状态
- 使用 outline 或 box-shadow 提供视觉反馈
- 确保 focus 状态的对比度符合标准

### Responsive Design Issues

**Breakpoint Handling:**
- 在所有断点测试布局
- 确保内容不会溢出或重叠
- 使用 CSS Grid 和 Flexbox 的 fallback

**Touch Target Size:**
- 移动设备上的可点击元素至少 44x44px
- 按钮和链接之间保持足够间距（至少 8px）

### Performance Issues

**Animation Performance:**
- 只动画 transform 和 opacity 属性
- 避免动画 width、height、margin 等会触发 layout 的属性
- 使用 `will-change` 提示浏览器优化

**Font Loading:**
- 使用 `font-display: swap` 避免 FOIT (Flash of Invisible Text)
- 预加载关键字体文件
- 提供系统字体作为 fallback

## Testing Strategy

### Unit Testing

**Component Testing:**
- 测试每个组件在不同 props 下的渲染
- 测试交互行为（hover、click、focus）
- 使用 React Testing Library

**Design Token Testing:**
- 验证所有 token 值符合规范
- 测试 token 的类型安全性
- 确保 token 值在合理范围内

### Property-Based Testing

Property-based testing 将用于验证设计系统的通用属性和一致性规则。每个 property 都应该对所有可能的输入保持为真。

配置要求：
- 使用 fast-check 库进行 property-based testing
- 每个测试至少运行 100 次迭代
- 每个测试必须标注对应的设计属性编号



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Text Contrast Compliance

*For any* text element displayed on a colored background in the design system, the contrast ratio SHALL be at least 4.5:1 for normal text (< 18pt or < 14pt bold) and at least 3:1 for large text (≥ 18pt or ≥ 14pt bold).

**Validates: Requirements 1.7**

### Property 2: Spacing Scale Consistency

*For any* spacing value defined in the spacing system, the value SHALL be a multiple of the base unit (8px).

**Validates: Requirements 2.1**

### Property 3: Container Padding Minimum

*For any* container component in the design system, the internal padding SHALL be at least 24px.

**Validates: Requirements 2.4**

### Property 4: Responsive Spacing Scaling

*For any* spacing value, when the viewport changes from mobile to tablet to desktop, the spacing SHALL scale proportionally (mobile: 0.75x, tablet: 0.875x, desktop: 1x of base value).

**Validates: Requirements 2.5**

### Property 5: Icon Size Consistency

*For any* icon used in the design system, all icons within the same context (e.g., all feature card icons, all navigation icons) SHALL have the same width and height dimensions.

**Validates: Requirements 4.2, 8.4**

### Property 6: Feature Card Spacing Uniformity

*For any* feature card component, all cards SHALL use identical padding, margin, and gap values.

**Validates: Requirements 4.4**

### Property 7: Typography Hierarchy Weight

*For any* heading typography level (h1-h6), the font weight SHALL be greater than or equal to the body text font weight.

**Validates: Requirements 5.3**

### Property 8: Typography Line Height Ranges

*For any* typography definition, body text line heights SHALL be between 1.5 and 1.7, and heading line heights SHALL be between 1.2 and 1.4.

**Validates: Requirements 5.4**

### Property 9: Responsive Typography Scaling

*For any* typography size, when the viewport changes from mobile to tablet to desktop, font sizes SHALL scale appropriately (mobile: 0.875rem base, tablet: 0.9375rem base, desktop: 1rem base).

**Validates: Requirements 5.5**

### Property 10: Animation Timing Consistency

*For any* animation or transition definition, the timing function SHALL be one of the predefined easing functions (standard, decelerate, accelerate, sharp).

**Validates: Requirements 6.1**

### Property 11: Animation Duration Ranges

*For any* micro-interaction animation (hover, focus, click feedback), the duration SHALL be between 150ms and 300ms.

**Validates: Requirements 6.2**

### Property 12: Interactive Element Hover States

*For any* interactive element (button, link, card), a hover state with visual feedback SHALL be defined.

**Validates: Requirements 6.3**

### Property 13: Performant Animation Properties

*For any* animation or transition, only performant properties (transform, opacity, filter) SHALL be animated, not layout properties (width, height, margin, padding, top, left).

**Validates: Requirements 6.6**

### Property 14: Mobile Touch Target Size

*For any* interactive element on mobile viewports (< 600px), the minimum touch target size SHALL be 44x44 pixels.

**Validates: Requirements 7.3**

### Property 15: Design Token Usage

*For any* component style definition, color, spacing, and typography values SHALL reference design tokens rather than hard-coded values.

**Validates: Requirements 8.1, 8.7**

### Property 16: Border Radius Consistency

*For any* component with rounded corners, the border-radius value SHALL be one of the predefined values (4px, 8px, 12px, 16px).

**Validates: Requirements 8.2**

### Testing Implementation Notes

Each property will be implemented as a property-based test using the fast-check library. Tests will:

1. Generate random component configurations
2. Verify the property holds for all generated inputs
3. Run at least 100 iterations per test
4. Tag each test with the format: `Feature: modern-flat-design-optimization, Property N: [property name]`

Example test structure:

```typescript
import fc from 'fast-check';

describe('Feature: modern-flat-design-optimization, Property 1: Text Contrast Compliance', () => {
  it('should maintain minimum contrast ratios for all text/background combinations', () => {
    fc.assert(
      fc.property(
        fc.record({
          textColor: fc.hexaString({ minLength: 6, maxLength: 6 }),
          backgroundColor: fc.hexaString({ minLength: 6, maxLength: 6 }),
          fontSize: fc.integer({ min: 12, max: 48 }),
          fontWeight: fc.constantFrom(400, 600, 700),
        }),
        (config) => {
          const contrastRatio = calculateContrastRatio(
            config.textColor,
            config.backgroundColor
          );
          const isLargeText = 
            config.fontSize >= 18 || 
            (config.fontSize >= 14 && config.fontWeight >= 700);
          const minimumRatio = isLargeText ? 3 : 4.5;
          
          return contrastRatio >= minimumRatio;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```
