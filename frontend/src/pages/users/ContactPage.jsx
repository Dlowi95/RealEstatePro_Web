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
          <Heading size="md" mb={4} display="flex" alignItems="baseline" flexWrap="wrap" gap={2}>
            Thông tin hỗ trợ
            <Text
              as="span"
              fontSize={{ base: "11px", sm: "xs", md: "sm" }}
              fontWeight="normal"
              color={{ base: "gray.500", _dark: "gray.400" }}
            >
              ( bấm vào số HOTLINE để nhận hỗ trợ ngay )
            </Text>
          </Heading>

          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} w="100%">
            
            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={{ base: 3, sm: 4 }}
              borderRadius="lg"
              w="100%"
              overflow="hidden"
            >
              <Flex align="center" justify="space-between" gap={3} w="100%">
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }} noOfLines={1}>Phạm Duy Anh</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={1} fontSize="xs" noOfLines={1}>
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Hotline: </Box>
                    <Box as="a" href="tel:0976741018" _hover={{ color: "#FF6B00", textDecoration: "underline" }}>0976741018</Box>
                  </Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" wordBreak="break-all">
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Email: </Box>
                    phamduyanhkg@gmail.com
                  </Text>
                </Box>
                <Image src="/imgs/avatar1.jpg" alt="Phạm Duy Anh" boxSize={{ base: "70px", sm: "90px", md: "110px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={{ base: 3, sm: 4 }}
              borderRadius="lg"
              w="100%"
              overflow="hidden"
            >
              <Flex align="center" justify="space-between" gap={3} w="100%">
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }} noOfLines={1}>Trương Gia Huy</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={1} fontSize="xs" noOfLines={1}>
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Hotline: </Box>
                    <Box as="a" href="tel:0976154487" _hover={{ color: "#FF6B00", textDecoration: "underline" }}>0976154487</Box>
                  </Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" wordBreak="break-all">
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Email: </Box>
                    huygiatruong2005@gmail.com
                  </Text>
                </Box>
                <Image src="/imgs/avatar2.jpg" alt="Trương Gia Huy" boxSize={{ base: "70px", sm: "90px", md: "110px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={{ base: 3, sm: 4 }}
              borderRadius="lg"
              w="100%"
              overflow="hidden"
            >
              <Flex align="center" justify="space-between" gap={3} w="100%">
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }} noOfLines={1}>Võ Hoàng Đại Lợi</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={1} fontSize="xs" noOfLines={1}>
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Hotline: </Box>
                    <Box as="a" href="tel:0336066639" _hover={{ color: "#FF6B00", textDecoration: "underline" }}>0336066639</Box>
                  </Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" wordBreak="break-all">
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Email: </Box>
                    loisadnhan@gmail.com
                  </Text>
                </Box>
                <Image src="/imgs/avatar3.jpg" alt="Võ Hoàng Đại Lợi" boxSize={{ base: "70px", sm: "90px", md: "110px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
              </Flex>
            </Box>

            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderWidth="1px"
              borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
              p={{ base: 3, sm: 4 }}
              borderRadius="lg"
              w="100%"
              overflow="hidden"
            >
              <Flex align="center" justify="space-between" gap={3} w="100%">
                <Box flex="1" minW="0">
                  <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }} noOfLines={1}>Trần Hữu Nhân</Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} mt={1} fontSize="xs" noOfLines={1}>
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Hotline: </Box>
                    <Box as="a" href="tel:0767050126" _hover={{ color: "#FF6B00", textDecoration: "underline" }}>0767050126</Box>
                  </Text>
                  <Text color={{ base: "gray.700", _dark: "gray.200" }} fontSize="xs" wordBreak="break-all">
                    <Box as="span" fontWeight="bold" color={{ base: "gray.900", _dark: "white" }}>Email: </Box>
                    nhanz200588@gmail.com
                  </Text>
                </Box>
                <Image src="/imgs/avatar4.jpg" alt="Trần Hữu Nhân" boxSize={{ base: "70px", sm: "90px", md: "110px" }} objectFit="cover" borderRadius="full" border="3px solid" borderColor="orange.400" flexShrink={0}/>
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