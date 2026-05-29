import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

function PolicyPage() {
  return (
    <Box bg={{ base: "white", _dark: "gray.900" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} py={10} minH="100vh">
      <Container maxW="1200px">
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          <Box
            display={{ base: "none", md: "block" }}
            flexBasis="260px"
            maxW="260px"
            position="sticky"
            top="100px"
            alignSelf="flex-start"
          >
            <Box
              bg={{ base: "gray.50", _dark: "gray.800" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              borderRadius="2xl"
              p={5}
              boxShadow="sm"
              maxH="calc(100vh - 140px)"
              overflowY="auto"
            >
              <Text fontSize="lg" fontWeight="700" mb={5} color={{ base: "gray.900", _dark: "white" }}>
                Mục lục
              </Text>
              <VStack align="start" gap={3}>
                <Link href="#section-1" color="blue.500">1. Thu thập thông tin</Link>
                <Link href="#section-2" color="blue.500">2. Mục đích sử dụng</Link>
                <Link href="#section-3" color="blue.500">3. Bảo mật dữ liệu</Link>
                <Link href="#section-4" color="blue.500">4. Cookies</Link>
                <Link href="#section-5" color="blue.500">5. Quyền người dùng</Link>
                <Link href="#section-6" color="blue.500">6. Liên hệ</Link>
              </VStack>
            </Box>
          </Box>

          <Box flex="1">
            <VStack gap={8} align="stretch">
              <VStack gap={3}>
                <Heading
                  fontSize={{ base: "26px", md: "38px" }}
                  textAlign="center"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  CHÍNH SÁCH BẢO MẬT
                </Heading>
                <Text fontSize="md" textAlign="center" color={{ base: "gray.600", _dark: "gray.400" }}>
                  Cập nhật lần cuối: 29/05/2026
                </Text>
              </VStack>

              <Text fontSize="16px" lineHeight="1.8" textAlign="justify">
                Chào mừng bạn đến với RealEstate Pro. Chúng tôi cam kết bảo vệ
                thông tin cá nhân và quyền riêng tư của người dùng khi truy cập
                và sử dụng nền tảng của chúng tôi.
              </Text>

              <Box>
                <Heading
                  id="section-1"
                  scrollMarginTop="120px"
                  fontSize="22px"
                  mb={5}
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  1. THU THẬP THÔNG TIN
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.7" textAlign="justify">
                    Chúng tôi có thể thu thập các thông tin như họ tên, email,
                    số điện thoại, địa chỉ và thông tin tài khoản của người
                    dùng.
                  </Text>
                  <Text lineHeight="1.7" textAlign="justify">
                    Ngoài ra, hệ thống có thể ghi nhận địa chỉ IP, loại thiết
                    bị, trình duyệt và lịch sử truy cập để nâng cao trải nghiệm
                    sử dụng.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading
                  id="section-2"
                  scrollMarginTop="120px"
                  fontSize="22px"
                  mb={5}
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  2. MỤC ĐÍCH SỬ DỤNG
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.7" textAlign="justify">
                    Thông tin được sử dụng nhằm cung cấp dịch vụ, hỗ trợ khách
                    hàng, xác minh tài khoản và cải thiện chất lượng hệ
                    thống.
                  </Text>
                  <Text lineHeight="1.7" textAlign="justify">
                    Chúng tôi có thể gửi thông báo, email hoặc cảnh báo liên
                    quan đến tài khoản và dịch vụ của người dùng.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading
                  id="section-3"
                  scrollMarginTop="120px"
                  fontSize="22px"
                  mb={5}
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  3. BẢO MẬT DỮ LIỆU
                </Heading>
                <Text lineHeight="1.7" textAlign="justify">
                  RealEstate Pro áp dụng các biện pháp kỹ thuật và tổ chức phù
                  hợp để bảo vệ dữ liệu cá nhân khỏi truy cập trái phép, mất mát
                  hoặc rò rỉ thông tin.
                </Text>
              </Box>

              <Box>
                <Heading
                  id="section-4"
                  scrollMarginTop="120px"
                  fontSize="22px"
                  mb={5}
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  4. COOKIES
                </Heading>
                <Text lineHeight="1.7" textAlign="justify">
                  Website có thể sử dụng cookies nhằm ghi nhớ tùy chọn người
                  dùng, hỗ trợ đăng nhập và cải thiện hiệu suất hoạt động.
                </Text>
              </Box>

              <Box>
                <Heading
                  id="section-5"
                  scrollMarginTop="120px"
                  fontSize="22px"
                  mb={5}
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  5. QUYỀN NGƯỜI DÙNG
                </Heading>
                <Text lineHeight="1.7" textAlign="justify">
                  Người dùng có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa thông
                  tin cá nhân theo quy định pháp luật hiện hành.
                </Text>
              </Box>

              <Box>
                <Heading
                  id="section-6"
                  scrollMarginTop="120px"
                  fontSize="22px"
                  mb={5}
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  6. THÔNG TIN LIÊN HỆ
                </Heading>
                <VStack gap={3} align="stretch" fontSize="sm">
                  <Text>Email: support@realestatepro.com</Text>
                  <Text>Hotline: 0123 456 789</Text>
                  <Text>Địa chỉ: TP. Hồ Chí Minh, Việt Nam</Text>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default PolicyPage;