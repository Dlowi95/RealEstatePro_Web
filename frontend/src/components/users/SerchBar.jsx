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
}) {
  const [keywordState, setKeywordState] = useState(keyword || "");
  const [locationState, setLocationState] = useState(location || "");
  const [propertyTypeState, setPropertyTypeState] = useState(propertyType || "");
  const [maxPriceState, setMaxPriceState] = useState(maxPrice || "");
  const [minAreaState, setMinAreaState] = useState(minArea || "");

  useEffect(() => {
    setKeywordState(keyword || "");
  }, [keyword]);

  useEffect(() => {
    setLocationState(location || "");
  }, [location]);

  useEffect(() => {
    setPropertyTypeState(propertyType || "");
  }, [propertyType]);

  useEffect(() => {
    setMaxPriceState(maxPrice || "");
  }, [maxPrice]);

  useEffect(() => {
    setMinAreaState(minArea || "");
  }, [minArea]);

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

  const handleSearchClick = () => {
    if (onSearch) onSearch();
  };

  const handleClearClick = () => {
    setKeywordState("");
    setLocationState("");
    setPropertyTypeState("");
    setMaxPriceState("");
    setMinAreaState("");

    if (setKeyword) setKeyword("");
    if (setLocation) setLocation("");
    if (setPropertyType) setPropertyType("");
    if (setMaxPrice) setMaxPrice("");
    if (setMinArea) setMinArea("");

    if (onClear) onClear();
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
        <InputGroup startElement={<FiSearch />}>
          <Input
            placeholder="Tìm kiếm..."
            value={keywordState}
            onChange={(e) => handleKeywordChange(e.target.value)}
          />
        </InputGroup>

        <NativeSelect.Root>
          <NativeSelect.Field
            value={locationState}
            onChange={(e) => handleLocationChange(e.target.value)}
          >
            <option value="">Tất cả khu vực</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>

        <NativeSelect.Root>
          <NativeSelect.Field
            value={propertyTypeState}
            onChange={(e) => handleTypeChange(e.target.value)}
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
        />

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
    </Card.Root>
  );
}