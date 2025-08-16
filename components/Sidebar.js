import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  Heading, 
  Button, 
  Input, 
  useColorModeValue,
  useColorMode,
  Divider,
  Text,
  Flex,
  Icon,
  InputGroup,
  InputRightElement,
  Badge,
  Collapse,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Tooltip,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast
} from '@chakra-ui/react';
import { 
  AddIcon, 
  SearchIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  SettingsIcon,
  LinkIcon,
  ViewIcon,
  ViewOffIcon,
  EditIcon,
  LockIcon
} from '@chakra-ui/icons';
import { 
  FaCode, 
  FaFolder, 
  FaFolderOpen, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaFilter,
  FaUser,
  FaShareAlt,
  FaUserPlus,
  FaCopy
} from 'react-icons/fa';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CodeSnippet from './CodeSnippet';

const Sidebar = ({ 
  snippets, 
  selectedSnippetId, 
  onSelectSnippet, 
  onAddSnippet, 
  onDeleteSnippet,
  onEditTitle,
  spaceId,
  spaceName
}) => {
  // State to store space data from Firebase
  const [spaceData, setSpaceData] = useState(null);
  const [isLoadingSpaceData, setIsLoadingSpaceData] = useState(false);
  
  // Fetch space data from Firebase when needed
  const fetchSpaceData = async () => {
    if (!spaceId) return;
    
    setIsLoadingSpaceData(true);
    try {
      const spaceRef = doc(db, 'spaces', spaceId);
      const spaceDoc = await getDoc(spaceRef);
      
      if (spaceDoc.exists()) {
        setSpaceData(spaceDoc.data());
      } else {
        console.error('Space not found in Firebase');
      }
    } catch (error) {
      console.error('Error fetching space data:', error);
    } finally {
      setIsLoadingSpaceData(false);
    }
  };
  
  // Fetch space data when opening password modal
  const handleOpenPasswordModal = async () => {
    await fetchSpaceData();
    onOpenPasswordModal();
  };
  // State for modals
  const { isOpen: isInviteModalOpen, onOpen: onOpenInviteModal, onClose: onCloseInviteModal } = useDisclosure();
  const { isOpen: isPasswordModalOpen, onOpen: onOpenPasswordModal, onClose: onClosePasswordModal } = useDisclosure();
  const toast = useToast();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'az', 'za'
  const { isOpen: isFiltersOpen, onToggle: onToggleFilters } = useDisclosure();
  
  // Password management state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  // Refs for password inputs
  const currentPasswordRef = useRef(null);
  
  // Styling
  const { colorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBgColor = useColorModeValue('gray.50', 'gray.900');
  const accentColor = useColorModeValue('teal.500', 'teal.300');
  
  // Enhanced dark mode styling
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const sidebarGradient = colorMode === 'dark' ? {
    bgGradient: 'linear(to-b, gray.800, gray.900)',
    boxShadow: 'inset -1px 0 0 0 rgba(255, 255, 255, 0.1)',
  } : {};
  
  // Filter and sort snippets
  const filteredSnippets = snippets
    .filter(snippet => {
      if (!searchQuery) return true;
      return snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             snippet.language.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'oldest':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  
  // Get language counts for potential filtering
  const languageCounts = snippets.reduce((acc, snippet) => {
    acc[snippet.language] = (acc[snippet.language] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <>
      <Flex 
        direction="column"
        width="280px" 
        height="100vh" 
        bg={sidebarBg} 
        borderRightWidth="1px"
        borderColor={borderColor}
        overflow="hidden" // ensure no scrollbars on y-axis
        {...sidebarGradient}
        transition="all 0.2s"
        position="fixed"
        top={0}
        left={0}
        zIndex={120}
      >
      {/* Header */}
      <Box 
        p={4} 
        borderBottomWidth="1px" 
        borderColor={borderColor}
        bg={sidebarBg}
      >
        <Flex justify="space-between" align="center" mb={3}>
          <Heading 
            size="md" 
            fontWeight="bold" 
            color={accentColor}
            letterSpacing="tight"
          >
            CodeShare
          </Heading>
          <HStack spacing={1}>
            <Tooltip label="Share workspace" placement="top">
              <IconButton
                icon={<FaShareAlt />}
                variant="ghost"
                size="sm"
                aria-label="Share workspace"
                color={colorMode === 'dark' ? 'teal.200' : undefined}
                _hover={{
                  bg: colorMode === 'dark' ? 'rgba(49, 151, 149, 0.2)' : undefined,
                  color: colorMode === 'dark' ? 'teal.100' : undefined,
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s"
                onClick={onOpenInviteModal}
              />
            </Tooltip>
            <Tooltip label="Password settings" placement="top">
              <IconButton
                icon={<LockIcon />}
                variant="ghost"
                size="sm"
                aria-label="Password settings"
                color={colorMode === 'dark' ? 'teal.200' : undefined}
                _hover={{
                  bg: colorMode === 'dark' ? 'rgba(49, 151, 149, 0.2)' : undefined,
                  color: colorMode === 'dark' ? 'teal.100' : undefined,
                  transform: 'scale(1.05)'
                }}
                transition="all 0.2s"
                onClick={handleOpenPasswordModal}
              />
            </Tooltip>
            <Menu placement="bottom-end">
              
              <MenuList zIndex={10}>
                <MenuItem icon={<FaUserPlus />} onClick={onOpenInviteModal}>Invite Users</MenuItem>
                <MenuItem icon={<LockIcon />} onClick={handleOpenPasswordModal}>Password Settings</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
        
        <Flex
          py={2.5}
          px={4}
          borderRadius="md" 
          bg={useColorModeValue('teal.50', 'rgba(49, 151, 149, 0.15)')}
          borderLeftWidth="3px"
          borderColor={accentColor}
          mb={3}
          align="center"
          justify="space-between"
        >
          <HStack spacing={3}>
            <Avatar 
              size="sm" 
              bg={accentColor} 
              icon={<Icon as={FaFolder} fontSize="0.9rem" color="white" />} 
            />
            <Text 
              fontSize="md" 
              fontWeight="bold" 
              color={useColorModeValue('gray.700', 'white')} 
            >
              {spaceName || spaceId}
            </Text>
          </HStack>
          
          <Badge 
            colorScheme="teal" 
            variant="solid" 
            fontSize="xs"
            borderRadius="full"
            px={2}
            py={0.5}
          >
            active
          </Badge>
        </Flex>
      </Box>
      
      {/* Search and Actions */}
      <Box p={4} borderBottomWidth="1px" borderColor={borderColor}>
        <InputGroup size="sm" mb={3}>
          <InputRightElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputRightElement>
          <Input 
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            borderRadius="md"
            bg={useColorModeValue('gray.50', 'gray.700')}
          />
        </InputGroup>
        
        <Button 
          leftIcon={<AddIcon boxSize={3.5} />} 
          colorScheme="teal" 
          size={{ base: 'md', md: 'sm' }} 
          width="100%" 
          height={{ base: '42px', md: '36px' }}
          onClick={onAddSnippet}
          fontWeight="medium"
          boxShadow="sm"
          px={4}
          py={2}
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
          New Snippet
        </Button>
      </Box>
      
      {/* Filters */}
      <Box px={4} py={2} borderBottomWidth="1px" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <HStack>
            <Text fontSize="xs" fontWeight="medium" color="gray.500">
              {filteredSnippets.length} snippet{filteredSnippets.length !== 1 ? 's' : ''}
            </Text>
            {searchQuery && (
              <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                Filtered
              </Badge>
            )}
          </HStack>
          
          <HStack spacing={1}>
            <Tooltip label="Sort snippets" placement="top">
              <Menu placement="bottom-end">
                <MenuButton
                  as={IconButton}
                  icon={sortOrder.includes('a') ? <FaSortAmountUp size="0.8rem" /> : <FaSortAmountDown size="0.8rem" />}
                  variant="ghost"
                  size="xs"
                  aria-label="Sort snippets"
                />
                <MenuList zIndex={10} minW="120px">
                  <MenuItem 
                    fontSize="xs"
                    icon={<Icon as={FaSortAmountDown} />} 
                    onClick={() => setSortOrder('newest')}
                    fontWeight={sortOrder === 'newest' ? 'bold' : 'normal'}
                  >
                    Newest
                  </MenuItem>
                  <MenuItem 
                    fontSize="xs"
                    icon={<Icon as={FaSortAmountUp} />} 
                    onClick={() => setSortOrder('oldest')}
                    fontWeight={sortOrder === 'oldest' ? 'bold' : 'normal'}
                  >
                    Oldest
                  </MenuItem>
                  <MenuItem 
                    fontSize="xs"
                    icon={<ChevronDownIcon />} 
                    onClick={() => setSortOrder('az')}
                    fontWeight={sortOrder === 'az' ? 'bold' : 'normal'}
                  >
                    A to Z
                  </MenuItem>
                  <MenuItem 
                    fontSize="xs"
                    icon={<ChevronRightIcon />} 
                    onClick={() => setSortOrder('za')}
                    fontWeight={sortOrder === 'za' ? 'bold' : 'normal'}
                  >
                    Z to A
                  </MenuItem>
                </MenuList>
              </Menu>
            </Tooltip>
            
            <Tooltip label="Toggle filters" placement="top">
              <IconButton
                icon={<FaFilter size="0.8rem" />}
                variant="ghost"
                size="xs"
                aria-label="Toggle filters"
                onClick={onToggleFilters}
              />
            </Tooltip>
          </HStack>
        </Flex>
        
        <Collapse in={isFiltersOpen} animateOpacity>
          <Box pt={2}>
            <Text fontSize="xs" fontWeight="medium" mb={1}>Filter by language:</Text>
            <Flex wrap="wrap" gap={1}>
              {Object.entries(languageCounts).map(([lang, count]) => (
                <Badge 
                  key={lang} 
                  colorScheme="gray" 
                  variant="subtle" 
                  fontSize="xs"
                  cursor="pointer"
                  onClick={() => setSearchQuery(lang)}
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {lang} ({count})
                </Badge>
              ))}
            </Flex>
          </Box>
        </Collapse>
      </Box>
      
      {/* Snippets List */}
      <Box flex="1" p={3}>
        {filteredSnippets.length > 0 ? (
          <VStack align="stretch" spacing={2}>
            {filteredSnippets.map(snippet => (
              <CodeSnippet 
                key={snippet.id}
                snippet={snippet}
                onSelect={onSelectSnippet}
                onDelete={() => onDeleteSnippet(snippet.id)}
                onEditTitle={onEditTitle}
                isSelected={selectedSnippetId === snippet.id}
              />
            ))}
          </VStack>
        ) : (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            h="100%" 
            py={8}
            opacity={0.7}
          >
            <Icon as={FaCode} fontSize="2xl" color="gray.400" mb={2} />
            <Text fontSize="sm" color="gray.500" textAlign="center">
              {searchQuery ? 'No matching snippets found' : 'No snippets yet. Create one to get started!'}
            </Text>
            {searchQuery && (
              <Button 
                size="xs" 
                variant="link" 
                colorScheme="teal" 
                mt={2}
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </Flex>
        )}
      </Box>
      </Flex>
      
      {/* Invite Users Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={onCloseInviteModal} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent bg={bgColor} borderColor={borderColor} boxShadow="xl">
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor} pb={4}>
            <Text fontSize="lg" fontWeight="bold">Invite to Workspace</Text>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              <Text>Share this link with others to invite them to this workspace:</Text>
              
              <Flex>
                <Input 
                  value={`${window.location.origin}/join/${spaceId}`}
                  isReadOnly
                  pr="4.5rem"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  fontFamily="mono"
                />
                <Tooltip label="Copy link" placement="top">
                  <IconButton
                    icon={<FaCopy />}
                    aria-label="Copy invite link"
                    ml={2}
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/join/${spaceId}`);
                      toast({
                        title: "Link copied",
                        status: "success",
                        duration: 2000,
                        isClosable: true,
                      });
                    }}
                  />
                </Tooltip>
              </Flex>
              
              <Text fontSize="sm" color="gray.500">
                Anyone with this link can join your workspace and collaborate in real-time.
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor} pt={4}>
            <Button colorScheme="teal" onClick={onCloseInviteModal}>
              Done
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Password Settings Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={onClosePasswordModal} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent 
          bg={bgColor} 
          borderColor={borderColor} 
          boxShadow="xl"
          borderRadius="xl"
          overflow="hidden"
        >
          <Box 
            bg={useColorModeValue('teal.50', 'teal.900')} 
            py={4} 
            px={6}
            borderBottomWidth="1px" 
            borderColor={borderColor}
          >
            <Flex align="center" justify="space-between">
              <Flex align="center">
                <Icon as={LockIcon} color={accentColor} mr={2} boxSize={5} />
                <Heading size="md" fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>
                  Password Settings
                </Heading>
              </Flex>
              <ModalCloseButton position="static" top="auto" right="auto" />
            </Flex>
          </Box>
          
          <ModalBody py={6} px={6}>
            <VStack spacing={5} align="stretch">
              {!isChangingPassword ? (
                <>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="md"
                    bg={useColorModeValue('white', 'gray.700')}
                  >
                    <Text fontWeight="semibold" fontSize="sm" mb={2} color={useColorModeValue('gray.600', 'gray.300')}>
                      Current Password
                    </Text>
                    <InputGroup size="md">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={isLoadingSpaceData ? "Loading..." : (showCurrentPassword && spaceData ? spaceData.password : "••••••••••••")}
                        isReadOnly
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        isDisabled={isLoadingSpaceData}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{ borderColor: useColorModeValue('gray.400', 'gray.500') }}
                        fontFamily="mono"
                        pr="4.5rem"
                      />
                      <InputRightElement width="4.5rem">
                        <Button 
                          h="1.75rem" 
                          size="sm" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          variant="ghost"
                          colorScheme="teal"
                        >
                          {showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    
                    <Text fontSize="xs" mt={2} color={useColorModeValue('gray.500', 'gray.400')}>
                      This is your current workspace password. Keep it secure.
                    </Text>
                  </Box>
                  
                  <Flex justify="center" mt={2}>
                    <Button 
                      leftIcon={<EditIcon />} 
                      colorScheme="teal" 
                      size="md"
                      fontWeight="medium"
                      boxShadow="sm"
                      onClick={() => {
                        setIsChangingPassword(true);
                        setTimeout(() => {
                          if (currentPasswordRef.current) {
                            currentPasswordRef.current.focus();
                          }
                        }, 100);
                      }}
                    >
                      Change Password
                    </Button>
                  </Flex>
                </>
              ) : (
                <>
                  <Box 
                    p={4} 
                    borderWidth="1px" 
                    borderColor={borderColor} 
                    borderRadius="md"
                    bg={useColorModeValue('white', 'gray.700')}
                  >
                    <Text fontWeight="semibold" fontSize="sm" mb={2} color={useColorModeValue('gray.600', 'gray.300')}>
                      Current Password
                    </Text>
                    <InputGroup size="md">
                      <Input
                        ref={currentPasswordRef}
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{ borderColor: useColorModeValue('gray.400', 'gray.500') }}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                        pr="4.5rem"
                      />
                      <InputRightElement width="4.5rem">
                        <Button 
                          h="1.75rem" 
                          size="sm" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          variant="ghost"
                          colorScheme="teal"
                        >
                          {showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                  
                  <Box 
                    p={4} 
                    borderWidth="1px" 
                    borderColor={borderColor} 
                    borderRadius="md"
                    bg={useColorModeValue('white', 'gray.700')}
                  >
                    <Text fontWeight="semibold" fontSize="sm" mb={2} color={useColorModeValue('gray.600', 'gray.300')}>
                      New Password
                    </Text>
                    <InputGroup size="md" mb={3}>
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        bg={useColorModeValue('gray.50', 'gray.800')}
                        borderColor={useColorModeValue('gray.300', 'gray.600')}
                        _hover={{ borderColor: useColorModeValue('gray.400', 'gray.500') }}
                        _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                        pr="4.5rem"
                      />
                      <InputRightElement width="4.5rem">
                        <Button 
                          h="1.75rem" 
                          size="sm" 
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          variant="ghost"
                          colorScheme="teal"
                        >
                          {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    
                    <Text fontWeight="semibold" fontSize="sm" mb={2} color={useColorModeValue('gray.600', 'gray.300')}>
                      Confirm New Password
                    </Text>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      bg={useColorModeValue('gray.50', 'gray.800')}
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{ borderColor: useColorModeValue('gray.400', 'gray.500') }}
                      _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                    />
                    
                    <Text fontSize="xs" mt={2} color={useColorModeValue('gray.500', 'gray.400')}>
                      Enter a secure password for your workspace.
                    </Text>
                  </Box>
                  
                  {passwordError && (
                    <Box 
                      p={4} 
                      bg={useColorModeValue('red.50', 'rgba(254, 178, 178, 0.15)')} 
                      color={useColorModeValue('red.600', 'red.200')} 
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="medium"
                      borderWidth="1px"
                      borderColor={useColorModeValue('red.100', 'red.800')}
                    >
                      {passwordError}
                    </Box>
                  )}
                  
                  <Flex justify="flex-end" mt={2} gap={3}>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setPasswordError('');
                      }}
                      borderColor={borderColor}
                      _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      colorScheme="teal" 
                      isDisabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                      isLoading={isUpdatingPassword}
                      loadingText="Updating..."
                      boxShadow="sm"
                      onClick={async () => {
                        if (!spaceId) {
                          setPasswordError('Space ID not found. Please refresh the page.');
                          return;
                        }
                        

                        
                        if (newPassword !== confirmPassword) {
                          setPasswordError('New passwords do not match.');
                          return;
                        }
                        
                        setPasswordError('');
                        setIsUpdatingPassword(true);
                        
                        try {
                          // If we don't have space data yet, fetch it
                          if (!spaceData) {
                            // Get the space document
                            const spaceRef = doc(db, 'spaces', spaceId);
                            const spaceDoc = await getDoc(spaceRef);
                            
                            if (!spaceDoc.exists()) {
                              setPasswordError('Space not found. It might have been deleted.');
                              setIsUpdatingPassword(false);
                              return;
                            }
                            
                            setSpaceData(spaceDoc.data());
                          }
                          
                          // Verify current password
                          if (spaceData.password !== currentPassword) {
                            setPasswordError('Current password is incorrect.');
                            setIsUpdatingPassword(false);
                            return;
                          }
                          
                          // Get a reference to the space document
                          const spaceRef = doc(db, 'spaces', spaceId);
                          
                          // Update password in Firestore
                          await updateDoc(spaceRef, {
                            password: newPassword,
                            updatedAt: new Date().toISOString()
                          });
                          
                          // Update local state with new password
                          setSpaceData({
                            ...spaceData,
                            password: newPassword,
                            updatedAt: new Date().toISOString()
                          });
                          
                          toast({
                            title: "Password updated",
                            description: "Your workspace password has been successfully updated.",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                          });
                          
                          setIsChangingPassword(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setIsUpdatingPassword(false);
                        } catch (error) {
                          console.error('Error updating password:', error);
                          setPasswordError(error.message || 'An unexpected error occurred');
                          setIsUpdatingPassword(false);
                        }
                      }}
                    >
                      Update Password
                    </Button>
                  </Flex>
                </>
              )}
            </VStack>
          </ModalBody>

          {!isChangingPassword && (
            <ModalFooter 
              borderTopWidth="1px" 
              borderColor={borderColor} 
              py={4}
              bg={useColorModeValue('gray.50', 'gray.800')}
            >
              <Button 
                colorScheme="teal" 
                onClick={onClosePasswordModal}
                size="md"
                fontWeight="medium"
                boxShadow="sm"
              >
                Done
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Sidebar;
