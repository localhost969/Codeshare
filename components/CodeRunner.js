import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  useColorModeValue,
  Spinner,
  Badge,
  Divider,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { FaPlay } from 'react-icons/fa';

// Mock function to simulate code execution
// In a production environment, you would use a real code execution API
const executeCode = async (code, language, input = '') => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock responses based on language
  switch (language) {
    case 'javascript':
      try {
        // For JavaScript, we can actually try to evaluate it (safely)
        // This is just for demo purposes - in production you'd use a sandboxed environment
        const result = new Function(`
          try {
            ${code}
            return { success: true, output: "Code executed successfully" };
          } catch (error) {
            return { success: false, output: error.toString() };
          }
        `)();
        return result;
      } catch (error) {
        return { success: false, output: error.toString() };
      }
    case 'python':
      return { success: true, output: "Python code execution simulated!\n\nOutput would appear here." };
    case 'java':
      return { success: true, output: "Java code compiled and executed!\n\nOutput would appear here." };
    case 'cpp':
      return { success: true, output: "C++ code compiled and executed!\n\nOutput would appear here." };
    default:
      return { success: true, output: `${language} code execution simulated!\n\nOutput would appear here.` };
  }
};

const CodeRunner = ({ code, language }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const outputBgColor = useColorModeValue('gray.50', 'gray.900');
  
  const handleRunCode = async () => {
    setIsRunning(true);
    setHasRun(true);
    
    try {
      const result = await executeCode(code, language, input);
      setOutput(result.output);
      setIsSuccess(result.success);
    } catch (error) {
      setOutput(error.toString());
      setIsSuccess(false);
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleClearOutput = () => {
    setOutput('');
    setHasRun(false);
  };
  
  return (
    <Box 
      mt={4} 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
    >
      <Flex 
        p={3} 
        bg="gray.100" 
        borderBottomWidth="1px" 
        justify="space-between" 
        align="center"
      >
        <Text fontWeight="bold">Code Runner</Text>
        <Flex>
          <Button
            colorScheme="teal"
            size="sm"
            leftIcon={<FaPlay />}
            onClick={handleRunCode}
            isLoading={isRunning}
            loadingText="Running"
            mr={2}
          >
            Run Code
          </Button>
          {hasRun && (
            <Tooltip label="Clear output">
              <IconButton
                icon={<DeleteIcon />}
                size="sm"
                onClick={handleClearOutput}
                aria-label="Clear output"
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>
      
      {/* Standard Input */}
      <Box p={3} borderBottomWidth="1px">
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Standard Input (optional)
        </Text>
        <Textarea
          placeholder="Enter input for your program here..."
          size="sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isRunning}
          rows={3}
        />
      </Box>
      
      {/* Output */}
      <Box p={3}>
        <Flex align="center" mb={2}>
          <Text fontSize="sm" fontWeight="medium" mr={2}>
            Output
          </Text>
          {hasRun && (
            <Badge colorScheme={isSuccess ? "green" : "red"}>
              {isSuccess ? "Success" : "Error"}
            </Badge>
          )}
        </Flex>
        
        {isRunning ? (
          <Flex justify="center" align="center" h="150px">
            <Spinner size="md" mr={3} />
            <Text>Running code...</Text>
          </Flex>
        ) : (
          <Box
            p={3}
            bg={outputBgColor}
            borderRadius="md"
            minH="150px"
            fontFamily="mono"
            fontSize="sm"
            whiteSpace="pre-wrap"
            overflowY="auto"
          >
            {output || "Run your code to see output here"}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CodeRunner;
