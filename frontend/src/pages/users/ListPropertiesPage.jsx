import React from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import PropertyList from "@/components/users/PropertyList";

export default function ListPropertiesPage() {
  return (
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh">
      <Container maxW="container.xl" py="6">
        <Box mb="6">
          <Text fontSize="3xl" fontWeight="bold" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
            Tất cả tin đăng
          </Text>
          <Text color={{ base: "gray.600", _dark: "gray.300" }} mt="2">
            Danh sách tất cả các bất động sản đã được duyệt trên toàn hệ thống.
          </Text>
        </Box>

        {/* GỌI COMPONENT DÙNG CHUNG: 
          Bắt buộc truyền hasSearched={true} trực tiếp tại đây để ép nó vẽ danh sách 
          bài đăng lên màn hình ngay khi vừa load trang mà không bị chặn trả về null nữa!
        */}
        <PropertyList hasSearched={true} />
        
      </Container>
    </Box>
  );
}