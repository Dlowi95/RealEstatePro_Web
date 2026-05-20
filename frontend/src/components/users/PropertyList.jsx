import React, { useEffect, useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function PropertyList({
  keyword,
  location,
  type,
  propertyType,
  maxPrice,
  minArea,
  hasSearched,
}) {
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
        console.error("SearchResults fetch error:", err);
        setError("Lỗi kết nối tới server.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const filteredProperties = useMemo(() => {
    if (!hasSearched) return [];

    const normalizedKeyword = (keyword || "").trim().toLowerCase();
    const normalizedLocation = (location || "").trim().toLowerCase();
    const normalizedType = (type || "").trim().toLowerCase();
    const normalizedPropertyType = (propertyType || "").trim().toLowerCase();
    const maxPriceNumber = Number(maxPrice) || Number.POSITIVE_INFINITY;
    const minAreaNumber = Number(minArea) || 0;

    return properties.filter((property) => {
      const title = property.title?.toLowerCase() || "";
      const description = property.description?.toLowerCase() || "";
      const propertySaleType = property.type?.toLowerCase() || "";
      const propertyTypeValue = property.propertyType?.toLowerCase() || "";
      const propertyLocation =
        `${property.location?.province || ""} ${property.location?.ward || ""} ${property.location?.address || ""}`.toLowerCase();
      const price = Number(property.price) || 0;
      const area = Number(property.area) || 0;

      const matchesKeyword =
        !normalizedKeyword ||
        title.includes(normalizedKeyword) ||
        description.includes(normalizedKeyword);
      const matchesLocation =
        !normalizedLocation || propertyLocation.includes(normalizedLocation);
      const matchesType =
        !normalizedType || propertySaleType.includes(normalizedType);
      const matchesPropertyType =
        !normalizedPropertyType ||
        propertyTypeValue.includes(normalizedPropertyType);
      const matchesMaxPrice = price <= maxPriceNumber;
      const matchesMinArea = area >= minAreaNumber;

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesPropertyType &&
        matchesMaxPrice &&
        matchesMinArea
      );
    });
  }, [
    hasSearched,
    keyword,
    location,
    type,
    propertyType,
    maxPrice,
    minArea,
    properties,
  ]);

  if (!hasSearched) {
    return null;
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" py="6">
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box py="4">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.lg">
      <Box mb="6">
        <Text fontSize="md" fontWeight="semibold" mb="4">
          Tìm thấy {filteredProperties.length} bất động sản
        </Text>
        {filteredProperties.length === 0 ? (
          <Text color="gray.500">Không tìm thấy bất động sản phù hợp.</Text>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2,1fr)",
              lg: "repeat(4,1fr)",
            }}
            gap="4"
          >
            {filteredProperties.map((property) => (
              <Box
                key={property._id}
                as={Link} // Thêm as={Link}
                to={`/property/${property._id}`} // Đường dẫn tới trang chi tiết
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
                    {property.location?.address},{" "}
                    {property.location?.ward || "Chưa cập nhật"},{" "}
                    {property.location?.province}
                  </Text>
                  <Text fontSize="sm" fontWeight="semibold">
                    Giá: {Number(property.price).toLocaleString("vi-VN")} VNĐ •{" "}
                    {property.area} m²
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
