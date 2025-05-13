import React from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import CodeEditor from '../CodeEditor';
import CodeRunner from '../CodeRunner';

const EditorPanel = ({ code, language, onChange, onLanguageChange, lastEditedTime }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  
  return (
    <Box 
      flex="1" 
      p={4} 
      overflowY="auto" 
      bg={bgColor}
    >
      <Tabs 
        variant="soft-rounded" 
        colorScheme="teal" 
        size="md" 
        isFitted
        isLazy
      >
        <TabList mb={4}>
          <Tab 
            fontWeight="medium" 
            _selected={{ 
              color: 'teal.500', 
              bg: useColorModeValue('teal.50', 'rgba(48, 140, 122, 0.3)'),
              fontWeight: 'bold'
            }}
          >
            Code Editor
          </Tab>
          <Tab 
            fontWeight="medium"
            _selected={{ 
              color: 'teal.500', 
              bg: useColorModeValue('teal.50', 'rgba(48, 140, 122, 0.3)'),
              fontWeight: 'bold'
            }}
          >
            Run Code
          </Tab>
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
              <CodeRunner code={code} language={language} />
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default EditorPanel;
