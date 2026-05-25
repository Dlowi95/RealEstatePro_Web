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
    <Box bg="gray.100" pt={10} pb={6}>
      <Container maxW="container.xl">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "2fr 1fr 1fr",
          }}
          gap={10}
        >
          {/* LEFT */}
          <GridItem>
            <VStack align="start" spacing={4}>
              <Image
                src="/imgs/logo.png"
                alt="RealEstate Pro"
                w="220px"
                objectFit="contain"
              />

              <Text fontWeight="bold" fontSize="lg">
                CÔNG TY TNHH REALESTATEPRO
              </Text>

              <Text color="gray.700">
                Địa chỉ: 11 Nguyễn Đình Chiểu, Phường Sài Gòn, TP.HCM
              </Text>

              <Text color="gray.700">
                Email hỗ trợ: support@realestatepro.com
              </Text>

              <Text color="gray.700">
                Hotline: 1900 9999
              </Text>
            </VStack>
          </GridItem>

          {/* CENTER */}
          <GridItem>
            <VStack align="start" spacing={3}>
              <Text fontWeight="bold" fontSize="lg">
                HƯỚNG DẪN
              </Text>

              <Link href="#">Về chúng tôi</Link>
              <Link href="#">Báo giá và hỗ trợ</Link>
              <Link href="#">Câu hỏi thường gặp</Link>
              <Link href="#">Liên hệ</Link>
            </VStack>
          </GridItem>

          {/* RIGHT */}
          <GridItem>
            <VStack align="start" spacing={3}>
              <Text fontWeight="bold" fontSize="lg">
                QUY ĐỊNH
              </Text>

              <Link href="#">Điều khoản sử dụng</Link>
              <Link href="#">Chính sách bảo mật</Link>
              <Link href="#">Quy chế hoạt động</Link>
              <Link href="#">Giải quyết khiếu nại</Link>
            </VStack>
          </GridItem>
        </Grid>

        {/* BOTTOM */}
        <Box
          mt={10}
          pt={5}
          borderTop="1px solid"
          borderColor="gray.300"
        >
          <HStack justify="space-between" flexWrap="wrap">
            <Text fontSize="sm" color="gray.600">
              © 2026 RealEstatePro. All rights reserved.
            </Text>

            <Text fontSize="sm" color="gray.600">
              Made with ❤️ by RealEstatePro
            </Text>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;