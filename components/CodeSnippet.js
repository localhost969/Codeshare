import React from 'react';
import { Box, Flex, Text, IconButton, useColorModeValue } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const CodeSnippet = ({ snippet, onSelect, onDelete, isSelected }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const selectedBgColor = useColorModeValue('blue.50', 'blue.900');
  
  return (
    <Box 
      p={3} 
      borderWidth="1px" 
      borderRadius="md" 
      mb={2} 
      bg={isSelected ? selectedBgColor : bgColor}
      _hover={{ bg: isSelected ? selectedBgColor : useColorModeValue('gray.50', 'gray.700') }}
      cursor="pointer"
      onClick={() => onSelect(snippet.id)}
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="bold" fontSize="sm" noOfLines={1}>{snippet.title}</Text>
          <Text fontSize="xs" color="gray.500">{snippet.language}</Text>
        </Box>
        <Box>
          <IconButton
            aria-label="Delete snippet"
            icon={<DeleteIcon />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(snippet.id);
            }}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default CodeSnippet;
