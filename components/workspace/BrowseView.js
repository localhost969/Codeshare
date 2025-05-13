import { keyframes } from '@emotion/react';import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Box, 
  Heading, 
  Grid,
  GridItem,
  Text, 
  Flex, 
  Badge, 
  useColorModeValue, 
  Input, 
  InputGroup, 
  InputRightElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  VStack,
  Icon,
  Circle,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Tooltip,
  Center,
  Spinner,
  Avatar,
  AvatarGroup,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Kbd,
  InputLeftElement,
  IconButton,
  Collapse,
  Wrap,
  WrapItem,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Portal,
  Stack,
  Image,
  // useMemo // Already moved to react import
} from '@chakra-ui/react';
import { 
  SearchIcon, 
  AddIcon, 
  ChevronDownIcon, 
  SettingsIcon, 
  TimeIcon, 
  StarIcon, 
  ViewIcon, 
  CalendarIcon, 
  InfoIcon,
  CloseIcon,
  HamburgerIcon,
  ChevronRightIcon,
  CheckIcon,
  SmallCloseIcon,
  DeleteIcon, // Added for consistency, though FaTrash will be used
  EditIcon // Already imported
} from '@chakra-ui/icons';
import { 
  FaCode, 
  FaClock, 
  FaFilter, 
  FaSortAmountDown, 
  FaListUl, 
  FaTh, 
  FaThLarge, 
  FaRegClock, 
  FaRegStar, 
  FaStar, 
  FaRegBookmark, 
  FaBookmark, 
  FaRegFileCode, 
  FaFileCode,
  FaJs,
  FaHtml5,
  FaCss3,
  FaPython,
  FaJava,
  FaPhp,
  FaDatabase,
  FaMarkdown,
  FaRegClone,
  FaHistory,
  FaEye,
  FaEyeSlash,
  FaTerminal,
  FaEdit, // Added
  FaTrash, // Added
  // FaEllipsisV // Removed as it's no longer used for card options
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Get language icon
const getLanguageIcon = (lang) => {
  const normalizedLang = lang?.toLowerCase() || '';
  if (normalizedLang.includes('javascript') || normalizedLang.includes('js')) return FaJs;
  if (normalizedLang.includes('html')) return FaHtml5;
  if (normalizedLang.includes('css')) return FaCss3;
  if (normalizedLang.includes('python')) return FaPython;
  if (normalizedLang.includes('java')) return FaJava;
  if (normalizedLang.includes('php')) return FaPhp;
  if (normalizedLang.includes('sql')) return FaDatabase;
  if (normalizedLang.includes('markdown') || normalizedLang.includes('md')) return FaMarkdown;
  return FaCode;
};

// Custom components
const SnippetCard = ({ snippet, onSelect, viewMode, onEditTitle, onDeleteSnippet }) => {
  const { id, title, code, language, updatedAt, createdAt } = snippet;
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Truncate code preview
  const truncateCode = (code) => {
    if (!code) return '';
    const maxLines = 5;
    const lines = code.split('\n').slice(0, maxLines);
    return lines.join('\n');
  };
  
  // Compact view
  if (viewMode === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        style={{ height: '100%' }}
      >
        <Flex
          direction="row"
          p={3}
          h="100%"
          borderWidth="1px"
          borderRadius="md"
          borderColor={borderColor}
          bg={cardBg}
          _hover={{ bg: hoverBg, borderColor: 'teal.300' }}
          cursor="pointer"
          onClick={() => onSelect(id)}
          boxShadow="sm"
          transition="all 0.2s"
          align="center"
          justify="space-between"
        >
          <HStack spacing={3} overflow="hidden">
            <Icon as={getLanguageIcon(language)} color={accentColor} boxSize={5} flexShrink={0} />
            <VStack align="start" spacing={0} overflow="hidden">
              <Text fontWeight="bold" fontSize="md" isTruncated width="100%">{title}</Text>
              <Text fontSize="xs" color={textColor} isTruncated width="100%">
                {formatDate(updatedAt || createdAt)}
              </Text>
            </VStack>
          </HStack>
          
          <HStack spacing={1} flexShrink={0}>
            <Tag size="sm" colorScheme="teal" borderRadius="full">
              <TagLabel isTruncated maxW="80px">{language || 'unknown'}</TagLabel>
            </Tag>
            <IconButton
              icon={<Icon as={FaEdit} />}
              size="xs"
              variant="ghost"
              aria-label="Edit title"
              onClick={(e) => {
                e.stopPropagation();
                onEditTitle(id);
              }}
            />
            <IconButton
              icon={<Icon as={FaTrash} />}
              size="xs"
              variant="ghost"
              aria-label="Delete snippet"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSnippet(id);
              }}
              colorScheme="red"
            />
          </HStack>
        </Flex>
      </motion.div>
    );
  }
  
  // Grid view (default)
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      style={{ height: '100%' }}
    >
      <Flex
        direction="column"
        h="100%"
        borderWidth="1px"
        borderRadius="md"
        overflow="hidden"
        bg={cardBg}
        borderColor={borderColor}
        _hover={{ borderColor: 'teal.300' }}
        cursor="pointer"
        onClick={() => onSelect(id)}
        boxShadow="sm"
        transition="all 0.2s"
      >
        {/* Header */}
        <Flex
          p={3}
          align="center"
          justify="space-between"
          borderBottomWidth="1px"
          borderColor={borderColor}
          minH="56px"
        >
          <HStack overflow="hidden">
            <Icon as={getLanguageIcon(language)} color={accentColor} boxSize={5} flexShrink={0} />
            <Text fontWeight="semibold" isTruncated maxW="200px">
              {title}
            </Text>
          </HStack>
          <HStack spacing={1} flexShrink={0}>
            <IconButton
              icon={<Icon as={FaEdit} />}
              size="xs"
              variant="ghost"
              aria-label="Edit title"
              onClick={(e) => {
                e.stopPropagation();
                onEditTitle(id);
              }}
            />
            <IconButton
              icon={<Icon as={FaTrash} />}
              size="xs"
              variant="ghost"
              aria-label="Delete snippet"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSnippet(id);
              }}
              colorScheme="red"
            />
          </HStack>
        </Flex>
        
        {/* Code preview */}
        <Box 
          flex="1"
          minH="120px"
          maxH="120px"
          p={3}
          bg={useColorModeValue('gray.50', 'gray.800')}
          borderBottomWidth="1px"
          borderColor={borderColor}
          overflow="hidden"
          position="relative"
        >
          <Text 
            as="pre"
            fontFamily="mono"
            fontSize="xs"
            color={textColor}
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            m={0}
            lineHeight="tall"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxHeight: '100%',
            }}
          >
            {truncateCode(code).replace(/ /g, '\u00A0')}
          </Text>
          {/* Small language tag */}
          <Box 
            position="absolute"
            bottom="1"
            right="2"
            bg={useColorModeValue('rgba(255,255,255,0.8)', 'rgba(26, 32, 44, 0.8)')}
            px={2}
            py={0.5}
            borderRadius="md"
            fontSize="10px"
            fontWeight="bold"
            color={accentColor}
            borderWidth="1px"
            borderColor={useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)')}
          >
            {language || 'text'}
          </Box>
        </Box>
        
        {/* Footer */}
        <Flex
          p={2}
          justify="space-between"
          align="center"
          minH="48px"
          bg={useColorModeValue('gray.50', 'gray.800')}
        >
          <Tag size="sm" colorScheme="teal" borderRadius="full" maxW="120px">
            <TagLabel isTruncated>{language || 'unknown'}</TagLabel>
          </Tag>
          <Text fontSize="xs" color={textColor} isTruncated maxW="120px">
            {formatDate(updatedAt || createdAt)}
          </Text>
        </Flex>
      </Flex>
    </motion.div>
  );
};

// Filter tag component
const FilterTag = ({ label, icon, isActive, onClick }) => {
  const activeBg = useColorModeValue('teal.100', 'teal.800');
  const activeColor = useColorModeValue('teal.800', 'white');
  const inactiveBg = useColorModeValue('gray.100', 'gray.700');
  const inactiveColor = useColorModeValue('gray.700', 'gray.300');
  
  return (
    <Tag
      size="md"
      borderRadius="full"
      variant="solid"
      bg={isActive ? activeBg : inactiveBg}
      color={isActive ? activeColor : inactiveColor}
      cursor="pointer"
      onClick={onClick}
      _hover={{ opacity: 0.8 }}
      px={3}
      py={1}
    >
      {icon && <TagLeftIcon as={icon} boxSize="12px" />}
      <TagLabel fontWeight={isActive ? "bold" : "normal"}>{label}</TagLabel>
      {isActive && (
        <Box ml={1}>
          <SmallCloseIcon boxSize={3} />
        </Box>
      )}
    </Tag>
  );
};

// Empty state component
const EmptyResults = ({ onAddSnippet, hasFilters, onClearFilters }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('teal.400', 'teal.300');
  
  return (
    <Center 
      p={10} 
      borderWidth="1px" 
      borderRadius="xl" 
      borderColor={borderColor} 
      bg={bgColor}
      minH="250px"
    >
      <VStack spacing={6} textAlign="center">
        <VStack spacing={2}>
          <Heading size="md">
            {hasFilters ? 'No snippets found' : 'Nothing to see here... yet!'}
          </Heading>
          
          <Text color={textColor} maxW="400px" fontSize="md">
            {hasFilters 
              ? 'Your search came up empty. Try different filters or keywords.'
              : 'Your snippets will appear here. Ready to create your first one?'}
          </Text>
          
          {!hasFilters && (
            <Text color={textColor} fontSize="sm" mt={2}>
              "In the beginning, there was no code. Then you clicked 'New Snippet'..."
            </Text>
          )}
        </VStack>
        
        {hasFilters ? (
          <Button
            leftIcon={<CloseIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        ) : (
          <Button
            leftIcon={<AddIcon boxSize={4} />}
            colorScheme="teal"
            onClick={onAddSnippet}
            px={4}
            _hover={{
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
            _active={{
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
            }}
            transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
            bgGradient="linear(to-r, teal.400, teal.500)"
            _focus={{
              boxShadow: '0 0 0 3px rgba(45, 212, 191, 0.4)',
            }}
            size="md"
            fontWeight="medium"
          >
            Create New Snippet
          </Button>
        )}
      </VStack>
    </Center>
  );
};

// Search bar with keyboard shortcut hint
const SearchBar = ({ value, onChange, onKeyDown }) => {
  return (
    <InputGroup size="md">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      
      <Input
        placeholder="Search snippets..."
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        borderRadius="full"
        bg={useColorModeValue('white', 'gray.800')}
        _focus={{ borderColor: 'teal.400', boxShadow: '0 0 0 1px var(--chakra-colors-teal-400)' }}
      />
      
      <Tooltip label="Press '/' to focus search" placement="bottom">
        <Box position="absolute" right="12px" top="8px">
          <Kbd fontSize="xs">/ </Kbd>
        </Box>
      </Tooltip>
    </InputGroup>
  );
};

// View toggle component
const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <HStack spacing={1} bg={useColorModeValue('gray.100', 'gray.700')} p={1} borderRadius="md">
      <IconButton
        icon={<FaThLarge />}
        size="sm"
        variant={viewMode === 'grid' ? 'solid' : 'ghost'}
        colorScheme={viewMode === 'grid' ? 'teal' : 'gray'}
        aria-label="Grid view"
        onClick={() => setViewMode('grid')}
      />
      <IconButton
        icon={<FaListUl />}
        size="sm"
        variant={viewMode === 'compact' ? 'solid' : 'ghost'}
        colorScheme={viewMode === 'compact' ? 'teal' : 'gray'}
        aria-label="List view"
        onClick={() => setViewMode('compact')}
      />
    </HStack>
  );
};

// Sort menu component
const SortMenu = ({ sortOrder, setSortOrder }) => {
  const options = [
    { value: 'newest', label: 'Newest First', icon: FaRegClock },
    { value: 'oldest', label: 'Oldest First', icon: FaHistory },
    { value: 'az', label: 'A to Z', icon: FaSortAmountDown },
    { value: 'za', label: 'Z to A', icon: FaSortAmountDown },
  ];

  const currentOption = options.find(opt => opt.value === sortOrder);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Box width="220px">
      <Popover placement="bottom-end" trigger="hover" openDelay={100} closeDelay={200}>
        <PopoverTrigger>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            fontWeight="medium"
            width="100%"
            height="38px"
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            textAlign="left"
            px={4}
            py={2}
            _focus={{ boxShadow: '0 0 0 2px rgba(49, 151, 149, 0.3)' }}
            _hover={{ 
              bg: useColorModeValue('gray.50', 'gray.700'),
              borderColor: 'teal.300',
              transform: 'translateY(-1px)',
              transition: 'all 0.2s ease-in-out'
            }}
            transition="all 0.2s ease-in-out"
            boxShadow="sm"
          >
            <HStack w="100%" justify="space-between">
              <Icon as={FaSortAmountDown} color={textColor} boxSize={4} />
              <Text flex="1" isTruncated>
                {currentOption?.label || 'Sort by'}
              </Text>
              <Icon as={ChevronDownIcon} color={textColor} boxSize={4} />
            </HStack>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          width="220px"
          borderRadius="md"
          borderColor={borderColor}
          boxShadow="lg"
          p={0}
          _focus={{ outline: 'none' }}
          bg={useColorModeValue('white', 'gray.800')}
        >
          <PopoverArrow bg={useColorModeValue('white', 'gray.800')} />
          <Box py={2}>
            {options.map(option => (
              <Box 
                key={option.value}
                px={4} 
                py={2} 
                cursor="pointer"
                onClick={() => setSortOrder(option.value)}
                fontWeight={sortOrder === option.value ? 'semibold' : 'normal'}
                bg={sortOrder === option.value ? useColorModeValue('teal.50', 'teal.900') : 'transparent'}
                _hover={{ 
                  bg: useColorModeValue('gray.100', 'gray.700'),
                  transform: 'translateX(2px)',
                  transition: 'all 0.2s ease'
                }}
                borderRadius="md"
                transition="all 0.2s ease"
              >
                <HStack w="100%" justify="space-between">
                  <HStack spacing={3}>
                    <Icon as={option.icon} color="teal.400" boxSize={4} />
                    <Text>{option.label}</Text>
                  </HStack>
                  {sortOrder === option.value && (
                    <Icon as={CheckIcon} color="teal.500" />
                  )}
                </HStack>
              </Box>
            ))}
          </Box>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

const BrowseView = ({ snippets, onSelectSnippet, onAddSnippet, onEditTitle, onDeleteSnippet }) => {
  // State management
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilters, setActiveFilters] = useState([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const searchInputRef = useRef(null);
  
  // Responsive layout
  const columnCount = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 });
  const isCompact = useBreakpointValue({ base: true, md: false });
  
  // Effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // '/' key to focus search
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      
      // 'Escape' key to clear search
      if (e.key === 'Escape' && searchQuery && document.activeElement === searchInputRef.current) {
        e.preventDefault();
        setSearchQuery('');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('white', 'gray.800');

  // Get all available languages for filtering
  const availableLanguages = useMemo(() => {
    const langs = [...new Set(snippets.map(s => s.language || 'unknown').filter(Boolean))];
    return langs.sort();
  }, [snippets]);
  
  // Handle filter changes
  const toggleLanguageFilter = (language) => {
    if (language === 'all') {
      setFilterLanguage('all');
      setActiveFilters(activeFilters.filter(f => f.type !== 'language'));
      return;
    }
    
    setFilterLanguage(language);
    
    // Update active filters
    const existingFilterIndex = activeFilters.findIndex(f => f.type === 'language');
    if (existingFilterIndex >= 0) {
      const newFilters = [...activeFilters];
      newFilters[existingFilterIndex] = { type: 'language', value: language, label: `Language: ${language}`, icon: FaCode };
      setActiveFilters(newFilters);
    } else {
      setActiveFilters([...activeFilters, { 
        type: 'language', 
        value: language, 
        label: `Language: ${language}`,
        icon: FaCode
      }]);
    }
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setFilterLanguage('all');
    setActiveFilters([]);
    setSortOrder('newest');
  };
  
  // Remove a specific filter
  const removeFilter = (filterType) => {
    if (filterType === 'language') {
      setFilterLanguage('all');
    } else if (filterType === 'search') {
      setSearchQuery('');
    }
    
    setActiveFilters(activeFilters.filter(f => f.type !== filterType));
  };
  
  // Update search filter
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Update active filters
    if (value) {
      const existingFilterIndex = activeFilters.findIndex(f => f.type === 'search');
      if (existingFilterIndex >= 0) {
        const newFilters = [...activeFilters];
        newFilters[existingFilterIndex] = { type: 'search', value, label: `Search: ${value}`, icon: SearchIcon };
        setActiveFilters(newFilters);
      } else {
        setActiveFilters([...activeFilters, { 
          type: 'search', 
          value, 
          label: `Search: ${value}`,
          icon: SearchIcon
        }]);
      }
    } else {
      setActiveFilters(activeFilters.filter(f => f.type !== 'search'));
    }
  };
  
  // Filter and sort snippets
  useEffect(() => {
    let filtered = [...snippets];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(snippet => 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (snippet.code && snippet.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (snippet.language && snippet.language.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply language filter
    if (filterLanguage !== 'all') {
      filtered = filtered.filter(snippet => 
        snippet.language && snippet.language.toLowerCase() === filterLanguage.toLowerCase()
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case 'oldest':
          return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
    
    setFilteredSnippets(filtered);
  }, [snippets, searchQuery, sortOrder, filterLanguage]);

  // Check if we have any active filters
  const hasActiveFilters = activeFilters.length > 0;
  
  // Get stats for the current view
  const stats = {
    total: snippets.length,
    filtered: filteredSnippets.length,
    languages: availableLanguages.length
  };

  return (
    <Box 
      flex="1" 
      overflow="hidden" 
      display="flex"
      flexDirection="column"
      bg={bgColor}
    >
      {/* Header with search and actions */}
      <Box 
        py={4} 
        px={6} 
        borderBottomWidth="1px" 
        borderColor={borderColor}
        bg={headerBg}
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex 
          justify="space-between" 
          align="center" 
          wrap="wrap"
          gap={4}
        >
          {/* Left side: Title and stats */}
          <VStack align="start" spacing={1}>
            <Heading size="lg" color={accentColor} lineHeight="1.2">Browse Snippets</Heading>
            {stats.total === 0 ? (
              <HStack spacing={2} align="center">
                <Box
                  as="span"
                  bg={useColorModeValue('teal.50', 'teal.900')}
                  color={useColorModeValue('teal.700', 'teal.200')}
                  px={2}
                  py={0.5}
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="medium"
                  display="inline-flex"
                  alignItems="center"
                >
                  <Icon as={InfoIcon} mr={1} boxSize={3} />
                  <span>New here?</span>
                </Box>
                <Text fontSize="sm" color={textColor}>
                  Start by creating your first snippet!
                </Text>
              </HStack>
            ) : (
              <HStack spacing={2} divider={<Box mx={1} color={textColor} opacity={0.4}>•</Box>}>
                <Text fontSize="sm" color={textColor}>
                  <Box as="span" fontWeight="medium" color={useColorModeValue('teal.600', 'teal.300')}>
                    {stats.filtered}
                  </Box>
                  {' '}snippet{stats.filtered !== 1 ? 's' : ''}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  {stats.languages} language{stats.languages !== 1 ? 's' : ''}
                </Text>
              </HStack>
            )}
          </VStack>
          
          {/* Right side: Actions */}
          <HStack spacing={3}>
            {/* Search bar */}
            <SearchBar 
              value={searchQuery} 
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === 'Escape' && setSearchQuery('')}
            />
            
            {/* View toggle */}
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            
            {/* Create new snippet button */}
            <Button
              leftIcon={<AddIcon boxSize={3.5} />}
              colorScheme="teal"
              onClick={onAddSnippet}
              size={{ base: 'sm', md: 'md' }}
              height={{ base: '36px', md: '40px' }}
              fontWeight="medium"
              px={4}
              py={2}
              minW={{ base: 'auto', md: '140px' }}
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              _active={{
                transform: 'translateY(0)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)',
              }}
              transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
              bgGradient="linear(to-r, teal.400, teal.500)"
              _focus={{
                boxShadow: '0 0 0 3px rgba(45, 212, 191, 0.4)',
              }}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              <Box as="span" display={{ base: 'none', sm: 'inline' }}>New Snippet</Box>
              <Box as="span" display={{ base: 'inline', sm: 'none' }}>New</Box>
            </Button>
          </HStack>
        </Flex>
        
        {/* Active filters */}
        {hasActiveFilters && (
          <Box mt={4}>
            <Flex justify="space-between" align="center">
              <Wrap spacing={2}>
                {activeFilters.map((filter, index) => (
                  <WrapItem key={index}>
                    <FilterTag
                      label={filter.label}
                      icon={filter.icon}
                      isActive={true}
                      onClick={() => removeFilter(filter.type)}
                    />
                  </WrapItem>
                ))}
              </Wrap>
              
              <Button
                size="xs"
                variant="ghost"
                colorScheme="gray"
                leftIcon={<SmallCloseIcon />}
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            </Flex>
          </Box>
        )}
      </Box>
      
      {/* Main content area */}
      <Box 
        flex="1" 
        overflow="auto" 
        p={6}
        position="relative"
      >
        {/* Toolbar */}
        <Flex 
          mb={6} 
          justify="space-between"
          align="center"
          bg={sectionBg}
          p={3}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          {/* Left side: Filter tags */}
          <HStack spacing={3} overflow="auto" pb={1}>
            <Text fontSize="sm" fontWeight="medium" color={textColor} whiteSpace="nowrap">
              Filter by:
            </Text>
            
            <Box width="220px">
              <Popover placement="bottom-start" trigger="hover" openDelay={100} closeDelay={200}>
                <PopoverTrigger>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme={filterLanguage !== 'all' ? 'teal' : 'gray'}
                    fontWeight="medium"
                    width="100%"
                    height="38px"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={filterLanguage !== 'all' ? 'teal.300' : borderColor}
                    textAlign="left"
                    px={4}
                    py={2}
                    _focus={{ boxShadow: '0 0 0 2px rgba(49, 151, 149, 0.3)' }}
                    _hover={{ 
                      bg: useColorModeValue('gray.50', 'gray.700'),
                      borderColor: 'teal.300',
                      transform: 'translateY(-1px)',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    transition="all 0.2s ease-in-out"
                    boxShadow="sm"
                  >
                    <HStack w="100%" justify="space-between">
                      <Text flex="1" isTruncated fontWeight={filterLanguage !== 'all' ? 'semibold' : 'normal'}>
                        {filterLanguage === 'all' ? 'All Languages' : filterLanguage.charAt(0).toUpperCase() + filterLanguage.slice(1)}
                      </Text>
                      <Icon as={ChevronDownIcon} color={filterLanguage !== 'all' ? 'teal.400' : textColor} boxSize={4} />
                    </HStack>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  width="220px"
                  borderRadius="md"
                  borderColor={borderColor}
                  boxShadow="lg"
                  p={0}
                  _focus={{ outline: 'none' }}
                  bg={useColorModeValue('white', 'gray.800')}
                >
                  <PopoverArrow bg={useColorModeValue('white', 'gray.800')} />
                  <Box maxH="300px" overflowY="auto" py={2}>
                    <Box 
                      px={4} 
                      py={2} 
                      cursor="pointer"
                      onClick={() => toggleLanguageFilter('all')}
                      fontWeight={filterLanguage === 'all' ? 'semibold' : 'normal'}
                      bg={filterLanguage === 'all' ? useColorModeValue('teal.50', 'teal.900') : 'transparent'}
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                      borderRadius="md"
                      transition="all 0.2s ease"
                    >
                      <HStack w="100%" justify="space-between">
                        <Text>All Languages</Text>
                        {filterLanguage === 'all' && (
                          <Icon as={CheckIcon} color="teal.500" />
                        )}
                      </HStack>
                    </Box>
                    <Divider my={1} borderColor={borderColor} />
                    {availableLanguages.map(lang => (
                      <Box 
                        key={lang}
                        px={4} 
                        py={2} 
                        cursor="pointer"
                        onClick={() => toggleLanguageFilter(lang)}
                        fontWeight={filterLanguage === lang ? 'semibold' : 'normal'}
                        bg={filterLanguage === lang ? useColorModeValue('teal.50', 'teal.900') : 'transparent'}
                        _hover={{ 
                          bg: useColorModeValue('gray.100', 'gray.700'),
                          transform: 'translateX(2px)',
                          transition: 'all 0.2s ease'
                        }}
                        borderRadius="md"
                        transition="all 0.2s ease"
                      >
                        <HStack w="100%" justify="space-between">
                          <HStack>
                            <Icon as={getLanguageIcon(lang)} color="teal.400" boxSize={4} />
                            <Text>{lang.charAt(0).toUpperCase() + lang.slice(1)}</Text>
                          </HStack>
                          {filterLanguage === lang && (
                            <Icon as={CheckIcon} color="teal.500" />
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </Box>
                </PopoverContent>
              </Popover>
            </Box>
          </HStack>
          
          {/* Right side: Sort options */}
          <SortMenu sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </Flex>
        
        {/* Snippets grid or list */}
        {filteredSnippets.length > 0 ? (
          viewMode === 'grid' ? (
            <Grid 
              templateColumns={`repeat(${columnCount}, 1fr)`} 
              gap={6}
              pb={6}
            >
              {filteredSnippets.map(snippet => (
                <GridItem key={snippet.id}>
                  <SnippetCard 
                    snippet={snippet} 
                    onSelect={onSelectSnippet} 
                    viewMode="grid"
                    onEditTitle={onEditTitle}
                    onDeleteSnippet={onDeleteSnippet}
                  />
                </GridItem>
              ))}
            </Grid>
          ) : (
            <VStack spacing={3} align="stretch" pb={6}>
              {filteredSnippets.map(snippet => (
                <SnippetCard 
                  key={snippet.id}
                  snippet={snippet} 
                  onSelect={onSelectSnippet} 
                  viewMode="compact"
                  onEditTitle={onEditTitle}
                  onDeleteSnippet={onDeleteSnippet}
                />
              ))}
            </VStack>
          )
        ) : (
          <EmptyResults 
            onAddSnippet={onAddSnippet} 
            hasFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        )}
      </Box>
    </Box>
  );
};

export default BrowseView;
