import { Box, Container, Heading, Text, Image, Flex, VStack } from "@chakra-ui/react";
import { useAuthContext } from "../../context/AuthContext";

export default function ContactPage() {
  const { dbUser } = useAuthContext();

  return (
    <Container maxW="container.lg" py={10}>
      <Box mb={6} textAlign="center">
        <Heading size="5xl">LIÊN HỆ</Heading>
        <Text color={{ base: "gray.800", _dark: "gray.200" }} mt={2}>
          Gửi câu hỏi hoặc nhận hỗ trợ từ đội ngũ RealEstatePro.
        </Text>
      </Box>

      <VStack spacing={4} align="stretch">
        <Box bg={{ base: "white", _dark: "gray.800" }} borderWidth="1px" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} p={6} borderRadius="lg">
          <Heading size="md" mb={3}>
            Thông tin hỗ trợ
          </Heading>

          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            
            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={4}>
                <Box flex="1">
                  <Text fontWeight="semibold">Phạm Duy Anh</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2}>Hotline: 0976741018</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }}>Email: phamduyanhkg@gmail.com</Text>
                </Box>
                <Image src="/public/imgs/avatar1.jpg" alt="Phạm Duy Anh" boxSize="120px" objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400"/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={4}>
                <Box flex="1">
                  <Text fontWeight="semibold">Trương Gia Huy</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2}>Hotline: 0976154487</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }}>Email: huygiatruong2005@gmail.com</Text>
                </Box>
                <Image src="/public/imgs/avatar2.jpg" alt="Trương Gia Huy" boxSize="120px" objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400"/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={4}>
                <Box flex="1">
                  <Text fontWeight="semibold">Võ Hoàng Đại Lợi</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2}>Hotline: 0336066639</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }}>Email: loisadnhan@gmail.com</Text>
                </Box>
                <Image src="/public/imgs/avatar3.jpg" alt="Võ Hoàng Đại Lợi" boxSize="120px" objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400"/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={4}>
                <Box flex="1">
                  <Text fontWeight="semibold">Trần Hữu Nhân</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2}>Hotline: 0767050126</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }}>Email: nhanz200588@gmail.com</Text>
                </Box>
                <Image src="/public/imgs/avatar4.jpg" alt="Trần Hữu Nhân" boxSize="120px" objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400"/>
              </Flex>
            </Box>
          </Box>
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

