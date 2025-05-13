import { Box, useColorModeValue } from "@chakra-ui/react";
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <Box 
      width="100%" 
      minH="100vh"
      bgGradient={useColorModeValue(
        'linear(to-b, cyan.50, whiteAlpha.900)', // Light mode: very light cyan to almost white
        'linear(to-b, cyan.800, gray.900)'      // Dark mode: darker cyan to dark gray
      )}
      margin="0"
      padding="0"
      maxW="100vw"
      position="relative"
    >
      <Hero />
      <Features />
    </Box>
  );
}
