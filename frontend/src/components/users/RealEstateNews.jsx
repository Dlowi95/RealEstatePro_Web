import React, { useState, useEffect } from "react";
import { Box, SimpleGrid, Image, Text, Heading, Link, Flex, Spinner } from "@chakra-ui/react";
import axios from "axios";

const RealEstateNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news");
        if (response.data.success) {
          setNews(response.data.data);
        }
      } catch (error) {
        console.error("Error loading news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="200px" py={10}>
        <Spinner size="xl" color="#E65C00" thickness="4px" />
      </Flex>
    );
  }

  if (news.length === 0) return null;

  return (
    <Box maxW="1200px" mx="auto" px={4} py={10}>
      <Heading as="h2" size="xl" mb={1} color={{ base: "gray.800", _dark: "white" }}>
        Tin tức Bất động sản nổi bật
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={6}>
        Cập nhật nhanh các biến động thị trường từ VnExpress
      </Text>

      {/* Lưới hiển thị các thẻ bài viết */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
        {news.map((item, index) => (
          <Link
            href={item.link}
            isExternal
            key={index}
            _hover={{ textDecoration: "none" }}
            style={{ display: "block" }}
          >
            <Box
              bg={{ base: "white", _dark: "gray.900" }}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="sm"
              border="1px solid"
              borderColor={{ base: "gray.100", _dark: "whiteAlpha.100" }}
              transition="all 0.3s ease"
              _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
              h="100%"
              display="flex"
              flexDirection="column"
            >
              {/* Ảnh Thumbnail */}
              <Box position="relative" overflow="hidden" h="160px">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  fallbackSrc="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=500"
                />
              </Box>

              {/* Nội dung bài báo */}
              <Flex p={4} direction="column" flex={1} justify="space-between" gap={2}>
                <Box>
                  {/* Tiêu đề (Giới hạn tối đa 2 dòng hiển thị) */}
                  <Heading
                    as="h3"
                    fontSize="sm"
                    lineHeight="shorter"
                    fontWeight="bold"
                    color={{ base: "gray.800", _dark: "whiteAlpha.900" }}
                    noOfLines={2}
                    mb={2}
                    _hover={{ color: "#E65C00" }}
                  >
                    {item.title}
                  </Heading>

                  {/* Mô tả chi tiết (Giới hạn tối đa 3 dòng hiển thị) */}
                  <Text
                    fontSize="xs"
                    color={{ base: "gray.600", _dark: "gray.400" }}
                    noOfLines={3}
                    lineHeight="normal"
                  >
                    {item.description}
                  </Text>
                </Box>

                {/* Ngày tháng đăng báo */}
                <Text fontSize="10px" color="gray.400" mt={2} textAlign="right">
                  {new Date(item.pubDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </Text>
              </Flex>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RealEstateNews;