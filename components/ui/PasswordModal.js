import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  Heading,
  Text,
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Icon,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiArrowLeft, FiEye, FiEyeOff, FiInfo } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import ErrorMessage from './ErrorMessage'; // Assuming ErrorMessage is also well-styled

export default function PasswordModal({ 
  isOpen, 
  onClose, 
  step, 
  spaceName, 
  password, 
  setPassword, 
  isLoading, 
  errorMessage, 
  onJoinSpace, 
  onCreateSpace, 
  onBack 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);
  
  // --- Color Palette (Unchanged from original) ---
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const inputBgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const focusBorderColor = useColorModeValue('teal.500', 'teal.300'); // Primary focus color
  const mainAccentColor = useColorModeValue('teal.500', 'teal.300'); // For 'create space' elements
  const secondaryAccentColor = useColorModeValue('blue.500', 'blue.300'); // For 'join space' elements
  const subtleTextColor = useColorModeValue('gray.600', 'gray.400');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500'); // Re-defined for clarity

  useEffect(() => {
    if (isOpen && inputRef.current && (step === 'enterPassword' || step === 'createPassword')) {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 100); // Shorter timeout for snappier focus
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, step]);

  const renderBackButton = () => (
    <Button 
      variant="ghost" 
      onClick={onBack}
      leftIcon={<Icon as={FiArrowLeft} />}
      size="md" // Slightly larger for better touch target and visibility
      colorScheme="gray"
      _hover={{
        bg: useColorModeValue('gray.100', 'gray.700') // Subtle hover for ghost buttons
      }}
    >
      Back
    </Button>
  );

  const isEnterPasswordStep = step === 'enterPassword';
  const isCreatePasswordStep = step === 'createPassword';

  // Return null if step is not relevant, preventing render
  if (!isEnterPasswordStep && !isCreatePasswordStep) {
    return null;
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      isCentered
      motionPreset="scale" // 'scale' can feel more subtle and modern than 'slideInBottom' for modals
      size="md"
    >
      <ModalOverlay 
        // Semi-transparent black/white with a blur, common for professional modals
        bg={useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(0, 0, 0, 0.8)')} 
        backdropFilter="blur(8px) saturate(120%)" // Slightly more subtle blur
      />
      <ModalContent
        bg={cardBgColor}
        borderRadius="xl" // Softer radius, consistent with the search bar
        boxShadow="2xl" // Keeps a good presence
        p={7} // Slightly more internal padding for a spacious feel
        mx={4}
      >
        <ModalHeader 
          display="flex" 
          justifyContent="flex-start" 
          alignItems="center" 
          p={0} // Remove default padding
          pb={4} // Padding below the header content
        >
          {renderBackButton()}
        </ModalHeader>
        
        <ModalBody p={0}> {/* Remove ModalBody's default padding to control with VStack */}
          <VStack spacing={6} align="stretch">
            {/* Main Heading for Modal */}
            <Heading as="h2" size="lg" fontWeight="extrabold" color={useColorModeValue('gray.800', 'white')}>
              {isEnterPasswordStep ? 'Join ' : 'Create '}
              <Text 
                as="span" 
                color={isEnterPasswordStep ? secondaryAccentColor : mainAccentColor}
              >
                "{spaceName}"
              </Text>
            </Heading>
            
            {/* Information Box */}
            <Box
              p={4}
              bg={useColorModeValue(
                isEnterPasswordStep ? 'blue.50' : 'teal.50', 
                isEnterPasswordStep ? 'blue.900' : 'teal.900'
              )}
              borderRadius="md" // Slightly less rounded for information boxes
              borderLeftWidth="5px" // Slightly thicker border for emphasis
              borderLeftColor={isEnterPasswordStep ? secondaryAccentColor : mainAccentColor}
            >
              <Text fontSize="sm" color={subtleTextColor} fontWeight="medium">
                {isEnterPasswordStep 
                  ? 'This space already exists. Please enter the password to join.' 
                  : 'You are creating a new workspace. Please choose a strong password.'
                }
              </Text>
            </Box>
            
            {/* Password Input Field */}
            <InputGroup size="lg">
              <Input
                ref={inputRef} 
                type={showPassword ? 'text' : 'password'}
                placeholder={isEnterPasswordStep ? 'Enter password' : 'Choose a password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outline" // Sticking to 'outline' as it's common in pro UIs for clarity
                borderColor={borderColor}
                bg={inputBgColor} // Keeping the distinct background color
                borderRadius="lg" // Consistent with the overall design
                _hover={{
                  borderColor: useColorModeValue('gray.300', 'gray.500'), // Subtle hover
                }}
                _focus={{
                  boxShadow: `0 0 0 2px ${focusBorderColor}`, // Clean focus ring
                  borderColor: focusBorderColor, // Make sure border itself changes as well
                  bg: useColorModeValue('white', 'gray.800'), // Change bg on focus for clarity
                }}
                _placeholder={{ color: placeholderColor }}
                isDisabled={isLoading}
                height="56px"
                fontSize="md"
                fontWeight="normal" // Keep input text as normal weight unless specified
              />
              <InputRightElement width="4.5rem" height="56px">
                <Button 
                  h="2rem" 
                  size="sm" 
                  onClick={() => setShowPassword(!showPassword)} 
                  variant="ghost"
                  borderRadius="md"
                  tabIndex="-1" // Make it not part of normal tab flow for accessibility if using enter on input
                >
                  <Icon as={showPassword ? FiEyeOff : FiEye} color={subtleTextColor} />
                </Button>
              </InputRightElement>
            </InputGroup>
            
            {/* Error Message */}
            <ErrorMessage message={errorMessage} />
            
            {/* Main Action Button */}
            <Button 
              colorScheme="teal" 
              size="lg" 
              onClick={isEnterPasswordStep ? onJoinSpace : onCreateSpace}
              isLoading={isLoading}
              loadingText={isEnterPasswordStep ? "Joining..." : "Creating..."}
              w="100%"
              borderRadius="lg" // Consistent radius
              height="56px"
              fontSize="lg" // Slightly larger font for main action
              fontWeight="bold" // Stronger weight for primary action
              boxShadow="md" // Subtle standard shadow
              // Removed _hover transform for a stable and modern feel
              _hover={{
                bg: useColorModeValue('teal.600', 'teal.400'), // Deeper hover color
                boxShadow: "lg" // A bit more pronounced shadow on hover for main button
              }}
              transition="background 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Smoother transition
              isDisabled={!password.trim()} // Disable if no password entered
            >
              {isEnterPasswordStep ? 'Join Space' : 'Create Space'}
            </Button>
            
            {/* Conditional Info Text for 'Join' step */}
            {isEnterPasswordStep && (
              <Flex 
                mt={2} 
                p={3} 
                borderRadius="lg" 
                bg={useColorModeValue('gray.50', 'gray.700')} 
                alignItems="center" 
              >
                <Icon as={FiInfo} color={subtleTextColor} mr={2} boxSize={5} /> {/* Slightly larger icon */}
                <Text fontSize="sm" fontWeight="medium" color={subtleTextColor}>
                  If you don't have access, try another space name.
                </Text>
              </Flex>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}