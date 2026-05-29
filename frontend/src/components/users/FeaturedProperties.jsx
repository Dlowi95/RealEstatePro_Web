import { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import PropertyCard from "@/components/users/PropertyCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function FeaturedProperties({ limit = 6 }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        console.error("FeaturedProperties fetch error:", err);
        setError("Lỗi kết nối tới server.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit]);

  if (loading) {
    return (
      <Flex align="center" justify="center" py="6">
        <Spinner color="#E65C00" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box py="4">
        <Text color="#E65C00">{error}</Text>
      </Box>
    );
  }

  if (!properties.length) {
    return (
      <Box py="4">
        <Text color={{ base: "gray.600", _dark: "gray.300" }}>Chưa có bất động sản nổi bật nào.</Text>
      </Box>
    );
  }

  return (
    <Container maxW="1200px" px={{ base: "0", md: "4" }}>
      <Box mb="6">
        <Text fontSize="xl" fontWeight="semibold" mb="4">
          Tin nổi bật hàng đầu
        </Text>
        
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(3,1fr)",
          }}
          gap="4"
          w="100%"
        >
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </Grid>

        <Box my="4" display="flex" justifyContent="center">
          <Button
            as={Link}
            to="/list-properties"
            variant="outline"
            colorScheme="orange"
            size="md"
            color="orange.600"
          >
            Xem thêm
          </Button>
        </Box>
      </Box>
    </Container>
  );
}