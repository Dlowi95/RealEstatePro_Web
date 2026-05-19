import { useState } from "react";
import SearchBar from "@/components/users/SerchBar";
import PropertyList from "@/components/users/PropertyList";
import { Box, Container, Text } from "@chakra-ui/react";

export default function SellPropertiesPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleClear = () => {
    setHasSearched(false);
  };

  return (
    <Container maxW="container.xl" py="6">
      <Box mb="6">
        <Text fontSize="3xl" fontWeight="bold">Nhà đất bán</Text>
        <Text color="gray.600" mt="2">
          Hiển thị tất cả sản phẩm cần bán. Bạn có thể lọc theo khu vực, loại hình, giá và diện tích.
        </Text>
      </Box>
      <SearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        location={location}
        setLocation={setLocation}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        minArea={minArea}
        setMinArea={setMinArea}
        onSearch={handleSearch}
        onClear={handleClear}
      />
      <PropertyList
        keyword={keyword}
        location={location}
        type="Buy"
        propertyType={propertyType}
        maxPrice={maxPrice}
        minArea={minArea}
        hasSearched={hasSearched}
      />
    </Container>
  );
}
