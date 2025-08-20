import { Box, Container, VStack, Text, Heading, SimpleGrid, Icon, useColorModeValue, chakra, shouldForwardProp } from "@chakra-ui/react";
import { motion, isValidMotionProp } from 'framer-motion';
import { FiCode, FiTerminal, FiUsers, FiLock, FiZap } from 'react-icons/fi';

// Re-usable Chakra factory for motion components
const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

export default function FeaturesSection({ features, cardBg, cardBorder, cardBackdropFilter, primaryAccentText, strongText, secondaryText }) {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900/50')} py={{ base: 20, md: 28 }}>
      <Container maxW="1280px" px={{ base: 6, md: 8 }}>
        <VStack spacing={4} mb={{ base: 12, md: 16 }} textAlign="center">
          <ChakraBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Text color={primaryAccentText} fontWeight="bold" fontSize="lg">Everything You Need</Text>
            <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="800" color={strongText} mt={2}>
              Seamless Code Collaboration
            </Heading>
          </ChakraBox>
          <ChakraBox initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            <Text color={secondaryText} fontSize={{ base: "md", md: "lg" }} maxW="2xl" mx="auto">
              A powerful, yet simple suite of features designed for modern development workflows.
            </Text>
          </ChakraBox>
        </VStack>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
          {features.map((feature, index) => (
            <ChakraBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <VStack
                spacing={4}
                bg={cardBg}
                p={8}
                borderRadius="xl"
                border="1px solid"
                borderColor={cardBorder}
                backdropFilter={cardBackdropFilter}
                h="100%"
                alignItems="flex-start"
                transition="all 0.3s ease"
                _hover={{
                  borderColor: primaryAccentText,
                  boxShadow: 'xl',
                }}
              >
                <Icon as={feature.icon} boxSize={8} color={primaryAccentText} />
                <Heading as="h3" fontSize="xl" fontWeight="700" color={strongText}>
                  {feature.title}
                </Heading>
                <Text color={secondaryText} fontSize="md">
                  {feature.description}
                </Text>
              </VStack>
            </ChakraBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
