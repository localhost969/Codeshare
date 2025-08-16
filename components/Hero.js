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
  // refined typographic colors for better legibility across modes
  const subtleText = useColorModeValue('gray.600', 'gray.300');
  const strongText = useColorModeValue('gray.900', 'gray.50');
  const accentColor = useColorModeValue('teal.600', 'teal.300');

  // layered hero background (linear + radial overlays) for production-grade color grading
  const heroBase = useColorModeValue(
    'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(99,102,241,0.03) 50%, rgba(255,255,255,1) 100%)',
    'linear-gradient(180deg, rgba(2,6,23,0.7), rgba(15,23,42,0.9))'
  );
  const heroGlow = useColorModeValue(
    'radial-gradient(600px 220px at 10% 10%, rgba(56,189,248,0.06), transparent)',
    'radial-gradient(500px 180px at 90% 10%, rgba(99,102,241,0.04), transparent)'
  );

  // card surfaces tuned for subtle elevation and contrast
  const cardBg = useColorModeValue('rgba(255,255,255,0.92)', 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))');
  const cardBorder = useColorModeValue('rgba(15,23,42,0.06)', 'rgba(255,255,255,0.04)');

  const dashboardImage = useColorModeValue('/l.png', '/d.png');

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
    <Box
      w="100%"
      mx="auto"
      mb={0}
      pb={0}
      /* layered graded background: base gradient + soft glow overlay */
      bg={`${heroBase}, ${heroGlow}`}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
    >
      <Container maxW="container.xl" py={{ base: 9, md: 19 }} pb={0} mb={0}>
        <Grid templateColumns={{ base: '1fr', lg: '1.2fr 1fr' }} gap={{ base: 6, lg: 10 }} alignItems="start">
          {/* Left: Heading and copy */}
          <VStack align={{ base: 'center', lg: 'flex-start' }} textAlign={{ base: 'center', lg: 'left' }} spacing={{ base: 4, md: 5 }}>
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
            mt={{ base: 16, md: 24, lg: 32 }} // further increased margin top to move down
          >
            <Auth />
          </ChakraBox>
        </Grid>

        {/* Dashboard Preview */}
        <ChakraBox
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          mt={{ base: 20, md: 32 }} // moved further down
          mx="auto"
          w="100%"
          display="flex"
          justifyContent="center"
        >
          <Box
            position="relative"
            borderRadius="xl"
            overflow="hidden"
            boxShadow={useColorModeValue(
              '0 20px 40px -10px rgba(2,6,23,0.12)',
              '0 24px 48px -16px rgba(2,6,23,0.6)'
            )}
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            maxW={{ base: "99vw", md: "900px", lg: "1100px" }} // increased max width
            w="100%"
            mx="auto"
          >
            <Flex
              align="center"
              justifyContent="space-between"
              bg={useColorModeValue('gray.50', 'gray.900')}
              p={2}
              borderBottomWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <Flex align="center">
                <Box w={2.5} h={2.5} borderRadius="full" bg="red.400" />
                <Box w={2.5} h={2.5} borderRadius="full" bg="yellow.400" ml={1.5} />
                <Box w={2.5} h={2.5} borderRadius="full" bg="green.400" ml={1.5} />
              </Flex>
              <Box w={12} />
            </Flex>
            <Box
              position="relative"
              bg={useColorModeValue(
                'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))',
                'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))'
              )}
              overflow="hidden"
            >
              <Image src={dashboardImage} alt="CodeShare Dashboard Preview" w="100%" objectFit="cover" />
            </Box>
          </Box>
        </ChakraBox>

        {/* Features Section */}
        <Box mt={{ base: 19, md: 25 }} mb={0} pb={0}>
          <VStack spacing={3} mb={{ base: 8, md: 10 }} textAlign="center">
            <ChakraBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="700" color={strongText}>
                Why Choose Codeshare
              </Heading>
            </ChakraBox>
            <ChakraBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
              <Text color={subtleText} fontSize={{ base: "md", md: "lg" }} maxW="2xl" mx="auto">
                Everything you need for seamless code collaboration
              </Text>
            </ChakraBox>
          </VStack>
          
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 5, md: 6 }}>
            {features.map((feature, index) => (
              <ChakraBox key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                <VStack spacing={3} bg={cardBg} p={6} borderRadius="xl" borderWidth="1px" borderColor={cardBorder} h="100%" alignItems="flex-start">
                  <Icon as={feature.icon} boxSize={6} color={accentColor} />
                  <Heading as="h3" fontSize="lg" fontWeight="600" color={strongText}>
                    {feature.title}
                  </Heading>
                  <Text color={subtleText} fontSize="sm">
                    {feature.description}
                  </Text>
                </VStack>
              </ChakraBox>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
}