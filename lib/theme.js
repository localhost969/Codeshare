import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80caff',
      300: '#4db3ff',
      400: '#1a9dff',
      500: '#0080ff',
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'Menlo, monospace'
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
      },
    },
  },
  styles: {
    global: (props) => ({
      'html, body, #__next': {
        height: '100%',
        width: '100%',
      },
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        minHeight: '100vh',
      },
      '*::placeholder': {
        color: props.colorMode === 'dark' ? 'whiteAlpha.600' : 'gray.500',
      },
      '*, *::before, *::after': {
        borderColor: props.colorMode === 'dark' ? 'whiteAlpha.300' : 'gray.200',
      },
    }),
  },
  layerStyles: {
    gradientBackground: {
      position: 'relative',
      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: 'linear(to-br, var(--chakra-colors-teal-50), var(--chakra-colors-blue-50))',
        opacity: 0.7,
        zIndex: -1,
        _dark: {
          bgGradient: 'linear(to-br, var(--chakra-colors-teal-900), var(--chakra-colors-blue-900))',
        }
      }
    }
  }
});

export default theme;
