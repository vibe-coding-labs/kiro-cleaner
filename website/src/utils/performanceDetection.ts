/**
 * Performance detection utilities
 */

export const getDevicePerformance = (): 'high' | 'medium' | 'low' => {
  if (typeof navigator === 'undefined') return 'medium';
  
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  if (cores >= 8 && memory >= 8) return 'high';
  if (cores >= 4 && memory >= 4) return 'medium';
  return 'low';
};

export const shouldUseReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const shouldUseHighQualityEffects = (): boolean => {
  return getDevicePerformance() === 'high' && !shouldUseReducedMotion();
};
