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
  Text
} from '@chakra-ui/react';
import { FaEdit } from 'react-icons/fa';

const EditTitleModal = ({ isOpen, onClose, title, onTitleChange, onSubmit }) => {
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
          <Text fontSize="lg" fontWeight="bold">Edit Snippet Title</Text>
        </ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody py={6}>
            <FormControl isRequired>
              <FormLabel fontWeight="medium">Snippet Title</FormLabel>
              <Input 
                value={title} 
                onChange={onTitleChange}
                placeholder="Enter a new title for your snippet"
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
              colorScheme="blue" 
              leftIcon={<FaEdit />}
              isDisabled={!title.trim()}
            >
              Update Title
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditTitleModal;
