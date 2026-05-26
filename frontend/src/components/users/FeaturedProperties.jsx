import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Image, Text, Badge, Flex, Spinner, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function FeaturedProperties({ limit = 6 }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/properties`);

        if (res.data?.success) {
          setProperties((res.data.data || []).slice(0, limit));
        } else {
          setError("Không thể tải danh sách bất động sản.");
        }
      } catch (err) {
        console.error("FeaturedProperties fetch error:", err);
        setError("Lỗi kết nối tới server.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [limit]);

  if (loading) {
    return (
      <Flex align="center" justify="center" py="6">
        <Spinner color="#E65C00" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box py="4">
        <Text color="#E65C00">{error}</Text>
      </Box>
    );
  }

  if (!properties.length) {
    return (
      <Box py="4">
        <Text color={{ base: "gray.600", _dark: "gray.300" }}>Chưa có bất động sản nào.</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.lg">
      <Box mb="6">
        <Text fontSize="xl" fontWeight="semibold" mb="4" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
          Tin mới nhất
        </Text>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)", lg: "repeat(3,1fr)" }} gap="4">
          {properties.map((p) => (
            <Box
              key={p._id}
              as={Link}
              to={`/property/${p._id}`}
              borderWidth="1px"
              borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
              borderRadius="md"
              overflow="hidden"
              bg={{ base: "white", _dark: "gray.900" }}
              transition="0.3s"
              _hover={{ shadow: "lg", transform: "translateY(-4px)", cursor: "pointer" }}
            >
              {p.images && p.images.length > 0 ? (
                <Image src={p.images[0]} alt={p.title} objectFit="cover" h="160px" w="100%" />
              ) : (
                <Box h="160px" bg={{ base: "gray.100", _dark: "gray.800" }} />
              )}
              <Box p="3">
                <Flex justify="space-between" align="center" mb="2">
                  <Text fontWeight="bold" noOfLines={1} color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
                    {p.title}
                  </Text>
                  <Badge colorPalette="orange">{p.type}</Badge>
                </Flex>
                <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }} mb="1" noOfLines={1}>
                  {p.location.address}, {p.location.ward || "Chưa cập nhật"}, {p.location.province}
                </Text>
                <Text fontSize="sm" fontWeight="semibold" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
                  Giá: {Number(p.price).toLocaleString("vi-VN")} VNĐ • {p.area} m²
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
