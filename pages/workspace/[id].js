import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Center, Spinner, Text, useToast } from '@chakra-ui/react';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Workspace from '../../components/Workspace';

export default function WorkspacePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [spaceData, setSpaceData] = useState(null);
  const router = useRouter();
  const toast = useToast();
  const { id, name } = router.query;

  useEffect(() => {
    const checkAuth = async () => {
      if (!id) return; // Wait for router query to be available
      
      try {
        console.log('Checking authentication for space:', id);
        
        // Check if we have access in localStorage first
        const storedSpace = typeof window !== 'undefined' ? localStorage.getItem('codeshare_space') : null;
        let storedSpaceData = null;
        
        if (storedSpace) {
          try {
            storedSpaceData = JSON.parse(storedSpace);
            console.log('Found stored space data:', storedSpaceData);
          } catch (e) {
            console.error('Error parsing stored space data:', e);
          }
        }
        
        // Verify this is the same space we have access to
        if (!storedSpaceData || storedSpaceData.id !== id) {
          console.log('No stored access for this space, redirecting to login');
          toast({
            title: 'Authentication required',
            description: 'Please login to access this workspace',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
          router.push('/');
          return;
        }
        
        // Check if the space exists
        const spacesRef = collection(db, 'spaces');
        const spaceRef = doc(spacesRef, id);
        const spaceDoc = await getDoc(spaceRef);
        
        if (!spaceDoc.exists()) {
          console.error('Space not found:', id);
          toast({
            title: 'Space not found',
            description: 'No space exists with that name',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          // Clear the invalid localStorage data
          localStorage.removeItem('codeshare_space');
          router.push('/');
          return;
        }
        
        console.log('Authentication successful for space:', id);
        
        // If we got here, we're authenticated
        setSpaceData(spaceDoc.data());
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast({
          title: 'Error',
          description: error.message || 'An unexpected error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        router.push('/');
      }
    };
    
    if (typeof window !== 'undefined') {
      checkAuth();
    }
  }, [id, router, toast]);

  const handleSignOut = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Spinner size="xl" mb={4} color="teal.500" />
          <Text>Loading workspace...</Text>
        </Box>
      </Center>
    );
  }

  if (!isAuthenticated) {
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Text>Authentication required</Text>
        </Box>
      </Center>
    );
  }

  return (
    <Workspace 
      spaceId={id} 
      spaceName={spaceData?.name || name} 
      onSignOut={handleSignOut} 
    />
  );
}
