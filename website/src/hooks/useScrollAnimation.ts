/**
 * Scroll Animation Hook
 * 
 * Uses IntersectionObserver to trigger animations when elements enter the viewport.
 * Provides a ref to attach to elements and an isVisible state to control animations.
 */

import { useEffect, useRef, useState } from 'react';

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface ScrollAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  isVisible: boolean;
}

/**
 * Hook to trigger animations when element enters viewport
 * 
 * @param options - Configuration options
 * @param options.threshold - Percentage of element visibility to trigger (0-1)
 * @param options.rootMargin - Margin around root element
 * @param options.triggerOnce - Whether to trigger only once or every time
 * @returns Object with ref to attach to element and isVisible state
 * 
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
 * 
 * return (
 *   <Box
 *     ref={ref}
 *     sx={{
 *       opacity: isVisible ? 1 : 0,
 *       transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
 *       transition: 'all 0.6s ease-out',
 *     }}
 *   >
 *     Content
 *   </Box>
 * );
 * ```
 */
export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
): ScrollAnimationReturn {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // If triggerOnce is true, stop observing after first trigger
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          // If triggerOnce is false, reset visibility when element leaves viewport
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);
  
  return { ref, isVisible };
}

/**
 * Hook to trigger animations with delay when element enters viewport
 * 
 * @param delay - Delay in milliseconds before triggering animation
 * @param options - Configuration options (same as useScrollAnimation)
 * @returns Object with ref to attach to element and isVisible state
 * 
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollAnimationWithDelay(300, { threshold: 0.2 });
 * ```
 */
export function useScrollAnimationWithDelay(
  delay: number,
  options: ScrollAnimationOptions = {}
): ScrollAnimationReturn {
  const { ref, isVisible: immediateVisible } = useScrollAnimation(options);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (immediateVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [immediateVisible, delay]);
  
  return { ref, isVisible };
}

/**
 * Hook to create staggered animations for multiple elements
 * 
 * @param count - Number of elements to animate
 * @param staggerDelay - Delay between each element animation in milliseconds
 * @param options - Configuration options (same as useScrollAnimation)
 * @returns Array of objects with ref and isVisible for each element
 * 
 * @example
 * ```tsx
 * const items = useStaggeredScrollAnimation(3, 100);
 * 
 * return (
 *   <>
 *     {items.map((item, index) => (
 *       <Box
 *         key={index}
 *         ref={item.ref}
 *         sx={{
 *           opacity: item.isVisible ? 1 : 0,
 *           transition: 'opacity 0.6s',
 *         }}
 *       >
 *         Item {index}
 *       </Box>
 *     ))}
 *   </>
 * );
 * ```
 */
export function useStaggeredScrollAnimation(
  count: number,
  staggerDelay: number = 100,
  options: ScrollAnimationOptions = {}
): ScrollAnimationReturn[] {
  const items = Array.from({ length: count }, (_, index) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useScrollAnimationWithDelay(index * staggerDelay, options)
  );
  
  return items;
}
