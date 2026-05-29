import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Flex,
  Spinner,
  Container,
  Button,
  Text,
} from "@chakra-ui/react";
import PropertyCard from "./PropertyCard"; // Đảm bảo chung thư mục components/users/

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

<<<<<<< Updated upstream
// Đã nạp giá trị mặc định hasSearched = true phòng trường hợp trang tổng gọi không truyền tham số
export default function PropertyList({ keyword = "", location = "", type = "", propertyType = "", maxPrice = "", minArea = "", hasSearched = true }) {
=======
export default function PropertyList({
  keyword,
  location,
  type,
  propertyType,
  maxPrice,
  minArea,
  hasSearched,
}) {
>>>>>>> Stashed changes
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, location, type, propertyType, maxPrice, minArea, hasSearched]);

  const filteredProperties = useMemo(() => {
    if (!hasSearched) return [];
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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

  if (!hasSearched) return null;
  if (loading) return <Flex align="center" justify="center" py="6"><Spinner color="#E65C00" /></Flex>;
  if (error) return <Box py="4"><Text color="#E65C00">{error}</Text></Box>;

<<<<<<< Updated upstream
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / itemsPerPage));
  const pagedProperties = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <Box mb="6">
      <Flex justify="space-between" align="center" mb="4" wrap="wrap" gap="3">
        <Text fontSize="md" fontWeight="semibold">Tìm thấy {filteredProperties.length} bất động sản</Text>
        {totalPages > 1 && (
          <Flex gap="2">
            <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} isDisabled={currentPage === 1}>Trước</Button>
            <Text fontSize="sm" color="gray.600" alignSelf="center">Trang {currentPage}/{totalPages}</Text>
            <Button size="sm" variant="outline" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} isDisabled={currentPage === totalPages}>Sau</Button>
=======
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / itemsPerPage),
  );
  const pagedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Container maxW="container.lg">
      <Box mb="6">
        {totalPages > 1 && (
          <Flex
            justify="space-between"
            align="center"
            mb="4"
            wrap="wrap"
            gap="3"
          >
            <Text fontSize="md" fontWeight="semibold">
              Tìm thấy {filteredProperties.length} bất động sản
            </Text>
            <Flex gap="2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                isDisabled={currentPage === 1}
              >
                Trước
              </Button>
              <Text fontSize="sm" color="gray.600" alignSelf="center">
                Trang {currentPage}/{totalPages}
              </Text>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                isDisabled={currentPage === totalPages}
              >
                Sau
              </Button>
            </Flex>
>>>>>>> Stashed changes
          </Flex>
        )}
      </Flex>

<<<<<<< Updated upstream
      {filteredProperties.length === 0 ? (
        <Text color="gray.500">Không tìm thấy bất động sản phù hợp.</Text>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)", lg: "repeat(4,1fr)" }} gap="4">
          {pagedProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </Grid>
      )}
    </Box>
=======
        {totalPages <= 1 && (
          <Text fontSize="md" fontWeight="semibold" mb="4">
            Tìm thấy {filteredProperties.length} bất động sản
          </Text>
        )}
        {filteredProperties.length === 0 ? (
          <Text color={{ base: "gray.500", _dark: "gray.300" }}>
            Không tìm thấy bất động sản phù hợp.
          </Text>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2,1fr)",
              lg: "repeat(4,1fr)",
            }}
            gap="4"
          >
            {pagedProperties.map((property) => (
              <Box
                key={property._id}
                as={Link}
                to={`/property/${property._id}`}
                borderWidth="1px"
                borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
                borderRadius="md"
                overflow="hidden"
                bg={{ base: "white", _dark: "gray.900" }}
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
                  <Box h="160px" bg={{ base: "gray.100", _dark: "gray.800" }} />
                )}
                <Box p="3">
                  <Flex justify="space-between" align="center" mb="2">
                    <Text
                      fontWeight="bold"
                      noOfLines={1}
                      color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                    >
                      {property.title}
                    </Text>
                    <Badge colorPalette="orange">{property.type}</Badge>
                  </Flex>
                  <Text
                    fontSize="sm"
                    color={{ base: "gray.600", _dark: "gray.300" }}
                    mb="1"
                    noOfLines={1}
                  >
                    {property.location?.address},{" "}
                    {property.location?.ward || "Chưa cập nhật"},{" "}
                    {property.location?.province}
                  </Text>
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
                  >
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
>>>>>>> Stashed changes
  );
}