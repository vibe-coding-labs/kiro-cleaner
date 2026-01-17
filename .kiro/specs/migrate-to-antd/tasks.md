# Implementation Plan: Migrate to Ant Design

## Overview

将网站从 Material-UI 迁移到 Ant Design，并重新设计为现代、美观的扁平化风格。

## Tasks

- [x] 1. Install and configure Ant Design
  - Install antd package
  - Install @ant-design/icons package
  - Configure theme in App.tsx
  - Import Ant Design CSS
  - Test basic setup with a simple component
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Create new HeroSection with Ant Design
  - Create new HeroSection component using Ant Design
  - Use Layout, Typography, Button, Space components
  - Implement clean, spacious layout
  - Add demo video container
  - Style with Ant Design theme
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Create new Features component with Ant Design
  - Create new Features component
  - Use Row, Col, Card components
  - Add icons from @ant-design/icons
  - Implement hover effects
  - Make responsive with Grid system
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 4. Create new NavigationBar with Ant Design
  - Create new NavigationBar component
  - Use Layout.Header and Menu components
  - Implement fixed positioning
  - Add mobile drawer for responsive design
  - Style with clean, minimal design
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Create new HowItWorks component with Ant Design
  - Create new HowItWorks component
  - Use Steps or Timeline component
  - Add Card for step details
  - Implement clean, clear layout
  - _Requirements: 5.1_

- [x] 6. Create new UseCases component with Ant Design
  - Create new UseCases component
  - Use Card components with icons
  - Implement grid layout
  - Add hover effects
  - _Requirements: 5.2_

- [x] 7. Create new FAQ component with Ant Design
  - Create new FAQ component
  - Use Collapse component
  - Set default active panel
  - Style with clean design
  - _Requirements: 5.3_

- [x] 8. Create new Installation component with Ant Design
  - Create new Installation component
  - Use Tabs component
  - Add code blocks with Typography
  - Implement tab switching
  - _Requirements: 5.4_

- [x] 9. Update App.tsx to use new components
  - Replace all old components with new Ant Design components
  - Remove Material-UI ThemeProvider
  - Add Ant Design ConfigProvider
  - Test all sections
  - _Requirements: 1.4, 6.1, 6.2, 6.3, 6.4_

- [ ] 10. Remove Material-UI dependencies
  - Uninstall @mui/material
  - Uninstall @mui/icons-material
  - Uninstall @emotion packages
  - Delete old component files
  - Delete theme files
  - Delete utility files
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 11. Clean up and optimize
  - Remove unused imports
  - Delete old test files
  - Update remaining tests
  - Optimize CSS
  - Check responsive design
  - _Requirements: 7.4_

- [ ] 12. Final polish and testing
  - Adjust spacing and alignment
  - Test on different screen sizes
  - Test all interactions
  - Verify accessibility
  - Check performance
  - _Requirements: All_

## Notes

- Focus on creating clean, simple components
- Use Ant Design's default styles as much as possible
- Minimize custom CSS
- Keep components small and focused
- Test frequently during migration
- Commit after each major component is migrated

## Estimated Time

- Phase 1 (Setup): 30 minutes
- Phase 2 (Core Components): 2 hours
- Phase 3 (Secondary Components): 2 hours
- Phase 4 (Cleanup): 1 hour
- Phase 5 (Polish): 1 hour
- **Total: ~6-7 hours**
