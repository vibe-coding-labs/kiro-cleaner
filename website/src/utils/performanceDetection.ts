/**
 * Performance Detection Utilities
 * 
 * Detects device performance capabilities and user preferences
 * to adjust animation complexity and visual effects accordingly.
 * 
 * Requirements: 7.4, 7.5
 */

/**
 * Performance levels for animation complexity
 */
export enum PerformanceLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Detect hardware concurrency (CPU cores)
 * More cores generally indicate better performance
 */
export const getHardwareConcurrency = (): number => {
  if (typeof window === 'undefined' || !navigator.hardwareConcurrency) {
    return 4; // Default fallback
  }
  return navigator.hardwareConcurrency;
};

/**
 * Check if user prefers reduced motion
 * Respects system-level accessibility settings
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Detect device memory (if available)
 * More memory generally indicates better performance
 */
export const getDeviceMemory = (): number | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  
  // @ts-ignore - deviceMemory is not in TypeScript types yet
  return navigator.deviceMemory;
};

/**
 * Check if device is likely a mobile device
 * Mobile devices typically have lower performance
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Detect overall performance level based on multiple factors
 * 
 * @returns PerformanceLevel enum value
 */
export const detectPerformanceLevel = (): PerformanceLevel => {
  // If user prefers reduced motion, always use low performance mode
  if (prefersReducedMotion()) {
    return PerformanceLevel.LOW;
  }
  
  const cores = getHardwareConcurrency();
  const memory = getDeviceMemory();
  const isMobile = isMobileDevice();
  
  // High performance: Desktop with 8+ cores and 8GB+ RAM
  if (!isMobile && cores >= 8 && (memory === undefined || memory >= 8)) {
    return PerformanceLevel.HIGH;
  }
  
  // Low performance: Mobile or low-end desktop (< 4 cores or < 4GB RAM)
  if (isMobile || cores < 4 || (memory !== undefined && memory < 4)) {
    return PerformanceLevel.LOW;
  }
  
  // Medium performance: Everything else
  return PerformanceLevel.MEDIUM;
};

/**
 * Get animation configuration based on performance level
 * 
 * @param level - Performance level
 * @returns Animation configuration object
 */
export const getAnimationConfig = (level: PerformanceLevel) => {
  switch (level) {
    case PerformanceLevel.HIGH:
      return {
        enableComplexAnimations: true,
        enableParticles: true,
        enableBlur: true,
        enableShadows: true,
        animationDuration: 1,
        staggerDelay: 100,
      };
    
    case PerformanceLevel.MEDIUM:
      return {
        enableComplexAnimations: true,
        enableParticles: false,
        enableBlur: true,
        enableShadows: true,
        animationDuration: 0.8,
        staggerDelay: 80,
      };
    
    case PerformanceLevel.LOW:
      return {
        enableComplexAnimations: false,
        enableParticles: false,
        enableBlur: false,
        enableShadows: false,
        animationDuration: 0.3,
        staggerDelay: 0,
      };
  }
};

/**
 * Hook to get current performance configuration
 * Can be used in React components
 */
export const usePerformanceConfig = () => {
  const level = detectPerformanceLevel();
  return getAnimationConfig(level);
};

/**
 * Get reduced animation duration based on performance
 * 
 * @param baseDuration - Base animation duration in seconds
 * @param level - Performance level (optional, will detect if not provided)
 * @returns Adjusted duration in seconds
 */
export const getAdjustedDuration = (
  baseDuration: number,
  level?: PerformanceLevel
): number => {
  const performanceLevel = level || detectPerformanceLevel();
  const config = getAnimationConfig(performanceLevel);
  return baseDuration * config.animationDuration;
};

/**
 * Check if backdrop-filter is supported
 * Used for glassmorphism effects
 */
export const supportsBackdropFilter = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return (
    CSS.supports('backdrop-filter', 'blur(10px)') ||
    CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
  );
};

/**
 * Get CSS transition duration string based on performance
 * 
 * @param baseDuration - Base duration in milliseconds
 * @returns CSS duration string (e.g., "300ms")
 */
export const getTransitionDuration = (baseDuration: number): string => {
  const level = detectPerformanceLevel();
  const adjusted = getAdjustedDuration(baseDuration / 1000, level);
  return `${Math.round(adjusted * 1000)}ms`;
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  /**
   * Measure frame rate over a period
   */
  measureFPS: (duration: number = 1000): Promise<number> => {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      const countFrame = () => {
        frames++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed < duration) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = Math.round((frames / elapsed) * 1000);
          resolve(fps);
        }
      };
      
      requestAnimationFrame(countFrame);
    });
  },
  
  /**
   * Check if performance is degrading
   */
  isPerformanceDegrading: async (): Promise<boolean> => {
    const fps = await performanceMonitor.measureFPS(500);
    return fps < 30; // Below 30 FPS is considered poor performance
  },
};
