import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  useColorMode,
  Flex
} from '@chakra-ui/react';
import CodeEditor from '../CodeEditor';
// ...removed CodeRunner import...

const EditorPanel = ({ code, language, onChange, onLanguageChange, lastEditedTime }) => {
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  
  // Enhanced dark mode styling
  const editorBg = useColorModeValue('white', 'gray.800');
  const editorBorderColor = useColorModeValue('gray.200', 'gray.700');
  const customEditorStyles = colorMode === 'dark' ? {
    bg: 'gray.800',
    borderRadius: 'md',
    borderWidth: '1px',
    borderColor: 'gray.700',
    boxShadow: 'dark-lg',
    backgroundImage: 'linear-gradient(to bottom, rgba(66, 153, 225, 0.05), rgba(49, 151, 149, 0.05))',
  } : {};

  return (
    <Box 
      flex="1" 
      p={4} 
      overflowY="auto" 
      bg={editorBg}
      {...customEditorStyles}
      transition="all 0.3s ease"
    >
      <Tabs 
        variant="soft-rounded" 
        colorScheme="teal" 
        size="md" 
        isFitted
        isLazy
        borderRadius="lg"
        overflow="hidden"
      >
        <TabList mb={4}>
          
          
        </TabList>
        
        <TabPanels>
          <TabPanel px={0} pt={2}>
            <Flex direction="column" h="full">
              <CodeEditor 
                value={code} 
                onChange={onChange} 
                language={language}
                onLanguageChange={onLanguageChange}
                lastEditedTime={lastEditedTime}
                height="calc(100vh - 180px)"
                showLineNumbers={true}
                fontSize={14}
              />
            </Flex>
          </TabPanel>
          
          <TabPanel px={0} pt={2}>
            <Flex direction="column" h="full">
              <Box mb={4}>
                <CodeEditor 
                  value={code} 
                  onChange={onChange} 
                  language={language}
                  onLanguageChange={onLanguageChange}
                  lastEditedTime={lastEditedTime}
                  height="40vh"
                />
              </Box>
              {/* CodeRunner component removed */}
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EditorPanel;
