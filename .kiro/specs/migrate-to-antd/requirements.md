# Requirements Document: Migrate to Ant Design

## Introduction

本文档定义了将 Kiro Cleaner 官网从 Material-UI 迁移到 Ant Design 的需求，并重新设计为现代、美观的扁平化风格。

## Glossary

- **Ant Design**: 蚂蚁金服开源的 React UI 组件库，以简洁、优雅著称
- **Flat Design**: 扁平化设计，强调简洁、清晰的视觉效果
- **Component Migration**: 组件迁移，将现有组件从 Material-UI 改为 Ant Design

## Requirements

### Requirement 1: 安装和配置 Ant Design

**User Story:** 作为开发者，我需要在项目中安装和配置 Ant Design

#### Acceptance Criteria

1. WHEN Ant Design is installed THEN it SHALL include antd and @ant-design/icons packages
2. WHEN the app is configured THEN it SHALL import Ant Design CSS
3. WHEN the theme is configured THEN it SHALL use a custom flat design theme
4. WHEN the app runs THEN it SHALL NOT have Material-UI conflicts

### Requirement 2: 重新设计 Hero Section

**User Story:** 作为访问者，我希望看到一个现代、吸引人的首屏

#### Acceptance Criteria

1. WHEN the Hero Section loads THEN it SHALL use Ant Design Layout components
2. WHEN the Hero Section is displayed THEN it SHALL have a clean, spacious layout
3. WHEN buttons are shown THEN they SHALL use Ant Design Button with primary/default styles
4. WHEN the video is displayed THEN it SHALL be in a clean container with subtle styling

### Requirement 3: 重新设计 Features Section

**User Story:** 作为访问者，我希望看到清晰展示的产品特性

#### Acceptance Criteria

1. WHEN Features are displayed THEN they SHALL use Ant Design Card components
2. WHEN Feature cards are shown THEN they SHALL have icons from @ant-design/icons
3. WHEN cards are hovered THEN they SHALL have subtle hover effects
4. WHEN the layout is responsive THEN it SHALL use Ant Design Grid system

### Requirement 4: 重新设计 Navigation Bar

**User Story:** 作为访问者，我希望看到简洁的导航栏

#### Acceptance Criteria

1. WHEN the Navigation Bar loads THEN it SHALL use Ant Design Menu component
2. WHEN navigation items are displayed THEN they SHALL be clearly visible
3. WHEN the navbar is on mobile THEN it SHALL collapse into a drawer
4. WHEN links are clicked THEN they SHALL smoothly scroll to sections

### Requirement 5: 重新设计其他组件

**User Story:** 作为访问者，我希望所有组件都有一致的设计风格

#### Acceptance Criteria

1. WHEN HowItWorks is displayed THEN it SHALL use Ant Design Steps or Timeline
2. WHEN UseCases are shown THEN they SHALL use Ant Design Card with icons
3. WHEN FAQ is displayed THEN it SHALL use Ant Design Collapse component
4. WHEN Installation is shown THEN it SHALL use Ant Design Tabs component

### Requirement 6: 优化色彩和排版

**User Story:** 作为访问者，我希望看到和谐的配色和清晰的排版

#### Acceptance Criteria

1. WHEN the website loads THEN it SHALL use a custom color palette
2. WHEN text is displayed THEN it SHALL use appropriate font sizes and weights
3. WHEN spacing is applied THEN it SHALL be consistent across all components
4. WHEN colors are used THEN they SHALL have sufficient contrast for accessibility

### Requirement 7: 移除 Material-UI 依赖

**User Story:** 作为开发者，我需要完全移除 Material-UI 依赖

#### Acceptance Criteria

1. WHEN the migration is complete THEN Material-UI packages SHALL be uninstalled
2. WHEN components are checked THEN they SHALL NOT import from @mui
3. WHEN the app builds THEN it SHALL NOT have Material-UI in the bundle
4. WHEN tests run THEN they SHALL NOT reference Material-UI components
