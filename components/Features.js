import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  HStack,
  Container,
  SimpleGrid,
  Flex,
  Icon,
  useColorModeValue,
  chakra,
  shouldForwardProp
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from 'framer-motion';
import { FiCode, FiTerminal, FiGitMerge, FiLock, FiZap } from 'react-icons/fi';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Features() {
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryColor = useColorModeValue('blue.500', 'blue.300');
  const subtleText = useColorModeValue('gray.600', 'gray.400');

  const features = [
    { 
      icon: FiCode, 
      title: "Multiple Snippets", 
      description: "Store and organize code snippets efficiently."
    },
    { 
      icon: FiTerminal, 
      title: "Syntax Highlighting", 
      description: "Supports all major programming languages."
    },
    { 
      icon: FiGitMerge, 
      title: "Real-time Sharing", 
      description: "Instant collaboration with others."
    },
    { 
      icon: FiLock, 
      title: "Secure", 
      description: "Password protection for private sharing."
    }
  ];

  return (
    <Box py={16}>
      <Container maxW="container.lg">
        <Box textAlign="center" mb={12}>
          <Heading 
            as="h2" 
            size="lg" 
            mb={2}
            bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`} 
            bgClip="text"
          >
            Features
          </Heading>
          <Text color={subtleText} maxW="600px" mx="auto">
            Everything you need for seamless code sharing
          </Text>
        </Box>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {features.map((feature, index) => (
            <ChakraBox
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <HStack 
                p={4}
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                spacing={3}
                h="100%"
                align="flex-start"
                _hover={{
                  borderColor: index % 2 === 0 ? accentColor : secondaryColor,
                  shadow: 'md'
                }}
                transition="all 0.2s"
              >
                <Flex 
                  align="center" 
                  justify="center" 
                  w={10}
                  h={10}
                  borderRadius="lg" 
                  bg={index % 2 === 0 ? `${accentColor}100` : `${secondaryColor}100`}
                  color={index % 2 === 0 ? accentColor : secondaryColor}
                >
                  <Icon as={feature.icon} boxSize={5} />
                </Flex>
                <Box>
                  <Heading as="h3" size="sm" mb={1} color={useColorModeValue('gray.800', 'white')}>
                    {feature.title}
                  </Heading>
                  <Text color={subtleText} fontSize="sm">
                    {feature.description}
                  </Text>
                </Box>
              </HStack>
            </ChakraBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}