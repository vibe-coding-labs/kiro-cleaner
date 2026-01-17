// Flat Design Color Palette
export const flatColors = {
  // Primary colors - Bright blue
  primary: '#3498db',
  primaryDark: '#2980b9',
  primaryLight: '#5dade2',
  
  // Secondary colors - Green
  secondary: '#2ecc71',
  secondaryDark: '#27ae60',
  secondaryLight: '#58d68d',
  
  // Accent colors - Orange/Red
  accent: '#e74c3c',
  accentDark: '#c0392b',
  accentLight: '#ec7063',
  
  // Neutral colors
  background: '#ecf0f1',
  surface: '#ffffff',
  border: '#bdc3c7',
  
  // Text colors
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  textLight: '#95a5a6',
  
  // Dark background
  darkBackground: '#34495e',
  darkSurface: '#2c3e50',
} as const;

export type FlatColor = typeof flatColors[keyof typeof flatColors];
