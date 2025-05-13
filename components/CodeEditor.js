import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Select, 
  Text, 
  Flex, 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuButton, 
  MenuList, 
  MenuItem, 
  Button, 
  useColorMode, 
  HStack, 
  Input, 
  InputGroup, 
  InputRightElement, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  Badge,
  Kbd
} from '@chakra-ui/react';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { EditorSelection } from '@codemirror/state';
import { searchKeymap } from '@codemirror/search';

// Languages
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import { sql } from '@codemirror/lang-sql';

// Themes
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight, githubDark } from '@uiw/codemirror-theme-github';
import { materialDark, materialLight } from '@uiw/codemirror-theme-material';
import { nord } from '@uiw/codemirror-theme-nord';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { solarizedLight, solarizedDark } from '@uiw/codemirror-theme-solarized';

// Icons
import { FaSearch, FaUndo, FaRedo, FaCog, FaDownload, FaUpload, FaPlay, FaClipboard, FaExpand, FaCompress } from 'react-icons/fa';

const languageMap = {
  javascript: javascript({ jsx: true }),
  typescript: javascript({ jsx: true, typescript: true }),
  python: python(),
  html: html(),
  css: css(),
  java: java(),
  cpp: cpp(),
  php: php(),
  sql: sql(),
};

const themeMap = {
  'vscode-dark': vscodeDark,
  'github-light': githubLight,
  'github-dark': githubDark,
  'material-dark': materialDark,
  'material-light': materialLight,
  'nord': nord,
  'okaidia': okaidia,
  'dracula': dracula,
  'solarized-light': solarizedLight,
  'solarized-dark': solarizedDark,
};

// Move languageLabels to a shared constants file or export it
export const languageLabels = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  html: 'HTML',
  css: 'CSS',
  java: 'Java',
  cpp: 'C++',
  php: 'PHP',
  sql: 'SQL',
};

const detectLanguage = (content) => {
  // Common file signatures
  const signatures = {
    javascript: [
      /^(import|export|const|let|var|function)/m,
      /\breturn\b/,
      /\bconsole\.(log|error|warn)\b/
    ],
    typescript: [
      /^(interface|type|enum)\s+\w+/m,
      /:\s*(string|number|boolean|any)\b/,
      /^import.*from/m
    ],
    python: [
      /^(def|class|import|from)\s+/m,
      /^if\s+__name__\s*==\s*(['"])__main__\1/m,
      /print\s*\(/
    ],
    html: [
      /<!DOCTYPE\s+html>/i,
      /<html[>\s]/i,
      /<(head|body|div|span)[>\s]/
    ],
    css: [
      /^[\w\s\.-]+\s*{/m,
      /@media\s+/,
      /\b(margin|padding|border|background)\s*:/
    ],
    java: [
      /public\s+class\s+\w+/,
      /public\s+static\s+void\s+main/,
      /System\.(out|in)\./
    ],
    sql: [
      /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP)\b/i,
      /\bFROM\s+\w+\b/i,
      /\bWHERE\b/i
    ]
  };

  for (const [lang, patterns] of Object.entries(signatures)) {
    const matches = patterns.filter(pattern => pattern.test(content));
    if (matches.length >= 2) {  // Require at least 2 matches for confidence
      return lang;
    }
  }
  return null;
};

const CodeEditor = ({ 
  value, 
  onChange, 
  language,  // Now required
  onLanguageChange,
  readOnly = false,
  height = '400px',
  onRun,
  showLineNumbers = true,
  initialTheme = 'vscode-dark',
  fontSize = 14,
  tabSize = 2,
  autoSave = false,
  onSave,
  lastEditedTime
}) => {
  const { colorMode } = useColorMode();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [editorContent, setEditorContent] = useState(value || '');
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [savingStatus, setSavingStatus] = useState('saved'); // 'saved', 'saving', 'unsaved'
  const editorRef = useRef(null);
  const editorView = useRef(null);
  const [searchResults, setSearchResults] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isKeyboardShortcutsOpen, onOpen: onKeyboardShortcutsOpen, onClose: onKeyboardShortcutsClose } = useDisclosure();

  // Auto-switch theme based on color mode
  useEffect(() => {
    if (colorMode === 'dark' && selectedTheme.includes('light')) {
      const darkEquivalent = selectedTheme.replace('light', 'dark');
      if (themeMap[darkEquivalent]) {
        setSelectedTheme(darkEquivalent);
      } else if (themeMap['vscode-dark']) {
        setSelectedTheme('vscode-dark');
      }
    } else if (colorMode === 'light' && selectedTheme.includes('dark')) {
      const lightEquivalent = selectedTheme.replace('dark', 'light');
      if (themeMap[lightEquivalent]) {
        setSelectedTheme(lightEquivalent);
      } else if (themeMap['github-light']) {
        setSelectedTheme('github-light');
      }
    }
  }, [colorMode]);

  // Handle auto-save
  useEffect(() => {
    if (editorContent !== value) {
      setSavingStatus('unsaved');
      
      if (autoSave && onSave) {
        setSavingStatus('saving');
        const timer = setTimeout(() => {
          onSave(editorContent);
          setSavingStatus('saved');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [editorContent, autoSave, onSave, value]);

  // Update local content when prop value changes
  useEffect(() => {
    if (value !== undefined && value !== editorContent) {
      setEditorContent(value);
      setSavingStatus('saved');
    }
  }, [value]);

  // Update language when prop changes
  useEffect(() => {
    if (language !== selectedLanguage) {
      setSelectedLanguage(language);
    }
  }, [language]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
  };

  const handleEditorChange = (value) => {
    setEditorContent(value);
    if (onChange) {
      onChange(value);
    }
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editorContent);
  };

  const handleSave = () => {
    if (onSave) {
      setSavingStatus('saving');
      onSave(editorContent);
      setTimeout(() => {
        setSavingStatus('saved');
      }, 500);
    }
  };

  const handleRun = () => {
    if (onRun) {
      onRun(editorContent, selectedLanguage);
    }
  };

  const handleDownload = () => {
    const fileExtensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      java: 'java',
      cpp: 'cpp',
      php: 'php',
      sql: 'sql',
      xml: 'xml',
      json: 'json',
      markdown: 'md',
      rust: 'rs',
      go: 'go',
    };
    
    const extension = fileExtensions[selectedLanguage] || 'txt';
    const blob = new Blob([editorContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        handleEditorChange(content);
        
        // Try to detect language from file extension
        const extension = file.name.split('.').pop().toLowerCase();
        const extensionLanguageMap = {
          js: 'javascript',
          ts: 'typescript',
          py: 'python',
          html: 'html',
          css: 'css',
          java: 'java',
          cpp: 'cpp',
          php: 'php',
          sql: 'sql',
          xml: 'xml',
          json: 'json',
          md: 'markdown',
          rs: 'rust',
          go: 'go',
        };
        
        if (extensionLanguageMap[extension] && languageMap[extensionLanguageMap[extension]]) {
          setSelectedLanguage(extensionLanguageMap[extension]);
          if (onLanguageChange) {
            onLanguageChange(extensionLanguageMap[extension]);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Build extensions array for the editor
  const getExtensions = () => {
    // Just use the language extension since we don't have access to the base extensions
    const extensions = [];
    
    // Add language support
    if (languageMap[selectedLanguage]) {
      extensions.push(languageMap[selectedLanguage]);
    }
    
    return extensions;
  };

  const handleSearch = (searchTerm, goForward = true) => {
    if (!editorView.current || !searchTerm) return;
    
    const view = editorView.current;
    const doc = view.state.doc;
    const searchRegex = new RegExp(searchTerm, 'gi');
    const matches = []; // Stores all found matches {from, to}
    
    // Find all matches
    let execResult; // Renamed from 'match' to avoid redeclaration
    let text = doc.toString();
    while ((execResult = searchRegex.exec(text)) !== null) {
      matches.push({
        from: execResult.index,
        to: execResult.index + execResult[0].length
      });
    }
    
    setSearchResults(matches.length);

    if (matches.length === 0) {
      setCurrentMatch(0);
      // Optionally, clear any existing selection highlight if no matches are found
      // view.dispatch({ selection: view.state.selection }); 
      return;
    }

    const currentSelection = view.state.selection.main;
    let currentSelectedMatchIndex = -1;

    // Check if the current selection exactly matches one of the found matches
    for (let i = 0; i < matches.length; i++) {
      if (matches[i].from === currentSelection.from && matches[i].to === currentSelection.to) {
        currentSelectedMatchIndex = i;
        break;
      }
    }

    let nextMatchIndex = 0; // Default to the first match

    if (goForward) {
      if (currentSelectedMatchIndex !== -1) {
        // If a match is currently selected, move to the next one, wrapping around
        nextMatchIndex = (currentSelectedMatchIndex + 1) % matches.length;
      } else {
        // If no specific match is selected, find the first match whose 'from' is at or after the cursor's head
        const cursorHead = currentSelection.head;
        const firstMatchAfterCursor = matches.findIndex(m => m.from >= cursorHead);
        nextMatchIndex = firstMatchAfterCursor !== -1 ? firstMatchAfterCursor : 0; // Wrap to first if none found after cursor
      }
    } else { // Find previous
      if (currentSelectedMatchIndex !== -1) {
        // If a match is currently selected, move to the previous one, wrapping around
        nextMatchIndex = (currentSelectedMatchIndex - 1 + matches.length) % matches.length;
      } else {
        // If no specific match is selected, find the last match whose 'to' is at or before the cursor's head
        const cursorHead = currentSelection.head;
        let lastMatchBeforeCursor = -1;
        for (let i = matches.length - 1; i >= 0; i--) {
          if (matches[i].to <= cursorHead) {
            lastMatchBeforeCursor = i;
            break;
          }
        }
        // If no match ends before/at cursor, wrap to the last match in the document.
        // Otherwise, use the found match.
        nextMatchIndex = lastMatchBeforeCursor !== -1 ? lastMatchBeforeCursor : matches.length - 1; 
      }
    }

    setCurrentMatch(nextMatchIndex + 1); // Update UI (1-based index)

    // Set selection to the determined next/previous match
    const targetMatch = matches[nextMatchIndex]; // Renamed from 'match' to 'targetMatch'
    
    if (targetMatch) { // Ensure targetMatch is valid
      view.dispatch({
        selection: EditorSelection.single(targetMatch.from, targetMatch.to),
        scrollIntoView: true
      });
    }
  };

  const handleReplace = (searchTerm, replaceTerm, replaceAll = false) => {
    if (!editorView.current || !searchTerm) return;
    
    const view = editorView.current;
    const doc = view.state.doc;
    const searchRegex = new RegExp(searchTerm, 'gi');
    
    if (replaceAll) {
      // Replace all occurrences
      const newContent = doc.toString().replace(searchRegex, replaceTerm);
      view.dispatch({
        changes: {
          from: 0,
          to: doc.length,
          insert: newContent
        }
      });
    } else {
      // Replace only current selection if it matches
      const selection = view.state.selection.main;
      const selectedText = doc.sliceString(selection.from, selection.to);
      if (searchRegex.test(selectedText)) {
        view.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: replaceTerm
          }
        });
        handleSearch(searchTerm, true); // Move to next match
      }
    }
  };

  // Editor view setup
  const editorHeight = isFullscreen ? '100vh' : height;
  const editorWidth = isFullscreen ? '100vw' : '100%';
  const editorPosition = isFullscreen ? 'fixed' : 'relative';
  const editorTop = isFullscreen ? '0' : 'auto';
  const editorLeft = isFullscreen ? '0' : 'auto';
  const editorZIndex = isFullscreen ? '9999' : '1';

  const handleEditorCreated = (view) => {
    setIsEditorReady(true);
    editorView.current = view;
    // Track cursor position using DOM events since we don't have direct access to the state API
    view.dom.addEventListener('keyup', () => {
      try {
        // Simplified cursor tracking
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
          // Approximate line and column from DOM
          const text = selection.anchorNode.textContent || '';
          const lines = text.split('\n');
          setCursorPosition({
            line: lines.length,
            column: lines[lines.length - 1].length + 1
          });
        }
      } catch (e) {
        // Fallback to default position if we can't get it
        setCursorPosition({ line: 1, column: 1 });
      }
    });
    view.dom.addEventListener('click', () => {
      try {
        // Similar simplified tracking for clicks
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
          const text = selection.anchorNode.textContent || '';
          const lines = text.split('\n');
          setCursorPosition({
            line: lines.length,
            column: lines[lines.length - 1].length + 1
          });
        }
      } catch (e) {
        setCursorPosition({ line: 1, column: 1 });
      }
    });
  };

  return (
    <>
      <Box 
        width={editorWidth} 
        borderWidth="1px" 
        borderRadius={isFullscreen ? '0' : 'lg'} 
        overflow="hidden"
        position={editorPosition}
        top={editorTop}
        left={editorLeft}
        zIndex={editorZIndex}
        bg={colorMode === 'dark' ? 'gray.800' : 'white'}
      >
        {/* Editor Toolbar */}
        <Flex 
          p={2} 
          bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'} 
          borderBottomWidth="1px" 
          justifyContent="space-between" 
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <HStack spacing={2}>
            <Text fontWeight="bold">Code Editor</Text>
            {!readOnly && (
              <>
                <Badge colorScheme="green" variant="subtle">
                  {cursorPosition.line}:{cursorPosition.column}
                </Badge>
                <Badge 
                  colorScheme={savingStatus === 'saved' ? 'green' : savingStatus === 'saving' ? 'blue' : 'yellow'} 
                  variant="subtle"
                >
                  {savingStatus === 'saved' ? 'Saved' : savingStatus === 'saving' ? 'Saving...' : 'Unsaved'}
                </Badge>
                {lastEditedTime && (
                  <Badge colorScheme="purple" variant="subtle">
                    Last edited: {new Date(lastEditedTime).toLocaleString()}
                  </Badge>
                )}
              </>
            )}
          </HStack>

          <HStack spacing={2}>
            {/* Language Selector */}
            <Select 
              value={selectedLanguage} 
              onChange={handleLanguageChange} 
              width="150px" 
              size="sm"
              isDisabled={readOnly}
              placeholder="Select language"
            >
              {Object.entries(languageLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>

            {/* Theme Selector */}
            <Menu>
              <MenuButton as={Button} size="sm" variant="outline">
                Theme
              </MenuButton>
              <MenuList>
                {Object.keys(themeMap).map(theme => (
                  <MenuItem key={theme} onClick={() => handleThemeChange(theme)}>
                    {theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Editor Controls */}
            <HStack spacing={1}>
              <Tooltip label="Search & Replace">
                <IconButton
                  aria-label="Search & Replace"
                  icon={<FaSearch />}
                  size="sm"
                  onClick={handleSearchToggle}
                />
              </Tooltip>

              {!readOnly && (
                <>
                  <Tooltip label="Copy to Clipboard">
                    <IconButton
                      aria-label="Copy to Clipboard"
                      icon={<FaClipboard />}
                      size="sm"
                      onClick={handleCopyToClipboard}
                    />
                  </Tooltip>

                  <Tooltip label="Download Code">
                    <IconButton
                      aria-label="Download Code"
                      icon={<FaDownload />}
                      size="sm"
                      onClick={handleDownload}
                    />
                  </Tooltip>

                  <Tooltip label="Upload File">
                    <IconButton
                      as="label"
                      htmlFor="file-upload"
                      aria-label="Upload File"
                      icon={<FaUpload />}
                      size="sm"
                      cursor="pointer"
                    />
                  </Tooltip>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    display="none"
                  />

                  {onRun && (
                    <Tooltip label="Run Code">
                      <IconButton
                        aria-label="Run Code"
                        icon={<FaPlay />}
                        size="sm"
                        colorScheme="green"
                        onClick={handleRun}
                      />
                    </Tooltip>
                  )}

                  <Tooltip label="Settings">
                    <IconButton
                      aria-label="Settings"
                      icon={<FaCog />}
                      size="sm"
                      onClick={onSettingsOpen}
                    />
                  </Tooltip>
                </>
              )}

              <Tooltip label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <IconButton
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                  size="sm"
                  onClick={handleFullscreenToggle}
                />
              </Tooltip>
            </HStack>
          </HStack>
        </Flex>

        {/* Search & Replace Bar */}
        {showSearch && (
          <Flex 
            p={2} 
            bg={colorMode === 'dark' ? 'gray.700' : 'gray.100'} 
            borderBottomWidth="1px" 
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <InputGroup size="sm" maxWidth="300px">
              <Input 
                placeholder="Search..." 
                value={searchQuery} 
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) handleSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery, !e.shiftKey);
                  }
                }}
              />
              <InputRightElement width="4.5rem">
                <Text fontSize="xs" color="gray.500">
                  {searchResults > 0 ? `${currentMatch}/${searchResults}` : '0/0'}
                </Text>
              </InputRightElement>
            </InputGroup>
            
            {!readOnly && (
              <>
                <InputGroup size="sm" maxWidth="300px">
                  <Input 
                    placeholder="Replace with..." 
                    value={replaceQuery} 
                    onChange={(e) => setReplaceQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleReplace(searchQuery, replaceQuery);
                      }
                    }}
                  />
                </InputGroup>
                
                <Button 
                  size="sm" 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={() => handleReplace(searchQuery, replaceQuery)}
                >
                  Replace
                </Button>
                
                <Button 
                  size="sm" 
                  colorScheme="blue" 
                  variant="solid"
                  onClick={() => handleReplace(searchQuery, replaceQuery, true)}
                >
                  Replace All
                </Button>
              </>
            )}
          </Flex>
        )}

        {/* Code Mirror Editor */}
        <Box ref={editorRef}>
          <CodeMirror
            value={editorContent}
            height={editorHeight}
            extensions={getExtensions()}
            onChange={handleEditorChange}
            readOnly={readOnly}
            theme={themeMap[selectedTheme]}
            basicSetup={{
              lineNumbers: showLineNumbers,
              foldGutter: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              autocompletion: true,
              bracketMatching: true,
              closeBrackets: true,
              crosshairCursor: true,
              indentOnInput: true,
            }}
            style={{
              fontSize: `${fontSize}px`,
            }}
            onCreateEditor={handleEditorCreated}
          />
        </Box>

        {/* Settings Modal */}
        <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editor Settings</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" gap={4}>
                <Box>
                  <Text mb={2}>Font Size</Text>
                  <Flex alignItems="center" gap={2}>
                    <Text>12px</Text>
                    <Input 
                      type="range" 
                      min="12" 
                      max="24" 
                      value={fontSize} 
                      onChange={(e) => {
                        // This would be handled with state in a real implementation
                        // setFontSize(parseInt(e.target.value))
                      }} 
                    />
                    <Text>24px</Text>
                  </Flex>
                </Box>

                <Box>
                  <Text mb={2}>Tab Size</Text>
                  <Select 
                    value={tabSize} 
                    onChange={(e) => {
                      // This would be handled with state in a real implementation
                      // setTabSize(parseInt(e.target.value))
                    }}
                  >
                    <option value="2">2 spaces</option>
                    <option value="4">4 spaces</option>
                    <option value="8">8 spaces</option>
                  </Select>
                </Box>

                <Box>
                  <Text mb={2}>Auto Save</Text>
                  <Select 
                    value={autoSave ? "true" : "false"} 
                    onChange={(e) => {
                      // This would be handled with state in a real implementation
                      // setAutoSave(e.target.value === "true")
                    }}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </Select>
                </Box>

                <Button colorScheme="blue" onClick={onKeyboardShortcutsOpen}>
                  View Keyboard Shortcuts
                </Button>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onSettingsClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Keyboard Shortcuts Modal */}
        <Modal isOpen={isKeyboardShortcutsOpen} onClose={onKeyboardShortcutsClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Keyboard Shortcuts</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" gap={2}>
                <Flex justify="space-between">
                  <Text>Find</Text>
                  <Kbd>Ctrl</Kbd> + <Kbd>F</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Replace</Text>
                  <Kbd>Ctrl</Kbd> + <Kbd>H</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Save</Text>
                  <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Undo</Text>
                  <Kbd>Ctrl</Kbd> + <Kbd>Z</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Redo</Text>
                  <Kbd>Ctrl</Kbd> + <Kbd>Y</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Comment Line</Text>
                  <Kbd>Ctrl</Kbd> + <Kbd>/</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Indent</Text>
                  <Kbd>Tab</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Outdent</Text>
                  <Kbd>Shift</Kbd> + <Kbd>Tab</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Multiple Cursors</Text>
                  <Kbd>Alt</Kbd> + <Kbd>Click</Kbd>
                </Flex>
                <Flex justify="space-between">
                  <Text>Select All</Text>
                  <Kbd>Ctrl</Kbd> + <Kbd>A</Kbd>
                </Flex>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onKeyboardShortcutsClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default CodeEditor;
