import { Box, Container, Heading, Text, Image, Flex, VStack } from "@chakra-ui/react";
import { useAuthContext } from "../../context/AuthContext";

export default function ContactPage() {
  const { dbUser } = useAuthContext();

  return (
    <Container maxW="1200px" py={{ base: "4", md: "10" }} px={{ base: "4", md: "6" }}>
      <Box mb={6} textAlign="center">
        <Heading size={{ base: "3xl", md: "5xl" }}>LIÊN HỆ</Heading>
        <Text color={{ base: "gray.800", _dark: "gray.200" }} mt={2} fontSize={{ base: "sm", md: "md" }}>
          Gửi câu hỏi hoặc nhận hỗ trợ từ đội ngũ RealEstatePro.
        </Text>
      </Box>

      <VStack gap={4} align="stretch" w="100%">
        <Box bg={{ base: "white", _dark: "gray.800" }} borderWidth="1px" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} p={{ base: "4", md: "6" }} borderRadius="lg">
          <Heading size="md" mb={4}>
            Thông tin hỗ trợ
          </Heading>

          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} w="100%">
            
            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={3} direction={{ base: "row", sm: "row" }}>
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" noOfLines={1}>Phạm Duy Anh</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2} fontSize="xs" noOfLines={1}>Hotline: 0976741018</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" noOfLines={1}>Email: phamduyanhkg@gmail.com</Text>
                </Box>
                {/* Đã sửa đường dẫn ảnh ở đây */}
                <Image src="/imgs/avatar1.jpg" alt="Phạm Duy Anh" boxSize={{ base: "80px", sm: "100px", md: "120px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={3} direction={{ base: "row", sm: "row" }}>
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" noOfLines={1}>Trương Gia Huy</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2} fontSize="xs" noOfLines={1}>Hotline: 0976154487</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" noOfLines={1}>Email: huygiatruong2005@gmail.com</Text>
                </Box>
                {/* Đã sửa đường dẫn ảnh ở đây */}
                <Image src="/imgs/avatar2.jpg" alt="Trương Gia Huy" boxSize={{ base: "80px", sm: "100px", md: "120px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={3} direction={{ base: "row", sm: "row" }}>
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" noOfLines={1}>Võ Hoàng Đại Lợi</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2} fontSize="xs" noOfLines={1}>Hotline: 0336066639</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" noOfLines={1}>Email: loisadnhan@gmail.com</Text>
                </Box>
                {/* Đã sửa đường dẫn ảnh ở đây */}
                <Image src="/imgs/avatar3.jpg" alt="Võ Hoàng Đại Lợi" boxSize={{ base: "80px", sm: "100px", md: "120px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={4}
              borderRadius="lg"
            >
              <Flex align="center" justify="space-between" gap={3} direction={{ base: "row", sm: "row" }}>
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" noOfLines={1}>Trần Hữu Nhân</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={2} fontSize="xs" noOfLines={1}>Hotline: 0767050126</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" noOfLines={1}>Email: nhanz200588@gmail.com</Text>
                </Box>
                {/* Đã sửa đường dẫn ảnh ở đây */}
                <Image src="/imgs/avatar4.jpg" alt="Trần Hữu Nhân" boxSize={{ base: "80px", sm: "100px", md: "120px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
              </Flex>
            </Box>
          </Box>
        </Box>

        <Box bg={{ base: "white", _dark: "gray.800" }} borderWidth="1px" borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }} p={{ base: "4", md: "6" }} borderRadius="lg">
          <Heading size="md" mb={3}>
            Gợi ý
          </Heading>
          <Text color={{ base: "gray.800", _dark: "gray.200" }} fontSize="sm">
            Nếu bạn đang đăng tin, vui lòng cung cấp mã tin/tiêu đề tin đăng để đội ngũ hỗ trợ nhanh hơn.
          </Text>
          {dbUser?.fullName ? (
            <Text mt={2} fontWeight="semibold" color={{ base: "gray.700", _dark: "gray.100" }} fontSize="sm">
              Xin chào {dbUser.fullName} 👋
            </Text>
          ) : null}
        </Box>
      </VStack>
    </Container>
  );
}