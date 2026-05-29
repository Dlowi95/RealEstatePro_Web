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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function FeaturedCarousel({ limit = 10 }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [index, setIndex] = useState(0);

  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    if (!properties.length) return;
    
    const maxStartIndex = Math.max(0, properties.length - itemsPerView);
    if (maxStartIndex <= 0) return; 

    const timer = setInterval(() => {
      setIndex((prev) => (prev >= maxStartIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, [properties.length, itemsPerView]);

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
    <Container maxW="1200px" py="6">
      <Flex align="center" justify="space-between" mb="4" gap={4}>
        <Text fontSize="xl" fontWeight="semibold" color="orange.500">
          Tin nổi bật
        </Text>
        <Flex gap={2}>
          <Button size="sm" variant="outline" onClick={handlePrev} isDisabled={safeIndex === 0}>Trước</Button>
          <Button size="sm" variant="outline" onClick={handleNext} isDisabled={safeIndex === maxStartIndex}>Sau</Button>
        </Flex>
      </Flex>

      <Flex gap="4" overflow="hidden" w="100%">
        {visible.map((p) => (
          <Box
            key={p._id}
            flex="1"
            as={Link}
            to={`/property/${p._id}`}
            borderWidth="1px"
            borderColor={{ base: "gray.100", _dark: "whiteAlpha.200" }}
            borderRadius="md"
            overflow="hidden"
            bg={{ base: "white", _dark: "gray.900" }}
            transition="0.3s"
            minW="0"
            _hover={{ shadow: "lg", transform: "translateY(-4px)", cursor: "pointer" }}
          >
            {p.images && p.images.length > 0 ? (
              <Image src={p.images[0]} alt={p.title} objectFit="cover" h="160px" w="100%" />
            ) : (
              <Box h="160px" bg={{ base: "gray.100", _dark: "gray.800" }} />
            )}
            <Box p="3">
              <Flex justify="space-between" align="center" mb="2" gap={2}>
                <Text fontWeight="bold" noOfLines={1} flex="1" color={{ base: "gray.900", _dark: "whiteAlpha.900" }}>{p.title}</Text>
                <Badge colorPalette="green" flexShrink={0}>{p.type === "Buy" ? "Bán" : "Thuê"}</Badge>
              </Flex>
              <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }} noOfLines={2}>
                {p.location?.address}, {p.location?.ward || "Chưa cập nhật"} {p.location?.province}
              </Text>
              <Text fontSize="sm" fontWeight="semibold" mt="2" color="#E65C00">
                {Number(p.price).toLocaleString("vi-VN")} VNĐ
              </Text>
            </Box>
          </Box>
        ))}
      </Flex>
    </Container>
  );
}