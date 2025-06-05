import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack,
  useColorModeValue,
  chakra,
  shouldForwardProp,
  Container,
  Flex,
  Circle,
  Stack,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  HStack,
  Image,
  SimpleGrid,
  Icon
} from "@chakra-ui/react";
import { keyframes } from '@emotion/react';
import { motion, isValidMotionProp } from 'framer-motion';
import { FiArrowRight, FiSearch, FiCode, FiTerminal, FiLock, FiZap, FiUsers } from 'react-icons/fi';
import Auth from './Auth';

// Create a custom motion component with Chakra UI
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

// Floating elements animation
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(-10px) rotate(240deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(-120deg); }
  66% { transform: translateY(-25px) rotate(-240deg); }
`;

const float3 = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(180deg); }
`;

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);
  
  // Enhanced color scheme
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryColor = useColorModeValue('blue.500', 'blue.300');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const strongText = useColorModeValue('gray.800', 'white');
  
  // Features specific colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  const hoverBorder = useColorModeValue('teal.200', 'teal.600');
  
  // Floating elements colors
  const floatingColor1 = useColorModeValue('teal.100', 'teal.800');
  const floatingColor2 = useColorModeValue('blue.100', 'blue.800');
  const floatingColor3 = useColorModeValue('purple.100', 'purple.800');
  
  // Dashboard preview images
  const dashboardImage = useColorModeValue(
    '/light.png',
    '/dark.png'
  );

  // Features data
  const features = [
    { 
      icon: FiCode, 
      title: "Multiple Snippets", 
      description: "Store and organize unlimited code snippets in one collaborative space.",
      color: 'teal'
    },
    { 
      icon: FiTerminal, 
      title: "Syntax Highlighting", 
      description: "Beautiful syntax highlighting for all major programming languages.",
      color: 'blue'
    },
    { 
      icon: FiUsers, 
      title: "Real-time Collaboration", 
      description: "Share instantly with team members and see changes in real-time.",
      color: 'purple'
    },
    { 
      icon: FiLock, 
      title: "Password Protected", 
      description: "Keep your code secure with password protection for private sharing.",
      color: 'green'
    },
    { 
      icon: FiZap, 
      title: "Instant Access", 
      description: "No sign-up required. Create a space and start sharing immediately.",
      color: 'orange'
    }
  ];

  const getColorScheme = (color) => {
    return {
      light: useColorModeValue(`${color}.500`, `${color}.300`),
      bg: useColorModeValue(`${color}.50`, `${color}.900`),
      lightBg: useColorModeValue(`${color}.25`, `${color}.800`)
    };
  };
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box 
      position="relative" 
      py={{ base: 16, md: 24, lg: 32 }}
      overflow="hidden"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgGradient={useColorModeValue(
        'radial(ellipse 80% 60% at 50% 40%, rgba(56, 178, 172, 0.15) 0%, rgba(59, 130, 246, 0.08) 35%, transparent 70%)',
        'radial(ellipse 80% 60% at 50% 40%, rgba(45, 212, 191, 0.2) 0%, rgba(96, 165, 250, 0.12) 35%, transparent 70%)'
      )}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: useColorModeValue(
          'linear(135deg, rgba(14, 165, 233, 0.05) 0%, transparent 30%, rgba(139, 92, 246, 0.05) 70%, transparent 100%)',
          'linear(135deg, rgba(34, 197, 94, 0.08) 0%, transparent 30%, rgba(168, 85, 247, 0.08) 70%, transparent 100%)'
        ),
        zIndex: 1,
        pointerEvents: 'none'
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: '10%',
        left: '10%',
        right: '10%',
        bottom: '10%',
        bgGradient: useColorModeValue(
          'conic(from 180deg at 50% 50%, transparent 0deg, rgba(56, 178, 172, 0.08) 60deg, transparent 120deg, rgba(59, 130, 246, 0.06) 180deg, transparent 240deg, rgba(16, 185, 129, 0.08) 300deg, transparent 360deg)',
          'conic(from 180deg at 50% 50%, transparent 0deg, rgba(45, 212, 191, 0.12) 60deg, transparent 120deg, rgba(96, 165, 250, 0.1) 180deg, transparent 240deg, rgba(52, 211, 153, 0.12) 300deg, transparent 360deg)'
        ),
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >

      
      <Container maxW="container.xl" position="relative" zIndex={2}>
        {/* Hero Content */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          mb={{ base: 16, md: 20 }}
        >
          <ChakraBox
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <VStack spacing={{ base: 6, md: 8 }} maxW="4xl" mx="auto">
              {/* Main Heading */}
              <Stack spacing={4} align="center">
                <ChakraBox
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Heading 
                    as="h1" 
                    fontSize={{ base: "5xl", sm: "6xl", md: "7xl", lg: "8xl" }}
                    bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`} 
                    bgClip="text"
                    fontWeight="800"
                    letterSpacing={{ base: "tight", md: "tighter" }}
                    lineHeight={{ base: "1.1", md: "0.95" }}
                    textShadow="0 4px 20px rgba(0,0,0,0.3)"
                    textAlign="center"
                    mb={4}
                  >
                    CodeShare
                  </Heading>
                </ChakraBox>
                
                <ChakraBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Text 
                    fontSize={{ base: "xl", sm: "2xl", md: "3xl" }}
                    color={strongText}
                    fontWeight="500"
                    maxW="4xl"
                    lineHeight="1.3"
                    mb={4}
                    textAlign="center"
                  >
                    Share code snippets instantly with{" "}
                                         <Text as="span" color={accentColor} fontWeight="600">
                      real-time collaboration
                    </Text>
                  </Text>
                </ChakraBox>
                
                <ChakraBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Text 
                    fontSize={{ base: "lg", md: "xl" }}
                    color={subtleText}
                    maxW="3xl"
                    lineHeight="1.6"
                    fontWeight="400"
                    textAlign="center"
                    mb={8}
                  >
                    Simple, fast, and secure code sharing. 
                    No sign-up required - just create a space and start collaborating.
                  </Text>
                </ChakraBox>
              </Stack>
              
              {/* Simple Search Bar */}
              <ChakraBox
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                w="100%"
                maxW="500px"
              >
                <Auth />
              </ChakraBox>
            </VStack>
          </ChakraBox>
        </Flex>
        
        {/* Dashboard Preview */}
        <ChakraBox
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          maxW="6xl"
          mx="auto"
          mb={{ base: 12, md: 16, lg: 20 }}
        >
          <Box
            position="relative"
            borderRadius="3xl"
            overflow="hidden"
            shadow="2xl"
            bg={useColorModeValue('white', 'gray.800')}
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            _hover={{
              shadow: '3xl',
              transform: 'scale(1.02)'
            }}
            transition="all 0.3s ease"
          >
            {/* Browser  Header */}
            <Flex
              align="center"
              justify="space-between"
              bg={useColorModeValue('gray.50', 'gray.900')}
              p={4}
              borderBottomWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <Flex align="center" spacing={2}>
                <Box w={3} h={3} borderRadius="full" bg="red.400" />
                <Box w={3} h={3} borderRadius="full" bg="yellow.400" ml={2} />
                <Box w={3} h={3} borderRadius="full" bg="green.400" ml={2} />
              </Flex>
              <Box
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="md"
                px={4}
                py={2}
                borderWidth="1px"
                borderColor={useColorModeValue('gray.300', 'gray.600')}
                fontSize="sm"
                color={subtleText}
                fontFamily="mono"
              >
                codeshareit-iota.vercel.app/workspace/test
              </Box>
              <Box w={16} />
            </Flex>
            
            {/* Dashboard Image */}
            <Box position="relative">
              <Image
                src={dashboardImage}
                alt="CodeShare Dashboard Preview"
                w="100%"
                objectFit="contain"
                filter={useColorModeValue('none', 'brightness(0.9) contrast(1.1)')}
              />
            </Box>
          </Box>
        </ChakraBox>

        {/* Features Section */}
        <Box py={{ base: 8, md: 12, lg: 16 }} position="relative">
          {/* Section Header */}
          <ChakraBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            textAlign="center" 
            mb={{ base: 10, md: 12 }}
          >
            <VStack spacing={4}>
              <Heading 
                as="h2" 
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="800"
                bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`} 
                bgClip="text"
                letterSpacing="tight"
              >
                Why Choose CodeShare
              </Heading>
              <Text 
                color={subtleText} 
                fontSize={{ base: "lg", md: "xl" }}
                maxW="2xl" 
                mx="auto"
                fontWeight="500"
                lineHeight="1.6"
              >
                Everything you need for seamless code collaboration
              </Text>
            </VStack>
          </ChakraBox>
          
          {/* Features Grid */}
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={{ base: 6, md: 8 }}
            maxW="6xl"
            mx="auto"
          >
            {features.map((feature, index) => {
              const colors = getColorScheme(feature.color);
              
              return (
                <ChakraBox
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Box
                    bg={cardBg}
                    borderRadius="xl"
                    p={{ base: 6, md: 7 }}
                    borderWidth="1px"
                    borderColor={cardBorder}
                    h="100%"
                    position="relative"
                    overflow="hidden"
                    shadow="lg"
                    _hover={{
                      borderColor: hoverBorder,
                      shadow: 'xl',
                      transform: 'translateY(-4px)'
                    }}
                    transition="all 0.3s ease"
                  >
                    {/* Background Pattern */}
                    <Circle
                      size="100px"
                      position="absolute"
                      top="-50px"
                      right="-50px"
                      bg={colors.bg}
                      opacity={0.1}
                    />
                    
                    <VStack spacing={4} align="flex-start" position="relative" zIndex={1}>
                      {/* Icon */}
                      <Flex 
                        align="center" 
                        justify="center" 
                        w={12}
                        h={12}
                        borderRadius="xl" 
                        bg={colors.lightBg}
                        color={colors.light}
                        shadow="md"
                      >
                        <Icon as={feature.icon} boxSize={6} />
                      </Flex>
                      
                      {/* Content */}
                      <Stack spacing={2} flex={1}>
                        <Heading 
                          as="h3" 
                          fontSize="lg"
                          fontWeight="700"
                          color={strongText}
                          lineHeight="1.2"
                        >
                          {feature.title}
                        </Heading>
                        <Text 
                          color={subtleText} 
                          fontSize="sm"
                          lineHeight="1.5"
                          fontWeight="500"
                        >
                          {feature.description}
                        </Text>
                      </Stack>
                    </VStack>
                  </Box>
                </ChakraBox>
              );
            })}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}