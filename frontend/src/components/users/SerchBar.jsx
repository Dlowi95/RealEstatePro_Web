import React, { useEffect, useState } from "react";
import axios from "axios";
import vnAddressData from "../../../utils/full_json_generated_data_vn_units.json";

import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Image,
  Input,
  InputGroup,
  NativeSelect,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { FiSearch } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function SearchBar({
  keyword,
  setKeyword,
  location,
  setLocation,
  type,
  setType,
  maxPrice,
  setMaxPrice,
  minArea,
  setMinArea,
}) {
  const [keywordState, setKeywordState] = useState(keyword || "");
  const [locationState, setLocationState] = useState(location || "");
  const [typeState, setTypeState] = useState(type || "");
  const [maxPriceState, setMaxPriceState] = useState(maxPrice || "");
  const [minAreaState, setMinAreaState] = useState(minArea || "");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const provinces = vnAddressData.map((province) => province.Name);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_BASE_URL}/api/properties`);
      const data = response.data;

      if (data.success) {
        setProperties(data.data || []);
      } else {
        setError("Không thể tải dữ liệu từ máy chủ.");
      }
    } catch (err) {
      console.error("Fetch properties error:", err);
      setError("Lỗi kết nối tới server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!hasSearched) {
      setFilteredProperties([]);
      return;
    }

    const normalizedKeyword = keywordState.trim().toLowerCase();
    const normalizedLocation = locationState.trim().toLowerCase();
    const normalizedType = typeState.trim().toLowerCase();
    const maxPriceNumber = Number(maxPriceState) || Number.POSITIVE_INFINITY;
    const minAreaNumber = Number(minAreaState) || 0;

    const hasSearchCriteria =
      Boolean(normalizedKeyword) ||
      Boolean(normalizedLocation) ||
      Boolean(normalizedType) ||
      Number(maxPriceState) > 0 ||
      Number(minAreaState) > 0;

    if (!hasSearchCriteria) {
      setFilteredProperties([]);
      return;
    }

    const filtered = properties.filter((property) => {
      const title = property.title?.toLowerCase() || "";
      const description = property.description?.toLowerCase() || "";
      const propertyType = property.type?.toLowerCase() || "";
      const propertyLocation = `${property.location?.province || ""} ${property.location?.ward || ""} ${property.location?.address || ""}`.toLowerCase();
      const price = Number(property.price) || 0;
      const area = Number(property.area) || 0;

      const matchesKeyword =
        !normalizedKeyword ||
        title.includes(normalizedKeyword) ||
        description.includes(normalizedKeyword);
      const matchesLocation =
        !normalizedLocation || propertyLocation.includes(normalizedLocation);
      const matchesType =
        !normalizedType || propertyType.includes(normalizedType);
      const matchesMaxPrice = price <= maxPriceNumber;
      const matchesMinArea = area >= minAreaNumber;

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesType &&
        matchesMaxPrice &&
        matchesMinArea
      );
    });

    setFilteredProperties(filtered);
  }, [hasSearched, keywordState, locationState, typeState, maxPriceState, minAreaState, properties]);

  const handleKeywordChange = (value) => {
    setKeywordState(value);
    if (setKeyword) setKeyword(value);
  };

  const handleLocationChange = (value) => {
    setLocationState(value);
    if (setLocation) setLocation(value);
  };

  const handleTypeChange = (value) => {
    setTypeState(value);
    if (setType) setType(value);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPriceState(value);
    if (setMaxPrice) setMaxPrice(value);
  };

  const handleMinAreaChange = (value) => {
    setMinAreaState(value);
    if (setMinArea) setMinArea(value);
  };

  const handleSearchClick = () => {
    setHasSearched(true);
  };

  const handleClearClick = () => {
    setKeywordState("");
    setLocationState("");
    setTypeState("");
    setMaxPriceState("");
    setMinAreaState("");
    setFilteredProperties([]);
    setHasSearched(false);

    if (setKeyword) setKeyword("");
    if (setLocation) setLocation("");
    if (setType) setType("");
    if (setMaxPrice) setMaxPrice("");
    if (setMinArea) setMinArea("");
  };

  return (
    <Card.Root p="6" mb="10">
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2,1fr)",
          lg: "repeat(5,1fr)",
        }}
        gap="4"
      >
        {/* SEARCH */}
        <InputGroup startElement={<FiSearch />}>
          <Input
            placeholder="Tìm kiếm..."
            value={keywordState}
            onChange={(e) => handleKeywordChange(e.target.value)}
          />
        </InputGroup>

        {/* LOCATION */}
        <NativeSelect.Root>
          <NativeSelect.Field
            value={locationState}
            onChange={(e) => handleLocationChange(e.target.value)}
          >
            <option value="">
              Tất cả khu vực
            </option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>

        {/* TYPE */}
        <NativeSelect.Root>
          <NativeSelect.Field
            value={typeState}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">
              Tất cả loại hình
            </option>

            <option value="Căn hộ">
              Căn hộ
            </option>

            <option value="Đất nền">
              Đất nền
            </option>

            <option value="Nhà phố">
              Nhà phố
            </option>
          </NativeSelect.Field>
        </NativeSelect.Root>

        {/* PRICE */}
        <Input
          placeholder="Giá tối đa"
          type="number"
          value={maxPriceState}
          onChange={(e) => handleMaxPriceChange(e.target.value)}
        />

        {/* AREA */}
        <Input
          placeholder="Diện tích tối thiểu"
          type="number"
          value={minAreaState}
          onChange={(e) => handleMinAreaChange(e.target.value)}
        />
      </Grid>

      <Flex justify="flex-end" mt="4" gap="2">
        <Button variant="outline" onClick={handleClearClick}>
          Xóa
        </Button>
        <Button colorScheme="blue" onClick={handleSearchClick}>
          Tìm kiếm
        </Button>
      </Flex>

      <Box mt="6">
        {loading && (
          <Flex align="center" gap="2">
            <Spinner size="sm" />
            <Text>Đang tải dữ liệu từ MongoDB...</Text>
          </Flex>
        )}

        {error && (
          <Text color="red.500" fontWeight="semibold">
            {error}
          </Text>
        )}

        {hasSearched && !loading && !error && (
          <Text fontSize="md" fontWeight="semibold" mb="4">
            Tìm thấy {filteredProperties.length || 0} bất động sản
          </Text>
        )}

        {hasSearched && !loading && !error && filteredProperties.length === 0 && (
          <Text fontSize="md" color="gray.500" mb="4">
            Không tìm thấy bất động sản phù hợp.
          </Text>
        )}

        {hasSearched && (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)", lg: "repeat(4,1fr)" }} gap="4">
            {filteredProperties.map((property) => (
              <Box key={property._id} borderWidth="1px" borderRadius="md" overflow="hidden" bg="white">
                <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap="0">
                  <Box>
                    {property.images && property.images.length > 0 ? (
                      <Image src={property.images[0]} alt={property.title} objectFit="cover" h={{ base: "200px", md: "220px" }} w="100%" />
                    ) : (
                      <Box h={{ base: "200px", md: "220px" }} bg="gray.100" />
                    )}
                  </Box>
                  <Box p="2">
                    <Grid templateColumns="repeat(2,1fr)" gap="2">
                      {(property.images || []).slice(1,5).map((img, idx) => (
                        <Box key={idx} h="100px" bg="gray.50" overflow="hidden">
                          <Image src={img} alt={`${property.title}-${idx}`} objectFit="cover" h="100%" w="100%" />
                        </Box>
                      ))}
                      {((property.images || []).length <= 1) && Array.from({ length: 4 }).map((_, idx) => (
                        <Box key={`ph-${idx}`} h="100px" bg="gray.50" />
                      ))}
                    </Grid>
                  </Box>
                </Grid>

                <Box p="3">
                  <Flex justify="space-between" align="center" mb="2">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={2}>{property.title}</Text>
                    {(property.isVip || property.vip || property.featured) && (
                      <Badge colorScheme="red">VIP KIM CƯƠNG</Badge>
                    )}
                  </Flex>

                  <Text fontSize="sm" color="gray.600" mb="1" noOfLines={1}>
                    {property.location.address}, {property.location.ward || "Chưa cập nhật"}, {property.location.province}
                  </Text>

                  <Text fontSize="lg" fontWeight="bold" color="red.500">
                    {Number(property.price).toLocaleString("vi-VN")} VNĐ
                  </Text>

                  <Text fontSize="sm" color="gray.600">
                    • {property.area} m²
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        )}
      </Box>
    </Card.Root>
  );
}