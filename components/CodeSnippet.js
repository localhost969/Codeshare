import React from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  IconButton, 
  useColorModeValue, 
  Tooltip, 
  Badge, 
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ChevronDownIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaCode, FaEllipsisV, FaRegCopy, FaDownload, FaShare, FaEdit, FaTrash } from 'react-icons/fa';
import { languageLabels } from './CodeEditor';  // Import shared language labels

// Language icons mapping
const getLanguageIcon = (language) => {
  const iconColor = useColorModeValue('gray.600', 'gray.400');
  
  // You could expand this with more specific icons for each language
  return <Icon as={FaCode} color={iconColor} boxSize="0.8rem" />;
};

// Language color mapping
const getLanguageColor = (language) => {
  const colorMap = {
    javascript: 'yellow',
    typescript: 'blue',
    python: 'green',
    html: 'orange',
    css: 'pink',
    java: 'red',
    cpp: 'purple',
    php: 'teal',
    sql: 'cyan'
  };
  
  return colorMap[language?.toLowerCase()] || 'gray';
};

const CodeSnippet = ({ snippet, onSelect, onDelete, onEditTitle, isSelected }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Styling
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedBgColor = useColorModeValue('teal.50', 'rgba(48, 140, 122, 0.2)');
  const selectedBorderColor = useColorModeValue('teal.200', 'teal.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get proper language display name
  const getLanguageLabel = (lang) => {
    return languageLabels[lang?.toLowerCase()] || lang;
  };

  return (
    <Box position="relative">
      <Flex>
        <Box 
          flex={1}
          p={2.5} 
          borderWidth="1px" 
          borderRadius="md" 
          borderColor={isSelected ? selectedBorderColor : borderColor}
          bg={isSelected ? selectedBgColor : bgColor}
          _hover={{ 
            bg: isSelected ? selectedBgColor : hoverBgColor,
            borderColor: isSelected ? selectedBorderColor : 'teal.200',
            transform: 'translateY(-1px)',
            boxShadow: 'sm'
          }}
          transition="all 0.2s"
          cursor="pointer"
          onClick={() => onSelect(snippet.id)}
          position="relative"
          overflow="hidden"
        >
          {/* Selection indicator */}
          {isSelected && (
            <Box 
              position="absolute"
              left={0}
              top={0}
              bottom={0}
              width="3px"
              bg="teal.500"
            />
          )}
          
          <Flex direction="column">
            {/* Title row */}
            <Text 
              fontWeight={isSelected ? "bold" : "medium"} 
              fontSize="sm" 
              noOfLines={1}
              color={isSelected ? "teal.700" : undefined}
              pl={isSelected ? 2 : 0}
              mb={1.5}
            >
              {snippet.title}
            </Text>
            
            {/* Language and metadata row */}
            <Flex justify="space-between" align="center" pl={isSelected ? 2 : 0}>
              <HStack spacing={1.5}>
                <Badge 
                  colorScheme={getLanguageColor(snippet.language)} 
                  variant="subtle" 
                  fontSize="xs"
                  px={1.5}
                  py={0.5}
                  borderRadius="full"
                >
                  <Flex align="center" gap={1}>
                    {getLanguageIcon(snippet.language)}
                    <Text>{getLanguageLabel(snippet.language)}</Text>
                  </Flex>
                </Badge>
              </HStack>
              
              <Text fontSize="xs" color="gray.500" fontStyle="italic">
                {formatDate(snippet.updatedAt)}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Action buttons vertically on the right */}
        <VStack 
          spacing={1} 
          ml={1}
          justify="center"
        >
          <IconButton
            icon={<FaEdit />}
            size="xs"
            variant="ghost"
            colorScheme="teal"
            aria-label="Edit snippet title"
            onClick={(e) => {
              e.stopPropagation();
              onEditTitle(snippet.id);
            }}
          />
          <IconButton
            icon={<FaTrash />}
            size="xs"
            variant="ghost"
            colorScheme="red"
            aria-label="Delete snippet"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(snippet.id);
            }}
          />
        </VStack>
      </Flex>
    </Box>
  );
};

export default CodeSnippet;
