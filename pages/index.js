import { Box, useColorModeValue, Divider, Container } from "@chakra-ui/react";
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  const dividerColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      width="100%" 
      minH="100vh"
      margin="0"
      padding="0"
      maxW="100vw"
      position="relative"
      overflow="hidden"
    >
      {/* Hero Section with Primary Gradient */}
      <Box
        bgGradient={useColorModeValue(
          'linear(to-b, cyan.50, whiteAlpha.900)', 
          'linear(to-b, cyan.800, gray.900)'
        )}
        position="relative"
      >
        <Hero />
      </Box>

      {/* Features Section with Enhanced Gradient */}
      <Box
        bgGradient={useColorModeValue(
          'linear(to-b, purple.25, teal.25, whiteAlpha.900)', 
          'linear(to-b, purple.900, teal.900, gray.900)'
        )}
        position="relative"
      >
        {/* Subtle section divider */}
        <Container maxW="container.xl" py={0}>
          <Divider 
            borderColor={dividerColor} 
            opacity={0.3}
            borderWidth="1px"
          />
        </Container>
        <Features />
        
        {/* Bottom padding for breathing room */}
        <Box py={{ base: 8, md: 12 }} />
      </Box>

      
    </Box>
  );
}
