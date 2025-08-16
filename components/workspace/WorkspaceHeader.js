import React from 'react';
import {
  Flex,
  Text,
  Tooltip,
  useColorModeValue,
  useColorMode,
  HStack,
  Box,
  Badge,
  VisuallyHidden,
  Button
} from '@chakra-ui/react';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';

const WorkspaceHeader = ({ 
  title, 
  hasActiveSnippet, 
  onCloseEditor, 
  onSignOut
}) => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');
  
  // Enhanced dark mode styling
  const headerStyles = colorMode === 'dark' ? {
    bg: 'gray.800',
    borderColor: 'gray.700',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    backgroundImage: 'linear-gradient(to right, rgba(49, 151, 149, 0.05), rgba(72, 87, 153, 0.05))',
  } : {};
  
  return (
    <Box 
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      py={2}
      px={{ base: 4, md: 6 }}
      bg={bgColor}
      borderBottomWidth="1px"
      borderColor={borderColor}
      boxShadow={colorMode === 'dark' ? 'md' : 'sm'}
      transition="all 0.2s"
      {...headerStyles}
    >
      <Flex justify="space-between" align="center" h="100%">
        <Flex align="center" minW={0}>
          {hasActiveSnippet ? (
            <HStack spacing={3}>
              <Badge 
                colorScheme="teal" 
                variant={colorMode === 'dark' ? 'solid' : 'subtle'}
                fontSize="xs"
                py={1}
                px={2}
                borderRadius="md"
                boxShadow={colorMode === 'dark' ? '0 0 5px rgba(49, 151, 149, 0.5)' : 'none'}
              >
                CURRENTLY VIEWING : {title}
              </Badge>
              <Text 
                fontSize="sm" 
                fontWeight="medium"
                color={textColor}
                noOfLines={1}
                title={title}
              >
                
              </Text>
            </HStack>
          ) : (
            <Text 
              fontSize="sm" 
              color={subtleTextColor}
              fontStyle="italic"
            >
            </Text>
          )}
        </Flex>
        
        <HStack spacing={2}>
          {hasActiveSnippet && (
            <Tooltip label="Close editor" placement="bottom">
              <Button
                leftIcon={<FaTimes />}
                size="sm"
                variant={colorMode === 'dark' ? 'outline' : 'solid'}
                colorScheme="teal"
                onClick={onCloseEditor}
                fontWeight="medium"
                px={3}
                aria-label="Close editor"
              >
                Close
              </Button>
            </Tooltip>
          )}

          <Tooltip label="Sign out" placement="bottom">
            <Button
              leftIcon={<FaSignOutAlt />}
              size="sm"
              variant={colorMode === 'dark' ? 'outline' : 'solid'}
              colorScheme="teal"
              onClick={onSignOut}
              fontWeight="medium"
              px={3}
              aria-label="Sign out"
            >
              Sign Out
            </Button>
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(WorkspaceHeader);
            