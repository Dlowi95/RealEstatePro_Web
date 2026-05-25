import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { LucideHeart, LucideUser, LucidePhone } from "lucide-react";
import {
  Box,
  Flex,
  Grid,
  HStack,
  Image,
  Text,
  Button,
  Spinner,
  Center,
  Container,
  VStack,
} from "@chakra-ui/react";
import Navbar from "../../components/users/Navbar";

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
        const statusRes = await axios.get(
          `${API_BASE_URL}/api/properties/favorites/check/${userId}/${property._id}`
        );
        setIsFavorite(statusRes.data?.isFavorite ?? false);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      }
    };

    checkFavoriteStatus();
  }, [property?._id, userId]);

  const handleToggleFavorite = async () => {
    if (!userId || !property?._id) {
      console.warn("Không thể cập nhật yêu thích: thiếu userId hoặc propertyId.");
      return;
    }

    try {
      setFavLoading(true);
      const res = await axios.post(`${API_BASE_URL}/api/properties/favorites/toggle`, {
        userId,
        propertyId: property._id,
      });

      if (res.data?.success) {
        setIsFavorite(res.data.isFavorite);
      } else {
        console.warn("Không thể đổi trạng thái yêu thích:", res.data?.message);
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
        <Spinner size="xl" color="red.500" />
      </Center>
    );
  }

  if (!property) {
    return (
      <Center h="100vh">
        <Text fontSize="lg" color="gray.500">Bài đăng không tồn tại hoặc đã bị xóa.</Text>
      </Center>
    );
  }

  return (
    <Box bg="gray.50/50" minH="100vh">
      <Container maxW="container.xl" py={8}>
        <Grid templateColumns={{ base: "1fr", lg: "7fr 3fr" }} gap={8}>
          
          {/* ======================================================== */}
          {/* CỘT TRÁI: Đã thêm minW="0" và w="full" để chặn đứng lỗi phình Grid */}
          {/* ======================================================== */}
          <Box 
            bg="white" 
            p={6} 
            borderRadius="2xl" 
            borderWidth="1px" 
            borderColor="gray.100" 
            boxShadow="sm"
            minW="0" 
            w="full"
          >
            {/* Gallery ảnh lớn (Thêm w="full" để cố định khung ảnh) */}
            <Box position="relative" borderRadius="xl" overflow="hidden" bg="gray.100" h={{ base: "300px", md: "450px" }} w="full">
              {mainImage ? (
                <Image src={mainImage} alt={property.title} w="full" h="full" objectFit="cover" />
              ) : (
                <Center h="full"><Text color="gray.400">Không có hình ảnh</Text></Center>
              )}
            </Box>

            {/* Danh sách ảnh nhỏ thumbnail */}
            {property.images && property.images.length > 1 && (
              <HStack gap={3} mt={4} overflowX="auto" py={2} w="full">
                {property.images.map((img, idx) => (
                  <Box
                    key={idx}
                    borderWidth="2px"
                    borderColor={mainImage === img ? "red.500" : "transparent"}
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

            {/* Tiêu đề & Địa chỉ */}
            <Box mt={6}>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold" color="gray.800" lineHeight="1.4">
                {property.title}
              </Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                📍 {property.location.address}, {property.location.ward}, {property.location.province}
              </Text>
            </Box>

            {/* Thông số Giá & Diện tích */}
            <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={6} p={4} bg="gray.50" borderRadius="xl" borderWidth="1px" borderColor="gray.100">
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">MỨC GIÁ</Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="red.500" mt={1}>
                  {property.price.toLocaleString("vi-VN")} VNĐ
                </Text>
              </Box>
              <Box borderLeft="1px solid" borderColor="gray.200" pl={4}>
                <Text fontSize="xs" color="gray.500" fontWeight="medium">DIỆN TÍCH</Text>
                <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold" color="gray.800" mt={1}>
                  {property.area} m²
                </Text>
              </Box>
            </Grid>

            {/* Thông tin mô tả chi tiết */}
            <Box mt={8}>
              <Text fontSize="lg" fontWeight="bold" mb={3} color="gray.800" borderBottom="2px solid" borderColor="red.500" w="fit-content" pb={1}>
                Thông tin mô tả
              </Text>
              {/* Giới hạn hình ảnh nhúng bên trong chuỗi HTML mô tả để không bao giờ bị vỡ */}
              <Box 
                lineHeight="1.8" 
                color="gray.700" 
                fontSize="sm"
                css={{
                  "& img": {
                    maxWidth: "100% !important",
                    height: "auto !important",
                    borderRadius: "lg",
                    marginTop: "12px",
                    marginBottom: "12px"
                  }
                }}
                dangerouslySetInnerHTML={{ __html: property.description }} 
              />
            </Box>
          </Box>

          {/* ======================================================== */}
          {/* CỘT PHẢI: KHU VỰC THÔNG TIN NGƯỜI ĐĂNG */}
          {/* ======================================================== */}
          <Box minW="0">
            <VStack gap={4} position="sticky" top="90px" align="stretch">
              
              {/* Card thông tin người đăng */}
              <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.100" boxShadow="sm" textAlign="center">
                
                {/* Phần Avatar & Tên người đăng bài */}
                <Flex direction="column" align="center" py={3}>
                  <Box 
                    w="70px" 
                    h="70px" 
                    bg="red.50" 
                    color="red.500" 
                    borderRadius="full" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    mb={3}
                    borderWidth="2px"
                    borderColor="red.100"
                    overflow="hidden"
                  >
                    {property.owner?.avatar ? (
                      <Image 
                        src={property.owner.avatar} 
                        w="full" 
                        h="full" 
                        objectFit="cover"
                        alt={property.owner.fullName}
                        onError={(e) => {
                          // Nếu avatar URL hết hạn hoặc lỗi, hiển thị icon
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <LucideUser size={32} />
                    )}
                  </Box>
                  
                  {/* Hiển thị Tên tài khoản người đăng */}
                  <Text fontWeight="bold" fontSize="md" color="gray.800" noOfLines={1}>
                    {property.owner?.fullName || "Chủ tin đăng"}
                  </Text>
                  
                  <Text fontSize="xs" color="gray.400" mt={0.5}>
                    Thành viên RealEstate Pro
                  </Text>
                </Flex>

                {/* Các nút tương tác hành động */}
                <VStack gap={3} mt={4} w="full">
                  <Button 
                    colorPalette="red" 
                    size="lg" 
                    w="full"
                    fontWeight="bold"
                    boxShadow="sm"
                  >
                    <LucidePhone size={18} style={{ marginRight: "6px" }} />
                    Gọi: {property.contactPhone}
                  </Button>

                  <Button
                    variant={isFavorite ? "solid" : "outline"}
                    colorPalette={isFavorite ? "red" : "gray"}
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

              {/* Box mẹo an toàn nhỏ đi kèm bên dưới */}
              <Box bg="orange.50/40" p={4} borderRadius="xl" borderWidth="1px" borderColor="orange.100/70">
                <Text fontSize="xs" fontWeight="bold" color="orange.700">💡 Mẹo an toàn:</Text>
                <Text fontSize="11px" color="orange.800/80" mt={1} lineHeight="1.5">
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