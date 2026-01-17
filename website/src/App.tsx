import { CssBaseline, Container, Box, Typography } from '@mui/material';
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import RealCases from './components/RealCases';
import UseCases from './components/UseCases';
import TechnicalFeatures from './components/TechnicalFeatures';
import Installation from './components/Installation';
import FAQ from './components/FAQ';
import { premiumTheme } from './theme/premiumTheme';
import ThemeErrorBoundary from './theme/ThemeErrorBoundary';
import { colorTokens } from './theme/tokens';
import './App.css';

function App() {
  return (
    <ThemeErrorBoundary theme={premiumTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navigation Bar - Flat Design */}
        <NavigationBar />

        {/* Hero Section - Flat Design */}
        <HeroSection />

        {/* Features Section */}
        <Box id="features" sx={{ py: { xs: 10, md: 15 }, backgroundColor: colorTokens.background.paper }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2, 
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: colorTokens.text.primary 
                }}
              >
                强大特性
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colorTokens.text.secondary,
                  fontWeight: 400,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                专为 Kiro IDE 用户打造的数据清理工具
              </Typography>
            </Box>
            <Features />
          </Container>
        </Box>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Real Cases Section */}
        <RealCases />

        {/* Use Cases Section */}
        <UseCases />

        {/* Technical Features Section */}
        <TechnicalFeatures />

        {/* Installation Section */}
        <Box id="installation" sx={{ py: { xs: 10, md: 15 }, backgroundColor: colorTokens.background.subtle }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2, 
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  color: colorTokens.text.primary 
                }}
              >
                快速开始
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: colorTokens.text.secondary,
                  fontWeight: 400,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                选择适合你的安装方式，几分钟即可开始使用
              </Typography>
            </Box>
            <Installation />
          </Container>
        </Box>

        {/* FAQ Section */}
        <FAQ />

        {/* Footer */}
        <Box 
          sx={{ 
            py: 8, 
            backgroundColor: colorTokens.neutral[900], 
            color: colorTokens.neutral[400], 
            borderTop: `1px solid ${colorTokens.neutral[800]}`,
          }}
        >
          <Container maxWidth="lg">
            <Box 
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
            >
              <Box textAlign={{ xs: 'center', md: 'left' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: colorTokens.text.inverse }}>
                  🧹 Kiro Cleaner
                </Typography>
                <Typography variant="body2" sx={{ color: colorTokens.neutral[500] }}>
                  让你的 Kiro IDE 轻装上阵
                </Typography>
              </Box>
              <Box textAlign={{ xs: 'center', md: 'right' }}>
                <Typography variant="body2" sx={{ color: colorTokens.neutral[500] }}>
                  © {new Date().getFullYear()} Kiro Cleaner. MIT License.
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeErrorBoundary>
  );
}

export default App;