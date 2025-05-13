import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Text,
  Box
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

const NewSnippetModal = ({ isOpen, onClose, title, onTitleChange, onSubmit }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bgColor} borderColor={borderColor} boxShadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          <Text fontSize="lg" fontWeight="bold">Create New Snippet</Text>
        </ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody py={6}>
            <Box mb={2}>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Create a new code snippet to start coding. Give it a descriptive name.
              </Text>
            </Box>
            
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Snippet Title</FormLabel>
              <Input 
                value={title} 
                onChange={onTitleChange}
                placeholder="Enter a title for your snippet"
                size="md"
                focusBorderColor="teal.400"
                autoFocus
              />
            </FormControl>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor} pt={4}>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              colorScheme="teal" 
              leftIcon={<FaPlus />}
              isDisabled={!title.trim()}
            >
              Create Snippet
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default NewSnippetModal;
