import React, { useState, useEffect, useRef, useMemo } from 'react';
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

// Custom components
const SnippetCard = ({ snippet, onSelect, viewMode, onEditTitle, onDeleteSnippet }) => {
  const { id, title, code, language, updatedAt, createdAt } = snippet;
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  
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
  
  // Compact view
  if (viewMode === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Flex
          direction="row"
          p={3}
          borderWidth="1px"
          borderRadius="md"
          borderColor={borderColor}
          bg={cardBg}
          _hover={{ bg: hoverBg, borderColor: 'teal.300' }}
          cursor="pointer"
          onClick={() => {
            onSelect(id);
          }}
          boxShadow="sm"
          transition="all 0.2s"
          align="center"
          justify="space-between"
        >
          <HStack spacing={3}>
            <Icon as={getLanguageIcon(language)} color={accentColor} boxSize={5} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="md">{title}</Text>
              <Text fontSize="xs" color={textColor}>
                {formatDate(updatedAt || createdAt)}
              </Text>
            </VStack>
          </HStack>
          
          <HStack spacing={1}>
            <Tag size="sm" colorScheme="teal" borderRadius="full">
              <TagLabel>{language || 'unknown'}</TagLabel>
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
              colorScheme="red"
              aria-label="Delete snippet"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSnippet(id);
              }}
            />
            <Icon as={ChevronRightIcon} color="gray.400" />
          </HStack>
        </Flex>
      </motion.div>
    );
  }
  
  // Grid view
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        borderColor={borderColor}
        _hover={{ borderColor: 'teal.300', boxShadow: 'md' }}
        cursor="pointer"
        onClick={() => {
          onSelect(id);
        }}
        transition="all 0.2s"
        height="100%"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <Box 
          bg={useColorModeValue(`${language?.toLowerCase() === 'javascript' ? 'yellow.50' : language?.toLowerCase() === 'python' ? 'blue.50' : language?.toLowerCase() === 'html' ? 'orange.50' : 'gray.50'}`, 'gray.700')} 
          p={4}
          borderBottomWidth="1px"
          borderColor={borderColor}
        >
          <Flex justify="space-between" align="center">
            <HStack>
              <Icon 
                as={getLanguageIcon(language)} 
                color={accentColor} 
                boxSize={5} 
              />
              <Heading size="sm" noOfLines={1}>
                {title}
              </Heading>
            </HStack>
            <Tag size="sm" colorScheme="teal" borderRadius="full">
              <TagLabel>{language || 'unknown'}</TagLabel>
            </Tag>
          </Flex>
        </Box>
        
        <Box p={3} flex="1">
          <Text 
            noOfLines={3} 
            fontSize="sm" 
            color={textColor}
            fontFamily="monospace"
            whiteSpace="pre-wrap"
          >
            {code ? code.substring(0, 150) + (code.length > 150 ? '...' : '') : 'No content'}
          </Text>
        </Box>
        
        <Flex 
          p={3} 
          borderTopWidth="1px" 
          borderColor={borderColor}
          justify="space-between"
          align="center"
          bg={useColorModeValue('gray.50', 'gray.700')}
          fontSize="xs"
        >
          <HStack spacing={1}>
            <Icon as={FaRegClock} />
            <Text>{formatDate(updatedAt || createdAt)}</Text>
          </HStack>
          
          <HStack spacing={1}>
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
              colorScheme="red"
              aria-label="Delete snippet"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSnippet(id);
              }}
            />
          </HStack>
        </Flex>
      </Box>
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
  
  return (
    <Center 
      p={10} 
      borderWidth="1px" 
      borderRadius="xl" 
      borderColor={borderColor} 
      bg={bgColor}
      minH="300px"
    >
      <VStack spacing={6}>
        <Icon 
          as={hasFilters ? FaFilter : FaFileCode} 
          fontSize="5xl" 
          color={useColorModeValue('teal.400', 'teal.300')} 
        />
        
        <VStack spacing={1}>
          <Heading size="md">
            {hasFilters ? 'No matching snippets' : 'No snippets found'}
          </Heading>
          
          <Text color={useColorModeValue('gray.600', 'gray.400')} textAlign="center" maxW="400px">
            {hasFilters 
              ? 'Try adjusting your search filters to find what you\'re looking for.'
              : 'Create your first code snippet to get started with CodeShare.'}
          </Text>
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
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={onAddSnippet}
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
    { value: 'az', label: 'A to Z', icon: ChevronDownIcon },
    { value: 'za', label: 'Z to A', icon: ChevronRightIcon },
  ];
  
  const currentOption = options.find(opt => opt.value === sortOrder);
  
  return (
    <Menu closeOnSelect={true}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" variant="outline">
        <HStack>
          <Icon as={currentOption?.icon} />
          <Text>{currentOption?.label}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        {options.map(option => (
          <MenuItem 
            key={option.value} 
            onClick={() => setSortOrder(option.value)}
            icon={<Icon as={option.icon} />}
            fontWeight={sortOrder === option.value ? 'bold' : 'normal'}
          >
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
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
            <Text fontSize="sm" color={textColor}>
              {stats.filtered} of {stats.total} snippet{stats.total !== 1 ? 's' : ''} • {stats.languages} language{stats.languages !== 1 ? 's' : ''}
            </Text>
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
              leftIcon={<AddIcon />}
              colorScheme="teal"
              onClick={onAddSnippet}
              size="md"
              fontWeight="medium"
            >
              New Snippet
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
          <HStack spacing={2} overflow="auto" pb={1}>
            <Text fontSize="sm" fontWeight="medium" color={textColor} whiteSpace="nowrap">
              Filter by:
            </Text>
            
            <Menu closeOnSelect={true}>
              <MenuButton 
                as={Button} 
                rightIcon={<ChevronDownIcon />} 
                size="sm" 
                variant="ghost"
                colorScheme={filterLanguage !== 'all' ? 'teal' : 'gray'}
                fontWeight={filterLanguage !== 'all' ? 'bold' : 'normal'}
              >
                <HStack>
                  <Text>Language</Text>
                </HStack>
              </MenuButton>
              <MenuList maxH="300px" overflow="auto">
                <MenuItem 
                  onClick={() => toggleLanguageFilter('all')}
                  fontWeight={filterLanguage === 'all' ? 'bold' : 'normal'}
                >
                  All Languages
                </MenuItem>
                <Divider my={1} />
                {availableLanguages.map(lang => (
                  <MenuItem 
                    key={lang} 
                    onClick={() => toggleLanguageFilter(lang)}
                    fontWeight={filterLanguage === lang ? 'bold' : 'normal'}
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    {filterLanguage === lang && (
                      <Icon as={CheckIcon} ml="auto" color="teal.500" />
                    )}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
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
