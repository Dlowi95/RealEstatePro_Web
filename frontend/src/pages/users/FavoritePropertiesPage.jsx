import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Grid, Image, Text, Badge, Flex, Spinner, Container, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "@/components/users/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function FavoritePropertiesPage() {
  const { user } = useUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/properties/favorites/${user.id}`);
        if (res.data?.success) {
          setProperties(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching favorite properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <Box bg="gray.50" minH="100vh">
      <SignedIn>
        <Container maxW="container.xl" py={8}>
          <Heading size="lg" mb={6} borderBottom="2px solid" borderColor="red.500" w="fit-content" pb={1}>
            Tin Đăng Đã Yêu Thích ({properties.length})
          </Heading>

          {loading ? (
            <Flex align="center" justify="center" py="10">
              <Spinner color="red.500" size="xl" />
            </Flex>
          ) : properties.length === 0 ? (
            <Box textAlignment="center" py={10} bg="white" rounded="md" borderWidth="1px" px={6}>
              <Text color="gray.500">Bạn chưa lưu bất động sản yêu thích nào.</Text>
            </Box>
          ) : (
            <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
              {properties.map((p) => (
                <Box
                  key={p._id}
                  as={Link}
                  to={`/property/${p._id}`}
                  borderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  bg="white"
                  transition="0.3s"
                  _hover={{ shadow: "lg", transform: "translateY(-4px)", cursor: "pointer" }}
                >
                  {p.images && p.images.length > 0 ? (
                    <Image src={p.images[0]} alt={p.title} objectFit="cover" h="160px" w="100%" />
                  ) : (
                    <Box h="160px" bg="gray.100" />
                  )}
                  <Box p="3">
                    <Flex justify="space-between" align="center" mb="2">
                      <Text fontWeight="bold" noOfLines={1}>{p.title}</Text>
                      <Badge colorPalette="green">{p.type === "Buy" ? "Bán" : "Cho thuê"}</Badge>
                    </Flex>
                    <Text fontSize="sm" color="gray.600" mb={1} noOfLines={1}>
                      {p.location?.address}, {p.location?.ward || "Chưa cập nhật"}, {p.location?.province}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="red.600">
                      Giá: {Number(p.price).toLocaleString("vi-VN")} VNĐ • {p.area} m²
                    </Text>
                  </Box>
                </Box>
              ))}
            </Grid>
          )}
        </Container>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Box>
  );
}