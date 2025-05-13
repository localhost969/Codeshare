import { ChakraProvider, ColorModeScript, Box, useColorMode } from "@chakra-ui/react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import theme from "../lib/theme";
import Head from "next/head";
import Footer from "../components/Footer";

// This component ensures color mode is synced across tabs/windows and updates live
function ColorModeSync() {
  const { colorMode, setColorMode } = useColorMode();
  const router = useRouter();

  useEffect(() => {
    // Set initial color mode from localStorage if available
    const storedColorMode = window.localStorage.getItem('chakra-ui-color-mode');
    if (storedColorMode && storedColorMode !== colorMode) {
      setColorMode(storedColorMode);
    }

    // Listen for color mode changes
    const handleStorageChange = (e) => {
      if (e.key === 'chakra-ui-color-mode') {
        // Update color mode without page refresh
        const newColorMode = e.newValue || 'light';
        if (newColorMode !== colorMode) {
          setColorMode(newColorMode);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [colorMode, setColorMode]);

  return null;
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CodeShare</title>
        <meta name="description" content="A real-time collaborative code editing platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style jsx global>{`
          html, body, #__next {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          #__next {
            min-height: 100%;
            position: relative;
          }
          main {
            padding-bottom: 30px; /* Space for fixed footer */
          }
        `}</style>
      </Head>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} key="chakra-color-mode-script" />
      <ChakraProvider theme={theme}>
        <ColorModeSync />
        <Box as="main">
          <Component {...pageProps} />
        </Box>
        <Footer />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
