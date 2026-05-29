import React from "react";
import { Box, Flex, Image, Text, Badge } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export default function PropertyCard({ property }) {
  const p = property;
  if (!p) return null;

  return (
    <Box
      as={Link}
      to={`/property/${p._id}`}
      borderWidth="1px"
      borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
      borderRadius="md"
      overflow="hidden"
      bg={{ base: "white", _dark: "gray.900" }}
      transition="0.3s"
      _hover={{ shadow: "lg", transform: "translateY(-4px)", cursor: "pointer" }}
      display="flex"
      flexDirection="column"
      h="100%"
    >
      {p.images && p.images.length > 0 ? (
        <Image src={p.images[0]} alt={p.title} objectFit="cover" h="160px" w="100%" />
      ) : (
        <Box h="160px" bg={{ base: "gray.100", _dark: "gray.800" }} />
      )}

      <Box p="3" flex="1" display="flex" flexDirection="column">
        <Box>
          <Flex justify="space-between" align="center" mb="2" gap={2}>
            <Text fontWeight="bold" noOfLines={1} color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
              {p.title}
            </Text>
            <Badge colorPalette="orange" flexShrink={0}>
              {p.type === "Buy" ? "Mua" : "Thuê"}
            </Badge>
          </Flex>
          <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }} mb="2" noOfLines={2}>
            {p.location?.address}, {p.location?.ward || "Chưa cập nhật"}, {p.location?.province}
          </Text>
        </Box>

        <Flex
          justify="space-between"
          align="center"
          mt="auto"
          pt="2"
          borderTop="1px solid"
          borderColor={{ base: "gray.50", _dark: "gray.800" }}
        >
          <Text fontSize="xs" fontWeight="semibold" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>
            Giá: {Number(p.price).toLocaleString("vi-VN")} VNĐ • {p.area} m²
          </Text>

          <Flex align="center" gap="1" color="gray.500" flexShrink={0}>
            <FaEye size={14} />
            <Text fontSize="xs" fontWeight="medium">{p.views || 0}</Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}