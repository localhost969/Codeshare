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
        <meta name="viewport" content="width=1024, initial-scale=0.4, minimum-scale=0.1, maximum-scale=2.0, user-scalable=yes" />
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

          /* Force desktop mode on mobile devices */
          @media only screen and (max-device-width: 768px) {
            html {
              -webkit-text-size-adjust: none;
              -ms-text-size-adjust: none;
            }
            body {
              min-width: 1024px;
              zoom: 1;
            }
          }

          /* Prevent responsive breakpoints from triggering */
          * {
            min-width: auto !important;
          }

          /* Custom Scrollbar Styles */
          ::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(203, 213, 225, 0.7);
            border-radius: 2px;
            border: 1px solid transparent;
            background-clip: content-box;
            transition: all 0.2s ease;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.9);
            background-clip: content-box;
          }

          ::-webkit-scrollbar-corner {
            background: transparent;
          }

          /* Dark mode scrollbar */
          [data-theme="dark"] ::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.8);
          }

          [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 0.9);
          }

          /* Firefox scrollbar */
          * {
            scrollbar-width: thin;
            scrollbar-color: rgba(203, 213, 225, 0.7) transparent;
          }

          [data-theme="dark"] * {
            scrollbar-color: rgba(71, 85, 105, 0.8) transparent;
          }

          /* Enhanced scrollbar for better UX */
          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </Head>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} key="chakra-color-mode-script" />
      <ChakraProvider theme={theme}>
        <ColorModeSync />
        <Box as="main" pb="60px">
          <Component {...pageProps} />
        </Box>
        <Box
          as="footer"
          position="fixed"
          left={0}
          bottom={0}
          width="100%"
          zIndex={100}
          bg="chakra-body-bg"
          // Optional: add shadow or border if desired
        >
          <Footer />
        </Box>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
