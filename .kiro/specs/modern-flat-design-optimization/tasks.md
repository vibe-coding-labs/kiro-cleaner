# Implementation Plan: Modern Flat Design Optimization

## Overview

本实现计划将 Kiro Cleaner 官网从基础扁平化设计升级为现代、专业、视觉吸引力强的设计系统。实现将分阶段进行：首先建立设计基础（tokens、主题），然后更新各个组件，最后进行测试和优化。

实现策略：
1. 建立新的设计 token 系统
2. 创建现代化的 MUI 主题配置
3. 逐个更新组件以使用新的设计系统
4. 实现响应式优化和动画效果
5. 通过 property-based testing 验证设计一致性

## Tasks

- [x] 1. 建立设计 token 系统
  - [x] 1.1 创建颜色 tokens
    - 创建 `src/theme/tokens/colors.ts` 文件
    - 定义 brand colors (primary, secondary, accent)
    - 定义 neutral colors (gray scale with 10 shades)
    - 定义 semantic colors (success, warning, error, info)
    - 定义 gradient colors
    - 导出类型安全的 color tokens
    - _Requirements: 1.1, 1.3, 1.5, 1.6_
  
  - [x] 1.2 创建字体 tokens
    - 创建 `src/theme/tokens/typography.ts` 文件
    - 定义 font families (primary: Inter, mono: Fira Code)
    - 定义 font size scale (h1-h6, body1-2, caption)
    - 定义 font weights (regular, medium, semibold, bold)
    - 定义 line heights (tight, snug, normal, relaxed)
    - 定义 letter spacing values
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [x] 1.3 创建间距 tokens
    - 创建 `src/theme/tokens/spacing.ts` 文件
    - 定义基于 8px 的间距 scale (0-32)
    - 确保所有值都是 8 的倍数
    - 导出类型安全的 spacing tokens
    - _Requirements: 2.1_
  
  - [x] 1.4 创建动画 tokens
    - 创建 `src/theme/tokens/animation.ts` 文件
    - 定义 duration scale (shortest to complex)
    - 定义 easing functions (standard, decelerate, accelerate, sharp)
    - 导出类型安全的 animation tokens
    - _Requirements: 6.1, 6.2_
  
  - [x] 1.5 创建 tokens 索引文件
    - 创建 `src/theme/tokens/index.ts`
    - 导出所有 token 模块
    - 提供统一的 tokens 访问接口
    - _Requirements: All token requirements_

- [-] 2. 创建现代化 MUI 主题
  - [x] 2.1 实现主题配置
    - 创建 `src/theme/modernTheme.ts` 文件
    - 使用 createTheme 整合所有 design tokens
    - 配置 palette (primary, secondary, error, warning, info, success, grey, background, text)
    - 配置 typography (所有变体的 fontSize, fontWeight, lineHeight, letterSpacing)
    - 配置 spacing (base unit: 8)
    - 配置 shape (borderRadius: 8)
    - 配置 transitions (duration, easing)
    - _Requirements: 1.1, 1.3, 1.5, 1.6, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2_
  
  - [ ] 2.2 配置组件样式覆盖
    - 在 modernTheme 中添加 components 配置
    - 覆盖 MuiButton 样式 (textTransform, fontWeight, borderRadius, padding, hover effects)
    - 覆盖 MuiCard 样式 (borderRadius, border, transition, hover effects)
    - 覆盖 MuiContainer 样式 (maxWidth, padding)
    - 覆盖 MuiTypography 样式 (responsive font sizes)
    - _Requirements: 2.4, 4.1, 4.3, 5.5_
  
  - [ ] 2.3 实现响应式断点配置
    - 在 modernTheme 中配置 breakpoints (mobile: 0, tablet: 600, desktop: 960)
    - 配置响应式 typography scaling
    - 配置响应式 spacing scaling
    - _Requirements: 7.1, 5.5, 2.5_

- [ ] 3. 更新 Hero Section
  - [ ] 3.1 重新设计 Hero Section 布局
    - 更新 `src/components/HeroSection.tsx`
    - 使用新的 gradient background (hero gradient from tokens)
    - 调整 padding 使用新的 spacing tokens (spacing[24] vertical)
    - 优化标题层次 (h1 for headline, h4 for subheadline)
    - 确保 CTA 按钮使用 primary 和 secondary colors
    - 添加微妙的背景效果 (gradient overlay)
    - _Requirements: 3.2, 3.6, 2.2_
  
  - [ ] 3.2 优化 Hero Section 响应式设计
    - 调整移动端布局 (单列，居中对齐)
    - 调整平板端布局 (保持双列但缩小间距)
    - 调整桌面端布局 (双列，大间距)
    - 确保图片在所有尺寸下正确缩放
    - _Requirements: 3.6, 7.2, 7.6_

- [ ] 4. 更新 Feature Cards
  - [ ] 4.1 重新设计 Feature Card 组件
    - 更新 `src/components/Features.tsx`
    - 使用新的 spacing tokens for padding (spacing[8])
    - 使用新的 border radius (12px)
    - 使用新的 border color (neutral[200])
    - 统一图标大小 (48px)
    - 使用新的 color tokens for icons (primary, secondary, accent)
    - _Requirements: 4.1, 4.2, 4.4, 4.5_
  
  - [ ] 4.2 实现 Feature Card 交互动画
    - 添加 hover 效果 (translateY(-4px), shadow, border color change)
    - 使用 animation tokens for duration (250ms) and easing (standard)
    - 确保动画只使用 transform 和 box-shadow
    - _Requirements: 4.3, 6.3, 6.6_
  
  - [ ] 4.3 优化 Feature Cards 响应式布局
    - 桌面: 4 列网格
    - 平板: 2 列网格
    - 移动: 1 列网格
    - 使用新的 spacing tokens for gaps (spacing[6])
    - _Requirements: 4.6, 7.2_

- [ ] 5. 更新 Navigation Bar
  - [ ] 5.1 重新设计 Navigation Bar
    - 更新 `src/components/NavigationBar.tsx`
    - 设置固定高度 (64px)
    - 使用白色背景和微妙阴影
    - 使用新的 spacing tokens for padding (spacing[6])
    - 优化 logo 大小 (32px height)
    - 优化链接间距 (spacing[8])
    - _Requirements: 2.4_
  
  - [ ] 5.2 实现 Navigation Bar 交互效果
    - 添加链接 hover 效果 (underline with primary color, 200ms transition)
    - 添加 logo hover 效果 (scale 1.05, 200ms transition)
    - 实现 sticky positioning on scroll
    - _Requirements: 6.3_

- [ ] 6. 更新按钮组件
  - [ ] 6.1 创建现代化按钮组件
    - 更新 `src/components/FlatButton.tsx`
    - 使用新的 color tokens (primary, secondary)
    - 使用新的 spacing tokens for padding (spacing[3] spacing[6])
    - 使用新的 border radius (8px)
    - 设置 font weight (semibold: 600)
    - _Requirements: 5.3_
  
  - [ ] 6.2 实现按钮交互动画
    - 添加 hover 效果 (darken 10%, translateY(-2px))
    - 添加 active 效果 (darken 15%, no lift)
    - 使用 animation tokens (200ms, standard easing)
    - 确保只动画 transform 和 background-color
    - _Requirements: 6.3, 6.6_
  
  - [ ] 6.3 优化按钮响应式设计
    - 确保移动端触摸目标至少 44x44px
    - 调整移动端 padding 以满足最小尺寸
    - _Requirements: 7.3_

- [ ] 7. 更新 Footer
  - [ ] 7.1 重新设计 Footer
    - 更新 `src/components/Footer.tsx` (如果存在) 或 App.tsx 中的 Footer 部分
    - 使用新的 background color (neutral[900])
    - 使用新的 text color (neutral[300])
    - 使用新的 spacing tokens for padding (spacing[12])
    - 添加顶部 border (3px solid primary)
    - _Requirements: 2.2, 2.4_
  
  - [ ] 7.2 实现 Footer 链接交互
    - 添加链接 hover 效果 (primary color, 200ms transition)
    - _Requirements: 6.3_

- [ ] 8. 实现全局样式和辅助功能
  - [ ] 8.1 更新全局 CSS
    - 更新 `src/index.css` 或 `src/App.css`
    - 添加 Inter 字体导入 (Google Fonts)
    - 设置全局 box-sizing: border-box
    - 设置全局 smooth scrolling
    - 添加 focus-visible 样式
    - _Requirements: 5.1_
  
  - [ ] 8.2 实现 reduced motion 支持
    - 添加 prefers-reduced-motion media query
    - 在 reduced motion 模式下禁用或减少动画
    - _Requirements: 6.5_
  
  - [ ] 8.3 更新 App.tsx 使用新主题
    - 将 ThemeProvider 的 theme 从 flatTheme 改为 modernTheme
    - 验证所有组件正确应用新主题
    - _Requirements: All requirements_

- [ ] 9. Checkpoint - 验证视觉效果和响应式设计
  - 在浏览器中测试所有组件的视觉效果
  - 测试所有断点的响应式布局 (mobile, tablet, desktop)
  - 测试所有交互动画 (hover, focus, click)
  - 测试颜色对比度
  - 确保没有布局问题或视觉错误
  - 如有问题，请向用户报告

- [ ] 10. 实现设计系统测试
  - [ ] 10.1 编写 Property 1 测试: Text Contrast Compliance
    - **Property 1: Text Contrast Compliance**
    - **Validates: Requirements 1.7**
    - 创建 `src/theme/tokens/colors.test.ts`
    - 使用 fast-check 生成随机文本/背景颜色组合
    - 验证对比度符合 WCAG 标准 (4.5:1 for normal, 3:1 for large)
    - 至少运行 100 次迭代
  
  - [ ] 10.2 编写 Property 2 测试: Spacing Scale Consistency
    - **Property 2: Spacing Scale Consistency**
    - **Validates: Requirements 2.1**
    - 创建 `src/theme/tokens/spacing.test.ts`
    - 验证所有 spacing 值都是 8 的倍数
  
  - [ ] 10.3 编写 Property 7 测试: Typography Hierarchy Weight
    - **Property 7: Typography Hierarchy Weight**
    - **Validates: Requirements 5.3**
    - 创建 `src/theme/tokens/typography.test.ts`
    - 验证所有标题的 font weight >= body text font weight
  
  - [ ] 10.4 编写 Property 8 测试: Typography Line Height Ranges
    - **Property 8: Typography Line Height Ranges**
    - **Validates: Requirements 5.4**
    - 在 `src/theme/tokens/typography.test.ts` 中添加
    - 验证 body text line height 在 1.5-1.7 范围
    - 验证 heading line height 在 1.2-1.4 范围
  
  - [ ] 10.5 编写 Property 10 测试: Animation Timing Consistency
    - **Property 10: Animation Timing Consistency**
    - **Validates: Requirements 6.1**
    - 创建 `src/theme/tokens/animation.test.ts`
    - 验证所有 easing functions 都来自预定义集合
  
  - [ ] 10.6 编写 Property 11 测试: Animation Duration Ranges
    - **Property 11: Animation Duration Ranges**
    - **Validates: Requirements 6.2**
    - 在 `src/theme/tokens/animation.test.ts` 中添加
    - 验证微交互动画时长在 150-300ms 范围
  
  - [ ] 10.7 编写 Property 16 测试: Border Radius Consistency
    - **Property 16: Border Radius Consistency**
    - **Validates: Requirements 8.2**
    - 创建 `src/theme/modernTheme.test.ts`
    - 验证所有 border-radius 值来自预定义集合 (4px, 8px, 12px, 16px)

- [ ] 11. 实现组件测试
  - [ ] 11.1 编写 Hero Section 单元测试
    - 创建或更新 `src/components/HeroSection.test.tsx`
    - 测试组件渲染
    - 测试 CTA 按钮存在
    - 测试响应式布局
    - _Requirements: 3.2, 3.6_
  
  - [ ] 11.2 编写 Feature Cards 单元测试
    - 创建或更新 `src/components/Features.test.tsx`
    - 测试所有卡片渲染
    - 测试图标一致性
    - 测试 hover 样式定义
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 11.3 编写 Navigation Bar 单元测试
    - 创建或更新 `src/components/NavigationBar.test.tsx`
    - 测试组件渲染
    - 测试链接存在
    - 测试 hover 样式
    - _Requirements: Navigation requirements_
  
  - [ ] 11.4 编写 Button 组件单元测试
    - 创建或更新 `src/components/FlatButton.test.tsx`
    - 测试不同变体渲染
    - 测试最小触摸目标尺寸
    - 测试 hover 和 active 状态
    - _Requirements: 7.3, 6.3_

- [ ] 12. 性能优化和可访问性
  - [ ] 12.1 优化字体加载
    - 在 index.html 中添加 font preload
    - 使用 font-display: swap
    - _Requirements: 5.1_
  
  - [ ] 12.2 验证颜色对比度
    - 使用浏览器开发工具或在线工具检查所有文本/背景组合
    - 确保符合 WCAG AA 标准
    - 修复任何对比度不足的问题
    - _Requirements: 1.4, 1.7_
  
  - [ ] 12.3 验证键盘导航
    - 测试所有交互元素的键盘可访问性
    - 确保 focus 状态清晰可见
    - 确保 tab 顺序合理
    - _Requirements: Accessibility requirements_

- [ ] 13. Final Checkpoint - 完整测试和验证
  - 运行所有测试 (unit tests + property tests)
  - 在多个浏览器中测试 (Chrome, Firefox, Safari)
  - 在多个设备上测试 (desktop, tablet, mobile)
  - 验证所有动画流畅
  - 验证所有颜色对比度符合标准
  - 验证响应式设计在所有断点正常工作
  - 如有问题，请向用户报告

## Notes

- 每个任务都引用了具体的需求编号以确保可追溯性
- Checkpoint 任务确保增量验证
- Property tests 验证设计系统的通用正确性属性
- Unit tests 验证具体示例和边缘情况
