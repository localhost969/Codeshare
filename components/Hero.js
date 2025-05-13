import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack,
  useColorModeValue,
  chakra,
  shouldForwardProp
} from "@chakra-ui/react";
import { keyframes } from '@emotion/react';
import { motion, isValidMotionProp } from 'framer-motion';
import Auth from './Auth';

// Create a custom motion component with Chakra UI
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryColor = useColorModeValue('blue.500', 'blue.300');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  
  // Pulse animation for elements
  const pulseKeyframes = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(49, 151, 149, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(49, 151, 149, 0); }
    100% { box-shadow: 0 0 0 0 rgba(49, 151, 149, 0); }
  `;
  const pulsing = `${pulseKeyframes} 2s infinite`;
  
  // Force desktop view on all devices
  const headingSize = "3xl";
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box 
      position="relative" 
      py={20} 
    >
      
      <VStack spacing={2} align="center" maxW="container.md" mx="auto" px={4}>
        <ChakraBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading 
            as="h1" 
            size={headingSize}
            bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`} 
            bgClip="text"
            fontWeight="extrabold"
            letterSpacing="tight"
            mb={4}
            textShadow="0 1px 2px rgba(0,0,0,0.1)"
          >
            CodeShare
          </Heading>
          
          <Text 
            fontSize="xl" 
            color={subtleText} 
            mb={3}
            maxW="600px"
            mx="auto"
            lineHeight="1.6"
          >
            Store and share multiple code snippets with others in real-time. Simple, fast, and secure code sharing for everyone.
          </Text>
        </ChakraBox>
        
        {/* Auth Component - Direct without container */}
        <Auth />          
      </VStack>
    </Box>
  );
}