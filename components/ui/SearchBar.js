import { 
  Input, 
  Button, 
  Flex, 
  useColorModeValue,
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";
import { FiSearch } from 'react-icons/fi';
import { forwardRef } from 'react';

const SearchBar = forwardRef(({ 
  spaceName, 
  onSpaceNameChange, 
  onSubmit, 
  isLoading, 
  isValidating, 
  onFocus, 
  onBlur 
}, ref) => {
  
  // --- Color Palette (Unchanged) ---
  const focusBorderColor = useColorModeValue('teal.500', 'blue.300'); // teal.300 -> blue.300
  const searchIconColor = useColorModeValue('gray.400', 'gray.500');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const focusShadowColor = useColorModeValue('teal.500', 'blue.300'); // teal.300 -> blue.300
  const bgColor = useColorModeValue('white', 'gray.800');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (spaceName.trim() && !isLoading && !isValidating) {
      onSubmit(spaceName);
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleFormSubmit}
      alignItems="center"
      width="100%"
      maxW="600px"
      mx="auto"
      bg={bgColor}
      borderRadius="lg" // Slightly softer radius
      boxShadow="md" // A subtle, standard shadow for depth
    >
      <InputGroup size="lg" flexGrow={1} alignItems="center">
        <InputLeftElement 
          pointerEvents="none" 
          height="100%" // Ensure icon is vertically centered
          display="flex"
          alignItems="center"
        >
          <FiSearch color={searchIconColor} size={22} style={{ verticalAlign: 'middle' }} />
        </InputLeftElement>
        
        <Input
          ref={ref}
          placeholder="Enter workspace name to join or create"
          value={spaceName}
          onChange={(e) => onSpaceNameChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          isDisabled={isLoading || isValidating}
          variant="filled" // Use filled variant for a more contained look
          bg={bgColor}
          border="none"
          borderTopLeftRadius="lg"
          borderBottomLeftRadius="lg"
          borderTopRightRadius="none" // Ensure seamless connection to button
          borderBottomRightRadius="none"
          _hover={{
            bg: useColorModeValue('gray.50', 'gray.700') // Subtle hover feedback
          }}
          _focus={{
            // A clean, modern focus ring instead of complex shadows
            zIndex: 1,
            outline: "none",
            boxShadow: `0 0 0 2px ${focusShadowColor}`,
          }}
          _placeholder={{ 
            color: placeholderColor,
            fontSize: "md"
          }}
          fontSize="md"
          fontWeight="500"
          height="56px" // Increased height for better presence
          pl="3.2rem" // Increased padding for more gap between icon and text
        />
      </InputGroup>
      
      <Button
        type="submit"
        colorScheme={useColorModeValue('teal', 'blue')} // teal -> blue in dark mode
        isLoading={isLoading || isValidating}
        isDisabled={!spaceName.trim()}
        size="lg" // Match the input group size
        borderTopLeftRadius="none" // Connects button flush with the input
        borderBottomLeftRadius="none"
        px={8}
        fontWeight="600"
        height="56px"
        minW="100px"
        loadingText="Searching"
        // Removed distracting hover transforms for a more stable, professional feel
      >
        Join
      </Button>
    </Flex>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;