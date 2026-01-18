# Website i18n Support - Implementation Tasks

## Task List

- [x] 1. Setup i18n Infrastructure
  - [x] 1.1 Install i18n dependencies (i18next, react-i18next, i18next-browser-languagedetector)
  - [x] 1.2 Create i18n configuration file (`src/i18n/config.ts`)
  - [x] 1.3 Create translation file structure (`src/i18n/locales/`)
  - [x] 1.4 Initialize i18n in main application entry point
  - [x] 1.5 Update HTML lang attribute dynamically

- [x] 2. Create Translation Files
  - [x] 2.1 Create English translation file (`src/i18n/locales/en.json`)
  - [x] 2.2 Create Simplified Chinese translation file (`src/i18n/locales/zh-CN.json`)
  - [x] 2.3 Define translation key structure and naming convention
  - [x] 2.4 Extract all translatable text from components
  - [x] 2.5 Organize translations by sections (nav, hero, features, useCases, faq, installation)

- [x] 3. Implement Language Switcher Component
  - [x] 3.1 Create LanguageSwitcher component (`src/components/LanguageSwitcher.tsx`)
  - [x] 3.2 Add language dropdown with English and 简体中文 options
  - [x] 3.3 Implement language change handler
  - [x] 3.4 Style language switcher to match design
  - [x] 3.5 Add language switcher to navigation bar
  - [x] 3.6 Add ARIA labels and keyboard accessibility

- [x] 4. Update Navigation Component
  - [x] 4.1 Replace hardcoded navigation text with translation keys
  - [x] 4.2 Update AntNavigationBar component to use useTranslation hook
  - [x] 4.3 Test navigation in both languages
  - [x] 4.4 Verify responsive behavior with different text lengths

- [x] 5. Update Hero Section Component
  - [x] 5.1 Replace hardcoded hero text with translation keys
  - [x] 5.2 Update AntHeroSection component to use useTranslation hook
  - [x] 5.3 Translate badge, titles, subtitle, benefits, and CTA buttons
  - [x] 5.4 Test layout with both languages
  - [x] 5.5 Verify no text overflow or layout breaks

- [x] 6. Update Features Section Component
  - [x] 6.1 Replace hardcoded features text with translation keys
  - [x] 6.2 Update AntFeatures component to use useTranslation hook
  - [x] 6.3 Translate section title, subtitle, and all feature cards
  - [x] 6.4 Test card layouts with different text lengths
  - [x] 6.5 Verify icons and styling remain consistent

- [x] 7. Update How It Works Section Component
  - [x] 7.1 Replace hardcoded workflow text with translation keys
  - [x] 7.2 Update AntHowItWorks component to use useTranslation hook
  - [x] 7.3 Translate section title, steps, and code examples
  - [x] 7.4 Test step cards in both languages
  - [x] 7.5 Verify timeline visualization works correctly

- [x] 8. Update Use Cases Section Component
  - [x] 8.1 Replace hardcoded use case text with translation keys
  - [x] 8.2 Update AntUseCases component to use useTranslation hook
  - [x] 8.3 Translate section title, subtitle, and all use case cards
  - [x] 8.4 Test card layouts and badges in both languages
  - [x] 8.5 Verify color schemes and icons remain consistent

- [x] 9. Update Installation Section Component
  - [x] 9.1 Replace hardcoded installation text with translation keys
  - [x] 9.2 Update AntInstallation component to use useTranslation hook
  - [x] 9.3 Translate tab labels and installation instructions
  - [x] 9.4 Keep code blocks in original language (bash commands)
  - [x] 9.5 Test tab switching in both languages

- [x] 10. Update FAQ Section Component
  - [x] 10.1 Replace hardcoded FAQ text with translation keys
  - [x] 10.2 Update AntFAQ component to use useTranslation hook
  - [x] 10.3 Translate section title, subtitle, questions, and answers
  - [x] 10.4 Test accordion expansion in both languages
  - [x] 10.5 Verify contact links and text

- [x] 11. Implement Language Detection
  - [x] 11.1 Configure i18next-browser-languagedetector
  - [x] 11.2 Set detection order (localStorage → navigator → default)
  - [x] 11.3 Test browser language detection for Chinese browsers
  - [x] 11.4 Test browser language detection for English browsers
  - [x] 11.5 Verify fallback to English for unsupported languages

- [x] 12. Implement Language Persistence
  - [x] 12.1 Configure localStorage caching in i18next
  - [x] 12.2 Set localStorage key name ('kiro-cleaner-language')
  - [x] 12.3 Test language preference is saved on switch
  - [x] 12.4 Test saved preference is loaded on page reload
  - [x] 12.5 Test clearing localStorage resets to auto-detection

- [x] 13. Update HTML Metadata
  - [x] 13.1 Update HTML lang attribute on language change
  - [x] 13.2 Add language-specific meta tags if needed
  - [x] 13.3 Test meta tags in both languages
  - [x] 13.4 Verify SEO implications

- [ ] 14. Write Unit Tests
  - [ ] 14.1 Write tests for LanguageSwitcher component
  - [ ] 14.2 Write tests for i18n configuration
  - [ ] 14.3 Write tests for language detection logic
  - [ ] 14.4 Write tests for localStorage persistence
  - [ ] 14.5 Ensure all tests pass

- [ ] 15. Write Integration Tests
  - [ ] 15.1 Test complete language switch flow
  - [ ] 15.2 Test language detection on first visit
  - [ ] 15.3 Test language persistence across sessions
  - [ ] 15.4 Test all components render correctly in both languages
  - [ ] 15.5 Ensure all integration tests pass

- [ ] 16. Manual Testing
  - [ ] 16.1 Test on Chrome with English browser settings
  - [ ] 16.2 Test on Chrome with Chinese browser settings
  - [ ] 16.3 Test on Firefox with both language settings
  - [ ] 16.4 Test on Safari with both language settings
  - [ ] 16.5 Test on mobile browsers (iOS Safari, Chrome Mobile)
  - [ ] 16.6 Test language switcher interactions
  - [ ] 16.7 Test localStorage persistence
  - [ ] 16.8 Verify no layout breaks or text overflow
  - [ ] 16.9 Test keyboard navigation
  - [ ] 16.10 Test with screen reader

- [ ] 17. Performance Testing
  - [ ] 17.1 Measure initial page load time with i18n
  - [ ] 17.2 Measure language switch performance
  - [ ] 17.3 Check bundle size increase
  - [ ] 17.4 Verify no performance regressions
  - [ ] 17.5 Optimize if needed

- [ ] 18. Accessibility Testing
  - [ ] 18.1 Test keyboard navigation for language switcher
  - [ ] 18.2 Test screen reader announcements
  - [ ] 18.3 Verify ARIA labels are correct
  - [ ] 18.4 Test focus management
  - [ ] 18.5 Run accessibility audit (Lighthouse)

- [ ] 19. Documentation
  - [ ] 19.1 Update README with i18n information
  - [ ] 19.2 Document translation key structure
  - [ ] 19.3 Create translation contribution guidelines
  - [ ] 19.4 Document how to add new languages
  - [ ] 19.5 Add comments to i18n configuration

- [ ] 20. Final Review and Deployment
  - [ ] 20.1 Review all translations for accuracy
  - [ ] 20.2 Get native speaker review for Chinese translations
  - [ ] 20.3 Fix any remaining issues
  - [ ] 20.4 Build production bundle
  - [ ] 20.5 Test production build locally
  - [ ] 20.6 Deploy to GitHub Pages
  - [ ] 20.7 Verify deployment works correctly
  - [ ] 20.8 Test on live site with both languages

## Task Dependencies

```
1 (Setup) → 2 (Translation Files) → 3-10 (Component Updates)
                                  ↓
11 (Detection) → 12 (Persistence) → 13 (Metadata)
                                  ↓
14 (Unit Tests) → 15 (Integration Tests) → 16 (Manual Testing)
                                         ↓
17 (Performance) → 18 (Accessibility) → 19 (Documentation) → 20 (Deployment)
```

## Estimated Time

- Setup and Infrastructure: 2-3 hours
- Translation Files: 3-4 hours
- Component Updates: 4-5 hours
- Testing: 3-4 hours
- Documentation and Deployment: 1-2 hours

**Total Estimated Time: 13-18 hours**

## Notes

- Keep code blocks (bash commands) in English for consistency
- Test with actual Chinese-speaking users if possible
- Ensure all text is translatable, including alt text and ARIA labels
- Monitor bundle size to keep it under 50KB increase
- Consider using translation management tools for larger projects
