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
  Image,
  Grid,
  SimpleGrid,
  Icon
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from 'framer-motion';
import { FiCode, FiTerminal, FiUsers, FiLock, FiZap } from 'react-icons/fi';
import Auth from './Auth';

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Hero() {
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const strongText = useColorModeValue('gray.900', 'white');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');

  const dashboardImage = useColorModeValue('/light.png', '/dark.png');

  const features = [
    { 
      icon: FiCode, 
      title: "Multiple Snippets", 
      description: "Store and organize unlimited code snippets in one collaborative space.",
    },
    { 
      icon: FiTerminal, 
      title: "Syntax Highlighting", 
      description: "Beautiful syntax highlighting for all major programming languages.",
    },
    { 
      icon: FiUsers, 
      title: "Real-time Collaboration", 
      description: "Share instantly with team members and see changes in real-time.",
    },
    { 
      icon: FiLock, 
      title: "Password Protected", 
      description: "Keep your code secure with password protection for private sharing.",
    },
    { 
      icon: FiZap, 
      title: "Instant Access", 
      description: "No sign-up required. Create a space and start sharing immediately.",
    }
  ];

  return (
    <Container maxW="container.xl" py={{ base: 12, md: 24 }}>
      <Grid templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }} gap={{ base: 8, lg: 12 }} alignItems="start">
        {/* Left: Heading and copy */}
        <VStack align={{ base: 'center', lg: 'flex-start' }} textAlign={{ base: 'center', lg: 'left' }} spacing={{ base: 5, md: 6 }}>
          <ChakraBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            <Heading as="h1" fontWeight={800} fontSize={{ base: '4xl', sm: '5xl', md: '6xl' }} lineHeight="1.1" color={strongText}>
              Codeshare.
              <Text as="span" display="block">Collaborate instantly.</Text>
            </Heading>
          </ChakraBox>

          <ChakraBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}>
            <Text color={accentColor} fontSize={{ base: 'lg', md: 'xl' }} fontWeight={500}>
              Real-time, secure, and effortless code sharing.
            </Text>
          </ChakraBox>

          <ChakraBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}>
            <Text color={subtleText} fontSize={{ base: 'md', md: 'lg' }}>
              Create a collaborative space for your team or friends. No sign-up required – just start sharing and coding together.
            </Text>
          </ChakraBox>
        </VStack>

        {/* Right: Search/Auth box */}
        <ChakraBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          w="full"
          mt={{ base: 4, md: 6, lg: 20 }}
        >
          <Auth />
        </ChakraBox>
      </Grid>

      {/* Dashboard Preview */}
      <ChakraBox initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }} mt={{ base: 16, md: 24 }} mx="auto">
        <Box position="relative" borderRadius="xl" overflow="hidden" boxShadow={useColorModeValue('0 25px 50px -12px rgba(0, 0, 0, 0.25)', '0 25px 50px -12px rgba(0, 0, 0, 0.5)')} bg={useColorModeValue('white', 'gray.800')} borderWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
          <Flex align="center" justifyContent="space-between" bg={useColorModeValue('gray.50', 'gray.900')} p={3} borderBottomWidth="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
            <Flex align="center">
              <Box w={3} h={3} borderRadius="full" bg="red.400" />
              <Box w={3} h={3} borderRadius="full" bg="yellow.400" ml={2} />
              <Box w={3} h={3} borderRadius="full" bg="green.400" ml={2} />
            </Flex>
            <Box bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="md" px={4} py={1} fontSize="sm" color={subtleText} fontFamily="mono" w="60%" textAlign="center">
              codeshareit.io/workspace/test
            </Box>
            <Box w={16} />
          </Flex>
          <Box position="relative">
            <Image src={dashboardImage} alt="CodeShare Dashboard Preview" w="100%" objectFit="cover" />
          </Box>
        </Box>
      </ChakraBox>

      {/* Features Section */}
      <Box mt={{ base: 24, md: 32 }}>
        <VStack spacing={4} mb={{ base: 10, md: 12 }} textAlign="center">
          <ChakraBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" color={strongText}>
              Why Choose Codeshare
            </Heading>
          </ChakraBox>
          <ChakraBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            <Text color={subtleText} fontSize={{ base: "lg", md: "xl" }} maxW="2xl" mx="auto">
              Everything you need for seamless code collaboration
            </Text>
          </ChakraBox>
        </VStack>
        
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 6, md: 8 }}>
          {features.map((feature, index) => (
            <ChakraBox key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
              <VStack spacing={4} bg={cardBg} p={8} borderRadius="xl" borderWidth="1px" borderColor={cardBorder} h="100%" alignItems="flex-start">
                <Icon as={feature.icon} boxSize={8} color={accentColor} />
                <Heading as="h3" fontSize="xl" fontWeight="600" color={strongText}>
                  {feature.title}
                </Heading>
                <Text color={subtleText} fontSize="md">
                  {feature.description}
                </Text>
              </VStack>
            </ChakraBox>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}