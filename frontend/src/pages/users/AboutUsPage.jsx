import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Avatar } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AboutUsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        // Lấy danh sách users, filter role=admin.
        const res = await axios.get(`${API_BASE_URL}/api/admin/users`);
        const users = res.data?.users || [];
        setAdmins(users.filter((u) => u.role === "admin"));
      } catch (e) {
        console.error("AboutUs fetch error:", e);
        setError("Không thể tải thông tin admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <Container maxW="container.lg" py={10}>
      <Box mb={6}>
        <Heading size="2xl">Về chúng tôi</Heading>
        <Text color="gray.600" mt={2}>
          RealEstatePro là nền tảng giúp bạn đăng tin và tìm kiếm bất động sản nhanh chóng.
        </Text>
      </Box>

      <Box mb={4}>
        <Heading size="lg" mb={2}>Đội ngũ quản trị</Heading>
        <Text color="gray.600">Thông tin liên hệ của các admin vận hành hệ thống.</Text>
      </Box>

     
      <Box mt={10} p={6} borderTopWidth="1px" borderColor="gray.200">
        <Text fontWeight="semibold">Liên hệ</Text>
        <Text color="gray.600" mt={2}>
          Nếu bạn có thắc mắc, vui lòng liên hệ với admin để được hỗ trợ.
        </Text>
      </Box>
    </Container>
  );
}


