# Gradient Fallback System

This document explains how to use the gradient fallback system to ensure graceful degradation when CSS gradients are not supported by the browser.

## Overview

The gradient fallback system provides solid color fallbacks for complex gradients using CSS custom properties. This ensures that your website maintains visual quality even in browsers that don't support modern gradient features.

## Requirements

Validates: **Requirements 1.4** - Gradient rendering with fallback support

## Features

- ✅ Automatic gradient support detection
- ✅ CSS custom properties for easy fallback management
- ✅ Solid color fallbacks for all gradient types
- ✅ Support for gradient text effects
- ✅ Integration with existing color tokens

## Usage

### 1. Using CSS Custom Properties

The recommended approach is to use CSS custom properties, which automatically handle fallbacks:

```typescript
import { initializeGradientProperties, useGradientProperty } from '@/utils/gradientFallbacks';

// Initialize gradient properties (do this once on app startup)
const gradientProperties = initializeGradientProperties();

// Apply to root element
document.documentElement.style.cssText = Object.entries(gradientProperties)
  .map(([key, value]) => `${key}: ${value}`)
  .join('; ');

// Use in components
const MyComponent = () => (
  <Box sx={useGradientProperty('--gradient-hero')}>
    Content with gradient background
  </Box>
);
```

### 2. Inline Gradient with Fallback

For dynamic gradients or when CSS custom properties aren't available:

```typescript
import { applyGradientWithFallback } from '@/utils/gradientFallbacks';

const MyComponent = () => {
  const gradientStyle = applyGradientWithFallback(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '#667eea' // Fallback color
  );
  
  return (
    <Box sx={gradientStyle}>
      Content with gradient background
    </Box>
  );
};
```

### 3. Gradient Text with Fallback

For text with gradient effects:

```typescript
import { createGradientTextStyle } from '@/utils/gradientFallbacks';

const MyComponent = () => {
  const textStyle = createGradientTextStyle(
    'linear-gradient(90deg, #ff0080, #7928ca)',
    '#ff0080' // Fallback text color
  );
  
  return (
    <Typography sx={textStyle}>
      Gradient Text
    </Typography>
  );
};
```

Or use the `GradientText` component which has built-in fallback support:

```typescript
import GradientText from '@/components/premium/GradientText';

const MyComponent = () => (
  <GradientText 
    gradient="linear-gradient(90deg, #ff0080, #7928ca)"
    fallbackColor="#ff0080"
  >
    Gradient Text
  </GradientText>
);
```

### 4. Creating Custom Gradient Properties

For custom gradients not in the token system:

```typescript
import { createGradientProperty } from '@/utils/gradientFallbacks';

const customGradient = createGradientProperty(
  '--my-custom-gradient',
  'linear-gradient(45deg, red, blue)',
  '#ff0000' // Fallback color
);

// Apply to element
<Box sx={{ 
  background: `var(${customGradient['--my-custom-gradient']})` 
}}>
  Content
</Box>
```

## Available Gradient Properties

After initialization, the following CSS custom properties are available:

### Main Gradients
- `--gradient-hero` / `--gradient-hero-fallback`
- `--gradient-hero-alt` / `--gradient-hero-alt-fallback`
- `--gradient-card` / `--gradient-card-fallback`
- `--gradient-subtle` / `--gradient-subtle-fallback`
- `--gradient-mesh` / `--gradient-mesh-fallback`

### Premium Gradients
- `--gradient-premium-blue` / `--gradient-premium-blue-fallback`
- `--gradient-premium-purple` / `--gradient-premium-purple-fallback`
- `--gradient-premium-ocean` / `--gradient-premium-ocean-fallback`
- `--gradient-premium-sunset` / `--gradient-premium-sunset-fallback`
- `--gradient-premium-forest` / `--gradient-premium-forest-fallback`

### Subtle Variants
- `--gradient-subtle-warm` / `--gradient-subtle-warm-fallback`
- `--gradient-subtle-cool` / `--gradient-subtle-cool-fallback`
- `--gradient-subtle-neutral` / `--gradient-subtle-neutral-fallback`

### Animated Gradients
- `--gradient-animated-rainbow` / `--gradient-animated-rainbow-fallback`
- `--gradient-animated-aurora` / `--gradient-animated-aurora-fallback`

## Fallback Colors

The system uses carefully chosen fallback colors that represent the primary color of each gradient:

```typescript
export const gradientFallbacks = {
  hero: '#0070f3',           // Primary blue
  heroAlt: '#0070f3',        // Primary blue
  card: '#ff0080',           // Accent pink
  subtle: '#fafafa',         // Neutral light
  mesh: '#fafafa',           // Neutral light
  
  premium: {
    blue: '#667eea',         // Purple-blue
    purple: '#f093fb',       // Pink-purple
    ocean: '#4facfe',        // Bright blue
    sunset: '#fa709a',       // Pink
    forest: '#0ba360',       // Green
  },
  
  subtleVariants: {
    warm: '#fff5f5',         // Warm white
    cool: '#f0f9ff',         // Cool white
    neutral: '#fafafa',      // Neutral white
  },
  
  animated: {
    rainbow: '#e81d1d',      // Red
    aurora: '#667eea',       // Purple-blue
  },
};
```

## Browser Support

The gradient fallback system automatically detects browser support for:
- CSS linear gradients
- CSS radial gradients
- Webkit prefixed gradients

When gradients are not supported, solid colors are used instead.

## Best Practices

1. **Always provide a fallback color**: Choose a color that represents the primary color of your gradient
2. **Use CSS custom properties when possible**: They provide the best performance and maintainability
3. **Initialize once**: Call `initializeGradientProperties()` once on app startup
4. **Test in older browsers**: Verify that fallback colors provide acceptable visual quality
5. **Consider contrast**: Ensure fallback colors maintain WCAG AA contrast ratios

## Examples

### Hero Section with Gradient Background

```typescript
import { useGradientProperty } from '@/utils/gradientFallbacks';

const HeroSection = () => (
  <Box sx={{
    ...useGradientProperty('--gradient-hero'),
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
  }}>
    <Typography variant="h1" color="white">
      Welcome to Our Site
    </Typography>
  </Box>
);
```

### Card with Premium Gradient

```typescript
import { applyGradientWithFallback } from '@/utils/gradientFallbacks';
import { colorTokens } from '@/theme/tokens/colors';
import { gradientFallbacks } from '@/utils/gradientFallbacks';

const PremiumCard = () => (
  <Card sx={{
    ...applyGradientWithFallback(
      colorTokens.gradients.premium.ocean,
      gradientFallbacks.premium.ocean
    ),
    padding: 3,
  }}>
    <Typography variant="h3" color="white">
      Premium Content
    </Typography>
  </Card>
);
```

### Animated Gradient Text

```typescript
import GradientText from '@/components/premium/GradientText';
import { colorTokens } from '@/theme/tokens/colors';
import { gradientFallbacks } from '@/utils/gradientFallbacks';

const AnimatedHeading = () => (
  <GradientText
    gradient={colorTokens.gradients.animated.aurora}
    fallbackColor={gradientFallbacks.animated.aurora}
    animate={true}
    variant="h1"
  >
    Animated Gradient Heading
  </GradientText>
);
```

## Testing

The gradient fallback system includes comprehensive tests:

```bash
npm test -- gradientFallbacks.test.ts
```

Tests cover:
- Gradient support detection
- CSS custom property generation
- Fallback color application
- Integration with color tokens
- Edge cases and error handling

## Related Files

- `website/src/utils/gradientFallbacks.ts` - Main implementation
- `website/src/utils/gradientFallbacks.test.ts` - Test suite
- `website/src/utils/featureDetection.ts` - Browser feature detection
- `website/src/theme/tokens/colors.ts` - Color and gradient tokens
- `website/src/components/premium/GradientText.tsx` - Gradient text component

## Support

For issues or questions about the gradient fallback system, please refer to:
- Design document: `.kiro/specs/premium-website-visual-enhancement/design.md`
- Requirements: `.kiro/specs/premium-website-visual-enhancement/requirements.md`
- Task list: `.kiro/specs/premium-website-visual-enhancement/tasks.md`
