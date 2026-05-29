import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Image,
  Text,
  Badge,
  Flex,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function FeaturedCarousel({ limit = 10 }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [index, setIndex] = useState(0);
  const itemsPerView = 3;

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/properties`);
        if (res.data?.success) {
          setProperties((res.data.data || []).slice(0, limit));
        } else {
          setError("Không thể tải danh sách bất động sản.");
        }
      } catch (err) {
        console.error("FeaturedCarousel fetch error:", err);
        setError("Lỗi kết nối tới server.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [limit]);

  useEffect(() => {
    if (index < 0) setIndex(0);
  }, [index]);

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

  if (!properties.length) return null;

  const maxStartIndex = Math.max(0, properties.length - itemsPerView);
  const safeIndex = Math.min(index, maxStartIndex);
  const visible = properties.slice(safeIndex, safeIndex + itemsPerView);

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setIndex((i) => Math.min(maxStartIndex, i + 1));

  return (
    <Container maxW="container.lg" py="6">
      <Flex align="center" justify="space-between" mb="4" gap={4}>
        <Text fontSize="xl" fontWeight="semibold" color="orange.500">
          Tin nổi bật
        </Text>
        <Flex gap={2}>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrev}
            isDisabled={safeIndex === 0}
          >
            Trước
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleNext}
            isDisabled={safeIndex === maxStartIndex}
          >
            Sau
          </Button>
        </Flex>
      </Flex>

      <Flex gap="4" overflow="hidden">
        {visible.map((p) => (
          <Box
            key={p._id}
            flex="1"
            as={Link}
            to={`/property/${p._id}`}
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
            {p.images && p.images.length > 0 ? (
              <Image
                src={p.images[0]}
                alt={p.title}
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
                  {p.title}
                </Text>
                <Badge colorScheme="green">{p.type}</Badge>
              </Flex>
              <Text fontSize="sm" color="gray.600" noOfLines={2}>
                {p.location?.address}, {p.location?.ward || "Chưa cập nhật"}{" "}
                {p.location?.province}
              </Text>
              <Text fontSize="sm" fontWeight="semibold" mt="2">
                {Number(p.price).toLocaleString("vi-VN")} VNĐ
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>
    </Container>
  );
}
