import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";
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
    <Container maxW="1200px" py={{ base: "4", md: "10" }} px={{ base: "4", md: "6" }}>
      <Box
        mb={6}
        bg={{ base: "white", _dark: "gray.800" }}
        p={{ base: "5", md: "8" }}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
      >
        <Heading size={{ base: "xl", md: "2xl" }} textAlign="center" mb={4} lineHeight="shorter">
          <Text as="span">
            Mua Bán Và Cho Thuê Bất Động Sản Nhanh Chóng Trên{" "}
          </Text>
          <Text
            as="span"
            color={{ base: "gray.800", _dark: "gray.100" }}
            fontWeight="bold"
          >
            RealEstatePro
          </Text>
          <Text as="span">.</Text>
        </Heading>
        <Text
          textAlign="center"
          color={{ base: "gray.600", _dark: "gray.200" }}
          mb={6}
          fontSize="sm"
        >
          (RealEstatePro: Nền tảng công nghệ bất động sản)
        </Text>

        <Text
          textAlign="justify"
          color={{ base: "gray.700", _dark: "gray.100" }}
          mb={4}
        >
          Bất động sản là một loại tài sản có giá trị lớn và tính thanh khoản
          cao, do đó, mua bán và cho thuê bất động sản luôn là hoạt động kinh
          doanh thu hút rất nhiều nhà đầu tư, từ cá nhân đến doanh nghiệp.
        </Text>

        <Text
          textAlign="justify"
          color={{ base: "gray.800", _dark: "gray.100" }}
          mb={4}
        >
          <Text as="span" fontWeight="bold">
            Mua bán bất động sản
          </Text>{" "}
          là quá trình chuyển giao quyền sở hữu từ người này sang người khác,
          bao gồm các loại địa ốc như đất nền, đất vườn, đất nông nghiệp, nhà
          đất, chung cư,... Mỗi giao dịch thành công là cơ hội để người bán thu
          được lợi nhuận lớn, đôi khi từ hàng trăm triệu đến vài tỷ đồng, tùy
          thuộc vào giá trị và vị trí.
        </Text>

        <Text
          textAlign="justify"
          color={{ base: "gray.800", _dark: "gray.100" }}
          mb={4}
        >
          <Text as="span" fontWeight="bold">
            Cho thuê bất động sản
          </Text>{" "}
          là hành động cho phép một cá nhân hoặc tổ chức sử dụng tài sản bất
          động sản của người khác trong một khoảng thời gian cụ thể, trong đó
          người thuê cam kết trả một khoản tiền xác định cho chủ sở hữu tài sản.
        </Text>

        <Text
          textAlign="justify"
          color={{ base: "gray.800", _dark: "gray.100" }}
        >
          RealEstatePro giúp bạn tìm kiếm và đăng tin bất động sản nhanh chóng,
          minh bạch và hiệu quả.
        </Text>
      </Box>

      <Box mt={8}>
        <Box
          bg={{ base: "white", _dark: "gray.800" }}
          p={{ base: "5", md: "8" }}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
        >
          <VStack align="start" gap={3}>
            <Heading size={{ base: "lg", md: "xl" }} mb={2}>
              Đội ngũ quản trị
            </Heading>
            <Text color={{ base: "gray.600", _dark: "gray.200" }} mb={4} fontSize="sm">
              Thông tin của các admin vận hành hệ thống (tóm tắt).
            </Text>
            
            <Text fontWeight="semibold">Phạm Duy Anh</Text>
            <Text color="gray.600" fontSize="sm">
              Chuyên hỗ trợ các vấn đề về mặt pháp lý
            </Text>

            <Text fontWeight="semibold" pt={2}>
              Trương Gia Huy
            </Text>
            <Text color="gray.600" fontSize="sm">
              Chuyên hỗ trợ các vấn đề về mặt kỹ thuật
            </Text>

            <Text fontWeight="semibold" pt={2}>
              Võ Hoàng Đại Lợi
            </Text>
            <Text color="gray.600" fontSize="sm">Chuyên hỗ trợ về mặt tài chính</Text>

            <Text fontWeight="semibold" pt={2}>
              Trần Hữu Nhân
            </Text>
            <Text color="gray.600" fontSize="sm">
              Chuyên hỗ trợ về mặt dự án cũng như xây dựng
            </Text>
          </VStack>
        </Box>
      </Box>
    </Container>
  );
}