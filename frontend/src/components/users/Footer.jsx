import {
  Box,
  Container,
  Grid,
  GridItem,
  Flex,
  Image,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";

function Footer() {
  return (
    <Box 
      bg={{ base: "gray.100", _dark: "gray.950" }} 
      pt={10} 
      pb={6} 
      w="100%"
      borderTop="1px solid"
      borderColor={{ base: "gray.200", _dark: "whiteAlpha.100" }}
    >
      <Container maxW="1200px">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "2fr 1fr 1fr",
          }}
          gap={10}
        >
          <GridItem>
            <VStack align="start" gap={4}>
              <Image
                src="/imgs/logo.png"
                alt="RealEstate Pro"
                w="220px"
                objectFit="contain"
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
            <VStack align="start" gap={3}>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
              >
                HƯỚNG DẪN
              </Text>

              <Link href="/about" color={{ base: "gray.700", _dark: "gray.300" }} _hover={{ color: "#E65C00" }}>Về chúng tôi</Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.300" }} _hover={{ color: "#E65C00" }}>Báo giá và hỗ trợ</Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.300" }} _hover={{ color: "#E65C00" }}>Câu hỏi thường gặp</Link>
              <Link href="/contact" color={{ base: "gray.700", _dark: "gray.300" }} _hover={{ color: "#E65C00" }}>Liên hệ</Link>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack align="start" gap={3}>
              <Text
                fontWeight="bold"
                fontSize="lg"
                color={{ base: "gray.900", _dark: "whiteAlpha.900" }}
              >
                QUY ĐỊNH
              </Text>

              <Link
                href="/terms"
                color={{ base: "gray.700", _dark: "gray.300" }}
                _hover={{ color: "#E65C00" }}
              >
                Điều khoản sử dụng
              </Link>
              <Link
                href="/policy"
                color={{ base: "gray.700", _dark: "gray.300" }}
                _hover={{ color: "#E65C00" }}
              >
                Chính sách bảo mật
              </Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.300" }} _hover={{ color: "#E65C00" }}>
                Quy chế hoạt động
              </Link>
              <Link href="#" color={{ base: "gray.700", _dark: "gray.300" }} _hover={{ color: "#E65C00" }}>
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
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <Text
              fontSize="sm"
              color={{ base: "gray.600", _dark: "gray.400" }}
              textAlign={{ base: "center", sm: "left" }}
            >
              © 2026 RealEstatePro. All rights reserved.
            </Text>

            <Text
              fontSize="sm"
              color={{ base: "gray.600", _dark: "gray.400" }}
              textAlign={{ base: "center", sm: "right" }}
            >
              Made with ❤️ by RealEstatePro
            </Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;