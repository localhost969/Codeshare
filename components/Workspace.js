import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Flex, 
  useToast, 
  useColorModeValue
} from '@chakra-ui/react';
import { doc, setDoc, onSnapshot, collection, query, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';

// Import components
import CodeEditor from './CodeEditor';
import Sidebar from './Sidebar';
import CodeRunner from './CodeRunner';

// Import workspace sub-components
import WorkspaceHeader from './workspace/WorkspaceHeader';
import EditorPanel from './workspace/EditorPanel';
import NewSnippetModal from './workspace/NewSnippetModal';
import EditTitleModal from './workspace/EditTitleModal';
import DeleteConfirmModal from './workspace/DeleteConfirmModal';
import EmptyState from './workspace/EmptyState';
import BrowseView from './workspace/BrowseView';

const Workspace = ({ spaceId, spaceName, onSignOut }) => {
  // State management
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippetId, setSelectedSnippetId] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [currentView, setCurrentView] = useState('browse'); // Changed from 'empty' to 'browse'
  
  // Modal states
  const [isNewSnippetModalOpen, setIsNewSnippetModalOpen] = useState(false);
  const [isEditTitleModalOpen, setIsEditTitleModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  
  // Form states
  const [newSnippetTitle, setNewSnippetTitle] = useState('');
  const [editingSnippetId, setEditingSnippetId] = useState(null);
  const [editingSnippetTitle, setEditingSnippetTitle] = useState('');
  const [snippetToDelete, setSnippetToDelete] = useState(null);
  
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
        
        // Don't automatically select any snippet when user logs in
        // If a snippet is already selected, make sure it still exists
        if (selectedSnippetId) {
          const snippetExists = loadedSnippets.some(s => s.id === selectedSnippetId);
          if (!snippetExists) {
            setSelectedSnippetId(null);
            setCode('');
            setLanguage('javascript');
          }
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
  }, [spaceId, toast, selectedSnippetId]);

  // Load selected snippet when clicked
  const handleSelectSnippet = (snippetId) => {
    // Only load the snippet if it's different from the currently selected one
    if (snippetId !== selectedSnippetId) {
      setSelectedSnippetId(snippetId);
      
      // Find the snippet and load its code and language
      const selectedSnippet = snippets.find(s => s.id === snippetId);
      if (selectedSnippet) {
        setCode(selectedSnippet.code || '');
        setLanguage(selectedSnippet.language || 'javascript');
        setCurrentView('editor'); // Make sure we switch to editor view
      }
    } else {
      // If clicking the same snippet, still ensure we're in editor view
      setCurrentView('editor');
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
    
    // Only attempt language detection if current language is plaintext
    if (language === 'plaintext' && value.length > 10) {
      const detectedLanguage = detectLanguage(value);
      if (detectedLanguage) {
        setLanguage(detectedLanguage);
        
        // Update language in Firestore if we have a snippet selected
        if (selectedSnippetId) {
          const snippetRef = doc(db, 'spaces', spaceId, 'snippets', selectedSnippetId);
          setDoc(snippetRef, { language: detectedLanguage }, { merge: true });
        }
      }
    }
    
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

  // Add new language detection function
  const detectLanguage = (code) => {
    // Simple language detection based on common patterns
    const patterns = {
      javascript: /(const|let|var|function|\=>|console\.log)/,
      python: /(def|import|from|print|if __name__|#\s*coding:)/,
      html: /(<html|<!DOCTYPE html|<div|<body|<head)/i,
      css: /(@media|@import|{|}|\b(margin|padding|border|color):)/,
      java: /(public class|private|protected|package|import java)/,
      cpp: /(#include|using namespace|int main|void main|std::)/,
      php: /(<\?php|\$_GET|\$_POST|\$_SERVER|echo)/i,
      sql: /(SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM)/i
    };

    for (const [language, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) {
        return language;
      }
    }
    return null; // No language detected
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
      code: '', // Start with empty code
      language: 'plaintext', // Start with plaintext, will update when code is entered
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
      setCode('');
      setLanguage('plaintext');
      setCurrentView('editor'); // Immediately switch to editor view
      
      toast({
        title: "Snippet created",
        description: "Start typing to auto-detect language",
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

  const handleEditSnippetTitle = () => {
    if (!editingSnippetId || !editingSnippetTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your snippet",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      console.log('Updating snippet title:', editingSnippetId, 'to:', editingSnippetTitle);
      
      const snippetRef = doc(db, 'spaces', spaceId, 'snippets', editingSnippetId);
      setDoc(snippetRef, { 
        title: editingSnippetTitle,
        updatedAt: new Date().toISOString() 
      }, { merge: true });
      
      setIsEditTitleModalOpen(false);
      setEditingSnippetId(null);
      setEditingSnippetTitle('');
      
      toast({
        title: "Title updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating snippet title:', error);
      toast({
        title: "Error updating title",
        description: error.message || 'An unexpected error occurred',
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const openEditTitleModal = (snippetId) => {
    const snippet = snippets.find(s => s.id === snippetId);
    if (snippet) {
      setEditingSnippetId(snippetId);
      setEditingSnippetTitle(snippet.title);
      setIsEditTitleModalOpen(true);
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    // Open confirmation modal instead of deleting directly
    setSnippetToDelete(snippetId);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDeleteSnippet = async () => {
    if (!snippetToDelete) return;

    try {
      console.log('Deleting snippet:', snippetToDelete);
      
      const snippetsRef = collection(db, 'spaces', spaceId, 'snippets');
      const snippetRef = doc(snippetsRef, snippetToDelete);
      await deleteDoc(snippetRef);
      
      console.log('Snippet deleted successfully');
      
      if (selectedSnippetId === snippetToDelete) {
        const remainingSnippets = snippets.filter(s => s.id !== snippetToDelete);
        if (remainingSnippets.length > 0) {
          // Select the first available snippet
          const firstSnippet = remainingSnippets[0];
          setSelectedSnippetId(firstSnippet.id);
          setCode(firstSnippet.code || '');
          setLanguage(firstSnippet.language || 'javascript');
        } else {
          setSelectedSnippetId(null);
          setCode('');
          setLanguage('javascript');
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
    } finally {
      setIsDeleteConfirmModalOpen(false);
      setSnippetToDelete(null);
    }
  };

  const handleCloseEditor = () => {
    setSelectedSnippetId(null);
    setCode('');
    setLanguage('javascript');
    setCurrentView('browse'); // Changed from 'empty' to 'browse'
  };
  
  const handleOpenBrowseView = () => {
    setCurrentView('browse');
  };
  
  // Remove handleOpenEmptyState as it's no longer needed

  return (
    <Flex height="100vh" direction="column">
      {/* Main workspace layout */}
      <Flex flex="1" overflow="hidden">
        {/* Sidebar */}
        <Sidebar 
          snippets={snippets}
          selectedSnippetId={selectedSnippetId}
          onSelectSnippet={handleSelectSnippet}
          onAddSnippet={() => setIsNewSnippetModalOpen(true)}
          onDeleteSnippet={handleDeleteSnippet}
          onEditTitle={openEditTitleModal}
          spaceId={spaceId}
          spaceName={spaceName}
        />
        
        {/* Main content area */}
        <Flex flex="1" direction="column" overflow="hidden">
          {/* Header with workspace controls */}
          <WorkspaceHeader 
            title={selectedSnippetId ? snippets.find(s => s.id === selectedSnippetId)?.title : ''}
            hasActiveSnippet={!!selectedSnippetId}
            onCloseEditor={handleCloseEditor}
            onSignOut={onSignOut}
          />
          
          {/* Main content area: Editor or Browse View */}
          {currentView === 'editor' && selectedSnippetId ? (
            <EditorPanel 
              code={code}
              language={language}
              onChange={handleCodeChange}
              onLanguageChange={handleLanguageChange}
              lastEditedTime={snippets.find(s => s.id === selectedSnippetId)?.updatedAt}
            />
          ) : (
            <BrowseView 
              snippets={snippets} 
              onSelectSnippet={handleSelectSnippet}
              onAddSnippet={() => setIsNewSnippetModalOpen(true)}
              onEditTitle={openEditTitleModal}
              onDeleteSnippet={handleDeleteSnippet}
            />
          )}
        </Flex>
      </Flex>
      
      {/* Modals */}
      <NewSnippetModal 
        isOpen={isNewSnippetModalOpen}
        onClose={() => setIsNewSnippetModalOpen(false)}
        title={newSnippetTitle}
        onTitleChange={(e) => setNewSnippetTitle(e.target.value)}
        onSubmit={handleAddSnippet}
      />
      
      <EditTitleModal 
        isOpen={isEditTitleModalOpen}
        onClose={() => setIsEditTitleModalOpen(false)}
        title={editingSnippetTitle}
        onTitleChange={(e) => setEditingSnippetTitle(e.target.value)}
        onSubmit={handleEditSnippetTitle}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        onConfirm={confirmDeleteSnippet}
      />
    </Flex>
  );
};

export default Workspace;
