import { Box, Container, Heading, Text, VStack, HStack, Link as ChakraLink } from "@chakra-ui/react";
import { useAuthContext } from "../../context/AuthContext";

export default function ContactPage() {
  const { dbUser } = useAuthContext();

  return (
    <Container maxW="container.lg" py={10}>
      <Box mb={6} textAlign="center">
        <Heading size="2xl">Liên hệ</Heading>
        <Text color={{ base: "gray.800", _dark: "gray.200" }} mt={2}>
          Gửi câu hỏi hoặc nhận hỗ trợ từ đội ngũ RealEstatePro.
        </Text>
      </Box>

      <VStack spacing={4} align="stretch">
        <Box bg={{ base: "white", _dark: "gray.800" }} borderWidth="1px" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} p={6} borderRadius="lg">
          <Heading size="md" mb={3}>
            Thông tin hỗ trợ
          </Heading>

          
            <Text fontWeight="semibold">Phạm Duy Anh</Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Hotline: 0976741018</Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Email: phamduyanhkg@gmail.com</Text>

            <Text fontWeight="semibold" pt={2}>
              Trương Gia Huy
            </Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Hotline: 0976154487</Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Email: huygiatruong2005@gmail.com</Text>

            <Text fontWeight="semibold" pt={2}>
              Võ Hoàng Đại Lợi
            </Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Hotline: 0336066639</Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Email: loisadnhan@gmail.com</Text>

            <Text fontWeight="semibold" pt={2}>
              Trần Hữu Nhân
            </Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Hotline: 0767050126</Text>
            <Text bg={{ base: "white", _dark: "gray.800" }}>Email: nhanz200588@gmail.com</Text>
        </Box>

        <Box bg={{ base: "white", _dark: "gray.800" }} borderWidth="1px" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} p={6} borderRadius="lg">
          <Heading size="md" mb={3}>
            Gợi ý
          </Heading>
          <Text color={{ base: "gray.800", _dark: "gray.200" }}>
            Nếu bạn đang đăng tin, vui lòng cung cấp mã tin/tiêu đề tin đăng để đội ngũ hỗ trợ nhanh hơn.
          </Text>
          {dbUser?.fullName ? (
            <Text mt={2} fontWeight="semibold" color={{ base: "gray.700", _dark: "gray.100" }}>
              Xin chào {dbUser.fullName} 👋
            </Text>
          ) : null}
        </Box>
      </VStack>
    </Container>
  );
}

