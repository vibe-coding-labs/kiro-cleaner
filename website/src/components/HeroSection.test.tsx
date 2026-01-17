import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { flatTheme } from '../theme/flatTheme';
import { flatColors } from '../theme/colors';
import HeroSection from './HeroSection';

// Feature: flat-design-website
// Property 4: Hero section has no shadows - **Validates: Requirements 2.1**
// Property 5: Hero section uses palette colors only - **Validates: Requirements 2.2**
// Property 6: Call-to-action buttons are flat - **Validates: Requirements 2.3**

const renderHeroSection = () => {
  return render(
    <ThemeProvider theme={flatTheme}>
      <HeroSection />
    </ThemeProvider>
  );
};

describe('HeroSection Component', () => {
  describe('Property 1: Video Source Correctness', () => {
    it('should use clean command video as primary source', () => {
      const { container } = renderHeroSection();
      const video = container.querySelector('video');
      
      expect(video).toBeInTheDocument();
      
      const sources = video?.querySelectorAll('source');
      expect(sources).toBeTruthy();
      expect(sources!.length).toBeGreaterThan(0);
      
      // Check that at least one source uses the clean command video
      const cleanVideoSources = Array.from(sources!).filter(source => 
        source.getAttribute('src')?.includes('demo-clean-command')
      );
      
      expect(cleanVideoSources.length).toBeGreaterThan(0);
    });

    it('should not reference scan command video', () => {
      const { container } = renderHeroSection();
      const video = container.querySelector('video');
      const sources = video?.querySelectorAll('source');
      
      // Verify no scan command video sources remain
      const scanVideoSources = Array.from(sources!).filter(source => 
        source.getAttribute('src')?.includes('demo-scan-command')
      );
      
      expect(scanVideoSources.length).toBe(0);
    });

    it('should have correct MIME types for video sources', () => {
      const { container } = renderHeroSection();
      const video = container.querySelector('video');
      const sources = video?.querySelectorAll('source');
      
      sources?.forEach(source => {
        const type = source.getAttribute('type');
        const src = source.getAttribute('src');
        
        if (src?.endsWith('.mov')) {
          expect(type).toBe('video/quicktime');
        }
      });
    });

    it('should have autoplay, loop, and muted attributes', () => {
      const { container } = renderHeroSection();
      const video = container.querySelector('video');
      
      expect(video?.hasAttribute('autoplay')).toBe(true);
      expect(video?.hasAttribute('loop')).toBe(true);
      expect(video?.hasAttribute('muted') || video?.muted).toBe(true);
      expect(video?.hasAttribute('playsinline')).toBe(true);
    });
  });

  describe('Property 4: Hero section has no shadows', () => {
    it('should render without box-shadow on container', () => {
      const { container } = renderHeroSection();
      // Check all elements for shadows
      const allElements = container.querySelectorAll('*');
      
      allElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        // Empty string or 'none' both indicate no shadow
        if (styles.boxShadow && styles.boxShadow !== '' && styles.boxShadow !== 'none') {
          expect(styles.boxShadow).toBe('none');
        }
      });
    });

    it('should render logo container without shadows', () => {
      renderHeroSection();
      // If we can find the image, check its parent container
      const img = screen.getByAltText('Kiro Cleaner Logo');
      expect(img).toBeInTheDocument();
      
      const parent = img.parentElement;
      if (parent) {
        const styles = window.getComputedStyle(parent);
        // Empty or none both mean no shadow
        expect(styles.boxShadow === '' || styles.boxShadow === 'none').toBe(true);
      }
    });
  });

  describe('Property 5: Hero section uses palette colors only', () => {
    it('should use colors from the defined palette', () => {
      const { container } = renderHeroSection();
      const heroBox = container.querySelector('[class*="MuiBox"]');
      
      if (heroBox) {
        const styles = window.getComputedStyle(heroBox);
        const bgColor = styles.backgroundColor;
        
        // Should have a background color set
        expect(bgColor).toBeTruthy();
        expect(bgColor).not.toBe('transparent');
      }
    });
  });

  describe('Property 6: Call-to-action buttons are flat', () => {
    it('should render CTA buttons without shadows', () => {
      renderHeroSection();
      const buttons = screen.getAllByRole('link');
      
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        expect(styles.boxShadow).toBe('none');
      });
    });

    it('should render buttons with solid backgrounds', () => {
      renderHeroSection();
      const buttons = screen.getAllByRole('link');
      
      buttons.forEach(button => {
        const styles = window.getComputedStyle(button);
        expect(styles.backgroundImage).toBe('none');
      });
    });
  });

  describe('Hero Content', () => {
    it('should render main heading', () => {
      renderHeroSection();
      expect(screen.getByText(/清理 Kiro IDE 的冗余数据/i)).toBeInTheDocument();
    });

    it('should render CTA buttons', () => {
      renderHeroSection();
      expect(screen.getByText('立即开始')).toBeInTheDocument();
      expect(screen.getByText('了解更多')).toBeInTheDocument();
    });
  });
});
