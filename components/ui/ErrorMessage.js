import { HStack, Text, Icon, Fade, useColorModeValue } from "@chakra-ui/react";
import { FiX } from 'react-icons/fi';

export default function ErrorMessage({ message }) {
  const errorColor = useColorModeValue('red.500', 'red.300');
  const errorBgColor = useColorModeValue('red.50', 'red.900');
  
  if (!message) return null;
  
  return (
    <Fade in={!!message} unmountOnExit>
      <HStack 
        spacing={3} 
        bg={errorBgColor} 
        p={4} 
        rounded="lg" 
        borderWidth="1px" 
        borderColor={errorColor}
        mt={4} 
        w="100%"
        boxShadow="sm"
      >
        <Icon as={FiX} color={errorColor} boxSize={5} flexShrink={0} />
        <Text color={errorColor} fontSize="sm" fontWeight="500">
          {message}
        </Text>
      </HStack>
    </Fade>
  );
}
