import React from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Button, 
  Input, 
  useColorModeValue,
  Divider,
  Text
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import CodeSnippet from './CodeSnippet';

const Sidebar = ({ 
  snippets, 
  selectedSnippetId, 
  onSelectSnippet, 
  onAddSnippet, 
  onDeleteSnippet,
  spaceId,
  spaceName
}) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box 
      width="250px" 
      height="100vh" 
      bg={bgColor} 
      p={4} 
      borderRightWidth="1px"
      overflowY="auto"
    >
      <VStack align="stretch" spacing={4}>
        <Heading size="md" mb={2}>CodeShare</Heading>
        <Text fontSize="sm" fontWeight="bold" color="blue.500">Space: {spaceName || spaceId}</Text>
        <Divider />
        
        <Box>
          <Heading size="sm" mb={3}>Your Snippets</Heading>
          <Button 
            leftIcon={<AddIcon />} 
            colorScheme="teal" 
            size="sm" 
            width="100%" 
            onClick={onAddSnippet}
            mb={4}
          >
            New Snippet
          </Button>
          
          {snippets.length > 0 ? (
            <VStack align="stretch" spacing={2}>
              {snippets.map(snippet => (
                <CodeSnippet 
                  key={snippet.id}
                  snippet={snippet}
                  onSelect={onSelectSnippet}
                  onDelete={onDeleteSnippet}
                  isSelected={selectedSnippetId === snippet.id}
                />
              ))}
            </VStack>
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center">
              No snippets yet. Create one to get started!
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
