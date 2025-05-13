import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Icon,
  Spinner
} from '@chakra-ui/react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';

const JoinWorkspace = ({ spaceId }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [isLoadingSpace, setIsLoadingSpace] = useState(true);
  
  const toast = useToast();
  const router = useRouter();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  
  // Fetch space details
  useEffect(() => {
    const fetchSpaceDetails = async () => {
      if (!spaceId) return;
      
      try {
        const spaceRef = doc(db, 'spaces', spaceId);
        const spaceDoc = await getDoc(spaceRef);
        
        if (spaceDoc.exists()) {
          setSpaceName(spaceDoc.data().name || 'Shared Workspace');
        } else {
          setError('This workspace does not exist or has been deleted.');
        }
      } catch (err) {
        console.error('Error fetching workspace details:', err);
        setError('Error loading workspace details. Please try again.');
      } finally {
        setIsLoadingSpace(false);
      }
    };
    
    fetchSpaceDetails();
  }, [spaceId]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (!password.trim()) {
        setError('Please enter a password.');
        setIsLoading(false);
        return;
      }
      
      // Validate password against the stored one in Firestore
      const spacesRef = collection(db, 'spaces');
      const spaceRef = doc(spacesRef, spaceId);
      const spaceDoc = await getDoc(spaceRef);
      
      if (spaceDoc.exists()) {
        const spaceData = spaceDoc.data();
        
        // Check if password matches
        if (spaceData.password === password) {
          // Password is correct
          toast({
            title: "Access granted",
            description: `Successfully joined "${spaceData.name}"`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          
          // Store in localStorage for persistence
          const spaceToStore = {
            id: spaceId,
            name: spaceData.name,
            lastAccessed: new Date().toISOString()
          };
          localStorage.setItem('codeshare_space', JSON.stringify(spaceToStore));
          
          // Also store access token to remember this user has access
          localStorage.setItem(`workspace_access_${spaceId}`, 'granted');
          
          // Redirect to the workspace
          router.push(`/workspace/${spaceId}`);
        } else {
          // Password is incorrect
          setError('Incorrect password. Please try again.');
        }
      } else {
        // Space doesn't exist
        setError('This workspace does not exist or has been deleted.');
      }
    } catch (err) {
      console.error('Error validating password:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  if (isLoadingSpace) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }
  
  if (error && !password) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Box textAlign="center" p={8}>
          <Heading size="lg" color="red.500" mb={4}>Error</Heading>
          <Text>{error}</Text>
        </Box>
      </Flex>
    );
  }
  
  return (
    <Flex 
      minHeight="100vh" 
      align="center" 
      justify="center" 
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box 
        w="full" 
        maxW="md" 
        p={8} 
        borderWidth="1px" 
        borderRadius="lg" 
        boxShadow="lg"
        bg={bgColor}
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" mb={2} color={accentColor}>CodeShare</Heading>
            <Text fontSize="lg" fontWeight="medium">Join Workspace</Text>
            {spaceName && (
              <Text fontSize="md" color="gray.500" mt={1}>
                {spaceName}
              </Text>
            )}
          </Box>
          
          <Box>
            <Icon as={FaLock} boxSize={12} color={accentColor} mx="auto" display="block" mb={4} />
            <Text textAlign="center" mb={6}>
              This workspace is password protected. Enter the password to continue.
            </Text>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!error}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter workspace password"
                    size="lg"
                    autoFocus
                  />
                  <InputRightElement width="3rem" height="100%">
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      variant="ghost"
                      onClick={toggleShowPassword}
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
              </FormControl>
              
              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                width="full"
                isLoading={isLoading}
                loadingText="Verifying"
                mt={4}
              >
                Join Workspace
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default JoinWorkspace;
