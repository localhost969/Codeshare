import React from 'react';
import {
  Flex,
  Text,
  Button,
  IconButton,
  Tooltip,
  useColorModeValue,
  HStack,
  Box,
  Badge
} from '@chakra-ui/react';
import { FaSignOutAlt, FaTimes, FaCog } from 'react-icons/fa';

const WorkspaceHeader = ({ title, hasActiveSnippet, onCloseEditor, onSignOut }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box 
      py={3} 
      px={6} 
      bg={bgColor} 
      borderBottomWidth="1px" 
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Flex align="center">
          {hasActiveSnippet && (
            <>
             <Badge colorScheme="green" variant="subtle">Currently editing : </Badge>
              <Text fontSize="sm" fontWeight="bold" mr={2}>
                {title}
              </Text>
             
            </>
          )}
          {!hasActiveSnippet && (
            <Text fontSize="lg" fontWeight="medium" color="gray.500">
              
            </Text>
          )}
        </Flex>
        
        <HStack spacing={2}>
          {hasActiveSnippet && (
            <Tooltip label="Close editor" placement="top">
              <IconButton
                icon={<FaTimes />}
                aria-label="Close editor"
                size="sm"
                variant="ghost"
                onClick={onCloseEditor}
              />
            </Tooltip>
          )}
          
          <Tooltip label="Exit space" placement="top">
            <IconButton
              icon={<FaSignOutAlt />}
              aria-label="Exit space"
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={onSignOut}
            />
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  );
};

export default WorkspaceHeader;
