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
} from "@chakra-ui/react";
import { motion, isValidMotionProp } from 'framer-motion';
import FeaturesSection from './FeaturesSection';
import Auth from './Auth';
import { FiCode, FiTerminal, FiUsers, FiLock, FiZap } from 'react-icons/fi';

// Chakra + framer motion factory (kept from your original)
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function Hero() {
  // Color tokens (kept & tuned)
  const strongText = useColorModeValue('gray.900', 'white');
  const primaryAccentText = useColorModeValue('teal.500', 'blue.300'); // changed teal.300 -> blue.300
  const secondaryText = useColorModeValue('gray.600', 'gray.400');
  const heroBg = useColorModeValue('#f8fafc', '#110c31ff'); // updated to match image background

  // Background accents (single-source values)
  const beamA = useColorModeValue('rgba(56,189,248,0.16)', 'rgba(56,189,248,0.12)');
  const beamB = useColorModeValue('rgba(45,212,191,0.14)', 'rgba(56,189,248,0.10)'); // changed greenish to blueish
  const spotlight = useColorModeValue('rgba(14,165,233,0.5)', 'rgba(14,165,233,0.26)');
  const subtleGrid = useColorModeValue('rgba(6,24,44,0.06)', 'rgba(255,255,255,0.03)');

  // frosted card surface (kept)
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.72)', 'rgba(18,20,28,0.55)');
  const cardBorder = useColorModeValue('gray.200', 'whiteAlpha.80');
  const cardBackdropFilter = 'blur(10px) saturate(135%)';

  const dashboardImage = useColorModeValue('/l.png', '/d.png');

  // features array now defined
  const features = [
    {
      icon: FiCode,
      title: "Real-time Collaboration",
      description: "Edit code together with your team in real time, with instant updates and zero lag.",
    },
    {
      icon: FiTerminal,
      title: "Syntax Highlighting",
      description: "Supports all major programming languages with beautiful syntax highlighting.",
    },
    {
      icon: FiUsers,
      title: "No Sign-Up Required",
      description: "Start sharing code instantly—no registration or login needed.",
    },
    {
      icon: FiLock,
      title: "Secure & Private",
      description: "All sessions are encrypted and temporary. Your code stays yours.",
    },
    {
      icon: FiZap,
      title: "Lightning Fast",
      description: "Optimized for speed so you can focus on what matters: your code.",
    },
    {
      icon: FiCode,
      title: "Easy Sharing",
      description: "Share your session link with anyone for seamless collaboration.",
    },
  ];

  // Framer motion variants (kept)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, ease: 'easeInOut' },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } },
  };

  // tiny inline SVG noise (very small, no external request)
  const svgNoise = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
      <filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter>
      <rect width='100%' height='100%' filter='url(#n)' opacity='0.04' />
    </svg>`);

  return (
    <Box position="relative" w="100%" overflow="hidden" bg={heroBg} aria-label="Hero">
      {/* Hero container (confines background to hero only) */}
      <Box
        as="section"
        id="hero"
        position="relative"
        overflow="hidden"
        pt={{ base: 12, md: 24 }}
        pb={{ base: 28, md: 44 }}
        // Primary layered background built with pseudo elements for performance
        _before={{
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          // Layered: conic for color shift + subtle radial vignette
          backgroundImage: `
            conic-gradient(from 200deg at 50% 40%, ${beamA} 0deg, transparent 90deg, ${beamB} 180deg, transparent 270deg),
            radial-gradient(ellipse at 10% 20%, ${spotlight} 0%, rgba(14,165,233,0) 25%),
            radial-gradient(ellipse at 90% 80%, rgba(45,212,191,0.07) 0%, rgba(45,212,191,0) 25%),
            linear-gradient(180deg, ${heroBg} 0%, rgba(0,0,0,0.02) 100%)
          `,
          // limit painting area on small screens to save GPU work
          backgroundSize: 'cover, 600px 600px, 700px 700px, cover',
          opacity: useColorModeValue(0.95, 0.9),
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          transform: 'translateZ(0)', // promote to composite layer
          willChange: 'transform, opacity',
        }}
        _after={{
          content: '""',
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          // subtle grid + noise overlay -> small alpha to avoid heavy repaints
          backgroundImage: `
            linear-gradient(to right, ${subtleGrid} 1px, transparent 1px),
            linear-gradient(to bottom, ${subtleGrid} 1px, transparent 1px),
            url("data:image/svg+xml;utf8,${svgNoise}")
          `,
          backgroundSize: '40px 40px, 40px 40px, 200px 200px',
          opacity: 0.28,
          mixBlendMode: 'overlay',
          transform: 'translateZ(0)',
          willChange: 'transform, opacity',
        }}
        sx={{
          // subtle, efficient motion using transforms
          '@keyframes slow-rotate': {
            from: { transform: 'rotate(0deg) translateZ(0)' },
            to: { transform: 'rotate(360deg) translateZ(0)' },
          },
          '@keyframes drift': {
            '0%': { transform: 'translate3d(-2%,0,0)' },
            '50%': { transform: 'translate3d(2%, -1.5%,0)' },
            '100%': { transform: 'translate3d(-2%,0,0)' },
          },
          // animate only a light overlay element to avoid repainting blurred elements
          '.hero-aux': {
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none',
            transformOrigin: '50% 50%',
            animation: 'slow-rotate 120s linear infinite, drift 22s ease-in-out infinite',
            opacity: 0.22,
            mixBlendMode: 'overlay',
          },
          // respect reduced motion
          '@media (prefers-reduced-motion: reduce)': {
            '.hero-aux': { animation: 'none', opacity: 0.18 },
            _before: { animation: 'none' },
            _after: { animation: 'none' },
          },
        }}
      >
        {/* lightweight decorative element that uses only transforms (GPU-friendly) */}
        <Box className="hero-aux" aria-hidden>
          {/* an extra rotated soft ring (no heavy blur) */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%,-50%)"
            w={{ base: '800px', md: '1100px' }}
            h={{ base: '800px', md: '1100px' }}
            borderRadius="50%"
            border="1px solid"
            borderColor={useColorModeValue('blackAlpha.100', 'whiteAlpha.80')}
            opacity={0.48}
            style={{ filter: 'blur(8px)' }}
          />
          {/* two soft colored blobs using radial-gradients — no heavy CSS filter animation */}
          <Box
            position="absolute"
            top={{ base: '6%', md: '4%' }}
            left={{ base: '6%', md: '4%' }}
            w={{ base: '240px', md: '520px' }}
            h={{ base: '240px', md: '520px' }}
            bg="radial-gradient(circle at 30% 30%, rgba(59,130,246,0.34), rgba(59,130,246,0) 60%)"
            style={{ filter: 'blur(28px)' }}
            opacity={useColorModeValue(0.9, 0.5)}
          />
          <Box
            position="absolute"
            bottom={{ base: '-8%', md: '-14%' }}
            right={{ base: '-6%', md: '-10%' }}
            w={{ base: '360px', md: '680px' }}
            h={{ base: '360px', md: '680px' }}
            bg="radial-gradient(circle at 70% 70%, rgba(59,130,246,0.28), rgba(59,130,246,0) 60%)" // changed green to blue
            style={{ filter: 'blur(36px)' }}
            opacity={useColorModeValue(0.9, 0.5)}
          />
        </Box>

        {/* Content container stays above backgrounds */}
        <Container maxW="1280px" px={{ base: 6, md: 8 }} position="relative" zIndex={3}>
          <ChakraBox variants={containerVariants} initial="hidden" animate="show">
            <VStack textAlign="center" spacing={6}>
              <ChakraBox variants={itemVariants}>
                <Heading
                  as="h1"
                  fontWeight={900}
                  fontSize={{ base: '4xl', sm: '5xl', md: '7xl' }}
                  lineHeight={1.05}
                  color={strongText}
                  letterSpacing="tight"
                >
                  Share Code,
                  <Text as="span" display="block" color={primaryAccentText}>
                    Instantly.
                  </Text>
                </Heading>
              </ChakraBox>

              <ChakraBox variants={itemVariants}>
                <Text color={secondaryText} fontSize={{ base: 'lg', md: 'xl' }} maxW="700px" mx="auto">
                  The ultimate real-time collaboration tool for developers. No sign-up, just secure and effortless code sharing for your projects.
                </Text>
              </ChakraBox>

              <ChakraBox variants={itemVariants} w="full" pt={4}>
                <Box maxW="600px" mx="auto">
                   <Auth />
                </Box>
              </ChakraBox>
            </VStack>
          </ChakraBox>

          {/* Dashboard preview — kept nearly identical */}
          <ChakraBox
            // Removed initial, whileInView, viewport, transition for instant load
            mt={{ base: 24, md: 32 }}
            mx="auto"
          >
            <Box
              position="relative"
              borderRadius="xl"
              bg={cardBg}
              border="1px solid"
              borderColor={cardBorder}
              backdropFilter={cardBackdropFilter}
              boxShadow={useColorModeValue(
                '0 18px 40px -12px rgba(0,0,0,0.12)',
                '0 18px 40px -12px rgba(2,6,23,0.6)'
              )}
              w="100%"
            >
              <Flex align="center" px={4} py={3} borderBottom="1px solid" borderColor={cardBorder}>
                <Flex align="center" gap={2}>
                  <Box w={3} h={3} borderRadius="full" bg="red.400" />
                  <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
                  <Box w={3} h={3} borderRadius="full" bg="green.400" />
                </Flex>
              </Flex>

              <Box p={2}>
                <Image
                  src={dashboardImage}
                  alt="CodeShare Dashboard Preview"
                  w="100%"
                  borderRadius="md"
                  objectFit="cover"
                />
              </Box>
            </Box>
          </ChakraBox>
        </Container>
      </Box>

     
      <Box position="relative" zIndex={4} mt={{ base: 8, md: 12 }}>
  <FeaturesSection
    features={features}
    cardBg={cardBg}
    cardBorder={cardBorder}
    cardBackdropFilter={cardBackdropFilter}
    primaryAccentText={primaryAccentText}
    strongText={strongText}
    secondaryText={secondaryText}
  />
</Box>
    </Box>

  );
}
