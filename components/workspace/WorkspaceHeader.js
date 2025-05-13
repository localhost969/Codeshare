import React from 'react';
import {
  Flex,
  Text,
  IconButton,
  Tooltip,
  useColorModeValue,
  HStack,
  Box,
  Badge
} from '@chakra-ui/react';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';

const WorkspaceHeader = ({ 
  title, 
  hasActiveSnippet, 
  onCloseEditor, 
  onSignOut
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subtleTextColor = useColorModeValue('gray.500', 'gray.400');
  
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
      boxShadow="sm"
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="center" h="100%">
        <Flex align="center" minW={0}>
          {hasActiveSnippet ? (
            <HStack spacing={3}>
              <Badge 
                colorScheme="blue" 
                variant="subtle"
                fontSize="xs"
                py={1}
                px={2}
                borderRadius="md"
              >
                EDITING
              </Badge>
              <Text 
                fontSize="sm" 
                fontWeight="medium"
                color={textColor}
                noOfLines={1}
                title={title}
              >
                {title}
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
        
        <HStack spacing={1}>
          {hasActiveSnippet && (
            <Tooltip label="Close editor" placement="bottom">
              <IconButton
                icon={<FaTimes />}
                aria-label="Close editor"
                size="sm"
                variant="ghost"
                color={textColor}
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                onClick={onCloseEditor}
              />
            </Tooltip>
          )}
          
          <Tooltip label="Sign out" placement="bottom">
            <IconButton
              icon={<FaSignOutAlt />}
              aria-label="Sign out"
              size="sm"
              variant="ghost"
              color={textColor}
              _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
              onClick={onSignOut}
            />
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(WorkspaceHeader);
