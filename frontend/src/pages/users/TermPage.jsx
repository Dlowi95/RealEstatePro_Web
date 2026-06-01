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

function TermPage() {
  return (
    <Box bg={{ base: "white", _dark: "gray.900" }} color={{ base: "gray.800", _dark: "whiteAlpha.900" }} py={{ base: 6, md: 10 }} minH="100vh" overflow="visible">
      <Container maxW="1200px" px={{ base: "4", md: "6" }}>
        <Flex direction={{ base: "column", md: "row" }} gap={8} position="relative">
          
          <Box
            display={{ base: "none", md: "block" }}
            flexBasis="260px"
            maxW="260px"
            w="100%"
            position="sticky"
            top="90px"
            alignSelf="flex-start"
            height="fit-content"
          >
            <Box
              borderWidth="1px"
              borderRadius="2xl"
              p={5}
              bg={{ base: "gray.50", _dark: "gray.800" }}
              borderColor={{ base: "gray.200", _dark: "gray.700" }}
              boxShadow="sm"
              maxH="calc(100vh - 130px)"
              overflowY="auto"
            >
              <Text fontSize="lg" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                Mục lục
              </Text>
              <VStack align="start" gap={3}>
                <Link href="#section-1" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 1. Dịch vụ</Link>
                <Link href="#section-2" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 2. Phí dịch vụ</Link>
                <Link href="#section-3" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 3. Đơn giá và thời hạn</Link>
                <Link href="#section-4" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 4. Thanh toán</Link>
                <Link href="#section-5" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 5. Quyền và nghĩa vụ</Link>
                <Link href="#section-6" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 6. Tạm ngừng</Link>
                <Link href="#section-7" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 7. Chấm dứt</Link>
                <Link href="#section-8" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 8. Phạt vi phạm</Link>
                <Link href="#section-9" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 9. Trách nhiệm pháp lý</Link>
                <Link href="#section-10" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 10. Sở hữu trí tuệ</Link>
                <Link href="#section-11" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 11. Bất khả kháng</Link>
                <Link href="#section-12" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 12. Bảo mật thông tin</Link>
                <Link href="#section-13" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 13. Chống tham nhũng</Link>
                <Link href="#section-14" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 14. Giải quyết tranh chấp</Link>
                <Link href="#section-15" color="blue.500" _hover={{ textDecoration: "underline", color: "#E65C00" }}>Điều 15. Quy định chung</Link>
              </VStack>
            </Box>
          </Box>

          <Box flex="1" minW="0">
            <VStack gap={8} align="stretch">
              <VStack gap={3}>
                <Heading
                  fontSize={{ base: "26px", md: "34px" }}
                  fontWeight="700"
                  textAlign="center"
                  color={{ base: "gray.900", _dark: "white" }}
                >
                  ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ
                </Heading>
                <Text
                  fontSize={{ base: "18px", md: "22px" }}
                  fontStyle="italic"
                  textAlign="center"
                  color={{ base: "gray.700", _dark: "gray.400" }}
                >
                  (có hiệu lực kể từ ngày 15 tháng 03 năm 2025)
                </Text>
              </VStack>

              <Text fontSize="16px" lineHeight="1.8" textAlign="justify">
                Bằng việc đặt mua, mua, sử dụng hoặc/và truy cập các dịch vụ
                trên website/ ứng dụng{" "}
                <Text as="span" color="red.500">
                  www.RealEstatePro.com.vn
                </Text>{" "}
                (“Nền tảng”) do Công ty cổ phần PropertyGuru Việt Nam
                (“PGVN”/“Nhà Cung Cấp”) là chủ sở hữu, Khách Hàng đồng ý với các
                điều khoản và điều kiện quy định tại Điều khoản sử dụng dịch vụ
                như sau:
              </Text>

              <Box>
                <Heading scrollMarginTop="100px" id="section-1" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 1. DỊCH VỤ
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify">
                    1.1. Trên cơ sở yêu cầu của Khách Hàng, PGVN đồng ý cung cấp
                    cho Khách Hàng các dịch vụ quảng cáo trên Nền tảng (“Dịch
                    vụ”) theo các điều khoản và điều kiện quy định tại Điều
                    khoản sử dụng dịch vụ này.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    1.2. Chi tiết của Dịch vụ sẽ được Các Bên thỏa thuận và ký
                    kết các Đơn đặt hàng để ghi nhận cho mỗi lần phát sinh nhu
                    cầu.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    1.3. Dịch vụ sẽ được cung cấp trên cơ sở (i) Khách Hàng đã
                    hoàn tất việc thanh toán theo quy định tại Đơn đặt hàng hoặc
                    (ii) số dư trong tài khoản thành viên của Khách Hàng trên
                    Nền tảng vẫn còn đủ để sử dụng Dịch vụ.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-2" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 2. PHÍ DỊCH VỤ
                </Heading>
                <Text lineHeight="1.8" textAlign="justify">
                  Phí dịch vụ bao gồm nhưng không giới hạn phí của Dịch vụ
                  được cung cấp và các chi phí có liên quan được nêu chi tiết
                  trong các Đơn đặt hàng được kí kết giữa Khách Hàng và PGVN
                  (“Phí dịch vụ”).
                </Text>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-3" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 3. ĐƠN GIÁ DỊCH VỤ VÀ THỜI HẠN SỬ DỤNG
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify">
                    3.1. Đơn giá dịch vụ cho từng lần phát sinh được áp dụng
                    theo đơn giá, chính sách của PGVN niêm yết công khai trên
                    Nền tảng.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    3.2. Tài khoản chính là tài khoản ghi nhận theo số tiền mà
                    Khách Hàng thực nạp vào hệ thống của PGVN (không bao gồm
                    thuế giá trị gia tăng). Ví dụ, Khách Hàng nạp 108,000,000
                    VNĐ thì trong tài khoản chính sẽ có 100,000,000 VNĐ.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    3.3. Tài khoản khuyến mại là khoản được cộng thêm (nếu có)
                    tùy thuộc vào các chương trình khuyến mại của PGVN tại từng
                    thời điểm. Việc sử dụng Tài khoản khuyến mại sẽ theo chính
                    sách của PGVN tại từng thời điểm và được thông báo tới Khách
                    Hàng trước khi sử dụng Dịch vụ.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    3.4. Tài khoản chính và tài khoản khuyến mại sẽ có thời hạn
                    sử dụng theo chính sách công khai của PGVN tại từng thời
                    điểm và được tính từ ngày PGVN nhận được tiền thanh toán của
                    Khách Hàng (đối với Tài khoản chính) hoặc từ ngày Khách Hàng
                    được cộng từng khuyến mại đó trên hệ thống của PGVN (đối với
                    Tài khoản khuyến mại) (“Thời hạn sử dụng ”). Hết Thời hạn sử
                    dụng, nếu tài khoản còn tiền thì khoản tiền đó sẽ không còn
                    khả dụng, Khách Hàng không thể sử dụng số tiền đó để sử dụng
                    Dịch vụ trên Nền tảng và cũng không được quy đổi thành tiền
                    mặt hay bất kỳ hình thức nào khác.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    3.5. Để tránh hiều nhầm, Các Bên theo đây xác nhận rằng Thời
                    hạn sử dụng sẽ được tách biệt theo từng lần thanh toán của
                    Khách Hàng và không gộp chung giá trị của các lần thanh toán
                    với nhau. Cụ thể: khi Thời hạn sử dụng của lần thanh toán
                    trước vẫn còn, nếu Khách Hàng thanh toán thêm thì sẽ không
                    kéo dài Thời hạn sử dụng của lần thanh toán trước đó. Thời
                    hạn sử dụng của mỗi lần thanh toán sẽ được tính riêng biệt
                    và áp dụng theo chính sách của PGVN về Thời hạn sử dụng được
                    niêm yết công khai trên Nền tảng của PGVN tại từng thời
                    điểm.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    3.6. Khách Hàng đồng ý rằng Dịch vụ mà Khách Hàng sử dụng sẽ
                    được tuân theo chính sách dịch vụ được PGVN niêm yết công
                    khai trên Nền tảng tại thời điểm Khách Hàng sử dụng Dịch vụ
                    thực tế. Ngoài ra, các Bên đồng ý rằng trường hợp PGVN thay
                    đổi Thời hạn sử dụng thì khoản thanh toán mới sẽ áp dụng
                    theo Thời hạn sử dụng mới được PGVN niêm yết công khai trên
                    Nền tảng tại thời điểm Khách Hàng thanh toán.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-4" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 4. THANH TOÁN
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify">
                    4.1. Khách Hàng có trách nhiệm thanh toán đầy đủ Phí dịch vụ
                    theo quy định tại Đơn đặt hàng hoặc chính sách thanh toán
                    của PGVN tại từng thời điểm.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    4.2. Việc thanh toán được xem là hoàn tất khi PGVN nhận được
                    đầy đủ số tiền thanh toán từ Khách Hàng.
                  </Text>
                  <Text lineHeight="1.8" textAlign="justify">
                    4.3. PGVN có quyền tạm ngừng cung cấp Dịch vụ nếu Khách Hàng
                    chậm thanh toán hoặc không thanh toán đầy đủ theo quy định.
                  </Text>
                </VStack>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-5" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 5. QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify" fontWeight="bold">5.1. Quyền và nghĩa vụ của Khách Hàng</Text>
                  <Text lineHeight="1.8" textAlign="justify">5.1.1. Cung cấp đầy đủ các thông tin cần thiết để PGVN cung cấp Dịch vụ.</Text>
                  <Text lineHeight="1.8" textAlign="justify">5.1.2. Chịu trách nhiệm về tính xác thực của nội dung cung cấp cho PGVN.</Text>
                  <Text lineHeight="1.8" textAlign="justify">5.1.3. Không được sử dụng Dịch vụ vào mục đích vi phạm pháp luật.</Text>
                  <Text lineHeight="1.8" textAlign="justify">5.1.4. Tuân thủ các điều khoản, chính sách và quy định của pháp luật Việt Nam.</Text>
                  <Text lineHeight="1.8" textAlign="justify">5.1.5. Thanh toán đầy đủ và đúng hạn các khoản Phí dịch vụ.</Text>
                  
                  <Text lineHeight="1.8" textAlign="justify" fontWeight="bold" mt={4}>5.2. Quyền và nghĩa vụ của PGVN</Text>
                  <Text lineHeight="1.8" textAlign="justify">5.2.1. Cung cấp Dịch vụ đúng theo thỏa thuận giữa Các Bên.</Text>
                  <Text lineHeight="1.8" textAlign="justify">5.2.2. Giải quyết các khiếu nại liên quan đến chất lượng Dịch vụ trong phạm vi trách nhiệm của PGVN.</Text>
                </VStack>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-6" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 6. TẠM NGỪNG THỰC HIỆN DỊCH VỤ
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify">6.1. PGVN có quyền tạm ngừng cung cấp Dịch vụ nếu Khách Hàng vi phạm các điều khoản sử dụng.</Text>
                  <Text lineHeight="1.8" textAlign="justify">6.2. Dịch vụ sẽ được tiếp tục sau khi Khách Hàng khắc phục hành vi vi phạm theo yêu cầu của PGVN.</Text>
                </VStack>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-7" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 7. CHẤM DỨT ĐƠN ĐẶT HÀNG / DỊCH VỤ
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify">7.1. Đơn đặt hàng/Dịch vụ có thể bị chấm dứt nếu một trong các Bên vi phạm nghĩa vụ theo thỏa thuận.</Text>
                  <Text lineHeight="1.8" textAlign="justify">7.2. Việc chấm dứt không làm ảnh hưởng đến các quyền và nghĩa vụ phát sinh trước thời điểm chấm dứt.</Text>
                </VStack>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-8" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 8. PHẠT VI PHẠM VÀ BỒI THƯỜNG THIỆT HẠI
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify">8.1. Bên vi phạm nghĩa vụ phải chịu khoản phạt theo quy định của pháp luật và thỏa thuận giữa Các Bên.</Text>
                  <Text lineHeight="1.8" textAlign="justify">8.2. Bên gây thiệt hại phải bồi thường toàn bộ thiệt hại thực tế phát sinh.</Text>
                </VStack>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-9" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 9. GIỚI HẠN TRÁCH NHIỆM PHÁP LÝ
                </Heading>
                <Text lineHeight="1.8" textAlign="justify">9.1. Trách nhiệm pháp lý của các Bên chỉ giới hạn trong các thiệt hại trực tiếp phát sinh.</Text>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-10" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 10. QUYỀN SỞ HỮU TRÍ TUỆ
                </Heading>
                <Text lineHeight="1.8" textAlign="justify">10.1. Các Bên là chủ sở hữu hợp pháp đối với các thông tin và tài liệu thuộc quyền sở hữu của mình.</Text>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-11" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 11. SỰ KIỆN BẤT KHẢ KHÁNG
                </Heading>
                <Text lineHeight="1.8" textAlign="justify">11.1. Sự kiện bất khả kháng là các sự kiện nằm ngoài khả năng kiểm soát hợp lý của Các Bên.</Text>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-12" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 12. BẢO MẬT THÔNG TIN
                </Heading>
                <Text lineHeight="1.8" textAlign="justify">12.1. Các Bên cam kết bảo mật toàn bộ thông tin trong quá trình thực hiện Dịch vụ.</Text>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-13" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 13. TUÂN THỦ CHỐNG HỐI LỘ VÀ THAM NHŨNG
                </Heading>
                <Text lineHeight="1.8" textAlign="justify">13.1. Các Bên cam kết tuân thủ đầy đủ các quy định pháp luật về phòng chống tham nhũng và hối lộ.</Text>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-14" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 14. LUẬT ĐIỀU CHỈNH VÀ GIẢI QUYẾT TRANH CHẤP
                </Heading>
                <Text lineHeight="1.8" textAlign="justify">14.1. Điều khoản sử dụng dịch vụ này được điều chỉnh bởi pháp luật Việt Nam.</Text>
              </Box>

              <Box>
                <Heading scrollMarginTop="100px" id="section-15" fontSize="20px" fontWeight="700" mb={4} color={{ base: "gray.900", _dark: "white" }}>
                  ĐIỀU 15. QUY ĐỊNH CHUNG
                </Heading>
                <VStack gap={4} align="stretch">
                  <Text lineHeight="1.8" textAlign="justify">15.1. Đây là toàn bộ thỏa thuận giữa Khách Hàng và PGVN liên quan đến Dịch vụ.</Text>
                  <Text lineHeight="1.8" textAlign="justify">15.2. Việc tiếp tục sử dụng Dịch vụ đồng nghĩa với việc Khách Hàng chấp nhận các điều khoản sửa đổi (nếu có).</Text>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default TermPage;