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
  Text,
  useColorModeValue,
  Box,
  Icon
} from '@chakra-ui/react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const warningColor = useColorModeValue('red.500', 'red.300');
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent bg={bgColor} borderColor={borderColor} boxShadow="xl">
        <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
          <Text fontSize="lg" fontWeight="bold" color={warningColor}>Confirm Deletion</Text>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody py={6}>
          <Box display="flex" alignItems="center" mb={4}>
            <Icon as={FaExclamationTriangle} color={warningColor} boxSize={6} mr={3} />
            <Text fontWeight="medium">Are you sure you want to delete this snippet?</Text>
          </Box>
          <Text color="gray.500">
            This action cannot be undone. The snippet and all its code will be permanently removed.
          </Text>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor={borderColor} pt={4}>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="red" 
            leftIcon={<FaTrash />}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete Permanently
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;
