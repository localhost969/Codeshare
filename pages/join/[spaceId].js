import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Auth from '../../components/Auth';
import { Spinner, Flex, Box } from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const JoinWorkspacePage = () => {
  const router = useRouter();
  const { spaceId } = router.query;
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [spaceName, setSpaceName] = useState('');
  const [isLoadingSpace, setIsLoadingSpace] = useState(true);
  
  useEffect(() => {
    // Check if user already has access to this workspace
    if (spaceId) {
      const checkAccess = async () => {
        try {
          // Check if user already has access
          const hasAccess = localStorage.getItem(`workspace_access_${spaceId}`);
          
          if (hasAccess === 'granted') {
            // User already has access, redirect to workspace
            router.push(`/workspace/${spaceId}`);
            return;
          }
          
          // Fetch space details to get the name
          const spaceRef = doc(db, 'spaces', spaceId);
          const spaceDoc = await getDoc(spaceRef);
          
          if (spaceDoc.exists()) {
            setSpaceName(spaceDoc.data().name || '');
          }
          
          setIsLoadingSpace(false);
          setIsCheckingAccess(false);
        } catch (error) {
          console.error('Error checking workspace access:', error);
          setIsLoadingSpace(false);
          setIsCheckingAccess(false);
        }
      };
      
      checkAccess();
    }
  }, [spaceId, router]);
  
  if (!spaceId || isCheckingAccess || isLoadingSpace) {
    return (
      <Flex height="100vh" align="center" justify="center">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }
  
  // Pass the spaceId and spaceName to Auth component
  // The Auth component will handle the password verification
  return (
    <Box maxW="md" mx="auto" mt={8}>
      <Auth initialSpaceId={spaceId} initialSpaceName={spaceName} initialStep="enterPassword" />
    </Box>
  );
};

export default JoinWorkspacePage;
