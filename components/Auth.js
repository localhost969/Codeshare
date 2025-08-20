import { useState, useRef } from 'react';
import { 
  Box, 
  VStack, 
  useToast,
  ScaleFade,
} from "@chakra-ui/react";
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';
import SearchBar from './ui/SearchBar';
import PasswordModal from './ui/PasswordModal';
import ErrorMessage from './ui/ErrorMessage';
import { useDisclosure } from '@chakra-ui/react';

export default function Auth({ initialSpaceId = '', initialSpaceName = '', initialStep = 'enterName' }) {
  const [spaceName, setSpaceName] = useState(initialSpaceName);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(initialStep);
  const [spaceExists, setSpaceExists] = useState(!!initialSpaceId);
  const [spaceId, setSpaceId] = useState(initialSpaceId);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef(null);
  const toast = useToast();
  const router = useRouter();
  
  const defaultToastOptions = {
    duration: 3000,
    isClosable: true,
    position: 'top-right',
    variant: 'subtle',
  };

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
      const generatedSpaceId = name.trim().toLowerCase().replace(/\s+/g, '-');
      setSpaceId(generatedSpaceId);
      
      const spacesRef = collection(db, 'spaces');
      const spaceRef = doc(spacesRef, generatedSpaceId);
      const spaceDoc = await getDoc(spaceRef);
      
      const exists = spaceDoc.exists();
      setSpaceExists(exists);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (exists) {
        setStep('enterPassword');
        toast({
          ...defaultToastOptions,
          title: 'Space found',
          description: `"${name}" exists. Enter password to join.`,
          status: 'info',
        });
      } else {
        setStep('createPassword');
        toast({
          ...defaultToastOptions,
          title: 'New space',
          description: `Creating "${name}". Set a password.`,
          status: 'info',
        });
      }
      
      setPassword(''); 
      onOpen();

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
      const spacesRef = collection(db, 'spaces');
      const spaceRef = doc(spacesRef, spaceId);
      const spaceDoc = await getDoc(spaceRef);
      
      if (spaceDoc.exists()) {
        setStep('enterName');
        throw new Error('This space name is already taken. Please try another name.');
      }
      
      const spaceData = {
        name: spaceName,
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const spaceDocRef = doc(spacesRef, spaceId);
      await setDoc(spaceDocRef, spaceData);
      
      console.log('Space created successfully with ID:', spaceId);
      
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
        if (spaceData.password === password) {
          toast({
            ...defaultToastOptions,
            title: 'Joined!',
            description: `Successfully joined "${spaceData.name}".`,
            status: 'success',
          });
          
          if (typeof window !== 'undefined') {
            const spaceToStore = {
              id: spaceId,
              name: spaceData.name,
              lastAccessed: new Date().toISOString()
            };
            console.log('Storing space data in localStorage:', spaceToStore);
            localStorage.setItem('codeshare_space', JSON.stringify(spaceToStore));
          }
          
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
        setStep('enterName');
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
    onClose();
  };

  return (
    <Box width="100%">
      <ScaleFade initialScale={0.9} in={true}>
        <Box width="100%" textAlign="center">
          <VStack spacing={6} align="center">
            <SearchBar
              ref={inputRef}
              spaceName={spaceName}
              onSpaceNameChange={setSpaceName}
              onSubmit={checkSpaceExists}
              isLoading={isLoading}
              isValidating={isValidating}
              isInputFocused={isInputFocused}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <ErrorMessage message={errorMessage} />
          </VStack>
        </Box>
      </ScaleFade>
      
      <PasswordModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setStep('enterName');
          setErrorMessage('');
        }}
        step={step}
        spaceName={spaceName}
        password={password}
        setPassword={setPassword}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onJoinSpace={handleJoinSpace}
        onCreateSpace={handleCreateSpace}
        onBack={handleBack}
      />
    </Box>
  );
}
      