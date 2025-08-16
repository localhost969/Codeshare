import { Box, useColorModeValue, Divider, Container } from "@chakra-ui/react";
import Hero from '../components/Hero';


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
        pb={0}
        mb={0}
      >
        <Hero />
      </Box>
    </Box>
  );
}
