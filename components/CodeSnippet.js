import React from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Tooltip,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

const CodeSnippet = ({
  snippet,
  onSelect,
  onDelete,
  onEditTitle,
  isSelected,
}) => {
  const cardBg = useColorModeValue('gray.50', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const cardShadow = useColorModeValue('sm', 'sm'); // Chakra's default shadow for subtlety
  const selectedBorder = useColorModeValue('teal.400', 'teal.300');
  const hoverBg = useColorModeValue('teal.50', 'rgba(49,151,149,0.15)');
  const titleColor = useColorModeValue('gray.800', 'white');
  const subColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Flex align="flex-start" w="100%" gap={0}>
      {/* Main Card */}
      <Box
        as="button"
        flex="1"
        w="100%"
        textAlign="left"
        bg={isSelected ? hoverBg : cardBg}
        borderWidth="1px"
        borderColor={isSelected ? selectedBorder : cardBorder}
        borderRadius="md"
        boxShadow={cardShadow}
        px={3}
        py={2.5}
        transition="all 0.2s"
        _hover={{
          bg: hoverBg,
          boxShadow: useColorModeValue('md', 'md'),
          borderColor: selectedBorder,
          transform: 'translateY(-1px)',
        }}
        _active={{
          transform: 'scale(0.99)',
          boxShadow: useColorModeValue('sm', 'sm'),
        }}
        onClick={() => onSelect(snippet.id)}
        position="relative"
        overflow="hidden"
        role="group"
      >
        {/* Rotated Language Tag */}
        <Box
          position="absolute"
          left="-28px"
          top="50%"
          transform="translateY(-50%) rotate(-90deg)"
          fontSize="0.7em"
          fontWeight="bold"
          letterSpacing="wide"
          whiteSpace="nowrap"
          color={titleColor}
          px={0}
          py={0}
        >
          #{snippet.language}
        </Box>
        <Flex align="flex-start" justify="space-between">
          <Box flex="1" minW={0}>
            <HStack spacing={2} align="center">
              <Text
                fontWeight="600"
                fontSize="sm"
                color={titleColor}
                isTruncated
                maxW="180px"
                lineHeight="1.25"
              >
                {snippet.title}
              </Text>
            </HStack>
            <Text
              fontSize="xx-small"
              color={subColor}
              mt={1}
              lineHeight="1.3"
            >
              Last updated: {new Date(snippet.updatedAt).toLocaleString(undefined, {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Box>

          <HStack spacing={0.5} ml={2} opacity={0} _groupHover={{ opacity: 1 }} transition="opacity 0.2s">
            <Tooltip label="Edit title" hasArrow>
              <IconButton
                icon={<EditIcon />}
                size="xs"
                variant="ghost"
                aria-label="Edit title"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTitle(snippet.id);
                }}
                _hover={{ color: 'teal.500', bg: 'teal.50' }}
                color={isSelected ? 'teal.500' : 'gray.500'}
              />
            </Tooltip>
            <Tooltip label="Delete snippet" hasArrow>
              <IconButton
                icon={<DeleteIcon />}
                size="xs"
                variant="ghost"
                aria-label="Delete snippet"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(snippet.id);
                }}
                _hover={{ color: 'red.500', bg: 'red.50' }}
                color="gray.500"
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* Tags at the bottom */}
        <Flex mt={2} wrap="wrap" gap={2}>
          {snippet.tags?.map((tag) => (
            <Text
              key={tag}
              fontSize="0.65em"
              textTransform="capitalize"
            >
              #{tag}
            </Text>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
};

export default React.memo(CodeSnippet);