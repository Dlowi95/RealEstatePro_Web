import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Image,
  Text,
  Badge,
  Flex,
  Spinner,
  Container,
  Heading,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  useUser,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

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
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh" w="100%">
      <SignedIn>
        <Container maxW="1200px" py={{ base: "4", md: "8" }} px={{ base: "4", md: "6" }}>
          <Heading
            size="lg"
            mb={6}
            borderBottom="2px solid"
            borderColor="#E65C00"
            w="fit-content"
            pb={1}
            color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
          >
            Tin Đăng Đã Yêu Thích ({properties.length})
          </Heading>

          {loading ? (
            <Flex align="center" justify="center" py="10">
              <Spinner color="#E65C00" size="xl" />
            </Flex>
          ) : properties.length === 0 ? (
            <Box
              textAlign="center"
              py={10}
              bg={{ base: "white", _dark: "gray.900" }}
              rounded="lg"
              borderWidth="1px"
              borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
              px={6}
            >
              <Text color={{ base: "gray.500", _dark: "gray.300" }}>
                Bạn chưa lưu bất động sản yêu thích nào.
              </Text>
            </Box>
          ) : (
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              }}
              gap={6}
              w="100%"
            >
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
                  minW="0"
                  _hover={{ shadow: "lg", transform: "translateY(-4px)" }}
                >
                  {p.images && p.images.length > 0 ? (
                    <Image src={p.images[0]} alt={p.title} objectFit="cover" h="160px" w="100%" />
                  ) : (
                    <Box h="160px" bg={{ base: "gray.100", _dark: "gray.800" }} />
                  )}
                  <Box p="3">
                    <Flex justify="space-between" align="center" mb="2" gap={2}>
                      <Text fontWeight="bold" noOfLines={1} color={{ base: "gray.900", _dark: "whiteAlpha.900" }} flex="1">
                        {p.title}
                      </Text>
                      <Badge colorPalette="green" flexShrink={0}>
                        {p.type === "Buy" ? "Bán" : "Cho thuê"}
                      </Badge>
                    </Flex>
                    <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }} mb={2} noOfLines={1}>
                      {p.location?.address}, {p.location?.ward || "Chưa cập nhật"}, {p.location?.province}
                    </Text>
                    <Text fontSize="sm" fontWeight="semibold" color="#E65C00">
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