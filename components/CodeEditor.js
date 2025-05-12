import React, { useEffect, useState } from 'react';
import { Box, Select, Text } from '@chakra-ui/react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';

const languageMap = {
  javascript: javascript(),
  python: python(),
  html: html(),
  css: css(),
  java: java(),
  cpp: cpp(),
  php: php(),
};

const CodeEditor = ({ 
  value, 
  onChange, 
  language = 'javascript', 
  onLanguageChange,
  readOnly = false 
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <Box width="100%" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p={2} bg="gray.100" borderBottomWidth="1px" display="flex" justifyContent="space-between" alignItems="center">
        <Text fontWeight="bold">Code Editor</Text>
        <Select 
          value={selectedLanguage} 
          onChange={handleLanguageChange} 
          width="150px" 
          size="sm"
          isDisabled={readOnly}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="php">PHP</option>
        </Select>
      </Box>
      <CodeMirror
        value={value}
        height="300px"
        extensions={[languageMap[selectedLanguage]]}
        onChange={onChange}
        readOnly={readOnly}
        theme="dark"
      />
    </Box>
  );
};

export default CodeEditor;
