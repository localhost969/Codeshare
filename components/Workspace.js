import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  Input, 
  Button, 
  useToast, 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue
} from '@chakra-ui/react';
import { doc, setDoc, onSnapshot, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import CodeEditor from './CodeEditor';
import Sidebar from './Sidebar';
import CodeRunner from './CodeRunner';
import UserPresence from './UserPresence';


const Workspace = ({ spaceId, spaceName, onSignOut }) => {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isNewSnippetModalOpen, setIsNewSnippetModalOpen] = useState(false);
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [activeUsers, setActiveUsers] = useState(1); // Static value since websockets removed
  const toast = useToast();

  // Real-time collaboration removed (websockets)

  // Load snippets from Firestore
  useEffect(() => {
    if (!spaceId) return;
    
    try {
      console.log('Loading snippets for space:', spaceId);
      
      const snippetsRef = collection(db, 'spaces', spaceId, 'snippets');
      const q = query(snippetsRef);
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const loadedSnippets = [];
        querySnapshot.forEach((doc) => {
          loadedSnippets.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(`Loaded ${loadedSnippets.length} snippets`);
        setSnippets(loadedSnippets);
        
        // Select the first snippet if none is selected
        if (loadedSnippets.length > 0 && !selectedSnippetId) {
          setSelectedSnippetId(loadedSnippets[0].id);
          setCode(loadedSnippets[0].code || '');
          setLanguage(loadedSnippets[0].language || 'javascript');
        }
      }, (error) => {
        console.error('Error loading snippets:', error);
        toast({
          title: 'Error loading snippets',
          description: error.message || 'An unexpected error occurred',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up snippets listener:', error);
      toast({
        title: 'Error loading snippets',
        description: error.message || 'An unexpected error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [spaceId, toast]);

  // Load selected snippet
  useEffect(() => {
    if (selectedSnippetId) {
      const selectedSnippet = snippets.find(s => s.id === selectedSnippetId);
      if (selectedSnippet) {
        setCode(selectedSnippet.code);
        setLanguage(selectedSnippet.language);
      }
    }
  }, [selectedSnippetId, snippets]);

  const handleCodeChange = (value) => {
    setCode(value);
    
    // Save to Firestore (debounced in a real app)
    if (selectedSnippetId) {
      try {
        const snippetsRef = collection(db, 'spaces', spaceId, 'snippets');
        const snippetRef = doc(snippetsRef, selectedSnippetId);
        
        // Update with merge to only change the code field
        setDoc(snippetRef, { 
          code: value, 
          language,
          updatedAt: new Date().toISOString() 
        }, { merge: true });
        
        // Real-time updates to other users removed (websockets)
      } catch (error) {
        console.error('Error saving code change:', error);
        toast({
          title: "Error saving changes",
          description: error.message || 'An unexpected error occurred',
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Save to Firestore
    if (selectedSnippetId) {
      const snippetRef = doc(db, 'spaces', spaceId, 'snippets', selectedSnippetId);
      setDoc(snippetRef, { language: newLanguage }, { merge: true });
      
      // Real-time updates to other users removed (websockets)
    }
  };

  const handleAddSnippet = async () => {
    if (!newSnippetTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your snippet",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const newSnippetId = uuidv4();
    const newSnippet = {
      id: newSnippetId,
      title: newSnippetTitle,
      code: '// Start coding here',
      language: 'javascript',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      console.log('Creating new snippet:', newSnippetTitle, 'for space:', spaceId);
      
      // Use a more explicit approach to create the document
      const snippetsRef = collection(db, 'spaces', spaceId, 'snippets');
      const snippetDocRef = doc(snippetsRef, newSnippetId);
      await setDoc(snippetDocRef, newSnippet);
      
      console.log('Snippet created successfully with ID:', newSnippetId);
      
      setNewSnippetTitle('');
      setIsNewSnippetModalOpen(false);
      setSelectedSnippetId(newSnippetId);
      
      toast({
        title: "Snippet created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating snippet:', error);
      toast({
        title: "Error creating snippet",
        description: error.message || 'An unexpected error occurred',
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    try {
      console.log('Deleting snippet:', snippetId);
      
      const snippetsRef = collection(db, 'spaces', spaceId, 'snippets');
      const snippetRef = doc(snippetsRef, snippetId);
      await deleteDoc(snippetRef);
      
      console.log('Snippet deleted successfully');
      
      if (selectedSnippetId === snippetId) {
        const remainingSnippets = snippets.filter(s => s.id !== snippetId);
        if (remainingSnippets.length > 0) {
          setSelectedSnippetId(remainingSnippets[0].id);
        } else {
          setSelectedSnippetId(null);
          setCode('');
        }
      }
      
      toast({
        title: "Snippet deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting snippet:', error);
      toast({
        title: "Error deleting snippet",
        description: error.message || 'An unexpected error occurred',
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex height="100vh">
      <Sidebar 
        snippets={snippets}
        selectedSnippetId={selectedSnippetId}
        onSelectSnippet={setSelectedSnippetId}
        onAddSnippet={() => setIsNewSnippetModalOpen(true)}
        onDeleteSnippet={handleDeleteSnippet}
        spaceId={spaceId}
        spaceName={spaceName}
      />
      
      <Box flex="1" p={4} overflowY="auto">
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="lg" fontWeight="bold">
            {selectedSnippetId ? snippets.find(s => s.id === selectedSnippetId)?.title : 'No snippet selected'}
          </Text>
          <Flex align="center">
            <UserPresence activeUsers={activeUsers} />
            <Button colorScheme="red" size="sm" onClick={onSignOut} ml={3}>
              Exit Space
            </Button>
          </Flex>
        </Flex>
        
        {selectedSnippetId ? (
          <Tabs variant="soft-rounded" colorScheme="teal">
            <TabList>
              <Tab>Code Editor</Tab>
              <Tab>Run Code</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0} pt={4}>
                <CodeEditor 
                  value={code} 
                  onChange={handleCodeChange} 
                  language={language}
                  onLanguageChange={handleLanguageChange}
                />
              </TabPanel>
              <TabPanel px={0} pt={4}>
                <Box mb={4}>
                  <CodeEditor 
                    value={code} 
                    onChange={handleCodeChange} 
                    language={language}
                    onLanguageChange={handleLanguageChange}
                  />
                </Box>
                <CodeRunner code={code} language={language} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        ) : (
          <Box 
            height="300px" 
            borderWidth="1px" 
            borderRadius="lg" 
            display="flex" 
            justifyContent="center" 
            alignItems="center"
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <Text color="gray.500">
              Select a snippet or create a new one to start coding
            </Text>
          </Box>
        )}
      </Box>
      
      {/* New Snippet Modal */}
      <Modal isOpen={isNewSnippetModalOpen} onClose={() => setIsNewSnippetModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Snippet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Snippet Title</FormLabel>
              <Input 
                value={newSnippetTitle} 
                onChange={(e) => setNewSnippetTitle(e.target.value)}
                placeholder="Enter a title for your snippet"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsNewSnippetModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddSnippet}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Workspace;
