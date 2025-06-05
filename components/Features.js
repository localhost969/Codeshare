import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  VStack,
  Container,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  chakra,
  shouldForwardProp,
  Circle,
  Stack
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from 'framer-motion';
import { FiCode, FiTerminal, FiLock, FiZap, FiUsers } from 'react-icons/fi';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Features() {
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryColor = useColorModeValue('blue.500', 'blue.300');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const strongText = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.100', 'gray.700');
  const hoverBorder = useColorModeValue('teal.200', 'teal.600');

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

  return (
    <Box py={{ base: 12, md: 16, lg: 20 }} position="relative">
      <Container maxW="container.xl">
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
      </Container>
    </Box>
  );
}