import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
} from "@chakra-ui/react";
import Navbar from "../../components/users/Navbar"; // Đảm bảo đúng đường dẫn Navbar của bạn

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

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
        <Text>Không tìm thấy bất động sản này.</Text>
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Container maxW="1200px" py={10}>
        <Box bg="white" p={6} borderRadius="xl" shadow="sm">
          {/* IMAGE SECTION */}
          <Box>
            <Image
              src={mainImage || "https://via.placeholder.com/800x500?text=No+Image"}
              w="100%"
              h={{ base: "300px", md: "500px" }}
              objectFit="cover"
              borderRadius="lg"
            />

            {/* THUMBNAILS */}
            {property.images && property.images.length > 1 && (
              <HStack mt={3} spacing={3} overflowX="auto" py={2}>
                {property.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    boxSize="90px"
                    objectFit="cover"
                    borderRadius="md"
                    cursor="pointer"
                    border={mainImage === img ? "2px solid red" : "1px solid gray"}
                    onClick={() => setMainImage(img)}
                    _hover={{ opacity: 0.8 }}
                  />
                ))}
              </HStack>
            )}
          </Box>

          {/* BREADCRUMB - Giả lập dựa trên location */}
          <Text mt={5} color="gray.500" fontSize="sm">
            {property.type === "Buy" ? "Bán" : "Cho thuê"} / {property.location.province} / {property.location.ward}
          </Text>

          {/* TITLE */}
          <Text fontSize="3xl" fontWeight="bold" mt={2} color="gray.800">
            {property.title}
          </Text>

          {/* ADDRESS */}
          <Text mt={3} color="gray.600" fontSize="lg">
            📍 {property.location.address}, {property.location.ward}, {property.location.province}
          </Text>

          {/* PRICE + AREA */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={6}
            mt={6}
            p={5}
            borderWidth="1px"
            borderRadius="xl"
            bg="gray.50"
          >
            <Box>
              <Text color="gray.500">Mức giá</Text>
              <Text fontSize="2xl" fontWeight="bold" color="red.500">
                {property.price.toLocaleString("vi-VN")} VNĐ
              </Text>
            </Box>

            <Box>
              <Text color="gray.500">Diện tích</Text>
              <Text fontSize="2xl" fontWeight="bold">
                {property.area} m²
              </Text>
            </Box>
          </Grid>

          {/* DESCRIPTION */}
          <Box mt={10}>
            <Text fontSize="2xl" fontWeight="bold" mb={4} borderBottom="2px solid" borderColor="red.500" w="fit-content">
              Thông tin mô tả
            </Text>
            
            {/* Hiển thị HTML từ mô tả */}
            <Box 
              className="property-description"
              lineHeight="1.8"
              dangerouslySetInnerHTML={{ __html: property.description }}
            />
          </Box>

          {/* CONTACT BUTTON */}
          <Button mt={8} colorScheme="red" size="lg" px={10}>
            Liên hệ ngay: {property.contactPhone}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}