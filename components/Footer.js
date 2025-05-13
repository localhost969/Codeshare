import React, { useState, useRef } from 'react';
import { 
  Box, 
  Text, 
  Container,
  Flex,
  Icon,
  IconButton,
  useColorModeValue,
  HStack,
  useBreakpointValue,
  useDisclosure,
  SlideFade
} from "@chakra-ui/react";
import { FiMail } from 'react-icons/fi';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const subtleText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Using useDisclosure for better control of open/close states
  const { isOpen, onOpen, onClose } = useDisclosure();
  const triggerRef = useRef(null);
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box 
      bg={useColorModeValue('gray.50', 'gray.900')} 
      color={useColorModeValue('gray.600', 'gray.300')}
      height="60px"
      borderTop="1px"
      borderColor={borderColor}
      as="footer"
      position="relative"
      width="100%"
      overflow="hidden"
    >
      <Container maxW="container.xl" height="100%">
        <Flex 
          direction="row"
          justify="space-between"   
          align="center"
          height="100%"
        >
          <Flex flex="1" justify="center" align="center">
            <Text 
              fontSize="sm" 
              color={subtleText} 
              fontWeight="medium"
              textAlign="center"
              alignItems="center"
              display="inline-flex"
            >
              {' '}
              {new Date().getFullYear()}{' '}
              <Box as="span" mx={1} fontWeight="semibold">CodeShare</Box>
            </Text>
          </Flex>

          <Box position="absolute" right="4" zIndex={1}>
            <Flex 
              direction="row-reverse" 
              align="center" 
              onMouseEnter={onOpen} 
              onMouseLeave={onClose}
              onClick={() => isOpen ? onClose() : onOpen} // Toggle on click too
            >
              <IconButton
                ref={triggerRef}
                aria-label="Contact Options"
                icon={<Icon as={FiMail} boxSize={5} />}
                variant="ghost"
                size="md"
                rounded="full"
                color={accentColor}
                _hover={{
                  bg: useColorModeValue(`${accentColor}.50`, `${accentColor}.900`),
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s"
              />
              
              <SlideFade 
                in={isOpen} 
                offsetX="-20px" 
                offsetY="0" 
                style={{ 
                  position: 'relative',
                  marginRight: '8px' 
                }}
              >
                <HStack spacing={2}>
                  <IconButton
                    as="a"
                    href="https://linkedin.com/in/vrdn96"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    aria-label="LinkedIn"
                    icon={<Icon as={FaLinkedin} boxSize={4} color="#0077B5" />}
                    borderRadius="full"
                    _hover={{
                      transform: 'scale(1.1)',
                      bg: useColorModeValue('blue.50', 'blue.900'),
                      borderColor: '#0077B5'
                    }}
                    title="LinkedIn: vrdn96"
                    transition="all 0.3s"
                  />
                  <IconButton
                    as="a"
                    href="https://github.com/localhost969"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    aria-label="GitHub"
                    icon={<Icon as={FaGithub} boxSize={4} />}
                    borderRadius="full"
                    _hover={{
                      transform: 'scale(1.1)',
                      bg: useColorModeValue('gray.100', 'gray.700'),
                      borderColor: useColorModeValue('gray.800', 'gray.300')
                    }}
                    title="GitHub: localhost969"
                    transition="all 0.3s"
                  />
                  <IconButton
                    as="a"
                    href="https://instagram.com/vardn.py"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    size="sm"
                    aria-label="Instagram"
                    icon={<Icon as={FaInstagram} boxSize={4} color="#E1306C" />}
                    borderRadius="full"
                    _hover={{
                      transform: 'scale(1.1)',
                      bg: useColorModeValue('pink.50', 'pink.900'),
                      borderColor: '#E1306C'
                    }}
                    title="Instagram: vardn.py"
                    transition="all 0.3s"
                  />
                </HStack>
              </SlideFade>
            </Flex>
          </Box>
        </Flex>
      </Container>
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}