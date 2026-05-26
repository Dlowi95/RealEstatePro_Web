import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { LucideHeart, LucideUser, LucidePhone } from "lucide-react";
import { Box, Flex, Grid, HStack, Image, Text, Button, Spinner, Center, Container, VStack } from "@chakra-ui/react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/properties/${id}`);

        if (res.data?.success) {
          setProperty(res.data.data);
          setMainImage(res.data.data.images?.[0] || "");
        }
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!userId || !property?._id) return;

      try {
        const statusRes = await axios.get(`${API_BASE_URL}/api/properties/favorites/check/${userId}/${property._id}`);
        setIsFavorite(statusRes.data?.isFavorite ?? false);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    checkFavoriteStatus();
  }, [property?._id, userId]);

  const handleToggleFavorite = async () => {
    if (!userId || !property?._id) return;

    try {
      setFavLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/properties/favorites/toggle`, {
        userId,
        propertyId: property._id,
      });

      if (res.data?.success) {
        setIsFavorite(res.data.isFavorite);
      }
    } catch (err) {
      console.error("Lỗi khi chuyển yêu thích:", err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="#E65C00" />
      </Center>
    );
  }

  if (!property) {
    return (
      <Center h="100vh">
        <Text fontSize="lg" color={{ base: "gray.500", _dark: "gray.300" }}>
          Bài đăng không tồn tại hoặc đã bị xóa.
        </Text>
      </Center>
    );
  }

  return (
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh">
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "7fr 3fr" }} gap={8}>
          <Box
            bg={{ base: "white", _dark: "gray.900" }}
            p={6}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
            boxShadow="sm"
            minW="0"
            w="full"
          >
            <Box position="relative" borderRadius="xl" overflow="hidden" bg={{ base: "gray.100", _dark: "gray.800" }} h={{ base: "300px", md: "450px" }} w="full">
              {mainImage ? (
                <Image src={mainImage} alt={property.title} w="full" h="full" objectFit="cover" />
              ) : (
                <Center h="full">
                  <Text color={{ base: "gray.400", _dark: "gray.300" }}>Không có hình ảnh</Text>
                </Center>
              )}
            </Box>

            {property.images && property.images.length > 1 && (
              <HStack gap={3} mt={4} overflowX="auto" py={2} w="full">
                {property.images.map((img, idx) => (
                  <Box
                    key={idx}
                    borderWidth="2px"
                    borderColor={mainImage === img ? "#E65C00" : "transparent"}
                    borderRadius="lg"
                    overflow="hidden"
                    cursor="pointer"
                    onClick={() => setMainImage(img)}
                    w="80px"
                    h="60px"
                    flexShrink={0}
                  >
                    <Image src={img} w="full" h="full" objectFit="cover" />
                  </Box>
                ))}
              </HStack>
            )}

            <Box mt={6}>
              <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.300" }}>
                {property.type === "Buy" ? "Bán" : "Cho thuê"} / {property.location?.province} / {property.location?.ward}
              </Text>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color={{ base: "gray.800", _dark: "whiteAlpha.900" }} mt={2} lineHeight="1.4">
                {property.title}
              </Text>
              <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }} mt={2}>
                📍 {property.location?.address}, {property.location?.ward}, {property.location?.province}
              </Text>
            </Box>

            <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={6} p={4} bg={{ base: "gray.50", _dark: "gray.800" }} borderRadius="xl" borderWidth="1px" borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}>
              <Box>
                <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.300" }} fontWeight="medium">
                  MỨC GIÁ
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="#E65C00" mt={1}>
                  {property.price?.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Box>
              <Box borderLeft="1px solid" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} pl={4}>
                <Text fontSize="xs" color={{ base: "gray.500", _dark: "gray.300" }} fontWeight="medium">
                  DIỆN TÍCH
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color={{ base: "gray.800", _dark: "whiteAlpha.900" }} mt={1}>
                  {property.area} m²
                </Text>
              </Box>
            </Grid>

            <Box mt={8}>
              <Text fontSize="lg" fontWeight="bold" mb={3} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderBottom="2px solid" borderColor="#E65C00" w="fit-content" pb={1}>
                Thông tin mô tả
              </Text>
              <Box
                lineHeight="1.8"
                color={{ base: "gray.700", _dark: "gray.100" }}
                fontSize="sm"
                css={{
                  "& img": {
                    maxWidth: "100% !important",
                    height: "auto !important",
                    borderRadius: "lg",
                    marginTop: "12px",
                    marginBottom: "12px",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: property.description }}
              />
            </Box>

            <Box mt={8}>
              <Text fontSize="lg" fontWeight="bold" mb={3} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} borderBottom="2px solid" borderColor="#E65C00" w="fit-content" pb={1}>
                Vị trí trên bản đồ
              </Text>
              <Box h="400px" w="100%" borderRadius="xl" overflow="hidden" border="1px solid" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}>
                <iframe
                  title="Google Maps Bản đồ"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent((property.location?.address || "") + ", " + (property.location?.ward || "") + ", " + (property.location?.province || ""))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                />
              </Box>
            </Box>
          </Box>

          <Box minW="0">
            <VStack gap={4} position="sticky" top="90px" align="stretch">
              <Box bg={{ base: "white", _dark: "gray.900" }} p={5} borderRadius="2xl" borderWidth="1px" borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }} boxShadow="sm" textAlign="center">
                <Flex direction="column" align="center" py={3}>
                  <Box
                    w="70px"
                    h="70px"
                    bg="#FFF1E6"
                    color="#E65C00"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mb={3}
                    borderWidth="2px"
                    borderColor="#FFD7BF"
                    overflow="hidden"
                  >
                    {property.owner?.avatar ? (
                      <Image src={property.owner.avatar} w="full" h="full" objectFit="cover" alt={property.owner.fullName} />
                    ) : (
                      <LucideUser size={32} />
                    )}
                  </Box>

                  <Text fontWeight="bold" fontSize="md" color={{ base: "gray.800", _dark: "whiteAlpha.900" }} noOfLines={1}>
                    {property.owner?.fullName || "Chủ tin đăng"}
                  </Text>

                  <Text fontSize="xs" color={{ base: "gray.400", _dark: "gray.300" }} mt={0.5}>
                    Thành viên RealEstate Pro
                  </Text>
                </Flex>

                <VStack gap={3} mt={4} w="full">
                  <Button bg="#E65C00" color="white" size="lg" w="full" fontWeight="bold" _hover={{ bg: "#CC5200" }}>
                    <LucidePhone size={18} style={{ marginRight: "6px" }} />
                    Gọi: {property.contactPhone}
                  </Button>

                  <Button
                    variant={isFavorite ? "solid" : "outline"}
                    colorPalette="orange"
                    size="lg"
                    w="full"
                    onClick={handleToggleFavorite}
                    loading={favLoading}
                  >
                    <LucideHeart size={18} style={{ marginRight: "6px", fill: isFavorite ? "currentColor" : "none" }} />
                    {isFavorite ? "Đã lưu vào yêu thích" : "Lưu tin đăng này"}
                  </Button>
                </VStack>
              </Box>

              <Box bg={{ base: "orange.50", _dark: "orange.950" }} p={4} borderRadius="xl" borderWidth="1px" borderColor={{ base: "orange.100", _dark: "orange.900" }}>
                <Text fontSize="xs" fontWeight="bold" color={{ base: "orange.700", _dark: "orange.200" }}>
                  💡 Mẹo an toàn:
                </Text>
                <Text fontSize="11px" color={{ base: "orange.800", _dark: "orange.100" }} mt={1} lineHeight="1.5">
                  Không nên đặt cọc, chuyển tiền trước khi xem trực tiếp bất động sản và giấy tờ pháp lý liên quan.
                </Text>
              </Box>
            </VStack>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}