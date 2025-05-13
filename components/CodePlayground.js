import React, { useState } from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import CodeEditor from './CodeEditor';
import CodeRunner from './CodeRunner';

const CodePlayground = () => {
  const [code, setCode] = useState('// Write your code here\nconsole.log("Hello, world!");');
  const [language, setLanguage] = useState('javascript');
  
  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };
  
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };
  
  const handleRun = () => {
    // No need to do anything here - the code and language state
    // are already passed to the CodeRunner component
  };
  
  return (
    <Flex direction="column" w="100%">
      <CodeEditor 
        value={code}
        onChange={handleCodeChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        height="400px"
        showLineNumbers={true}
        onSave={(savedCode) => setCode(savedCode)}
      />
      
      <CodeRunner code={code} language={language} />
    </Flex>
  );
};

export default CodePlayground;
