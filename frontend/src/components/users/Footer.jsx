import {
  Box,
  Container,
  Grid,
  GridItem,
  HStack,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

function Footer() {
  return (
    <Box bg={{ base: "gray.100", _dark: "gray.950" }} pt={10} pb={6}>
      <Container maxW="container.xl">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "2fr 1fr 1fr",
          }}
          gap={10}
        >
          <GridItem>
            <VStack align="start" spacing={4}>
              <Image
                src="/imgs/logo.png"
                alt="RealEstate Pro"
                w="220px"
                objectFit="contain"
                // Chuyển màu theo chế độ light/dark (tránh logo bị “mảng” trắng khi dark)
                filter={{ base: "none", _dark: "invert(1)" }}
              />

              <Text
                fontWeight="bold"
                fontSize="lg"
                color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
              >
                CÔNG TY TNHH REALESTATEPRO
              </Text>

              <Text color={{ base: "gray.700", _dark: "gray.300" }}>
                Địa chỉ: 11 Nguyễn Đình Chiểu, Phường Sài Gòn, TP.HCM
              </Text>

              <Text color={{ base: "gray.700", _dark: "gray.300" }}>
                Email hỗ trợ: support@realestatepro.com
              </Text>

              <Text color={{ base: "gray.700", _dark: "gray.300" }}>
                Hotline: 1900 9999
              </Text>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack align="start" spacing={3}>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
              >
                HƯỚNG DẪN
              </Text>

              <Link href="/about" color={{ base: "gray.700", _dark: "gray.200" }}>Về chúng tôi</Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.200" }}>Báo giá và hỗ trợ</Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.200" }}>Câu hỏi thường gặp</Link>
              <Link href="/contact" color={{ base: "gray.700", _dark: "gray.200" }}>Liên hệ</Link>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack align="start" spacing={3}>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
              >
                QUY ĐỊNH
              </Text>

              <Link
                href="/terms"
                color={{ base: "gray.700", _dark: "gray.200" }}
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="/policy"
                color={{ base: "gray.700", _dark: "gray.200" }}
              >
                Chính sách bảo mật
              </Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.200" }}>
                Quy chế hoạt động
              </Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.200" }}>
                Giải quyết khiếu nại
              </Link>
            </VStack>
          </GridItem>
        </Grid>

        <Box
          mt={10}
          pt={5}
          borderTop="1px solid"
          borderColor={{ base: "gray.300", _dark: "whiteAlpha.200" }}
        >
          <HStack justify="space-between" flexWrap="wrap">
            <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }}>
              © 2026 RealEstatePro. All rights reserved.
            </Text>

            <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }}>
              Made with ❤️ by RealEstatePro
            </Text>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
