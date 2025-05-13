import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  HStack,
  Container,
  Flex,
  Icon,
  useColorModeValue,
  chakra,
  shouldForwardProp
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from 'framer-motion';
import { FiCode, FiTerminal, FiGitMerge, FiLock, FiZap } from 'react-icons/fi';

// Create a custom motion component with Chakra UI
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Features() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryColor = useColorModeValue('blue.500', 'blue.300');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const features = [
    { 
      icon: FiCode, 
      title: "Multiple Snippets", 
      description: "Store and organize multiple code snippets in one place."
    },
    { 
      icon: FiTerminal, 
      title: "Syntax Highlighting", 
      description: "Beautiful syntax highlighting for all major programming languages."
    },
    { 
      icon: FiGitMerge, 
      title: "Real-time Sharing", 
      description: "Share your snippets with others instantly in real-time."
    },
    { 
      icon: FiLock, 
      title: "Secure Access", 
      description: "Password-protected spaces for private code sharing."
    },
    { 
      icon: FiZap, 
      title: "Instant Access", 
      description: "No account required. Create and share in seconds."
    },
    { 
      icon: FiTerminal, 
      title: "Simple Interface", 
      description: "Clean, distraction-free interface focused on your code."
    }
  ];

  return (
    <Box 
      position="relative" 
      py={20} 
    >
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <ChakraBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          textAlign="center"
          mb={8}
        >
          <Heading 
            as="h2" 
            size="lg" 
            mb={2}
            bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`} 
            bgClip="text"
          >
            Features
          </Heading>
          <Text fontSize="md" color={subtleText} maxW="700px" mx="auto">
            CodeShare offers everything you need for seamless collaboration
          </Text>
        </ChakraBox>
        
        <Flex 
          wrap="wrap" 
          justify="center"
          mx="-8px"
        >
          {features.map((feature, index) => (
            <ChakraBox
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              w={{ base: "100%", sm: "50%", md: "33.33%" }}
              px={2}
              mb={4}
            >
              <HStack 
                bg={cardBg} 
                p={4} 
                borderRadius="lg" 
                boxShadow="sm"
                border="1px solid"
                borderColor={borderColor}
                h="100%"
                spacing={3}
                align="flex-start"
                _hover={{
                  borderColor: accentColor,
                  boxShadow: 'md',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Flex 
                  align="center" 
                  justify="center" 
                  minW={10} 
                  h={10} 
                  borderRadius="md" 
                  bg={useColorModeValue('teal.50', 'teal.900')} 
                  color={accentColor}
                >
                  <Icon as={feature.icon} boxSize={4} />
                </Flex>
                <Box>
                  <Heading as="h3" size="sm" mb={1} fontWeight="600">
                    {feature.title}
                  </Heading>
                  <Text color={subtleText} fontSize="sm">
                    {feature.description}
                  </Text>
                </Box>
              </HStack>
            </ChakraBox>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}