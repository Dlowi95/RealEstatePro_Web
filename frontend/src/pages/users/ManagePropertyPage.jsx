import React, { useEffect, useState } from "react";
import { Box, Container, Heading, SimpleGrid, Text, Badge, Stack, Button, HStack } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";

const ManagePropertiesPage = () => {
  const { user } = useUser();
  const [myProperties, setMyProperties] = useState([]);

  useEffect(() => {
    const fetchMyProperties = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/properties/user/${user.id}`);
        setMyProperties(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyProperties();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "green";
      case "pending":
        return "orange";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/properties/delete/${id}`);

      if (res.data.success) {
        setMyProperties((current) => current.filter((property) => property._id !== id));
        toaster.create({ title: "Đã xóa bài đăng", type: "success" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh">
      <Container maxW="container.lg" py={10}>
        <Heading size="lg" mb={6} color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
          Quản lý tin đăng của tôi
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          {myProperties.map((prop) => (
            <Box
              key={prop._id}
              p={5}
              bg={{ base: "white", _dark: "gray.900" }}
              shadow="sm"
              rounded="lg"
              border="1px solid"
              borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
            >
              <Stack gap={3}>
                <Box flex="1">
                  <Badge colorPalette={getStatusColor(prop.status)} mb={2}>
                    {prop.status === "approved" ? "Đã duyệt" : "Đang chờ duyệt"}
                  </Badge>
                  <Heading size="sm" noOfLines={1} color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
                    {prop.title}
                  </Heading>
                  <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.300" }} mt={1}>
                    {prop.location?.address}
                  </Text>
                </Box>
                <Text fontWeight="bold" color="#E65C00">
                  {new Intl.NumberFormat("vi-VN").format(prop.price)} VNĐ
                </Text>
              </Stack>

              <HStack gap={2} mt={4}>
                <Button size="sm" variant="outline" colorPalette="orange" as="a" href={`/edit-property/${prop._id}`}>
                  Sửa tin
                </Button>
                <Button size="sm" colorPalette="red" onClick={() => handleDelete(prop._id)}>
                  Xóa
                </Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default ManagePropertiesPage;