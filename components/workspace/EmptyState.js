import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  VStack,
  useColorModeValue,
  Icon,
  Flex,
  Image,
  Tooltip,
  ScaleFade,
  HStack,
  useDisclosure,
  SlideFade
} from '@chakra-ui/react';
import { FaCode, FaPlus, FaLightbulb, FaMagic, FaRocket } from 'react-icons/fa';

// Hand-drawn SVG components
const HandDrawnArrow = () => (
  <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5,20 C15,15 40,25 60,20 L70,20 L65,15 M70,20 L65,25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const HandDrawnCircle = ({size = 200, color = "teal.400"}) => (
  <Box position="absolute" width={`${size}px`} height={`${size}px`} zIndex="0">
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,10 C25,10 10,30 10,50 C10,75 30,90 50,90 C75,90 90,70 90,50 C90,25 70,10 50,10 Z" stroke={useColorModeValue("teal.400", "teal.300")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </Box>
);

const HandDrawnBox = ({width = 100, height = 100}) => (
  <Box position="absolute" width={`${width}px`} height={`${height}px`} zIndex="0">
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,20 L80,20 L80,80 L20,80 Z" stroke={useColorModeValue("purple.400", "purple.300")} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  </Box>
);

const EmptyState = ({ onAddSnippet, onBrowseSnippets }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  
  // State for interactive elements
  const [activeMessage, setActiveMessage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [showElements, setShowElements] = useState(true);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  
  // Animation states
  const [floatUp, setFloatUp] = useState(false);
  const [shine, setShine] = useState(false);
  
  // Array of micro-messages
  const messages = [
    "Ready to write some amazing code?",
    "Share your code with friends and colleagues!",
    "Multiple language support awaits you!",
    "Your code is automatically saved as you type.",
    "Try different themes for your coding experience!"
  ];
  
  // Cycle through messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setActiveMessage((prev) => (prev + 1) % messages.length);
      onToggle();
      setTimeout(onToggle, 100);
    }, 5000);
    
    // Float animation
    const floatInterval = setInterval(() => {
      setFloatUp(prev => !prev);
    }, 2000);
    
    // Shine animation
    const shineInterval = setInterval(() => {
      setShine(prev => !prev);
    }, 1500);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(floatInterval);
      clearInterval(shineInterval);
    };
  }, []);
  
  return (
    <Flex 
      flex="1" 
      p={8} 
      justify="center" 
      align="center"
      position="relative"
      overflow="hidden"
    >
      {/* Background hand-drawn elements */}
      <Box 
        position="absolute" 
        top="10%" 
        left="15%" 
        transition="transform 2s ease-in-out"
        transform={floatUp ? "translateY(-10px)" : "translateY(0px)"}
      >
        <HandDrawnCircle size={80} />
      </Box>
      <Box 
        position="absolute" 
        bottom="15%" 
        right="20%" 
        transition="transform 2s ease-in-out"
        transform={!floatUp ? "translateY(-10px)" : "translateY(0px)"}
      >
        <HandDrawnBox width={60} height={60} />
      </Box>
      
      <Box 
        maxW="700px" 
        w="full" 
        p={10}
        borderWidth="2px" 
        borderRadius="3xl"
        borderStyle="dashed"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow="xl"
        textAlign="center"
        position="relative"
        zIndex="1"
        overflow="hidden"
      >
        {/* Decorative code brackets */}
        <Text 
          position="absolute" 
          top="-20px" 
          left="20px" 
          fontSize="120px" 
          opacity="0.1" 
          color={accentColor}
          fontFamily="monospace"
        >
          &lt;
        </Text>
        <Text 
          position="absolute" 
          bottom="-20px" 
          right="20px" 
          fontSize="120px" 
          opacity="0.1" 
          color={accentColor}
          fontFamily="monospace"
        >
          /&gt;
        </Text>
        
        <VStack spacing={8} position="relative">
          {/* Animated code icon */}
          <Box 
            position="relative" 
            transition="all 0.3s, transform 2s ease-in-out"
            transform={isHovering ? "scale(1.1)" : (floatUp ? "translateY(-10px)" : "translateY(0px)")} 
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Icon 
              as={FaCode} 
              boxSize={20} 
              color={accentColor} 
            />
            <Box 
              position="absolute" 
              top="-5px" 
              right="-5px" 
              opacity={shine ? 1 : 0.5}
              transition="opacity 1.5s ease-in-out"
            >
              <Icon as={FaLightbulb} boxSize={6} color="yellow.400" />
            </Box>
          </Box>
          
          <Text 
            fontSize="3xl" 
            fontWeight="bold"
            bgGradient="linear(to-r, teal.400, purple.500)"
            bgClip="text"
          >
            Welcome to CodeShare
          </Text>
          
          {/* Animated micro-messages */}
          <Box height="60px" display="flex" alignItems="center" justifyContent="center">
            <ScaleFade in={isOpen} initialScale={0.9}>
              <Text 
                color={textColor} 
                fontSize="lg"
                fontStyle="italic"
              >
                {messages[activeMessage]}
              </Text>
            </ScaleFade>
          </Box>
          
          <Text color={textColor} maxW="500px">
            Select a snippet from the sidebar or create a new one to start coding.
            Your code will be automatically saved and can be shared with others.
          </Text>
          
          {/* Interactive action buttons */}
          <HStack spacing={6} pt={4}>
            <Tooltip label="Browse existing snippets" hasArrow placement="top">
              <Button
                leftIcon={<FaMagic />}
                colorScheme="teal"
                variant="outline"
                size="lg"
                borderRadius="full"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
                onClick={onBrowseSnippets}
              >
                Browse Snippets
              </Button>
            </Tooltip>
            
            <Tooltip label="Start a new coding project" hasArrow placement="top">
              <Button
                leftIcon={<FaRocket />}
                colorScheme="purple"
                size="lg"
                borderRadius="full"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
                onClick={onAddSnippet}
              >
                New Snippet
              </Button>
            </Tooltip>
          </HStack>
          
          {/* Hand-drawn arrow pointing to sidebar */}
          <Box position="absolute" left="-70px" top="50%" color={accentColor}>
            <HandDrawnArrow />
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default EmptyState;
