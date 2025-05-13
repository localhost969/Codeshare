import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Text, 
  Button, 
  VStack, 
  Input, 
  InputGroup,
  InputRightElement,
  useToast,
  useColorModeValue,
  Flex,
  Fade,
  ScaleFade,
  SlideFade,
  Heading,
  Icon,
  Tooltip,
  Divider,
  HStack,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { keyframes } from '@emotion/react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';
import { FiEye, FiEyeOff, FiArrowLeft, FiCheck, FiX, FiLock, FiInfo, FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function Auth({ initialSpaceId = '', initialSpaceName = '', initialStep = 'enterName' }) {
  const [spaceName, setSpaceName] = useState(initialSpaceName);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(initialStep); // 'enterName', 'enterPassword', 'createPassword'
  const [spaceExists, setSpaceExists] = useState(!!initialSpaceId);
  const [spaceId, setSpaceId] = useState(initialSpaceId);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef(null);
  const toast = useToast();
  const router = useRouter();
  
  // Styling variables from index.js theme
  const mainAccentColor = useColorModeValue('teal.500', 'teal.300');
  const secondaryAccentColor = useColorModeValue('blue.500', 'blue.300');
  const focusBorderColor = useColorModeValue('teal.400', 'teal.200');
  const cardBgColor = useColorModeValue('white', 'gray.800'); 
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');
  const errorColor = useColorModeValue('red.500', 'red.300');
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Default Toast Options
  const defaultToastOptions = {
    duration: 3000,
    isClosable: true,
    position: 'top-right',
    variant: 'subtle', // Using subtle for a softer look, often includes icons by default
  };
  
  // Define animation styles
  const pulseAnimation = keyframes`
    0% { box-shadow: 0 0 0 0 ${useColorModeValue('rgba(49, 151, 149, 0.6)', 'rgba(129, 230, 217, 0.6)')}; } /* teal.500 / teal.300 with alpha */
    70% { box-shadow: 0 0 0 10px rgba(49, 151, 149, 0); }
    100% { box-shadow: 0 0 0 0 rgba(49, 151, 149, 0); }
  `;
  
  // Focus the input on mount
  useEffect(() => {
    if (inputRef.current && step === 'enterName') {
      const timeoutId = setTimeout(() => {
        // Add a check here
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 500);
      // Optional: Clear the timeout if the component unmounts or step changes
      return () => clearTimeout(timeoutId);
    }
  }, [step]);

  const checkSpaceExists = async (name) => {
    if (!name.trim()) {
      toast({
        ...defaultToastOptions,
        title: 'Error',
        description: 'Please provide a space name',
        status: 'error',
      });
      return;
    }

    setIsLoading(true);
    setIsValidating(true);
    setErrorMessage('');
    try {
      // Generate space ID from name
      const generatedSpaceId = name.trim().toLowerCase().replace(/\s+/g, '-');
      setSpaceId(generatedSpaceId);
      
      // Check if space exists 
      const spacesRef = collection(db, 'spaces');
      const spaceRef = doc(spacesRef, generatedSpaceId);
      const spaceDoc = await getDoc(spaceRef);
      
      const exists = spaceDoc.exists();
      setSpaceExists(exists);
      
      // Simulate a slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Move to appropriate next step
      if (exists) {
        setStep('enterPassword'); // Space exists, ask for password to join
        toast({
          ...defaultToastOptions,
          title: 'Space found',
          description: `"${name}" exists. Enter password to join.`,
          status: 'info',
        });
      } else {
        setStep('createPassword'); // Space doesn't exist, ask to create password
        toast({
          ...defaultToastOptions,
          title: 'New space',
          description: `Creating "${name}". Set a password.`,
          status: 'info',
        });
      }
      
      // Clear password field when step changes to enter/create password
      setPassword(''); 
      
      // Open the modal for password entry
      onOpen();
      
      // Focus input for password after modal opens
      setTimeout(() => inputRef.current?.focus(), 300); 

      setIsLoading(false);
      setIsValidating(false);
    } catch (error) {
      console.error('Error checking space:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  const handleCreateSpace = async () => {
    if (!spaceName.trim() || !password.trim()) {
      toast({
        ...defaultToastOptions,
        title: 'Error',
        description: 'Please provide both a space name and password',
        status: 'error',
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      // Check if space exists again (just to be safe)
      const spacesRef = collection(db, 'spaces');
      const spaceRef = doc(spacesRef, spaceId);
      const spaceDoc = await getDoc(spaceRef);
      
      if (spaceDoc.exists()) {
        // Space already exists, notify user
        setStep('enterName');
        throw new Error('This space name is already taken. Please try another name.');
      }
      
      // Create the space document in Firestore
      const spaceData = {
        name: spaceName,
        password, // In a real app, you would hash this password
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Use a more explicit approach to create the document
      const spaceDocRef = doc(spacesRef, spaceId);
      await setDoc(spaceDocRef, spaceData);
      
      console.log('Space created successfully with ID:', spaceId);
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        const spaceToStore = {
          id: spaceId,
          name: spaceName,
          lastAccessed: new Date().toISOString()
        };
        console.log('Storing space data in localStorage:', spaceToStore);
        localStorage.setItem('codeshare_space', JSON.stringify(spaceToStore));
      }
      
      toast({
        ...defaultToastOptions,
        title: 'Success!',
        description: 'Space created successfully!',
        status: 'success',
      });
      
      // Redirect to the workspace
      router.push(`/workspace/${spaceId}`);
    } catch (error) {
      console.error('Error creating space:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleJoinSpace = async () => {
    if (!spaceId.trim() || !password.trim()) {
      toast({
        ...defaultToastOptions,
        title: 'Error',
        description: 'Please provide both space ID and password',
        status: 'error',
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const spacesRef = collection(db, 'spaces');
      const spaceRef = doc(spacesRef, spaceId);
      const spaceDoc = await getDoc(spaceRef);
      
      if (spaceDoc.exists()) {
        const spaceData = spaceDoc.data();
        if (spaceData.password === password) { // In real app, compare hashed passwords
          toast({
            ...defaultToastOptions,
            title: 'Joined!',
            description: `Successfully joined "${spaceData.name}".`,
            status: 'success',
          });
          
          // Store in localStorage for persistence
          if (typeof window !== 'undefined') {
            const spaceToStore = {
              id: spaceId,
              name: spaceData.name,
              lastAccessed: new Date().toISOString()
            };
            console.log('Storing space data in localStorage:', spaceToStore);
            localStorage.setItem('codeshare_space', JSON.stringify(spaceToStore));
          }
          
          // Redirect to the workspace
          router.push(`/workspace/${spaceId}`);
        } else {
          throw new Error('Incorrect password. Please try again.');
        }
      } else {
        toast({
          ...defaultToastOptions,
          title: 'Error',
          description: 'Space not found. It might have been deleted.',
          status: 'error',
        });
        setStep('enterName'); // Reset to start
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error joining space:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('enterName');
    setSpaceName('');
    setPassword('');
    setErrorMessage('');
    setSpaceExists(false);
    setSpaceId('');
    setIsLoading(false);
    onClose(); // Close the modal when going back to search
  };

  const renderBackButton = () => (
    <Button 
      variant="ghost" 
      onClick={() => { 
        setStep('enterName'); 
        setErrorMessage(''); 
        setPassword('');
        onClose(); // Close the modal
        // Focus back on space name input when going back
        setTimeout(() => inputRef.current?.focus(), 100); 
      }}
      leftIcon={<Icon as={FiArrowLeft} />}
      alignSelf="flex-start"
      mb={4}
      colorScheme="gray"
    >
      Back
    </Button>
  );

  const renderErrorMessage = () => {
    if (!errorMessage) return null;
    return (
      <Fade in={!!errorMessage} unmountOnExit>
        <HStack 
          spacing={2} 
          bg={useColorModeValue('red.50', 'red.900')} 
          p={3} 
          rounded="md" 
          borderWidth="1px" 
          borderColor={errorColor}
          mt={4} 
          w="100%"
        >
          <Icon as={FiX} color={errorColor} boxSize={5} />
          <Text color={errorColor} fontSize="sm" fontWeight="medium">
            {errorMessage}
          </Text>
        </HStack>
      </Fade>
    );
  };

  return (
    <Box width="100%">
      <ScaleFade initialScale={0.9} in={true}>
        <Box
          width="100%" 
          textAlign="center"
        >
          <VStack spacing={6} align="stretch">
            <Flex
              alignItems="center"
              width="100%"
              borderRadius="full"
              borderWidth="1px"
              borderColor={isInputFocused ? focusBorderColor : borderColor}
              boxShadow={isInputFocused 
                ? `0 0 0 2px ${useColorModeValue('rgba(49, 151, 149, 0.3)', 'rgba(129, 230, 217, 0.3)')}` 
                : `0 1px 2px ${useColorModeValue('rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.2)')}`
              }
              bg={useColorModeValue('white', 'gray.800')}
              p="1px"
              transition="all 0.2s ease"
              overflow="hidden"
              textAlign="center"
              _hover={{
                borderColor: useColorModeValue('gray.300', 'gray.500')
              }}
            >
              <Box
                as={motion.div}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                pl={4}
                color={useColorModeValue('gray.500', 'gray.400')}
              >
                <FiSearch size={18} />
              </Box>
              <Input
                ref={inputRef}
                placeholder="Enter space name"
                value={spaceName}
                onChange={(e) => setSpaceName(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && spaceName.trim() && !isLoading && !isValidating) {
                    checkSpaceExists(spaceName);
                  }
                }}
                border="none"
                _focus={{
                  boxShadow: "none",
                  outline: "none"
                }}
                bg="transparent"
                color={useColorModeValue('gray.800', 'white')}
                _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                isDisabled={isLoading || isValidating}
                size="md"
                flexGrow={1}
                pl={2}
                h="40px"
                fontWeight="medium"
              />
              <Button
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                colorScheme="teal"
                size="sm"
                onClick={() => checkSpaceExists(spaceName)}
                isLoading={isLoading || isValidating}
                loadingText={isValidating ? 'Checking' : 'Processing'}
                borderRadius="full"
                px={5}
                h="36px"
                fontWeight="500"
                _hover={{ bg: 'teal.500' }}
                mr={1}
              >
                Go
              </Button>
            </Flex>
          </VStack>
        </Box>
      </ScaleFade>
      
      {/* Password Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          onClose();
          setStep('enterName');
          setErrorMessage('');
        }}
        isCentered
        motionPreset="slideInBottom"
        size="md"
      >
        <ModalOverlay 
          bg={useColorModeValue('rgba(255, 255, 255, 0.4)', 'rgba(0, 0, 0, 0.6)')}
          backdropFilter="blur(8px)"
        />
        <ModalContent
          bg={cardBgColor}
          borderRadius="xl"
          boxShadow="xl"
          p={4}
        >
          <ModalHeader p={0} mb={2}>
            {step !== 'enterName' && renderBackButton()}
          </ModalHeader>
          <ModalBody p={0}>
            <VStack spacing={6} align="stretch">
              {step === 'enterPassword' && (
                <>
                  <Heading as="h1" size="lg" fontWeight="semibold" mb={1}>
                    Join Space: "<Text as="span" color={secondaryAccentColor}>{spaceName}</Text>"
                  </Heading>
                  <Box
                    p={3}
                    bg={useColorModeValue('blue.50', 'blue.900')}
                    borderRadius="md"
                    borderLeftWidth="4px"
                    borderLeftColor={secondaryAccentColor}
                    mb={4}
                  >
                    <Text color={subtleTextColor} fontSize="sm" fontWeight="medium">
                      This space already exists. Enter the password to join.
                    </Text>
                  </Box>
                  <InputGroup size="lg">
                    <Input
                      ref={inputRef} 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      borderColor={borderColor}
                      focusBorderColor={focusBorderColor}
                      bg={inputBgColor}
                      _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                      isDisabled={isLoading}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">
                        <Icon as={showPassword ? FiEyeOff : FiEye} color="gray.500" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {renderErrorMessage()} 
                  <Button 
                    colorScheme="teal" 
                    size="lg" 
                    onClick={handleJoinSpace} 
                    isLoading={isLoading}
                    loadingText="Joining..."
                    w="100%"
                    boxShadow="md"
                  >
                    Join Space
                  </Button>
                  <Flex 
                    mt={4} 
                    p={2} 
                    borderRadius="md" 
                    bg={useColorModeValue('gray.50', 'gray.700')} 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Icon as={FiInfo} color={subtleTextColor} mr={2} />
                    <Text fontSize="xs" fontWeight="medium" color={subtleTextColor}>
                      If you don't have access, try another space name.
                    </Text>
                  </Flex>
                </>
              )}

              {step === 'createPassword' && (
                <>
                  <Heading 
                    as="h1" 
                    size="lg" 
                    fontWeight="semibold"
                    title={`Creating New Space: "${spaceName}"`}
                    mb={1}
                  >
                    Creating New Space: "<Text as="span" color={mainAccentColor}>{spaceName}</Text>"
                  </Heading>
                  <Box
                    p={3}
                    bg={useColorModeValue('teal.50', 'teal.900')}
                    borderRadius="md"
                    borderLeftWidth="4px"
                    borderLeftColor={mainAccentColor}
                    mb={4}
                  >
                    <Text color={subtleTextColor} fontSize="sm" fontWeight="medium">
                      Choose a password to secure your new space.
                    </Text>
                  </Box>
                  <InputGroup size="lg">
                    <Input
                      ref={inputRef} 
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Choose a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      borderColor={borderColor}
                      focusBorderColor={focusBorderColor}
                      bg={inputBgColor}
                      _placeholder={{ color: useColorModeValue('gray.400', 'gray.500') }}
                      isDisabled={isLoading}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">
                        <Icon as={showPassword ? FiEyeOff : FiEye} color="gray.500" />
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {renderErrorMessage()} 
                  <Button 
                    colorScheme="teal" 
                    variant="solid"    
                    size="lg" 
                    onClick={handleCreateSpace} 
                    isLoading={isLoading}
                    loadingText="Creating..."
                    w="100%"
                    boxShadow="md"
                  >
                    Create Space
                  </Button>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
