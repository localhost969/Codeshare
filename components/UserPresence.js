import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';

// This component shows who is currently active in the workspace
const UserPresence = ({ activeUsers = 1, userColors = ['teal.500', 'blue.500', 'purple.500', 'pink.500', 'orange.500'] }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Generate mock users for demo purposes
  // Mock users for demonstration purposes
  const mockUsers = Array.from({ length: Math.min(activeUsers, 5) }, (_, i) => ({
    id: `user-${i}`,
    name: i === 0 ? 'You' : `User ${i}`,
    color: userColors[i % userColors.length],
    isYou: i === 0
  }));
  
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="md" 
      p={2} 
      bg={bgColor}
      borderColor={borderColor}
    >
      <Text fontSize="sm" fontWeight="medium" mb={2}>
        Active Users ({activeUsers})
      </Text>
      
      <Flex>
        {mockUsers.map((user, index) => (
          <Tooltip key={user.id} label={user.name} placement="top">
            <Avatar 
              size="sm" 
              name={user.name} 
              bg={user.color}
              ml={index > 0 ? -2 : 0}
              border="2px solid"
              borderColor={bgColor}
              position="relative"
            >
              {user.isYou && (
                <Badge 
                  position="absolute" 
                  bottom="-2px" 
                  right="-2px" 
                  colorScheme="green" 
                  size="xs"
                  borderRadius="full"
                  boxSize="10px"
                />
              )}
            </Avatar>
          </Tooltip>
        ))}
        
        {activeUsers > 5 && (
          <Flex
            ml={-2}
            align="center"
            justify="center"
            bg="gray.300"
            color="gray.800"
            borderRadius="full"
            boxSize="32px"
            fontSize="xs"
            fontWeight="bold"
            border="2px solid"
            borderColor={bgColor}
          >
            +{activeUsers - 5}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default UserPresence;
