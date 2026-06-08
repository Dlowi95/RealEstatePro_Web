import React, { useEffect, useState } from "react";
import { Box, Container, Heading, SimpleGrid, Text, Badge, Stack, Button, HStack, Flex, Spinner } from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FiInbox } from "react-icons/fi";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ManagePropertiesPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProperties = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/properties/user/${user.id}`);
        setMyProperties(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProperties();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "green";
      case "pending": return "orange";
      case "rejected": return "red";
      default: return "gray";
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này?")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/properties/delete/${id}`);
      if (res.data.success) {
        setMyProperties((current) => current.filter((property) => property._id !== id));
        toaster.create({ title: "Đã xóa bài đăng", type: "success" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh" w="100%">
      <Container maxW="1200px" py={{ base: "4", md: "10" }} px={{ base: "4", md: "6" }}>
        <Heading size="lg" mb={6} color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
          Quản lý tin đăng của tôi
        </Heading>
        {loading ? (
          <Flex align="center" justify="center" py="10"><Spinner color="#E65C00" size="xl" /></Flex>
        ) : myProperties.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={20}
            bg={{ base: "white", _dark: "gray.900" }}
            rounded="lg"
            borderWidth="1px"
            borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
            px={6}
          >
            <Box mb={4} fontSize="6xl" color={{ base: "gray.300", _dark: "gray.500" }}>
              <FiInbox />
            </Box>
            <Text fontSize="lg" fontWeight="semibold" mb={2} color={{ base: "gray.700", _dark: "whiteAlpha.900" }}>
              Chưa có tin đăng nào
            </Text>
            <Text color={{ base: "gray.500", _dark: "gray.400" }} mb={6} maxW="400px">
              Bạn có thể đăng bài ngay hoặc chỉnh sửa cấu hình tài khoản để bắt đầu.
            </Text>
            <Button as={RouterLink} to="/create-property" bg="#E65C00" color="white" _hover={{ bg: "#CC5200" }} size="sm" borderRadius="xl">
              Đăng bài ngay
            </Button>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="100%">
            {myProperties.map((prop) => (
              <Box
                key={prop._id}
                p={5}
                bg={{ base: "white", _dark: "gray.900" }}
                shadow="sm"
                rounded="lg"
                border="1px solid"
                borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
                cursor="pointer"
                onClick={() => navigate(`/property/${prop._id}`)}
                _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s" }}
              >
                <Stack gap={3}>
                  <Box flex="1">
                    <Badge colorPalette={getStatusColor(prop.status)} mb={2}>
                      {prop.status === "approved" ? "Đã duyệt" : prop.status === "pending" ? "Đang chờ duyệt" : "Bị từ chối"}
                    </Badge>
                    <Heading size="sm" noOfLines={1} color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>{prop.title}</Heading>
                    <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.300" }} mt={1}>{prop.location?.address}</Text>
                  </Box>
                  <Text fontWeight="bold" color="#E65C00">{new Intl.NumberFormat("vi-VN").format(prop.price)} VNĐ</Text>
                </Stack>
                <HStack gap={2} mt={4} onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" colorPalette="orange" as={RouterLink} to={`/edit-property/${prop._id}`}>Sửa tin</Button>
                  <Button size="sm" colorPalette="red" onClick={() => handleDelete(prop._id)}>Xóa</Button>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default ManagePropertiesPage;