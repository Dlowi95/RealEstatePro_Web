import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import PropertyList from "@/components/users/PropertyList";

export default function ListPropertiesPage() {
  return (
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh">
      <Container maxW="1200px" py="6" px={{ base: "4", md: "6" }}>
        <Box mb="6">
          <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
            Tất cả tin đăng
          </Text>
          <Text color={{ base: "gray.600", _dark: "gray.300" }} mt="2" fontSize="sm">
            Danh sách tất cả các bất động sản đã được duyệt trên toàn hệ thống.
          </Text>
        </Box>
        <PropertyList hasSearched={true} />
      </Container>
    </Box>
  );
}