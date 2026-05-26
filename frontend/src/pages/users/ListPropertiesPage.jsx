import { useEffect, useState } from "react";
import { Box, Container, Spinner, Text, Grid, Image, Badge, Flex, Button } from "@chakra-ui/react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ListPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/properties`);
        if (res.data?.success) {
          setProperties(res.data.data || []);
        } else {
          setError("Không thể tải danh sách bất động sản.");
        }
      } catch (err) {
        console.error("ListPropertiesPage fetch error:", err);
        setError("Lỗi kết nối tới server.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) {
    return (
      <Container maxW="container.lg" py="10">
        <Flex justify="center">
          <Spinner />
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py="10">
        <Text color="red.500">{error}</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py="6">
      <Box mb="6">
        <Text fontSize="3xl" fontWeight="bold">
          Tất cả tin đăng
        </Text>
        <Text color="gray.600" mt="2">
          Danh sách tất cả các bất động sản đã được duyệt.
        </Text>
      </Box>

      {properties.length === 0 ? (
        <Text color="gray.500">Không có bất động sản.</Text>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2,1fr)", lg: "repeat(4,1fr)" }}
          gap="4"
        >
          {properties.map((property) => (
            <Box
              key={property._id}
              as={Link}
              to={`/property/${property._id}`}
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              bg="white"
              transition="0.3s"
              _hover={{
                shadow: "lg",
                transform: "translateY(-4px)",
                cursor: "pointer",
              }}
            >
              {property.images && property.images.length > 0 ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  objectFit="cover"
                  h="160px"
                  w="100%"
                />
              ) : (
                <Box h="160px" bg="gray.100" />
              )}
              <Box p="3">
                <Flex justify="space-between" align="center" mb="2">
                  <Text fontWeight="bold" noOfLines={1}>
                    {property.title}
                  </Text>
                  <Badge colorScheme="green">{property.type}</Badge>
                </Flex>
                <Text fontSize="sm" color="gray.600" mb="1" noOfLines={1}>
                  {property.location?.address}, {property.location?.ward || "Chưa cập nhật"},{" "}
                  {property.location?.province}
                </Text>
                <Text fontSize="sm" fontWeight="semibold">
                  Giá: {Number(property.price).toLocaleString("vi-VN")} VNĐ • {property.area} m²
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>
      )}

      <Box mt="8">
        <Button as={Link} to="/" variant="ghost" color="orange.500">
          Quay lại
        </Button>
      </Box>
    </Container>
  );
}

