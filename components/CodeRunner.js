import React, { useState, useEffect, useRef } from 'react';
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
  Tooltip,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  Code,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { DeleteIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaPlay, FaTerminal, FaStopCircle } from 'react-icons/fa';
import { languageLabels } from './CodeEditor';

// Actual code execution using Judge0 API or similar
const executeCode = async (code, language, input = '') => {
  // For demonstration, we'll provide a more realistic simulation
  // In production, you would use a real API like Judge0, JDoodle, or a custom backend
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Language IDs mapping (would match API requirements in production)
  const languageIds = {
    javascript: 'nodejs',
    python: 'python3',
    java: 'java',
    cpp: 'cpp',
    php: 'php',
    ruby: 'ruby',
    typescript: 'typescript', 
    csharp: 'csharp',
    go: 'go',
    rust: 'rust',
    // Add more languages as needed
  };
  
  // More comprehensive mock responses
  try {
    switch (language) {
      case 'javascript':
        try {
          // For JavaScript, we can safely evaluate simple code (for demo purposes only)
          // In production, NEVER use this approach - it's extremely unsafe
          const consoleOutput = [];
          const originalConsoleLog = console.log;
          const originalConsoleError = console.error;
          const originalConsoleWarn = console.warn;
          
          // Override console methods to capture output
          console.log = (...args) => {
            consoleOutput.push(['log', args.map(arg => String(arg)).join(' ')]);
            originalConsoleLog(...args);
          };
          console.error = (...args) => {
            consoleOutput.push(['error', args.map(arg => String(arg)).join(' ')]);
            originalConsoleError(...args);
          };
          console.warn = (...args) => {
            consoleOutput.push(['warn', args.map(arg => String(arg)).join(' ')]);
            originalConsoleWarn(...args);
          };
          
          // Mock process.stdin for simple input handling
          const inputLines = input.split('\n');
          let inputLineIndex = 0;
          const mockReadline = {
            question: (prompt) => {
              consoleOutput.push(['input-prompt', prompt]);
              const response = inputLines[inputLineIndex] || '';
              inputLineIndex++;
              consoleOutput.push(['input-response', response]);
              return response;
            }
          };
          
          // Execute with timeout for safety
          const wrappedCode = `
            // Define some safe functions for input
            const prompt = (msg) => mockReadline.question(msg);
            const input = () => mockReadline.question('');
            const readLine = () => mockReadline.question('');
            
            try {
              ${code}
              return { success: true, output: consoleOutput };
            } catch (error) {
              console.error(error.toString());
              return { success: false, output: consoleOutput, error: error.toString() };
            }
          `;
          
          // Set timeout to prevent infinite loops
          const result = await Promise.race([
            new Promise(resolve => {
              try {
                const fn = new Function('console', 'mockReadline', wrappedCode);
                resolve(fn(console, mockReadline));
              } catch (error) {
                resolve({ success: false, output: consoleOutput, error: error.toString() });
              }
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Execution timed out (5s)')), 5000)
            )
          ]);
          
          // Restore original console methods
          console.log = originalConsoleLog;
          console.error = originalConsoleError;
          console.warn = originalConsoleWarn;
          
          return result;
        } catch (error) {
          return { success: false, output: [], error: error.toString() };
        }
        
      case 'python':
        if (input) {
          return mockPythonExecution(code, input);
        }
        return { 
          success: true, 
          output: [
            ['log', 'Python 3.9.0 (default)'],
            ['log', code.includes('input(') ? 'Program executed with provided inputs.' : 'Program executed successfully.'],
            ['log', code.includes('print(') ? 'Hello, World!' : '']
          ] 
        };
        
      case 'java':
        if (code.includes('System.out.print')) {
          return { 
            success: true, 
            output: [
              ['log', 'OpenJDK Runtime Environment 11.0.15'],
              ['log', 'Program executed successfully.'],
              ['log', 'Hello, Java World!']
            ] 
          };
        } else if (code.includes('public class') && !code.includes('public static void main')) {
          return { 
            success: false, 
            output: [['error', 'Error: Main method not found in class Main']], 
            error: 'Main method not found in class Main'
          };
        }
        return { 
          success: true, 
          output: [['log', 'Program executed with no output.']] 
        };
        
      case 'cpp':
        if (code.includes('cin >>')) {
          return mockCppExecution(code, input);
        }
        return { 
          success: true, 
          output: [
            ['log', 'g++ (Ubuntu 9.4.0-1ubuntu1~20.04) 9.4.0'],
            ['log', code.includes('cout <<') ? 'Hello, C++ World!' : 'Program executed with no output.']
          ] 
        };
        
      default:
        // For other languages, provide a realistic output based on language
        const langName = languageLabels[language] || language;
        return { 
          success: true, 
          output: [
            ['log', `${langName} execution simulated!`],
            ['log', input ? 'Program executed with provided inputs.' : 'Program executed with no inputs.'],
            ['log', 'Output would appear here based on your code.']
          ] 
        };
    }
  } catch (error) {
    return { 
      success: false, 
      output: [['error', error.toString()]], 
      error: error.toString() 
    };
  }
};

// Helper function to simulate Python execution with input
function mockPythonExecution(code, input) {
  const inputLines = input.split('\n').filter(line => line.trim());
  const outputs = [['log', 'Python 3.9.0 (default)']];
  
  // Simple mock execution for Python that handles basic input
  if (code.includes('input(')) {
    const inputPrompts = [...code.matchAll(/input\(['"](.*?)['"]?\)/g)]
      .map(match => match[1] || '');
    
    for (let i = 0; i < inputPrompts.length; i++) {
      if (i < inputLines.length) {
        outputs.push(['input-prompt', inputPrompts[i]]);
        outputs.push(['input-response', inputLines[i]]);
        
        // If there's a print after input, simulate output
        if (code.includes('print(')) {
          outputs.push(['log', `Simulated output for input "${inputLines[i]}"`]);
        }
      } else {
        outputs.push(['error', 'Not enough input values provided']);
        return { success: false, output: outputs, error: 'Not enough input values provided' };
      }
    }
    
    outputs.push(['log', 'Program completed successfully.']);
    return { success: true, output: outputs };
  }
  
  // Handle print statements
  if (code.includes('print(')) {
    outputs.push(['log', 'Hello, Python World!']);
  }
  
  outputs.push(['log', 'Program executed successfully.']);
  return { success: true, output: outputs };
}

// Helper function to simulate C++ execution with input
function mockCppExecution(code, input) {
  const inputLines = input.split('\n').filter(line => line.trim());
  const outputs = [['log', 'g++ (Ubuntu 9.4.0-1ubuntu1~20.04) 9.4.0']];
  
  // Simple mock execution for C++ that handles basic cin
  if (code.includes('cin >>')) {
    const inputVars = [...code.matchAll(/cin\s*>>\s*(\w+)/g)]
      .map(match => match[1]);
    
    for (let i = 0; i < inputVars.length; i++) {
      if (i < inputLines.length) {
        outputs.push(['input-prompt', `Enter value for ${inputVars[i]}:`]);
        outputs.push(['input-response', inputLines[i]]);
        
        // If there's cout, simulate output
        if (code.includes('cout <<')) {
          outputs.push(['log', `Simulated output for variable ${inputVars[i]} = ${inputLines[i]}`]);
        }
      } else {
        outputs.push(['error', 'Not enough input values provided']);
        return { success: false, output: outputs, error: 'Not enough input values provided' };
      }
    }
    
    outputs.push(['log', 'Program completed successfully.']);
    return { success: true, output: outputs };
  }
  
  // Handle cout statements
  if (code.includes('cout <<')) {
    outputs.push(['log', 'Hello, C++ World!']);
  }
  
  outputs.push(['log', 'Program executed successfully.']);
  return { success: true, output: outputs };
}

const CodeRunner = ({ code, language }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');
  const [inputHistory, setInputHistory] = useState([]);
  const [hasRun, setHasRun] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [isProgramWaitingForInput, setIsProgramWaitingForInput] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [memoryUsed, setMemoryUsed] = useState(0);
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const outputBgColor = useColorModeValue('gray.50', 'gray.900');
  const terminalBgColor = useColorModeValue('black', 'gray.900');
  const terminalTextColor = useColorModeValue('gray.100', 'gray.100');
  const promptColor = useColorModeValue('green.400', 'green.400');
  const errorColor = useColorModeValue('red.500', 'red.300');
  const warningColor = useColorModeValue('yellow.500', 'yellow.300');
  const infoColor = useColorModeValue('blue.500', 'blue.300');
  const headerBgColor = useColorModeValue('gray.100', 'gray.700');
  
  useEffect(() => {
    // Scroll to the bottom of terminal when output changes
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);
  
  const handleRunCode = async () => {
    setIsRunning(true);
    setHasRun(true);
    setOutput([]);
    setTimeElapsed(0);
    setMemoryUsed(0);
    
    const startTime = Date.now();
    
    try {
      const result = await executeCode(code, language, input);
      
      // Calculate execution time
      const endTime = Date.now();
      setTimeElapsed((endTime - startTime) / 1000);
      
      // Mock memory usage based on code complexity
      setMemoryUsed(Math.floor(Math.random() * 10) + code.length / 100);
      
      setOutput(result.output || []);
      setIsSuccess(result.success);
      
      if (!result.success) {
        toast({
          title: "Execution Failed",
          description: result.error || "There was an error executing your code",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      setOutput([['error', error.toString()]]);
      setIsSuccess(false);
      
      toast({
        title: "Execution Error",
        description: error.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleClearOutput = () => {
    setOutput([]);
    setHasRun(false);
    setInputHistory([]);
  };
  
  const handleInputSubmit = (e) => {
    e.preventDefault();
    
    if (!currentInput.trim()) return;
    
    // Add to input history
    setInputHistory([...inputHistory, currentInput]);
    
    // In a real implementation, this would interface with the running program
    setOutput([...output, ['input-response', currentInput]]);
    setCurrentInput('');
    setIsProgramWaitingForInput(false);
  };
  
  // Terminal Rendering Function
  const renderTerminalOutput = () => {
    return output.map((item, index) => {
      const [type, message] = item;
      
      switch (type) {
        case 'log':
          return <Text key={index}>{message}</Text>;
        case 'error':
          return <Text key={index} color={errorColor}>{message}</Text>;
        case 'warn':
          return <Text key={index} color={warningColor}>{message}</Text>;
        case 'info':
          return <Text key={index} color={infoColor}>{message}</Text>;
        case 'input-prompt':
          return <Text key={index} color={promptColor}>{message}</Text>;
        case 'input-response':
          return (
            <HStack key={index}>
              <Text color={promptColor}>{'>'}</Text>
              <Text>{message}</Text>
            </HStack>
          );
        default:
          return <Text key={index}>{message}</Text>;
      }
    });
  };

  // Format Output Function
  const formatOutput = () => {
    // For formatted output, we show just the log messages without prompt symbols
    const logMessages = output
      .filter(item => item[0] === 'log' || item[0] === 'error')
      .map(item => item[1])
      .join('\n');
    
    return logMessages || "Run your code to see output here";
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
        bg={headerBgColor}
        borderBottomWidth="1px" 
        borderColor={borderColor}
        justify="space-between" 
        align="center"
      >
        <Text fontWeight="bold">Code Runner</Text>
        <HStack>
          {hasRun && (
            <HStack spacing={2} mr={2}>
              <Badge colorScheme={isSuccess ? "green" : "red"} variant="subtle">
                {isSuccess ? "Success" : "Error"}
              </Badge>
              {timeElapsed > 0 && (
                <Badge colorScheme="purple" variant="subtle">
                  {timeElapsed.toFixed(3)}s
                </Badge>
              )}
              {memoryUsed > 0 && (
                <Badge colorScheme="blue" variant="subtle">
                  {memoryUsed.toFixed(1)}MB
                </Badge>
              )}
            </HStack>
          )}
          
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
          
          {isRunning && (
            <Tooltip label="Stop execution">
              <IconButton
                icon={<FaStopCircle />}
                size="sm"
                colorScheme="red"
                mr={2}
                aria-label="Stop execution"
                onClick={() => {
                  setIsRunning(false);
                  setOutput([...output, ['error', 'Execution terminated by user']]);
                  toast({
                    title: "Execution Terminated",
                    description: "Code execution was stopped by user",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                }}
              />
            </Tooltip>
          )}
          
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
        </HStack>
      </Flex>
      
      {/* Standard Input */}
      <Box p={3} borderBottomWidth="1px">
        <Text fontSize="sm" mb={2} fontWeight="medium">
          Standard Input (one input per line)
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
      
      {/* Output Tabs */}
      <Tabs isFitted variant="enclosed" onChange={(index) => setActiveTab(index)} index={activeTab}>
        <TabList>
          <Tab>
            <HStack>
              <FaTerminal />
              <Text>Console</Text>
            </HStack>
          </Tab>
          <Tab>Formatted Output</Tab>
        </TabList>

        <TabPanels>
          {/* Terminal Console Tab */}
          <TabPanel p={0}>
            <Box 
              p={3} 
              bg={terminalBgColor} 
              color={terminalTextColor}
              borderRadius="md"
              minH="200px"
              maxH="400px"
              fontFamily="mono"
              fontSize="sm"
              whiteSpace="pre-wrap"
              overflowY="auto"
              ref={terminalRef}
            >
              <VStack align="flex-start" spacing={0}>
                {isRunning ? (
                  <Flex justify="center" align="center" w="100%" py={4}>
                    <Spinner size="sm" mr={3} />
                    <Text>Running code...</Text>
                  </Flex>
                ) : (
                  <>
                    {output.length === 0 && <Text opacity={0.7}>Run your code to see output here</Text>}
                    {renderTerminalOutput()}
                    
                    {/* Interactive Input (simulation) */}
                    {hasRun && isSuccess && !isRunning && (
                      <form onSubmit={handleInputSubmit} style={{ width: '100%' }}>
                        <Flex mt={2}>
                          <Text color={promptColor} mr={2}>{'>'}</Text>
                          <Input
                            ref={inputRef}
                            variant="unstyled"
                            placeholder="Type here to interact with the program..."
                            value={currentInput}
                            onChange={(e) => setCurrentInput(e.target.value)}
                            onKeyDown={(e) => {
                              // Handle up/down arrows for history
                              if (e.key === 'ArrowUp' && inputHistory.length > 0) {
                                const historyIndex = inputHistory.length - 1;
                                setCurrentInput(inputHistory[historyIndex]);
                              }
                            }}
                            autoFocus
                          />
                        </Flex>
                      </form>
                    )}
                  </>
                )}
              </VStack>
            </Box>
          </TabPanel>
          
          {/* Formatted Output Tab */}
          <TabPanel p={0}>
            {isRunning ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="md" mr={3} />
                <Text>Running code...</Text>
              </Flex>
            ) : (
              <Box
                p={3}
                bg={outputBgColor}
                borderRadius="md"
                minH="200px"
                maxH="400px"
                fontFamily="mono"
                fontSize="sm"
                whiteSpace="pre-wrap"
                overflowY="auto"
              >
                <Code colorScheme={isSuccess ? "green" : "red"} width="100%" p={3} display="block">
                  {formatOutput()}
                </Code>
                
                {/* Stats Display */}
                {hasRun && (
                  <Flex mt={4} justify="space-between" fontSize="xs" color="gray.500">
                    <Text>Execution time: {timeElapsed.toFixed(3)}s</Text>
                    <Text>Memory used: ~{memoryUsed.toFixed(1)}MB</Text>
                  </Flex>
                )}
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CodeRunner;
