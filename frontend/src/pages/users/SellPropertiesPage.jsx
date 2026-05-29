import { useState } from "react";
import SearchBar from "@/components/users/SerchBar";
import PropertyList from "@/components/users/PropertyList";
import { Box, Container, Text, Stack } from "@chakra-ui/react";

export default function SellPropertiesPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");

  return (
    <Box bg={{ base: "gray.50", _dark: "gray.950" }} minH="100vh" py={{ base: 6, md: 8 }}>
      <Container maxW="container.xl">
        <Stack gap={6}>
          <Box borderBottom="1px solid" borderColor={{ base: "gray.200", _dark: "whiteAlpha.100" }} pb={5}>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
              Nhà đất bán
            </Text>
            <Text color="gray.500" mt={2} fontSize="sm">
              Hệ thống tự động lọc Real-time siêu tốc ngay khi ông gõ tay nhập liệu.
            </Text>
          </Box>

          <Box bg={{ base: "white", _dark: "gray.900" }} p={{ base: 4, md: 6 }} borderRadius="xl" borderWidth="1px" borderColor={{ base: "gray.100", _dark: "whiteAlpha.100" }} boxShadow="sm">
            {/* 👉 TRUYỀN HIDEBUTTONS VÀO ĐÂY */}
            <SearchBar
              keyword={keyword} setKeyword={setKeyword}
              location={location} setLocation={setLocation}
              propertyType={propertyType} setPropertyType={setPropertyType}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              minArea={minArea} setMinArea={setMinArea}
              hideButtons={true}
            />
          </Box>

          <Box mt={2}>
            <PropertyList keyword={keyword} location={location} type="Buy" propertyType={propertyType} maxPrice={maxPrice} minArea={minArea} hasSearched={true} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}