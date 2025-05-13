import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Box, 
  Text, 
  Container,
  Flex,
  Icon,
  IconButton,
  Tooltip,
  useColorMode,
  useColorModeValue,
  HStack,
  useBreakpointValue,
  useDisclosure,
  SlideFade
} from "@chakra-ui/react";
import { FiMail, FiMoon, FiSun } from 'react-icons/fi';
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
  const router = useRouter();
  const isIndexPage = router.pathname === '/';
  const { colorMode, toggleColorMode } = useColorMode();
  // Remove scroll and hover effects for always-visible footer

  return (
    <Box 
      as="footer"
      bg={useColorModeValue('white', 'gray.800')} 
      color={useColorModeValue('gray.600', 'gray.300')}
      height="24px"
      py={1}
      borderTop="1px"
      borderColor={borderColor}
      width="100%"
      position="sticky"
      bottom="0"
      left="0"
      right="0"
      zIndex="sticky"
      boxShadow="sm"
      mt="auto"
      // Remove hover and scroll effects
    >
      <Container maxW="container.xl" height="100%" px={4} py={0}>
        <Flex 
          direction="row"
          justify="center"   
          align="center"
          height="100%"
          maxW="100%"
        >
          <Flex flex="1" justify="center" align="center">
            <Text
              fontSize="xs"
              lineHeight="shorter"
              color={subtleText}
              fontWeight="medium"
              textAlign="center"
              alignItems="center"
              display="flex"
              justifyContent="center"
              width="100%"
            >
              &copy; {new Date().getFullYear()} Codeshare. All rights reserved. | Crafted by{' '}
              <Box
                as="span"
                color={accentColor}
                fontWeight="bold"
                fontFamily="heading"
                px={1}
                borderBottom="2px solid"
                borderColor={accentColor}
                ml={1}
              >
                Vardan
              </Box>
            </Text>
          </Flex>

          <Box position="absolute" right="4" zIndex={1}>
            <Flex direction="row" align="center" gap={2}>
              <Box
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
                onClick={() => isOpen ? onClose() : onOpen()}
              >
                <IconButton
                  ref={triggerRef}
                  aria-label="Contact Options"
                  icon={<Icon as={FiMail} boxSize={4} />}
                  variant="ghost"
                  size="sm"
                  rounded="full"
                  color={accentColor}
                  _hover={{
                    bg: useColorModeValue(`${accentColor}.50`, `${accentColor}.900`),
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s"
                />
              </Box>
              
              <Box 
                position="relative" 
                display="inline-flex" 
                alignItems="center"
                height="100%"
              >
                <Box
                  position="absolute"
                  right="100%"
                  bottom="100%"
                  mb={2}
                  opacity={isOpen ? 1 : 0}
                  transition="all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                  pointerEvents={isOpen ? 'auto' : 'none'}
                  mr={2}
                  zIndex="dropdown"
                >
                  <Box
                    position="relative"
                    bg={useColorModeValue('white', 'gray.800')}
                    borderRadius="lg"
                    boxShadow="xl"
                    border="1px"
                    borderColor={useColorModeValue('gray.100', 'gray.700')}
                    py={2}
                    px={3}
                    onMouseEnter={onOpen}
                    onMouseLeave={onClose}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      bottom: '-6px',
                      right: '14px',
                      width: '12px',
                      height: '12px',
                      bg: 'inherit',
                      borderBottom: '1px solid',
                      borderRight: '1px solid',
                      borderColor: 'inherit',
                      transform: 'rotate(45deg)',
                      zIndex: -1,
                    }}
                  >
                    <HStack spacing={2}>
                    <Tooltip label="LinkedIn" placement="top" hasArrow>
                      <IconButton
                        as="a"
                        href="https://linkedin.com/in/vrdn96"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="ghost"
                        size="sm"
                        aria-label="LinkedIn"
                        icon={<Icon as={FaLinkedin} boxSize={4} color={useColorModeValue('#0077B5', '#90cdf4')} />}
                        borderRadius="full"
                        _hover={{
                          bg: useColorModeValue('blue.50', 'blue.900'),
                          transform: 'translateY(-2px)'
                        }}
                        title="LinkedIn: vrdn96"
                        transition="all 0.2s"
                      />
                    </Tooltip>
                    <Tooltip label="GitHub" placement="top" hasArrow>
                      <IconButton
                        as="a"
                        href="https://github.com/localhost969"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="ghost"
                        size="sm"
                        aria-label="GitHub"
                        icon={<Icon as={FaGithub} boxSize={4} color={useColorModeValue('gray.700', 'gray.300')} />}
                        borderRadius="full"
                        _hover={{
                          bg: useColorModeValue('gray.100', 'gray.700'),
                          transform: 'translateY(-2px)'
                        }}
                        title="GitHub: localhost969"
                        transition="all 0.2s"
                      />
                    </Tooltip>
                    <Tooltip label="Instagram" placement="top" hasArrow>
                      <IconButton
                        as="a"
                        href="https://instagram.com/vardn.py"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="ghost"
                        size="sm"
                        aria-label="Instagram"
                        icon={<Icon as={FaInstagram} boxSize={4} color="#E1306C" />}
                        borderRadius="full"
                        _hover={{
                          bg: useColorModeValue('pink.50', 'pink.900'),
                          transform: 'translateY(-2px)'
                        }}
                        title="Instagram: vardn.py"
                        transition="all 0.2s"
                      />
                    </Tooltip>
                    </HStack>
                  </Box>
                </Box>
                <IconButton
                  aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                  icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  size="sm"
                  rounded="full"
                  color={useColorModeValue('gray.600', 'gray.300')}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.700'),
                    transform: 'scale(1.05)'
                  }}
                  transition="all 0.2s"
                />
              </Box>
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