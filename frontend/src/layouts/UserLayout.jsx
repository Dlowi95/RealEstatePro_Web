import ChatbotWidget from "@/components/users/ChatbotWidget";
import Navbar from "@/components/users/Navbar";
import React from "react";
import Footer from "@/components/users/Footer";
import { Box } from "@chakra-ui/react";

const UserLayout = ({ children }) => {
  return (
    <Box
      bg={{ base: "gray.50", _dark: "gray.950" }}
      color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
      minH="100vh"
      w="100%"
      overflowX="hidden"
    >
      <Navbar />

      <Box as="main" w="100%" px={{ base: "4", md: "6", lg: "8" }} maxW="1200px" mx="auto" pt="75px">
        {children}
      </Box>

      <ChatbotWidget />
      <Footer />
    </Box>
  );
};

export default UserLayout;