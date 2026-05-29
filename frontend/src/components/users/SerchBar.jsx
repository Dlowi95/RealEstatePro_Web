import React, { useEffect, useState } from "react";
import vnAddressData from "../../../utils/full_json_generated_data_vn_units.json";
import {
  Button,
  Card,
  Flex,
  Grid,
  Input,
  InputGroup,
  NativeSelect,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({
  keyword,
  setKeyword,
  location,
  setLocation,
  propertyType,
  setPropertyType,
  maxPrice,
  setMaxPrice,
  minArea,
  setMinArea,
  onSearch,
  onClear,
  hideButtons = false,
}) {
  const [keywordState, setKeywordState] = useState(keyword || "");
  const [locationState, setLocationState] = useState(location || "");
  const [propertyTypeState, setPropertyTypeState] = useState(propertyType || "");
  const [maxPriceState, setMaxPriceState] = useState(maxPrice || "");
  const [minAreaState, setMinAreaState] = useState(minArea || "");

  useEffect(() => { setKeywordState(keyword || ""); }, [keyword]);
  useEffect(() => { setLocationState(location || ""); }, [location]);
  useEffect(() => { setPropertyTypeState(propertyType || ""); }, [propertyType]);
  useEffect(() => { setMaxPriceState(maxPrice || ""); }, [maxPrice]);
  useEffect(() => { setMinAreaState(minArea || ""); }, [minArea]);

  const handleKeywordChange = (value) => {
    setKeywordState(value);
    if (setKeyword) setKeyword(value);
  };

  const handleLocationChange = (value) => {
    setLocationState(value);
    if (setLocation) setLocation(value);
  };

  const handleTypeChange = (value) => {
    setPropertyTypeState(value);
    if (setPropertyType) setPropertyType(value);
  };

  const handleMaxPriceChange = (value) => {
    setMaxPriceState(value);
    if (setMaxPrice) setMaxPrice(value);
  };

  const provinces = vnAddressData.map((province) => province.Name);

  const handleMinAreaChange = (value) => {
    setMinAreaState(value);
    if (setMinArea) setMinArea(value);
  };

  const handleClearClick = () => {
    setKeywordState(""); setLocationState(""); setPropertyTypeState(""); setMaxPriceState(""); setMinAreaState("");
    if (setKeyword) setKeyword(""); if (setLocation) setLocation(""); if (setPropertyType) setPropertyType(""); if (setMaxPrice) setMaxPrice(""); if (setMinArea) setMinArea("");
    if (onClear) onClear();
  };

  return (
    <Card.Root
      p={{ base: "4", md: "6" }}
      mb={{ base: "6", md: "10" }}
      bg={{ base: "white", _dark: "gray.900" }}
      borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
      boxShadow="sm"
      w="100%"
    >
      <Grid
        templateColumns={{ base: "1fr", sm: "repeat(2,1fr)", lg: "repeat(5,1fr)" }}
        gap="4"
        w="100%"
      >
        <InputGroup startElement={<FiSearch />} w="100%">
          <Input
            placeholder="Tìm kiếm..."
            value={keywordState}
            onChange={(e) => handleKeywordChange(e.target.value)}
            bg={{ base: "white", _dark: "gray.800" }}
            color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
            borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          />
        </InputGroup>

        <NativeSelect.Root w="100%">
          <NativeSelect.Field
            value={locationState}
            onChange={(e) => handleLocationChange(e.target.value)}
            bg={{ base: "white", _dark: "gray.800" }}
            color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
            borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          >
            <option value="">Tất cả khu vực</option>
            {provinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>

        <NativeSelect.Root w="100%">
          <NativeSelect.Field
            value={propertyTypeState}
            onChange={(e) => handleTypeChange(e.target.value)}
            bg={{ base: "white", _dark: "gray.800" }}
            color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
            borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          >
            <option value="">Tất cả loại hình</option>
            <option value="Apartment">Căn hộ</option>
            <option value="Land">Đất nền</option>
            <option value="House">Nhà phố</option>
          </NativeSelect.Field>
        </NativeSelect.Root>

        <Input
          placeholder="Giá tối đa"
          type="number"
          value={maxPriceState}
          onChange={(e) => handleMaxPriceChange(e.target.value)}
          bg={{ base: "white", _dark: "gray.800" }}
          color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
          borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          w="100%"
        />

        <Input
          placeholder="Diện tích tối thiểu"
          type="number"
          value={minAreaState}
          onChange={(e) => handleMinAreaChange(e.target.value)}
          bg={{ base: "white", _dark: "gray.800" }}
          color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
          borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
          w="100%"
        />
      </Grid>

      {!hideButtons && (
        <Flex
          justify={{ base: "stretch", sm: "flex-end" }}
          mt="4"
          gap="3"
          w="100%"
          flexDirection={{ base: "row", sm: "row" }}
        >
          <Button variant="outline" colorPalette="orange" onClick={handleClearClick} flex={{ base: "1", sm: "none" }} minW={{ sm: "100px" }} size="sm">
            Xóa
          </Button>
          <Button bg="#E65C00" color="white" _hover={{ bg: "#CC5200" }} onClick={onSearch} flex={{ base: "1", sm: "none" }} minW={{ sm: "120px" }} size="sm">
            Tìm kiếm
          </Button>
        </Flex>
      )}
    </Card.Root>
  );
}