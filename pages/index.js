import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack,
  Container,
  Flex,
  Button,
  Icon,
  useColorModeValue,
  Divider,
  Badge,
  Grid,
  GridItem,
  chakra,
  shouldForwardProp,
  Image,
  useBreakpointValue
} from "@chakra-ui/react";
import { keyframes } from '@emotion/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { FiCode, FiGitMerge, FiLock, FiZap, FiTerminal, FiArrowRight } from 'react-icons/fi';
import Auth from '../components/Auth';

// Create a custom motion component with Chakra UI
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const bgGradient = useColorModeValue(
    'linear(to-b, gray.50, blue.50, teal.50)',
    'linear(to-b, gray.900, blue.900, teal.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryColor = useColorModeValue('blue.500', 'blue.300');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
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
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Hero Section */}
      <Box 
        position="relative" 
        py={20} 
        overflow="hidden"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: `linear(to-br, ${useColorModeValue('teal.50', 'teal.900')}, ${useColorModeValue('blue.50', 'blue.900')})`,
          opacity: 0.7,
          zIndex: -1
        }}
      >
        <Box 
          position="absolute" 
          top="-5%" 
          right="-5%" 
          w="300px" 
          h="300px" 
          borderRadius="full" 
          bg={useColorModeValue('teal.100', 'teal.800')} 
          filter="blur(60px)" 
          opacity={0.4} 
          zIndex={-1} 
        />
        <Box 
          position="absolute" 
          bottom="-5%" 
          left="-5%" 
          w="300px" 
          h="300px" 
          borderRadius="full" 
          bg={useColorModeValue('blue.100', 'blue.800')} 
          filter="blur(60px)" 
          opacity={0.4} 
          zIndex={-1} 
        />
        
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
              CodeShare Platform
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
      
      {/* Features Section */}
      <Box bg={useColorModeValue('white', 'gray.800')} py={16}>
        <Container maxW="container.xl">
          <ChakraBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            textAlign="center"
            mb={12}
          >
            <Heading 
              as="h2" 
              size="xl" 
              mb={4}
              bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`} 
              bgClip="text"
            >
              Powerful Features
            </Heading>
            <Text fontSize="lg" color={subtleText} maxW="800px" mx="auto">
              Built with developers in mind, CodeShare offers everything you need for seamless collaboration
            </Text>
          </ChakraBox>
          
          <Grid 
            templateColumns="repeat(3, 1fr)" 
            gap={8}
          >
            {[
              { 
                icon: FiCode, 
                title: "Multiple Snippets", 
                description: "Store and organize multiple code snippets in one place for easy access and sharing."
              },
              { 
                icon: FiTerminal, 
                title: "Syntax Highlighting", 
                description: "Beautiful syntax highlighting for all major programming languages makes your code easy to read."
              },
              { 
                icon: FiGitMerge, 
                title: "Real-time Sharing", 
                description: "Share your snippets with others instantly. Multiple users can view the same code in real-time."
              },
              { 
                icon: FiLock, 
                title: "Secure Access", 
                description: "Password-protected spaces ensure your code snippets remain private and accessible only to those you invite."
              },
              { 
                icon: FiZap, 
                title: "Instant Access", 
                description: "No account required. Create a space, set a password, and start sharing code in seconds."
              },
              { 
                icon: FiTerminal, 
                title: "Simple Interface", 
                description: "Clean, distraction-free interface that focuses on what matters most - your code."
              }
            ].map((feature, index) => (
              <ChakraBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Flex 
                  direction="column" 
                  bg={cardBg} 
                  p={6} 
                  borderRadius="xl" 
                  boxShadow="md"
                  border="1px solid"
                  borderColor={borderColor}
                  height="100%"
                  _hover={{
                    transform: 'translateY(-5px)',
                    boxShadow: 'lg',
                    borderColor: accentColor,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Flex 
                    align="center" 
                    justify="center" 
                    w={12} 
                    h={12} 
                    borderRadius="full" 
                    bg={useColorModeValue('teal.100', 'teal.900')} 
                    color={accentColor} 
                    mb={4}
                  >
                    <Icon as={feature.icon} boxSize={5} />
                  </Flex>
                  <Heading as="h3" size="md" mb={3}>
                    {feature.title}
                  </Heading>
                  <Text color={subtleText}>
                    {feature.description}
                  </Text>
                </Flex>
              </ChakraBox>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Auth component is now in the hero section */}
      
      {/* Footer */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={8}>
        <Container maxW="container.xl">
          <Flex direction="row" justify="space-between" align="center">
            <Text fontSize="sm" color={subtleText}>
              © {new Date().getFullYear()} CodeShare Platform. Personal Project.
            </Text>
            <HStack spacing={4} mt={0}>
              <Button variant="ghost" size="sm">About</Button>
              <Button variant="ghost" size="sm">GitHub</Button>
              <Button variant="ghost" size="sm">Contact</Button>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
